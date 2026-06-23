from pydantic import BaseModel

class UserBase(BaseModel): 
    username: str
    email: str 
    password: str 

# defines structured output class for LLM 
class ReviewGuide(BaseModel):
    questions: dict[int, str]
    answers: dict[int, int]
    options: dict[int, list[str]]
    body: dict[int, str]
    explanation: dict[int, str]
    topic: dict[int, str]
    containsMarkdown: dict[int, bool]
    type: dict[int, str]

# defines structued output class for check answer 
class CheckAnswer(BaseModel): 
    correct: bool