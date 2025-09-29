import React from 'react';

export default function InputForm({ idea, setIdea, onSubmit, loading }) {
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        if (!loading) onSubmit();
      }}
    >
      <textarea
        placeholder="Enter your startup business idea..."
        value={idea}
        onChange={e => setIdea(e.target.value)}
        rows={6}
        required
        disabled={loading}
      />
      <button type="submit" disabled={loading || idea.trim() === ""}>
        {loading ? "Evaluating..." : "Evaluate Idea"}
      </button>
    </form>
  );
}
