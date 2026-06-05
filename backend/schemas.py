from pydantic import BaseModel, EmailStr

class UserBase(BaseModel): 
    username: str
    email: str 

# defines structured output class for LLM 
class ReviewGuide(BaseModel):
    questions: dict[int, str]
    answers: dict[int, int]
    options: dict[int, list[str]]
    body: dict[int, str]
    explanation: dict[int, str]
    topic: dict[int, str]
    containsMarkdown: dict[int, bool]