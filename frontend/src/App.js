import React, { useState } from 'react';
import InputForm from './components/InputForm';
import ResultDisplay from './components/ResultDisplay';
import { analyzeBusiness } from './api';

export default function App() {
  const [formData, setFormData] = useState({
    concept: '',
    target_market: '',
    business_model: '',
    goals: ''
  });
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      const result = await analyzeBusiness(formData);
      setAnalysis(result);
    } catch (err) {
      setError(err.message || "Error generating analysis.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="container">
      <h1>Business Idea Evaluator</h1>
      <InputForm formData={formData} setFormData={setFormData} onSubmit={handleSubmit} loading={loading} />
      {loading && <p>Generating comprehensive analysis...</p>}
      {error && <p className="error">Error: {error}</p>}
      {analysis && <ResultDisplay analysis={analysis} />}
    </div>
  );
}

