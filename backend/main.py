import io 
import pypdf 
from fastapi import FastAPI, UploadFile, File 
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import SystemMessagePromptTemplate, HumanMessagePromptTemplate, ChatPromptTemplate
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

origins = [
    "http://localhost:5176",  
    "http://127.0.0.1:5176",  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            
    allow_credentials=True,
    allow_methods=["*"],              
    allow_headers=["*"],              
)

# defines structured output class for LLM 
class ReviewGuide(BaseModel):
    questions: dict[int, str]
    answers: dict[int, str]

@app.post("/upload")
# async funtion that must take a file 
async def upload_file(file: UploadFile = File(...)):
    # reads bytes of the file
    contents = await file.read() 

    # hands bytes from the contents to pypdf to read and understand
    reader = pypdf.PdfReader(io.BytesIO(contents))

    # variable to hold the text 
    text = ""
    # loop to add the information to the text variable
    for page in reader.pages:
        text += page.extract_text()
    
    # defines base llm for langchain 
    base_llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        temperature=0.0,
        google_api_key="AIzaSyAkc5PmCMtsRm7Vjyp2o_L2S5BGkKSk4z0"
    )

    # defines LLM to have structured output 
    llm = base_llm.with_structured_output(ReviewGuide)

    # defines system message instructions for LLM - COT prompt
    system_prompt = SystemMessagePromptTemplate.from_template(
        """
        You are a helpful assistant designed to help students study for an exam with ranging topics.
        A PDF File, or multiple PDF files, will be uploaded, as well as the number of questions the student
        wishes for the exam to be. The PDF file will be in text format, already parsed with Python PYPDF, some
        words may be jumpled, use best context to figure out the problems. When creating the exams follow
        these exact steps denoted in backticks (``)

        `
            - Fully digest and read every line of the uploaded text content (from PDF)
            - Determine the topic of the exam (e.g Calculus, Physics, Coding, exc)
            - Determine the exact number of questions the user specified 
            - Create exam questions relating to specific problems, or topics from the PDF text 
            - After creating the exam questions, double check they are solveable 
            - After creating the exam questions, double check they are of the same type and difficulty
            as text problems from the PDF 
            - Output with Review Guide model with dictionaries in that, one with the question number as key, then the problem text
            as the value, the second with the question number as a key, then the answer as the value
        `
        """
    )

    # defines user prompt template for PDF contents to be injected, and number of questions 
    user_prompt = HumanMessagePromptTemplate.from_template(
        """
            Number of questions: {number},
            Previous Class Context (follow difficulty and problems): {context}, 
        """,
        input_variables=['number', 'context']
    )

    # creates prompt, combining system and human messages 
    prompt = ChatPromptTemplate.from_messages([system_prompt, user_prompt])

    # creates chain to invoke LLM 
    chain = (
        {"number": lambda x: x["number"], "context": lambda x: x["context"]}
        | prompt
        | llm
        | {
            "questions": lambda x: x.questions, 
            "answers": lambda x: x.answers
        }
    )

    # returns the output 
    output = chain.invoke({"number": 2, "context": text})

    return output



