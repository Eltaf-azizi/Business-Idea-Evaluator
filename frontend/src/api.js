
export async function generateSwotAnalysis(idea) {
  if (!idea || idea.trim() === "") {
    throw new Error("Please enter a startup idea.");
  }


  const response = await fetch("http://localhost:8000/api/generate-swot", {
    
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idea }),

  });
  


  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to generate SWOT analysis.");
  }



  const data = await response.json();
  return data.swot;
}
