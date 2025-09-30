
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {})
  };
};

export async function analyzeBusiness(data) {
  const { concept, target_market, business_model, goals } = data;
  if (!concept || !target_market || !business_model || !goals) {
    throw new Error("Please fill in all fields.");
  }

  const response = await fetch("http://localhost:8000/api/analyze-business", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ concept, target_market, business_model, goals }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to generate analysis.");
  }

  const result = await response.json();
  return result;
}

export async function getMyIdeas() {
  const response = await fetch("http://localhost:8000/api/my-ideas", {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch ideas.");
  }

  return await response.json();
}

export async function getIdea(ideaId) {
  const response = await fetch(`http://localhost:8000/api/idea/${ideaId}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch idea.");
  }

  return await response.json();
}
