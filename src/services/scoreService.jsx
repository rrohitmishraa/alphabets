export async function getScores() {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/api/scores`);
  if (!res.ok) throw new Error("Failed to fetch scores");
  return res.json();
}

export async function saveScore(data) {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/api/scores`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to save score");
  return res.json();
}
