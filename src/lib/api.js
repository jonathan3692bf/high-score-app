async function submitScore ({ name = '', totalPoints = 0, clicks = 0 }) {
  try {
    const response = await fetch('/scores', {
      method: 'post',
      body: JSON.stringify({ name, totalPoints, clicks })
    })
    return await response.json()
  } catch (err) {
    const promise = new Promise(resolve => {
      setTimeout(() => {
        resolve({})
      }, 1000)
    })

    return promise
  }
}

async function getScores () {
  try {
    const response = await fetch('/scores')
    return await response.json()
  } catch (err) {
    const promise = new Promise(resolve => {
      setTimeout(() => {
        resolve([
          { name: 'Jane Doe', totalPoints: Math.round((Math.random() * 2000)) - 1000, clicks: Math.round((Math.random() * 10)) },
          { name: 'Lily Allen', totalPoints: Math.round((Math.random() * 2000)) - 1000, clicks: Math.round((Math.random() * 10)) },
          { name: 'John Smith', totalPoints: Math.round((Math.random() * 2000)) - 1000, clicks: Math.round((Math.random() * 10)) }
        ])
      }, 1000)
    })

    return promise
  }
}

const api = {
  getScores,
  submitScore
}

export default api
