import React, { useState } from 'react';
import InputForm from './components/InputForm';
import ResultDisplay from './components/ResultDisplay';
import { generateSwotAnalysis } from './api';



export default function App() {
  const [idea, setIdea] = useState('');
  const [swot, setSwot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


}

