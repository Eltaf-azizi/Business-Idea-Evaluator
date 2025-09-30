import React, { useEffect, useRef, useState } from 'react';

export default function ResultDisplay({ analysis }) {
  const { swot, strategic_recommendations, market_opportunity, competitor_comparison, financial_forecast, risk_assessment } = analysis;
  const [activeTab, setActiveTab] = useState('swot');
  const swotChartRef = useRef(null);
  const swotChartInstance = useRef(null);

  useEffect(() => {
    if (swotChartRef.current && swot) {
      if (swotChartInstance.current) {
        swotChartInstance.current.destroy();
      }
      const ctx = swotChartRef.current.getContext('2d');
      swotChartInstance.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Strengths', 'Weaknesses', 'Opportunities', 'Threats'],
          datasets: [{
            data: [
              swot.strengths?.length || 0,
              swot.weaknesses?.length || 0,
              swot.opportunities?.length || 0,
              swot.threats?.length || 0
            ],
            backgroundColor: ['#28a745', '#dc3545', '#17a2b8', '#ffc107'],
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom',
            },
            title: {
              display: true,
              text: 'SWOT Analysis Overview'
            }
          }
        }
      });
    }
    return () => {
      if (swotChartInstance.current) {
        swotChartInstance.current.destroy();
      }
    };
  }, [swot]);

  const tabs = [
    { key: 'swot', label: 'SWOT Analysis' },
    { key: 'recommendations', label: 'Recommendations' },
    { key: 'market', label: 'Market Opportunity' },
    { key: 'competitor', label: 'Competitor Analysis' },
    { key: 'financial', label: 'Financial Forecast' },
    { key: 'risk', label: 'Risk Assessment' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'swot':
        return (
          <div className="swot-dashboard">
            <canvas ref={swotChartRef} width="400" height="300"></canvas>
            <div className="swot-details">
              <div className="swot-section strengths">
                <h2>Strengths</h2>
                <ul>{swot.strengths?.map((item, i) => <li key={i}>{item}</li>) || <li>No data</li>}</ul>
              </div>
              <div className="swot-section weaknesses">
                <h2>Weaknesses</h2>
                <ul>{swot.weaknesses?.map((item, i) => <li key={i}>{item}</li>) || <li>No data</li>}</ul>
              </div>
              <div className="swot-section opportunities">
                <h2>Opportunities</h2>
                <ul>{swot.opportunities?.map((item, i) => <li key={i}>{item}</li>) || <li>No data</li>}</ul>
              </div>
              <div className="swot-section threats">
                <h2>Threats</h2>
                <ul>{swot.threats?.map((item, i) => <li key={i}>{item}</li>) || <li>No data</li>}</ul>
              </div>
            </div>
          </div>
        );
      case 'recommendations':
        return (
          <div>
            <h2>Strategic Recommendations</h2>
            <ul>{strategic_recommendations?.map((item, i) => <li key={i}>{item}</li>) || <li>No data</li>}</ul>
          </div>
        );
      case 'market':
        return (
          <div>
            <h2>Market Opportunity Sizing</h2>
            <p>{market_opportunity || 'No data'}</p>
          </div>
        );
      case 'competitor':
        return (
          <div>
            <h2>Competitor Comparison</h2>
            <p>{competitor_comparison || 'No data'}</p>
          </div>
        );
      case 'financial':
        return (
          <div>
            <h2>Financial Forecast</h2>
            <p>{financial_forecast || 'No data'}</p>
          </div>
        );
      case 'risk':
        return (
          <div>
            <h2>Risk Assessment and Mitigation</h2>
            <p>{risk_assessment || 'No data'}</p>
          </div>
        );
      default:
        return null;
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(analysis, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'business-analysis.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="result-display">
      <div className="result-header">
        <h1>Analysis Results</h1>
        <button onClick={handleExport} className="export-btn">Export Analysis</button>
      </div>
      <div className="tabs">
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={`tab-button ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
