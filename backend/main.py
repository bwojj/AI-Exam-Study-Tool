import os
from dotenv import load_dotenv
from typing import Annotated 
from starlette import status 
from fastapi import FastAPI, UploadFile, File, Form, Depends, Request, HTTPException
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import SystemMessagePromptTemplate, HumanMessagePromptTemplate, ChatPromptTemplate
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy.orm.attributes import flag_modified
from database import engine, Base, get_db
import models
from schemas import ReviewGuide, CheckAnswer
from datetime import datetime
import auth 
from auth import get_current_user, get_user_id
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from utilities import extract_file_information, check_binary_guardrails


# creates the database tables, to be used 
models.Base.metadata.create_all(bind=engine)

app = FastAPI()
app.include_router(auth.router)

user_dependency = Annotated[dict, Depends(get_current_user)]

# initializes rate limiting 
# limiter = Limiter(key_func=get_user_id)
# app.state.limiter = limiter
# app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)



origins = [
    "http://localhost:5176",  
    "http://localhost:5173",
    "http://127.0.0.1:5176", 
    "http://localhost:5174", 
    "https://ai-exam-study-tool.vercel.app",
]

load_dotenv()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            
    allow_credentials=True,
    allow_methods=["*"],              
    allow_headers=["*"],              
) 

@app.post("/upload")
# @limiter.limit("20/hour") # adds 5 / minute rate limit
# async funtion that must take a file 
async def upload_file(request: Request, user: user_dependency, 
                      files: list[UploadFile] = File(...), type: str = Form("type"), 
                      questions: int = Form("questions"), name: str = Form("name"), 
                      db: Session = Depends(get_db), difficulty: str = Form("difficulty")):
    # variable to hold the text from all files 
    text = ""
    # variable to hold image contents
    image_contents = []
    for file in files:
        extracted = extract_file_information(file)
        if extracted.startswith("data:image/"):
            image_contents.append({"type": "image_url", "image_url": {"url": extracted}})
        text += extracted + "\n"
    
    # defines base llm for langchain 
    base_llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        temperature=0.0,
        google_api_key=os.environ.get("GOOGLE_API_KEY")
    )

    # defines LLM to have structured output 
    llm = base_llm.with_structured_output(ReviewGuide)

    # defines system message instructions for LLM - COT prompt based on type of problems
    if type == 'Multiple choice':
        print("Multiple choice")
        system_prompt = SystemMessagePromptTemplate.from_template(
            """
                You are a helpful assistant designed to help students study for an exam with ranging topics.
                A PDF File, multiple PDF files, or images will be uploaded, as well as the number of questions the student
                wishes for the exam to be. The text file will be in text format, already parsed, some
                words may be jumbled, use best context to figure out the problems. When creating the exams follow
                these exact steps denoted in backticks (``). If images are provided, there may not be any pdf
                context, in which case use the information from the images. Images will be provided in a list if
                they are uploaded. A difficulty will also be provided, as you can read and see below. The difficulty options are 
                one of the following in increasing difficulty order: Mixed (mixture of all), Foundational, Advanced, and Exam Grade. Make the problems 
                follow this difficulty no matter what. If the content is anything action-based (such as solving problems for math, coding,
                physics, exc) include problems of practice and problems of theory as well, they why behind the topic (e.g, why are integrals
                worked). 

                *IF problems CANNOT be generated from the inputted files (not enough information, not testable) return
                a dictionary for questions exactly like this 0: "False"* 

                `
                    - Fully digest and read every line of the uploaded text content (from PDF) or image
                    - Determine the topic of the exam (e.g Calculus, Physics, Coding, exc). DO NOT include Markdown in topic.
                    - Determine the exact number of questions the user specified 
                     - If the multiple choice questions include mathematics, physics, coding, or anything else where the problems or answers might be different than plain 
                    text (such as square roots, exponents, code blocks exc.) return the problem as markdown to allow them
                    to be displayed as they should be 
                    - Never use \\text{{}} to wrap mathematical expressions. Only use \\text for
                    prose words embedded in a formula (e.g. \\text{{ where }}). Math symbols, variables,
                    and expressions like x^2 or 16 + x^2 must appear directly in math mode without any
                    \\text{{}} wrapper.
                    - Create multiple choice exam questions relating to specific problems, or topics from the PDF text of difficulty {difficulty}, explicitly follow this difficulty level
                    - Create 4 different choices to choose from for each problem, making sure they are all valid in problem context 
                    - After creating the exam questions, double check they are solveable 
                    - After creating the exam questions, double check they are of the same type and difficulty
                    as text problems from the PDF 
                    - Output with Review Guide model with exactly 3 dictionaries in that, one with the question number as key, then the problem text
                    as the value, the second with the question number as a key, then the answer index as the value (options indexed 0-3), and the 3rd with the problem
                    number as the key, and the alphebetical options with the 
                    answer they correspond to in a list such as ["option here", "option here"] and so on DO NOT include the letter in the options list. 
                    - Provide an explanation for the correct answer to the explanation key in the output, using the integer question number as the key, and the string explanation as value. 
                    - Provide a body text to explain how to go about answering the question such as: "Select an option below" use the integer question number as the key, and the string body as the value.
                    - Provide a topic text to explain which topic the question is from such as "Integrals" for each problem, output in dictionary using integer question number as key, and topic as the value
                    DO NOT use markdown in this topic text.
                    - Output to the 'containsMarkdown" boolean value true or false based on if markdown was used in the problem. The output is
                    a dictionary with the integer problem as the key, and true or false if markdown was used as the value.  
                    - For each problem, output to the 'containsMath' if the answer contains math. 
                    - For each problem, return the type of problem it is: multiple choice
                `
            """,
            input_variables=['difficulty']
        )
    elif type == 'Short answer':
        print("Short Answer")
        system_prompt = SystemMessagePromptTemplate.from_template(
            """
                You are a helpful assistant designed to help students study for an exam with ranging topics.
                A PDF File, multiple PDF files, or images will be uploaded, as well as the number of questions the student
                wishes for the exam to be. The text file will be in text format, already parsed, some
                words may be jumbled, use best context to figure out the problems. When creating the exams follow
                these exact steps denoted in backticks (``). If images are provided, there may not be any pdf
                context, in which case use the information from the images. Images will be provided in a list if
                they are uploaded. A difficulty will also be provided, as you can read and see below. The difficulty options are 
                one of the following in increasing difficulty order: Mixed (mixture of all), Foundational, Advanced, and Exam Grade. Make the problems 
                follow this difficulty no matter what. If the content is anything action-based (such as solving problems for math, coding,
                physics, exc) include problems of practice and problems of theory as well, they why behind the topic (e.g, why are integrals
                worked).  

                *IF problems CANNOT be generated from the inputted files (not enough information, not testable) return
                JUST the word False, NOTHING else* 

                `
                    - Fully digest and read every line of the uploaded text content (from PDF), or image 
                    - Determine the topic of the exam (e.g Calculus, Physics, Coding, exc) DO NOT include Markdown in topic.
                    - Determine the exact number of questions the user specified 
                    - Determine the topic of the exam
                    - Create short answer exam questions relating to specific problems, or topics from the PDF text of difficulty {difficulty}
                    - If the short answer questions include mathematics, physics, coding, or anything else where the problems or answers might be different than plain 
                    text (such as square roots, exponents, code blocks exc.) return the problem as markdown to allow them
                    to be displayed as they should be 
                    - Never use \\text{{}} to wrap mathematical expressions. Only use \\text for
                    prose words embedded in a formula (e.g. \\text{{ where }}). Math symbols, variables,
                    and expressions like x^2 or 16 + x^2 must appear directly in math mode without any
                    \\text{{}} wrapper.
                    - After creating the exam questions, double check they are solveable
                    - After creating the exam questions, double check they are of the same type and difficulty
                    as text problems from the PDF
                    - Output with Review Guide model with dictionaries in that, one with the question number as key, then the problem text
                    as the value, the second with the question number as a key, then the answer as the value make sure the answer
                    is text, not any integer values since the questions will be short answer based, set the third 'options' dictionary
                    to None
                   - Provide an explanation for the correct answer to the explanation key in the output, using the integer question number as the key, and the string explanation as value. 
                   - Provide a body text to explain how to go about answering the question such as: "Select an option below" use the integer question number as the key, and the string body as the value.
                   - Provide a topic text to explain which topic the question is from such as "Integrals" for each problem, output in dictionary using integer question number as key, and topic as the value.
                    DO NOT use markdown in this topic text.
                   - Output to the 'containsMarkdown" boolean value true or false based on if markdown was used in the problem. The output is
                    a dictionary with the integer problem as the key, and true or false if markdown was used as the value. 
                    - For each problem, output to the 'containsMath' boolean value true or false based on if the answer will be in
                    math format (such as exponents, square roots, or anything of the sort), if a math problem is theory for example, and the
                    answer is purely strings, the output for that problem should be false for that question number. it will
                    be a dictionary with the question number as the key, and the true or false field as the value 
                    - For each problem, return the type of problem it is: short answer
                `
            """,
            input_variables=['difficulty']
        )
    elif type == 'Mixed format':
        print("Mixed Format")
        system_prompt = SystemMessagePromptTemplate.from_template(
            """
                You are a helpful assistant designed to help students study for an exam with ranging topics.
                A PDF File, multiple PDF files, or images will be uploaded, as well as the number of questions the student
                wishes for the exam to be. The text file will be in text format, already parsed, some
                words may be jumbled, use best context to figure out the problems. When creating the exams follow
                these exact steps denoted in backticks (``). If images are provided, there may not be any pdf
                context, in which case use the information from the images. Images will be provided in a list if
                they are uploaded. A difficulty will also be provided, as you can read and see below. The difficulty options are 
                one of the following in increasing difficulty order: Mixed (mixture of all), Foundational, Advanced, and Exam Grade. Make the problems 
                follow this difficulty no matter what. If the content is anything action-based (such as solving problems for math, coding,
                physics, exc) include problems of practice and problems of theory as well, they why behind the topic (e.g, why are integrals
                worked). 

                *IF problems CANNOT be generated from the inputted files (not enough information, not testable) return
                JUST the word False, NOTHING else* 

                `
                    - Fully digest and read every line of the uploaded text content (from PDF) or image
                    - Determine the topic of the exam (e.g Calculus, Physics, Coding, exc) DO NOT include Markdown in topic.
                    - Determine the exact number of questions the user specified
                    - If the mixed format questions include mathematics, physics, coding, or anything else where the problems or answers might be different than plain 
                    text (such as square roots, exponents, code blocks exc.) return the problem as markdown to allow them
                    to be displayed as they should be 
                    - Never use \\text{{}} to wrap mathematical expressions. Only use \\text for 
                    prose words embedded in a formula (e.g. \\text{{ where }}). Math symbols, variables, 
                    and expressions like x^2 or 16 + x^2 must appear directly in math mode without any 
                    \\text{{}} wrapper.  
                    - Create 1/4 of the specified amount as multiple choice exam questions, and 3/4
                     as short answer questions, all relating to specific problems, or topics from the PDF text of difficulty {difficulty}
                    - Create 4 different choices to choose from for each multiple choice problem, making sure they are all valid in problem context 
                    - After creating the exam questions, double check they are solveable 
                    - After creating the exam questions, double check they are of the same type and difficulty
                    as text problems from the PDF 
                    - Output with Review Guide model with dictionaries in that, one with the question number as key, then the problem text
                    as the value, the second with the question number as a key, then the answer as the value - ensuring
                    the answer is in text format - not an index, and the 3rd with the
                     multiple choice question number as the key, and the alphebetical options with the 
                    answer they correspond to such as "option here", "option here" and so on  
                    - Provide an explanation for the correct answer to the explanation key in the output, using the integer question number as the key, and the string explanation as value. 
                    - Provide a body text to explain how to go about answering the question such as: "Select an option below" use the integer question number as the key, and the string body as the value.
                    - Provide a topic text to explain which topic the question is from such as "Integrals" for each problem, output in dictionary using integer question number as key, and topic as the value.
                    DO NOT use markdown in this topic text.
                    - Output to the 'containsMarkdown" boolean value true or false based on if markdown was used in the problem. The output is
                    a dictionary with the integer problem as the key, and true or false if markdown was used as the value. 
                    - For each problem, output to the 'containsMath' boolean value true or false based on if the answer will be in
                    math format (such as exponents, square roots, or anything of the sort), if a math problem is theory for example, and the
                    answer is purely strings, the output for that problem should be false for that question number. it will
                    be a dictionary with the question number as the key, and the true or false field as the value
                    - For each problem, return the type of problem it is, whether it be short answer or multiple choice
            """,
            input_variables=['difficulty']
        )

   # defines user prompt content
    prompt_content = [
        {
            "type": "text",
            "text": "Number of questions: {number},\nPrevious Class Context (follow difficulty and problems): {context}"
        }
    ]

    # adds images to user prompt if they exist
    if image_contents: 
        prompt_content.extend(image_contents)

    # creates human message prompt with all information 
    user_prompt = HumanMessagePromptTemplate.from_template(
        template=prompt_content,
        input_variables=['number', 'context']
    )

    # creates prompt, combining system and human messages 
    prompt = ChatPromptTemplate.from_messages([system_prompt, user_prompt])

    # creates chain to invoke LLM 
    chain = (
        {"number": lambda x: x["number"], "context": lambda x: x["context"], "difficulty": lambda x: x["difficulty"]}
        | prompt
        | llm
        | {
            "questions": lambda x: x.questions, 
            "answers": lambda x: x.answers,
            "options": lambda x: x.options,
            "body": lambda x: x.body, 
            "explanation": lambda x: x.explanation, 
            "topic": lambda x: x.topic,
            "containsMarkdown": lambda x: x.containsMarkdown, 
            "type": lambda x: x.type,
            "containsMath": lambda x: x.containsMath
        }
    )

    # returns the output 
    output = await chain.ainvoke({"number": questions, "context": text, "difficulty": difficulty})

    db_user = db.query(models.User).filter(models.User.id == user["id"]).first()

    if len(output["questions"]) == 1:
        return {"Error": "Could not generate"} 

    # creates generated test model 
    generated_test = models.GeneratedTests(
        name = name, 
        date = datetime.now(),
        number_of_questions = questions, 
        questions = output["questions"],
        answers = output["answers"], 
        options = output["options"], 
        body = output["body"],
        explanation = output["explanation"], 
        topic = output["topic"], 
        containsMarkdown = output["containsMarkdown"],
        containsMath = output["containsMath"],
        owner = db_user, 
    )
    # saves and commits to database
    db.add(generated_test)
    db.commit()
    db.refresh(generated_test)

    output["test_id"] = generated_test.id
    return output



@app.get("/tests")
# @limiter.limit("60/minute")
def get_all_tests(request: Request, user: user_dependency, db: Session = Depends(get_db)):
    # Fetch every row from the GeneratedTests table
    tests = db.query(models.GeneratedTests).filter(models.GeneratedTests.user == user["id"]).all()
    return tests



@app.get("/", status_code=status.HTTP_200_OK)
async def user(user: user_dependency, db: get_db):
    if user is None:
        raise HTTPException(status_code=401, detail='Authentication Failed')
    return {"User": user}

@app.post("/check-answer")
# @limiter.limit("20/hour")
async def check_answer(request: Request, user: user_dependency, db: Session = Depends(get_db),
                       question: str = Form("question"), gen_answer: str = Form("gen_answer"),
                       user_answer: str = Form("user_answer")):
    

    check_binary = check_binary_guardrails(user_answer, gen_answer)

    if check_binary != None: 
        return check_binary
    
    else:
        # defines base llm for langchain 
        base_llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            temperature=0.0,
            google_api_key=os.environ.get("GOOGLE_API_KEY")
        )

        llm = base_llm.with_structured_output(CheckAnswer)

        system_prompt = SystemMessagePromptTemplate.from_template(
            """
                You are an AI assistant located within an AI application that takes in files such as
                text-based, or image files, and generates practice exam questions and answers of ranging
                difficulties, for users to study from.

                Your specific task within this application is to take in a generated question, generated answer,
                and user answer, to determine if the user's answer is correct and provide feedback.

                You must output a JSON object with two fields:
                - "correct": true if the user's answer is correct, false otherwise
                - "feedback": a concise explanation of the correct answer and why the user's answer
                  was right or wrong. Use proper markdown formatting:
                  - Inline math: $x^2 + y^2 = z^2$
                  - Block math: $$\\int_0^\\infty e^{{-x}} dx = 1$$
                  - Code fences with language tag for code snippets
                  - Bold, lists, etc. as appropriate
            """
        )

        user_prompt = HumanMessagePromptTemplate.from_template(
            """
                Question: {question},
                Generated Answer: {gen_answer},
                User Current Answer: {user_answer}
            """, 
            input_variables=["question", "gen_answer", "user_answer"]
        )

        prompt = ChatPromptTemplate.from_messages([system_prompt, user_prompt])

        chain = (
            {"question": lambda x: x["question"], "gen_answer": lambda x: x["gen_answer"], "user_answer": lambda x: x["user_answer"]}
            | prompt
            | llm 
            | {
                "Correct": lambda x: x.correct,
                "Feedback": lambda x: x.feedback,
            }
        )

        output = await chain.ainvoke({"question": question, "gen_answer": gen_answer, "user_answer": user_answer})

        return output

@app.post("/update-answer")
async def update_answer(user: user_dependency, db: Session = Depends(get_db),
                        id: str = Form("id"), correct: bool = Form("correct"),
                        question: int = Form("question"), answer: int | str = Form(...)):
    test_to_update = db.query(models.GeneratedTests).filter(models.GeneratedTests.id == id).first()

    if not test_to_update:
        raise HTTPException(status_code=404, detail="Test not found")

    current_answers = test_to_update.userAnswers or []
    current_answers.append({
        "question_num": question,
        "answer": answer,
        "correct": correct
    })

    test_to_update.userAnswers = current_answers
    flag_modified(test_to_update, "userAnswers")

    db.commit()
    db.refresh(test_to_update)

    return True

