import React, { useState } from 'react';

export default function InputForm({ formData, setFormData, onSubmit, loading }) {
  const [step, setStep] = useState(1);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const steps = [
    { key: 'concept', label: 'Business Concept', placeholder: 'Describe your innovative business idea in detail...' },
    { key: 'target_market', label: 'Target Market', placeholder: 'Define your target audience, market size, and customer segments...' },
    { key: 'business_model', label: 'Business Model', placeholder: 'Explain your revenue streams, pricing strategy, and value proposition...' },
    { key: 'goals', label: 'Goals & Objectives', placeholder: 'Outline your short-term and long-term goals, milestones, and success metrics...' }
  ];

  const currentStep = steps[step - 1];
  const isFormValid = Object.values(formData).every(value => value.trim() !== "");
  const isCurrentValid = formData[currentStep.key]?.trim() !== "";

  const handleNext = () => {
    if (isCurrentValid) setStep(step + 1);
  };

  const handlePrev = () => {
    setStep(step - 1);
  };

  return (
    <div className="input-form">
      <div className="step-indicator">
        {steps.map((s, i) => (
          <span key={i} className={`step ${i + 1 === step ? 'active' : i + 1 < step ? 'completed' : ''}`}>
            {i + 1}
          </span>
        ))}
      </div>
      <h3>{currentStep.label}</h3>
      <form
        onSubmit={e => {
          e.preventDefault();
          if (!loading && isFormValid) onSubmit();
        }}
      >
        <textarea
          value={formData[currentStep.key] || ''}
          onChange={e => handleChange(currentStep.key, e.target.value)}
          placeholder={currentStep.placeholder}
          required
          rows="6"
        />
        <div className="form-buttons">
          {step > 1 && (
            <button type="button" onClick={handlePrev} className="prev-btn">
              Previous
            </button>
          )}
          {step < steps.length ? (
            <button type="button" onClick={handleNext} disabled={!isCurrentValid} className="next-btn">
              Next
            </button>
          ) : (
            <button type="submit" disabled={loading || !isFormValid} className="submit-btn">
              {loading ? "Analyzing..." : "Analyze Business"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
