from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import SystemMessagePromptTemplate, HumanMessagePromptTemplate, ChatPromptTemplate
from pydantic import BaseModel, Field
from pypdf import PdfReader

# defines structured output for LLM to follow
class ReviewGuide(BaseModel):
    question_number : int = Field(description="Question Number")
    question : str = Field(description="Question")
    answer : str = Field(description="Answer to created question")

reader = PdfReader("11_9.pdf") # loads calculus 2 problem pdf 
pf_text = "" # inits variable to hold the pdf content 

for page in reader.pages: # extracts text from the pdf 
    pf_text += page.extract_text() 

# inits the llm to be used
base_llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", 
                             google_api_key="AIzaSyAkc5PmCMtsRm7Vjyp2o_L2S5BGkKSk4z0",
                             temperature=0, 
                            )

# inits llm with structured output 
llm = base_llm.with_structured_output(ReviewGuide)


# creates system prompt template - instructions 
system_prompt = SystemMessagePromptTemplate.from_template(
    """You are a PHD math tutor designed to help students study for an exam.
        You will be provided with documents of classwork from the student. Your job is to
        return the number of questions specified by the user with answers. The questions will be
        problems different than in the document, BUT of the same type and difficulty level, just different numbers."""
)

# creates user prompt templates for questions and document 
user_prompt = HumanMessagePromptTemplate.from_template(
    """
        Number of questions {questions}. 
        Document: {document}.  
    """,
    input_variables=["questions", "document"]
)

# Creates chat prompt template combining both messages
prompt = ChatPromptTemplate.from_messages([system_prompt, user_prompt])

# creates chain to add input variables -> construct prompt -> prompt -> output content
chain = ({"questions": lambda x : x["questions"], "document": lambda x : x["document"]}
        | prompt 
        | llm 
        | {
            "question_number": lambda x: x.question_number,
            "question": lambda x: x.question, 
            "answer": lambda x: x.answer
        })

# returns output 
print(chain.invoke({"questions": 3, "document": pf_text}))

