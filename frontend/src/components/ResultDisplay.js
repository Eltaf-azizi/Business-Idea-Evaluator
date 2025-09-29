import React from 'react';



export default function ResultDisplay({ swot }) {
  return (

    <div className="result">
      {["strengths", "weaknesses", "opportunities", "threats"].map((key) => (
        <div key={key} className={`swot-section ${key}`}>
          <h2>{capitalizeFirstLetter(key)}</h2>
          {swot[key].length > 0 ? (
            <ul>
              {swot[key].map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          ) : (
            <p>No insights found.</p>
          )}
        </div>
      ))}
    </div>
    
  );
}


function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
