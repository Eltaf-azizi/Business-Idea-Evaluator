
export async function generateSwotAnalysis(idea) {
  if (!idea || idea.trim() === "") {
    throw new Error("Please enter a startup idea.");
  }


  const response = await fetch("http://localhost:8000/api/generate-swot", {
    
  });

  