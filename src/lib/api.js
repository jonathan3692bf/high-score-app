async function submitScore ({ name = '', totalPoints = 0, clicks = 0 }) {
  const response = await fetch('/scores', {
    method: 'post',
    body: JSON.stringify({ name, totalPoints, clicks })
  })
  return await response.json()
}

const api = {
  submitScore
}

export default api
