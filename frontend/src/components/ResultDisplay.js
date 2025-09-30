import React from 'react';

export default function ResultDisplay({ analysis }) {
  const { swot, strategic_recommendations, market_opportunity, competitor_comparison, financial_forecast, risk_assessment } = analysis;

  
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
