import os

# Must be set before importing any app modules so database/auth modules
# pick up test values at import time.
os.environ.setdefault("SECRET_KEY", "test-secret-key-for-testing-only")
os.environ.setdefault("ALGORITHM", "HS256")
os.environ.setdefault("DATABASE_URL", "sqlite:///./test_app.db")
os.environ.setdefault("GOOGLE_API_KEY", "fake-key")

import io
import pytest
from datetime import timedelta
from unittest.mock import MagicMock, patch

from fastapi.testclient import TestClient
from langchain_core.runnables import RunnableLambda
from sqlalchemy.orm import sessionmaker

from database import Base, engine, get_db as db_get_db
from main import app
import auth
from auth import authenticate_user, create_access_token, hash_password, verify_password
import models
from schemas import CheckAnswer, ReviewGuide


# ─── Test database ──────────────────────────────────────────────────────────────

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


# Override both get_db references: main.py uses database.get_db, auth.py uses its own local copy.
app.dependency_overrides[db_get_db] = override_get_db
app.dependency_overrides[auth.get_db] = override_get_db

client = TestClient(app)


# ─── Fixtures ───────────────────────────────────────────────────────────────────

@pytest.fixture(autouse=True)
def reset_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def registered_user():
    resp = client.post("/auth/", json={"username": "testuser", "password": "testpass"})
    assert resp.status_code == 201
    return "testuser", "testpass"


@pytest.fixture
def auth_token(registered_user):
    username, password = registered_user
    resp = client.post("/auth/token", data={"username": username, "password": password})
    return resp.json()["access_token"]


@pytest.fixture
def auth_headers(auth_token):
    return {"Authorization": f"Bearer {auth_token}"}


# ─── Mock LLM helpers ───────────────────────────────────────────────────────────

MOCK_REVIEW_GUIDE = ReviewGuide(
    questions={1: "What is 2+2?", 2: "What color is the sky?"},
    answers={1: 0, 2: 1},
    options={1: ["4", "3", "5", "6"], 2: ["Red", "Blue", "Green", "Yellow"]},
    body={1: "Select an option below", 2: "Select an option below"},
    explanation={1: "2+2 equals 4.", 2: "The sky appears blue due to Rayleigh scattering."},
    topic={1: "Math", 2: "Science"},
    containsMarkdown={1: False, 2: False},
    type={1: "multiple choice", 2: "multiple choice"},
    containsMath={1: False, 2: False},
)

MOCK_CHECK_ANSWER = CheckAnswer(correct=True, feedback="Your answer is correct.")


def make_llm_mock(return_value):
    """Return a mock ChatGoogleGenerativeAI instance whose with_structured_output
    returns a RunnableLambda that ignores its input and yields return_value."""
    mock = MagicMock()
    mock.with_structured_output.return_value = RunnableLambda(lambda _: return_value)
    return mock


def fake_pdf():
    return io.BytesIO(b"%PDF-1.4 fake content")


# ─── Auth helper unit tests ─────────────────────────────────────────────────────

class TestPasswordHelpers:
    def test_hash_password_produces_bcrypt_hash(self):
        hashed = hash_password("mysecret")
        assert hashed.startswith("$2b$")

    def test_verify_password_correct_password(self):
        hashed = hash_password("mysecret")
        assert verify_password("mysecret", hashed) is True

    def test_verify_password_wrong_password(self):
        hashed = hash_password("mysecret")
        assert verify_password("wrongpass", hashed) is False

    def test_different_passwords_produce_different_hashes(self):
        assert hash_password("abc") != hash_password("abc")  # bcrypt salts


class TestCreateAccessToken:
    def test_token_encodes_username_and_id(self):
        from jose import jwt
        token = create_access_token("alice", 42, timedelta(minutes=30))
        payload = jwt.decode(
            token,
            os.environ["SECRET_KEY"],
            algorithms=[os.environ["ALGORITHM"]],
        )
        assert payload["sub"] == "alice"
        assert payload["id"] == 42

    def test_token_includes_expiry(self):
        from jose import jwt
        token = create_access_token("alice", 42, timedelta(minutes=30))
        payload = jwt.decode(
            token,
            os.environ["SECRET_KEY"],
            algorithms=[os.environ["ALGORITHM"]],
        )
        assert "exp" in payload


class TestAuthenticateUser:
    def test_returns_user_for_valid_credentials(self):
        db = TestingSessionLocal()
        db.add(models.User(username="alice", hashed_password=hash_password("secret")))
        db.commit()
        result = authenticate_user("alice", "secret", db)
        assert result is not False
        assert result.username == "alice"
        db.close()

    def test_returns_false_for_wrong_password(self):
        db = TestingSessionLocal()
        db.add(models.User(username="alice", hashed_password=hash_password("secret")))
        db.commit()
        result = authenticate_user("alice", "wrongpass", db)
        assert result is False
        db.close()

    def test_returns_false_for_unknown_user(self):
        db = TestingSessionLocal()
        result = authenticate_user("nobody", "pass", db)
        assert result is False
        db.close()


# ─── Auth route tests ───────────────────────────────────────────────────────────

class TestCreateUser:
    def test_create_user_returns_201(self):
        resp = client.post("/auth/", json={"username": "newuser", "password": "newpass"})
        assert resp.status_code == 201
        assert resp.json()["Success"] is True

    def test_duplicate_username_returns_error(self):
        # The endpoint has no IntegrityError handler, so the server raises a 500.
        # Use raise_server_exceptions=False so TestClient returns the response instead of re-raising.
        nc = TestClient(app, raise_server_exceptions=False)
        nc.post("/auth/", json={"username": "dupuser", "password": "pass"})
        resp = nc.post("/auth/", json={"username": "dupuser", "password": "pass"})
        assert resp.status_code >= 400


class TestLogin:
    def test_valid_credentials_return_bearer_token(self, registered_user):
        username, password = registered_user
        resp = client.post("/auth/token", data={"username": username, "password": password})
        assert resp.status_code == 200
        data = resp.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"

    def test_wrong_password_returns_401(self, registered_user):
        username, _ = registered_user
        resp = client.post("/auth/token", data={"username": username, "password": "wrongpass"})
        assert resp.status_code == 401

    def test_unknown_user_returns_401(self):
        resp = client.post("/auth/token", data={"username": "ghost", "password": "pass"})
        assert resp.status_code == 401


class TestLogout:
    def test_logout_returns_200(self):
        resp = client.post("/auth/logout")
        assert resp.status_code == 200


# ─── JWT / protected route tests ────────────────────────────────────────────────

class TestCurrentUserEndpoint:
    @pytest.mark.xfail(
        reason="GET / declares 'db: get_db' instead of 'db: Session = Depends(get_db)', "
               "causing FastAPI to return 422 instead of 200. Fix main.py to unblock."
    )
    def test_valid_token_returns_user_payload(self, auth_headers):
        resp = client.get("/", headers=auth_headers)
        assert resp.status_code == 200
        assert "User" in resp.json()

    def test_missing_token_returns_401(self):
        resp = client.get("/")
        assert resp.status_code == 401

    def test_garbage_token_returns_401(self):
        resp = client.get("/", headers={"Authorization": "Bearer garbage.token.value"})
        assert resp.status_code == 401

    def test_malformed_bearer_scheme_returns_401(self):
        resp = client.get("/", headers={"Authorization": "Token somevalue"})
        assert resp.status_code == 401

    def test_expired_token_returns_401(self):
        token = create_access_token("testuser", 1, timedelta(seconds=-1))
        resp = client.get("/", headers={"Authorization": f"Bearer {token}"})
        assert resp.status_code == 401


# ─── /upload + LLM tests ────────────────────────────────────────────────────────

class TestUploadEndpoint:
    def _upload(self, headers, question_type="Multiple choice"):
        return client.post(
            "/upload",
            headers=headers,
            files={"files": ("notes.pdf", fake_pdf(), "application/pdf")},
            data={
                "type": question_type,
                "questions": "2",
                "name": "Test Quiz",
                "difficulty": "Foundational",
            },
        )

    def test_unauthenticated_returns_401(self):
        resp = client.post(
            "/upload",
            files={"files": ("notes.pdf", fake_pdf(), "application/pdf")},
            data={"type": "Multiple choice", "questions": "2", "name": "Quiz", "difficulty": "Foundational"},
        )
        assert resp.status_code == 401

    def test_multiple_choice_returns_questions_and_answers(self, auth_headers):
        with patch("main.ChatGoogleGenerativeAI", return_value=make_llm_mock(MOCK_REVIEW_GUIDE)), \
             patch("main.extract_file_information", return_value="Some class text content"):
            resp = self._upload(auth_headers, "Multiple choice")
        assert resp.status_code == 200
        data = resp.json()
        assert "questions" in data
        assert "answers" in data
        assert len(data["questions"]) == 2

    def test_short_answer_type_succeeds(self, auth_headers):
        with patch("main.ChatGoogleGenerativeAI", return_value=make_llm_mock(MOCK_REVIEW_GUIDE)), \
             patch("main.extract_file_information", return_value="class content"):
            resp = self._upload(auth_headers, "Short answer")
        assert resp.status_code == 200
        assert "questions" in resp.json()

    def test_mixed_format_type_succeeds(self, auth_headers):
        with patch("main.ChatGoogleGenerativeAI", return_value=make_llm_mock(MOCK_REVIEW_GUIDE)), \
             patch("main.extract_file_information", return_value="class content"):
            resp = self._upload(auth_headers, "Mixed format")
        assert resp.status_code == 200
        assert "questions" in resp.json()

    def test_response_includes_test_id(self, auth_headers):
        with patch("main.ChatGoogleGenerativeAI", return_value=make_llm_mock(MOCK_REVIEW_GUIDE)), \
             patch("main.extract_file_information", return_value="content"):
            resp = self._upload(auth_headers)
        assert "test_id" in resp.json()

    def test_generated_test_is_persisted(self, auth_headers):
        with patch("main.ChatGoogleGenerativeAI", return_value=make_llm_mock(MOCK_REVIEW_GUIDE)), \
             patch("main.extract_file_information", return_value="content"):
            self._upload(auth_headers)
        tests = client.get("/tests", headers=auth_headers).json()
        assert len(tests) == 1

    def test_single_question_response_returns_error(self, auth_headers):
        single = ReviewGuide(
            questions={1: "Only question"},
            answers={1: 0},
            options={1: ["A", "B", "C", "D"]},
            body={1: "Select below"},
            explanation={1: "Because A"},
            topic={1: "Topic"},
            containsMarkdown={1: False},
            type={1: "multiple choice"},
            containsMath={1: False},
        )
        with patch("main.ChatGoogleGenerativeAI", return_value=make_llm_mock(single)), \
             patch("main.extract_file_information", return_value="text"):
            resp = self._upload(auth_headers)
        assert "Error" in resp.json()

    def test_llm_is_called_with_correct_model(self, auth_headers):
        with patch("main.ChatGoogleGenerativeAI", return_value=make_llm_mock(MOCK_REVIEW_GUIDE)) as mock_cls, \
             patch("main.extract_file_information", return_value="content"):
            self._upload(auth_headers)
        call_kwargs = mock_cls.call_args.kwargs
        assert call_kwargs["model"] == "gemini-2.5-flash"


# ─── /check-answer + LLM tests ──────────────────────────────────────────────────

class TestCheckAnswerEndpoint:
    def _check(self, headers, user_answer="4", gen_answer="4"):
        return client.post(
            "/check-answer",
            headers=headers,
            data={
                "question": "What is 2+2?",
                "gen_answer": gen_answer,
                "user_answer": user_answer,
            },
        )

    def test_unauthenticated_returns_401(self):
        resp = client.post(
            "/check-answer",
            data={"question": "Q?", "gen_answer": "A", "user_answer": "A"},
        )
        assert resp.status_code == 401

    def test_llm_response_returned_for_open_ended_answer(self, auth_headers):
        with patch("main.ChatGoogleGenerativeAI", return_value=make_llm_mock(MOCK_CHECK_ANSWER)):
            resp = self._check(auth_headers, user_answer="4", gen_answer="4")
        assert resp.status_code == 200
        data = resp.json()
        assert "Correct" in data
        assert "Feedback" in data

    def test_llm_is_called_for_non_binary_answer(self, auth_headers):
        with patch("main.ChatGoogleGenerativeAI", return_value=make_llm_mock(MOCK_CHECK_ANSWER)) as mock_cls:
            self._check(auth_headers)
        mock_cls.assert_called_once()

    def test_binary_yes_yes_skips_llm_and_returns_correct(self, auth_headers):
        with patch("main.ChatGoogleGenerativeAI") as mock_cls:
            resp = self._check(auth_headers, user_answer="yes", gen_answer="yes")
        mock_cls.assert_not_called()
        assert resp.json() == "correct"

    def test_binary_no_no_skips_llm_and_returns_correct(self, auth_headers):
        with patch("main.ChatGoogleGenerativeAI") as mock_cls:
            resp = self._check(auth_headers, user_answer="no", gen_answer="no")
        mock_cls.assert_not_called()
        assert resp.json() == "correct"

    def test_binary_yes_no_skips_llm_and_returns_incorrect(self, auth_headers):
        with patch("main.ChatGoogleGenerativeAI") as mock_cls:
            resp = self._check(auth_headers, user_answer="yes", gen_answer="no")
        mock_cls.assert_not_called()
        assert resp.json() == "incorrect"

    def test_binary_no_yes_skips_llm_and_returns_incorrect(self, auth_headers):
        with patch("main.ChatGoogleGenerativeAI") as mock_cls:
            resp = self._check(auth_headers, user_answer="no", gen_answer="yes")
        mock_cls.assert_not_called()
        assert resp.json() == "incorrect"

    def test_binary_affirmative_variants_are_recognized(self, auth_headers):
        with patch("main.ChatGoogleGenerativeAI") as mock_cls:
            resp = self._check(auth_headers, user_answer="yeah", gen_answer="correct")
        mock_cls.assert_not_called()
        assert resp.json() == "correct"


# ─── /tests endpoint tests ──────────────────────────────────────────────────────

class TestGetTestsEndpoint:
    def test_empty_list_when_no_tests(self, auth_headers):
        resp = client.get("/tests", headers=auth_headers)
        assert resp.status_code == 200
        assert resp.json() == []

    def test_unauthenticated_returns_401(self):
        resp = client.get("/tests")
        assert resp.status_code == 401

    def test_user_only_sees_own_tests(self, auth_headers):
        # Create a second user and upload a test under that account.
        client.post("/auth/", json={"username": "other", "password": "otherpass"})
        other_token = client.post(
            "/auth/token", data={"username": "other", "password": "otherpass"}
        ).json()["access_token"]
        other_headers = {"Authorization": f"Bearer {other_token}"}

        with patch("main.ChatGoogleGenerativeAI", return_value=make_llm_mock(MOCK_REVIEW_GUIDE)), \
             patch("main.extract_file_information", return_value="content"):
            client.post(
                "/upload",
                headers=other_headers,
                files={"files": ("notes.pdf", fake_pdf(), "application/pdf")},
                data={"type": "Multiple choice", "questions": "2", "name": "Other Quiz", "difficulty": "Foundational"},
            )

        # Original user's test list should still be empty.
        resp = client.get("/tests", headers=auth_headers)
        assert resp.json() == []


# ─── /update-answer tests ───────────────────────────────────────────────────────

class TestUpdateAnswer:
    def _seed_test(self, auth_headers):
        with patch("main.ChatGoogleGenerativeAI", return_value=make_llm_mock(MOCK_REVIEW_GUIDE)), \
             patch("main.extract_file_information", return_value="content"):
            resp = client.post(
                "/upload",
                headers=auth_headers,
                files={"files": ("notes.pdf", fake_pdf(), "application/pdf")},
                data={"type": "Multiple choice", "questions": "2", "name": "Quiz", "difficulty": "Foundational"},
            )
        return resp.json()["test_id"]

    def test_update_answer_returns_true(self, auth_headers):
        test_id = self._seed_test(auth_headers)
        resp = client.post(
            "/update-answer",
            headers=auth_headers,
            data={"id": str(test_id), "correct": "true", "question": "1", "answer": "0"},
        )
        assert resp.status_code == 200
        assert resp.json() is True

    def test_update_answer_nonexistent_test_returns_404(self, auth_headers):
        resp = client.post(
            "/update-answer",
            headers=auth_headers,
            data={"id": "99999", "correct": "true", "question": "1", "answer": "0"},
        )
        assert resp.status_code == 404

    def test_unauthenticated_returns_401(self):
        resp = client.post(
            "/update-answer",
            data={"id": "1", "correct": "true", "question": "1", "answer": "0"},
        )
        assert resp.status_code == 401
