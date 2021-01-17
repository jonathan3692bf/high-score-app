import { useState, useEffect } from 'react'
import { v4 as uuid } from 'uuid'
import { ProgressSpinner } from 'primereact/progressspinner'
import { InputText } from 'primereact/inputtext'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import Button from './components/Button'
import api from './lib/api'

const MAX_CLICK_COUNT = 10

function App () {
  const [loading, setLoading] = useState(true)
  const [id, setId] = useState(uuid())
  const [name, setName] = useState('')
  const [totalPoints, setTotalPoints] = useState(0)
  const [clickCount, setClickCount] = useState(0)
  const [nameError, setNameError] = useState(false)
  const [requestPending, setRequestPending] = useState(false)
  const [scores, setScores] = useState([])
  const disableAdjustButton = clickCount === MAX_CLICK_COUNT

  useEffect(() => {
    async function requestScores () {
      setLoading(true)
      const latestScores = await api.getScores()
      updateScores(latestScores)
      setLoading(false)
    }
    requestScores()
  }, [])

  function resetState () {
    setId(uuid())
    setName('')
    setTotalPoints(0)
    setClickCount(0)
  }
  function adjustScore () {
    if (!name) {
      return setNameError(true)
    }
    if (clickCount < MAX_CLICK_COUNT) {
      const clicks = clickCount + 1
      const newTotalPoints = totalPoints + Math.round((Math.random() * 200)) - 100
      const updatedScores = scores.filter(score => {
        return score.id !== id
      })
        .concat([{
          id,
          name,
          clicks,
          totalPoints: newTotalPoints,
          avgPointsPerClick: Number(newTotalPoints / clicks).toFixed(2)
        }])
      setClickCount(clicks)
      setTotalPoints(newTotalPoints)
      updateScores(updatedScores)
    }
  }
  function updateScores (scores) {
    const updatedScores = scores
      .sort((a, b) => {
        return a.totalPoints - b.totalPoints
      })
      .slice(0, 10)
      .map(score => {
        score.avgPointsPerClick = Number(score.totalPoints / score.clicks).toFixed(2)
        return score
      })
    setScores(updatedScores)
  }
  async function submitScores () {
    if (!name) {
      return setNameError(true)
    }
    const submittedScore = {
      name,
      totalPoints,
      clicks: clickCount,
      avgPointsPerClick: Number(totalPoints / clickCount).toFixed(2)
    }
    setRequestPending(true)
    await api.submitScore(submittedScore)
    const updatedScores = scores.slice().filter(score => {
      return score.id !== id
    })
    updatedScores.push(submittedScore)
    updateScores(updatedScores)
    setRequestPending(false)
    resetState()
  }

  return <div style={{ margin: '2rem' }}>
    <h1>High Score App</h1>

    {loading
      ? <>
        <div style={{ margin: 'auto' }}><ProgressSpinner className="p-d-block" /></div>
        <h3 style={{ textAlign: 'center' }}>Getting scores</h3>
      </>
      : <>
      <div>Enter a name and click "Adjust score" until you have a score that you are happy with.</div>
      <div>You can adjust your score up to {MAX_CLICK_COUNT} times, but may chose to click "Save" at any point.</div>
      <br/>
      <div className="p-grid">
        <div className="p-col-fixed">
          <div className={'p-float-label'}>
            <InputText className={nameError ? 'p-invalid' : ''} id="name" value={name} onChange={(e) => {
              setName(e.target.value)
              setNameError(false)
            }} />
            <label htmlFor="name">Name</label>
          </div>
          {nameError && <div className="p-invalid">
            Name is required
          </div>}
        </div>
        <div className="p-col-fixed">
          <Button label="Adjust score" disabled={disableAdjustButton || requestPending} className={`p-button-outlined ${disableAdjustButton ? 'p-button-secondary' : ''}`} onClick={adjustScore}/>
        </div>
        <div className="p-col-fixed">
          <Button label="Save" className="p-button" onClick={submitScores} loading={requestPending}/>
        </div>
      </div>
      <h3>Current score: {totalPoints} | Remaining adjustments: {MAX_CLICK_COUNT - clickCount}</h3>
      {clickCount === MAX_CLICK_COUNT && <div>
        You are out of adjustments. Click the "Save" button above to try again.
      </div>}
    </>}
    {scores.length > 0 && <>
      <h2>Leaderboard</h2>
      <DataTable value={scores} loading={requestPending} sortField="totalPoints" sortOrder={-1}>
        <Column field="name" header="Name" sortable/>
        <Column field="totalPoints" header="Score"sortable/>
        <Column field="clicks" header="Clicks" sortable/>
        <Column field="avgPointsPerClick" header="Avg Points/Click" sortable/>
      </DataTable>
    </>}
  </div>
}

export default App
