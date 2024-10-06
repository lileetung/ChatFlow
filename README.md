# ChatFlow

ChatFlow is an AI-powered chatbot application with a React frontend and a FastAPI backend.

## Getting Started

### Frontend

To run the frontend:

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies (if you haven't already):
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`.

### Backend

To run the backend:

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies (if you haven't already):
   ```
   pip install -r requirements.txt
   ```

3. Start the FastAPI server:
   ```
   uvicorn main:app --reload
   ```

The backend API will be available at `http://localhost:8000`.

## Environment Variables

Make sure to set up your environment variables in a `.env` file in the backend directory:

```
OPENAI_API_KEY=your_openai_api_key
```
