import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import InputForm from './components/InputForm';
import ResultDisplay from './components/ResultDisplay';
import { analyzeBusiness } from './api';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [formData, setFormData] = useState({
    concept: '',
    target_market: '',
    business_model: '',
    goals: ''
  });
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const handleLogin = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    setToken(null);
    setAnalysis(null);
    setFormData({
      concept: '',
      target_market: '',
      business_model: '',
      goals: ''
    });
  };

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

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="container">
      <header className="app-header">
        <h1>Business Idea Evaluator</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </header>
      <InputForm formData={formData} setFormData={setFormData} onSubmit={handleSubmit} loading={loading} />
      {loading && <p>Generating comprehensive analysis...</p>}
      {error && <p className="error">Error: {error}</p>}
      {analysis && <ResultDisplay analysis={analysis} />}
    </div>
  );
}
