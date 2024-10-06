from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from langchain_openai import ChatOpenAI
from langchain.schema import HumanMessage, SystemMessage
import os
from dotenv import load_dotenv
import asyncio

load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the ChatOpenAI model
chat = ChatOpenAI(api_key=os.getenv("OPENAI_API_KEY"), streaming=True)

class ChatMessage(BaseModel):
    message: str

async def stream_chat_response(chat_message: str, system_prompt: str):
    async for chunk in chat.astream([
        SystemMessage(content=system_prompt),
        HumanMessage(content=chat_message)
    ]):
        yield chunk.content

@app.post("/chat")
async def chat_endpoint(chat_message: ChatMessage):
    # Define the system prompt
    system_prompt = "你是一位台灣人，請用繁體中文回答"

    return StreamingResponse(
        stream_chat_response(chat_message.message, system_prompt),
        media_type="text/event-stream"
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)