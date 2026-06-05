from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os 
from dotenv import load_dotenv

load_dotenv()

# links to the database (sqlite for dev postgre in prod)
DATABASE_URL = os.environ.get("DATABASE_URL")

# creates engine to communicate with the database 
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# creates the session object 
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# defines base for the models 
Base = declarative_base()

# gets the database for each session 
def get_db():
    db = SessionLocal()
    try: 
        # passes the database to the application 
        yield db 
    finally: 
        db.close()