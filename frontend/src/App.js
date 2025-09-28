import React, { useState } from 'react';
import InputForm from './components/InputForm';
import ResultDisplay from './components/ResultDisplay';
import { generateSwotAnalysis } from './api';



export default function App() {
  const [idea, setIdea] = useState('');
  const [swot, setSwot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSwot(null);
    try {
      const result = await generateSwotAnalysis(idea);
      setSwot(result);
    } catch (err) {
      setError(err.message || "Error generating SWOT analysis.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="container">
      <h1>Business Idea Evaluator</h1>
      <InputForm idea={idea} setIdea={setIdea} onSubmit={handleSubmit} loading={loading} />
      {loading && <p>Generating SWOT analysis...</p>}
      {error && <p className="error">Error: {error}</p>}
      {swot && <ResultDisplay swot={swot} />}
    </div>
  );
}

