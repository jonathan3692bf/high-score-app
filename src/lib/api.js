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
          { id: 1, name: 'Jane Doe', totalPoints: Math.round((Math.random() * 2000)) - 1000, clicks: Math.round((Math.random() * 9)) + 1 },
          { id: 2, name: 'Lily Allen', totalPoints: Math.round((Math.random() * 2000)) - 1000, clicks: Math.round((Math.random() * 9)) + 1 },
          { id: 3, name: 'John Smith', totalPoints: Math.round((Math.random() * 2000)) - 1000, clicks: Math.round((Math.random() * 9)) + 1 },
          { id: 4, name: 'Will Smith', totalPoints: Math.round((Math.random() * 2000)) - 1000, clicks: Math.round((Math.random() * 9)) + 1 },
          { id: 5, name: 'Jayden Smith', totalPoints: Math.round((Math.random() * 2000)) - 1000, clicks: Math.round((Math.random() * 9)) + 1 },
          { id: 6, name: 'Willow Smith', totalPoints: Math.round((Math.random() * 2000)) - 1000, clicks: Math.round((Math.random() * 9)) + 1 },
          { id: 7, name: 'Adam Smith', totalPoints: Math.round((Math.random() * 2000)) - 1000, clicks: Math.round((Math.random() * 9)) + 1 },
          { id: 9, name: 'Ada Lovelace', totalPoints: Math.round((Math.random() * 2000)) - 1000, clicks: Math.round((Math.random() * 9)) + 1 },
          { id: 10, name: 'Nathan Smith', totalPoints: Math.round((Math.random() * 2000)) - 1000, clicks: Math.round((Math.random() * 9)) + 1 },
          { id: 11, name: 'Maynard Smith', totalPoints: Math.round((Math.random() * 2000)) - 1000, clicks: Math.round((Math.random() * 9)) + 1 },
          { id: 12, name: 'Leaky Smith', totalPoints: Math.round((Math.random() * 2000)) - 1000, clicks: Math.round((Math.random() * 9)) + 1 },
          { id: 13, name: 'Nightsmoke Smith', totalPoints: Math.round((Math.random() * 2000)) - 1000, clicks: Math.round((Math.random() * 9)) + 1 },
          { id: 14, name: 'Madhan Smith', totalPoints: Math.round((Math.random() * 2000)) - 1000, clicks: Math.round((Math.random() * 9)) + 1 },
          { id: 15, name: 'Jake Smith', totalPoints: Math.round((Math.random() * 2000)) - 1000, clicks: Math.round((Math.random() * 9)) + 1 }
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
