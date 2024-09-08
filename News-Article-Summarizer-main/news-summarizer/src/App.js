import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [articleText, setArticleText] = useState('');
  const [summary, setSummary] = useState('');
  const [method, setMethod] = useState('extractive');
  const [sentenceCount, setSentenceCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleSummarize = async () => {
    setLoading(true);

    // Create FormData to send the file
    const formData = new FormData();
    if (selectedFile) {
      formData.append('file', selectedFile);
    } else {
      formData.append('text', articleText);
    }

    try {
      const response = await axios.post('http://localhost:5000/summarize', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSummary(response.data.summary);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>News Summarizer</h1>
      </header>

      <div className="content">
        <textarea
          className="article-input"
          rows="10"
          placeholder="Paste the news article here..."
          value={articleText}
          onChange={(e) => setArticleText(e.target.value)}
          disabled={selectedFile !== null} // Disable text input if a file is uploaded
        />

        <div className="options">
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />
        </div>

        <button className="summarize-button" onClick={handleSummarize}>
          Summarize
        </button>

        {loading ? (
          <div className="loading">
            <p>Generating summary...</p>
          </div>
        ) : (
          <div className="summary-output">
            <h2>Summary:</h2>
            <p>{summary}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
