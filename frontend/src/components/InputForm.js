import React from 'react';

export default function InputForm({ formData, setFormData, onSubmit, loading }) {
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = Object.values(formData).every(value => value.trim() !== "");

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        if (!loading && isFormValid) onSubmit();
      }}
    >
      
      <button type="submit" disabled={loading || !isFormValid}>
        {loading ? "Analyzing..." : "Analyze Business"}
      </button>
    </form>
  );
}
