from flask import Flask, request, jsonify
from dotenv import load_dotenv  
import json
import logging
from flask_cors import CORS
import os
from openai import OpenAI

load_dotenv()
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
CORS(app)

api_key = os.getenv('OPENAI_API_KEY')
if not api_key:
    raise ValueError("No API key found for OpenAI")

client = OpenAI(api_key=api_key)

try:
    with open('qna.json', 'r') as f:
        qna_set = json.load(f)
    logging.debug('Q&A set loaded')
except Exception as e:
    logging.error(f'Error loading Q&A set: {e}')
    qna_set = []

def generate_response(user_input, qna_set):
    try:
        if not user_input or not isinstance(user_input, str):
            raise ValueError("Invalid user input")
        
        messages = [
            {"role": "system", "content": "You are an assistant that answers questions based on a predefined Q&A set."},
            {"role": "system", "content": "You can only use information provided in Q&A set. If something is not in the Q&A set, you can't answer it."},
            {"role": "system", "content": "You can't say that your answer is based on the Q&A set, but you can use the information in the Q&A set to answer the question."}
        ]
        
        for item in qna_set:
            question = item.get('question')
            answer = item.get('answer')
            if question and answer:
                if isinstance(answer, list):
                    answer = ' '.join(answer)
                messages.append({"role": "system", "content": f"Q: {question}\nA: {answer}"})

        messages.append({"role": "user", "content": user_input})

        response = client.chat.completions.create(
            model='gpt-4-turbo',
            messages=messages
        )

        return response.choices[0].message.content
    
    except Exception as e:
        logging.error(f"Error generating response: {e}")
        return "Sorry, something went wrong. Please try again later."

    
@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        logging.debug(f"Received JSON payload: {data}")
        user_input = data.get("user_input")
        if not user_input:
            return jsonify({"error": "No user input provided"}), 400

        response = generate_response(user_input, qna_set)
        return jsonify({"response": response})
    except Exception as e:
        logging.error(f"Error in /api/chat route: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
