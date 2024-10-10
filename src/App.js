import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSearch = async () => {
        setLoading(true);
        setError('');
        setResults([]);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://127.0.0.1:5000/search', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setResults(response.data.matches);
        } catch (err) {
            setError(err.response.data.error || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-container">
            <h1>Facial Recognition Search Tool</h1>
            <input type="file" onChange={handleFileChange} accept="image/*" />
            <button onClick={handleSearch} disabled={!file || loading}>
                {loading ? "Searching..." : "Search"}
            </button>
            {error && <p className="error">{error}</p>}
            <div className="results-grid">
                {results.map((media) => (
                    <div key={media.id} className="media-card">
                        {media.path.endsWith('.mp4') || media.path.endsWith('.avi') ? (
                            <video controls>
                                <source src={media.path} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <img src={media.path} alt={media.filename} />
                        )}
                        <p>{media.filename}</p>
                        <p>Similarity: {media.similarity}%</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default App;
