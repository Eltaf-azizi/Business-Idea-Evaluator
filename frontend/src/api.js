
export async function analyzeBusiness(data) {
  const { concept, target_market, business_model, goals } = data;
  if (!concept || !target_market || !business_model || !goals) {
    throw new Error("Please fill in all fields.");
  }

  const response = await fetch("http://localhost:8000/api/analyze-business", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ concept, target_market, business_model, goals }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to generate analysis.");
  }

  const result = await response.json();
  return result;
}
