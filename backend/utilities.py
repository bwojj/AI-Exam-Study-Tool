import os
from dotenv import load_dotenv
import tempfile
import io 
import pypdf 
import base64
from langchain_community.document_loaders import (
    TextLoader, PyPDFLoader, Docx2txtLoader, UnstructuredPowerPointLoader
)


def extract_file_information(file): 
    content_type = file.content_type or ""
    file_type = content_type.split('/')[-1] if '/' in content_type else file.filename.split('.')[-1]
    
    if file_type in ['png', 'jpg', 'jpeg', 'webp']:
        file_bytes = file.file.read()
        base64_encoded = base64.b64encode(file_bytes).decode("utf-8")
        return f"data:image/{file_type};base64,{base64_encoded}"
    
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
        temp_file.write(file.file.read())
        temp_path = temp_file.name
    try: 
        file_type = file.content_type.split('/')[1]
        match file_type: 
            case 'pdf':
                loader = PyPDFLoader(temp_path)
            case 'docx': 
                loader = Docx2txtLoader(temp_path)
            case 'pptx':
                loader = UnstructuredPowerPointLoader(temp_path)
            case 'txt':
                loader = TextLoader(temp_path)
        docs = loader.load()

        return "\n".join([doc.page_content for doc in docs])
    finally: 
        if os.path.exists(temp_path):
            os.remove(temp_path)

def check_binary_guardrails(user_answer: str, target_answer: str):
    user_clean = user_answer.strip().lower().rstrip('.')
    target_clean = target_answer.strip().lower().rstrip('.')
    
    # Exact or colloquial match mapping
    affirmative = {'yes', 'yeah', 'yup', 'correct', 'true'}
    negative = {'no', 'nope', 'false', 'incorrect'}
    
    if target_clean in affirmative and user_clean in negative:
        return "incorrect"
    if target_clean in negative and user_clean in affirmative:
        return "incorrect"
    if target_clean in affirmative and user_clean in affirmative:
        return "correct"
    if target_clean in negative and user_clean in negative:
        return "correct"
        
    return None