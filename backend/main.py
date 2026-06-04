import os
from dotenv import load_dotenv
import io 
import pypdf 
from fastapi import FastAPI, UploadFile, File, Form
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import SystemMessagePromptTemplate, HumanMessagePromptTemplate, ChatPromptTemplate
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

origins = [
    "http://localhost:5176",  
    "http://127.0.0.1:5176",  
]

load_dotenv()

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
    answers: dict[int, int]
    options: dict[int, list[str]]

@app.post("/upload")
# async funtion that must take a file 
async def upload_file(file: UploadFile = File(...), type: str = Form("type"), questions: int = Form("questions")):
    # reads bytes of the file
    contents = await file.read() 

    print(type)

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
                A PDF File, or multiple PDF files, will be uploaded, as well as the number of questions the student
                wishes for the exam to be. The PDF file will be in text format, already parsed with Python PYPDF, some
                words may be jumbled, use best context to figure out the problems. When creating the exams follow
                these exact steps denoted in backticks (``)

                `
                    - Fully digest and read every line of the uploaded text content (from PDF)
                    - Determine the topic of the exam (e.g Calculus, Physics, Coding, exc)
                    - Determine the exact number of questions the user specified 
                    - Create multiple choice exam questions relating to specific problems, or topics from the PDF text 
                    - Create 4 different choices to choose from for each problem, making sure they are all valid in problem context 
                    - After creating the exam questions, double check they are solveable 
                    - After creating the exam questions, double check they are of the same type and difficulty
                    as text problems from the PDF 
                    - Output with Review Guide model with exactly 3 dictionaries in that, one with the question number as key, then the problem text
                    as the value, the second with the question number as a key, then the answer index as the value (options indexed 0-3), and the 3rd with the problem
                    number as the key, and the alphebetical options with the 
                    answer they correspond to in a list such as ["option here", "option here"] and so on DO NOT include the letter in the options list. 
                `
            """
        )
    elif type == 'Short answer':
        print("Short Answer")
        system_prompt = SystemMessagePromptTemplate.from_template(
            """
                You are a helpful assistant designed to help students study for an exam with ranging topics.
                A PDF File, or multiple PDF files, will be uploaded, as well as the number of questions the student
                wishes for the exam to be. The PDF file will be in text format, already parsed with Python PYPDF, some
                words may be jumbled, use best context to figure out the problems. When creating the exams follow
                these exact steps denoted in backticks (``)

                `
                    - Fully digest and read every line of the uploaded text content (from PDF)
                    - Determine the topic of the exam (e.g Calculus, Physics, Coding, exc)
                    - Determine the exact number of questions the user specified 
                    - Create short answer exam questions relating to specific problems, or topics from the PDF text 
                    - After creating the exam questions, double check they are solveable 
                    - After creating the exam questions, double check they are of the same type and difficulty
                    as text problems from the PDF 
                    - Output with Review Guide model with dictionaries in that, one with the question number as key, then the problem text
                    as the value, the second with the question number as a key, then the answer as the value, set the third 'options' dictionary
                    to None
                `
            """
        )
    elif type == 'Mixed format':
        print("Mixed Format")
        system_prompt = SystemMessagePromptTemplate.from_template(
            """
                You are a helpful assistant designed to help students study for an exam with ranging topics.
                A PDF File, or multiple PDF files, will be uploaded, as well as the number of questions the student
                wishes for the exam to be. The PDF file will be in text format, already parsed with Python PYPDF, some
                words may be jumbled, use best context to figure out the problems. When creating the exams follow
                these exact steps denoted in backticks (``)

                `
                    - Fully digest and read every line of the uploaded text content (from PDF)
                    - Determine the topic of the exam (e.g Calculus, Physics, Coding, exc)
                    - Determine the exact number of questions the user specified 
                    - Create 1/4 of the specified amount as multiple choice exam questions, and 3/4
                     as short answer questions, all relating to specific problems, or topics from the PDF text 
                    - Create 4 different choices to choose from for each multiple choice problem, making sure they are all valid in problem context 
                    - After creating the exam questions, double check they are solveable 
                    - After creating the exam questions, double check they are of the same type and difficulty
                    as text problems from the PDF 
                    - Output with Review Guide model with dictionaries in that, one with the question number as key, then the problem text
                    as the value, the second with the question number as a key, then the answer as the value, and the 3rd with the
                     multiple choice question number as the key, and the alphebetical options with the 
                    answer they correspond to such as "option here", "option here" and so on  
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
            "answers": lambda x: x.answers,
            "options": lambda x: x.options
        }
    )

    # returns the output 
    output = chain.invoke({"number": questions, "context": text})

    return output



