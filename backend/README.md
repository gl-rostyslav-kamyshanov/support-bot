# Support Bot Backend

## Overview

This project is the backend for a support bot written in Python using Flask. The bot uses OpenAI's API to generate responses based on a predefined Q&A set.

## Features

- **Flask Server**: Serves as the main backend framework.
- **OpenAI Integration**: Uses OpenAI's GPT-4 model to generate responses.
- **CORS**: Enabled to allow cross-origin requests.
- **Environment Variables**: Managed using `python-dotenv`.
- **Dockerized**: Dockerfile and docker-compose configuration provided for easy setup and deployment.


## Requirements

- Python 3.10
- OpenAI API Key


## Setup

1. **Create and activate a virtual environment:**
  ```bash 
python3 -m venv venv
source venv/bin/activate   # On Windows use `venv\Scripts\activate`
```

2. **Install the dependencies:**
```bash
pip install -r requirements.txt
```

3. **Set up environment variables:**
- Copy the example environment file and fill in your OpenAI API key.
```bash
cp .env.example .env
```
- Edit the .env file and add your OpenAI API key:
```bash
OPENAI_API_KEY=your_openai_api_key
```

## Running the Application

1. **Run the Flask server:**
```bash
export FLASK_APP=server.py
export FLASK_ENV=development
flask run
```
The server will be accessible at http://127.0.0.1:5000.

## Using Docker
1. **Build the Docker image:**
```bash
docker build -t support-bot-backend .
```
2. **Run the Docker container:**
```bash
docker run -p 5000:5000 --env-file .env support-bot-backend
```

## Using Docker Compose
1. **Build and run the services:**
```bash
docker-compose up --build
```
The server will be accessible at http://127.0.0.1:5000.

## API Endpoint
- /api/chat [POST]: Endpoint to handle chat requests

- Request Body:
```json
{
  "user_input": "Your question here"
}
```
- Response:
```json
{
  "response": "Generated response"
}
```