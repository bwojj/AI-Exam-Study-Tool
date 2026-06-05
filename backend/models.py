from sqlalchemy import Column, Integer, String, Date, JSON
from datetime import date 
from database import Base

class User(Base): 
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)

class GeneratedTests(Base): 
    __tablename__ = "generated-tests"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date)
    number_of_questions = Column(Integer)
    questions = Column(JSON, nullable=False)
    answers = Column(JSON, nullable=False)
    options = Column(JSON, nullable=True)
    body = Column(JSON, nullable=False)
    explanation = Column(JSON, nullable=False)
    topic = Column(JSON, nullable=False)
    containsMarkdown = Column(JSON, nullable=False)
