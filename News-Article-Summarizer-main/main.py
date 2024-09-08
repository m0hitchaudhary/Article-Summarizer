from flask import Flask, request, jsonify
from transformers import pipeline
from flask_cors import CORS
import PyPDF2
import io

app = Flask(__name__)
CORS(app)  # This will allow cross-origin requests from the React frontend

# Load the Hugging Face summarization model
summarizer = pipeline("summarization")

def extract_text_from_pdf(pdf_file):
    # Read the PDF file using PyPDF2
    reader = PyPDF2.PdfReader(pdf_file)
    text = ''
    for page in reader.pages:
        text += page.extract_text()
    return text

@app.route('/')
def index():
    return "Flask server running!"

@app.route('/summarize', methods=['POST'])
def summarize():
    if 'file' in request.files:
        # Handle PDF file
        pdf_file = request.files['file']
        text = extract_text_from_pdf(pdf_file)
    else:
        # Handle plain text input
        data = request.form
        text = data.get('text', '')

    if text:
        # Use the summarizer model to summarize the input text
        summary = summarizer(text, max_length=300, min_length=100, do_sample=False)
        formatted_summary = ' '.join([sentence.capitalize() for sentence in summary[0]['summary_text'].split('. ')])
        return jsonify({"summary": formatted_summary})
    else:
        return jsonify({"summary": "No content provided"}), 400

if __name__ == '__main__':
    app.run(debug=True)
