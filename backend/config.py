import os
from dotenv import load_dotenv

load_dotenv()  # load environment variables from .env

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
MODEL_NAME = os.getenv("MODEL_NAME", "gpt-4")  # You can use gpt-4 or gpt-3.5-turbo
