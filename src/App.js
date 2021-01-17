import { useState, useEffect } from 'react'
import { ProgressSpinner } from 'primereact/progressspinner'
import { InputText } from 'primereact/inputtext'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import Button from './components/Button'
import api from './lib/api'

const MAX_CLICK_COUNT = 10

function App () {
  const [loading, setLoading] = useState(true)
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
      const latestScoresWithAveragePointsPerClick = latestScores
        .sort((a, b) => {
          return a.totalPoints - b.totalPoints
        })
        .slice(0, 10)
        .map(score => {
          score.avgPointsPerClick = Number(score.totalPoints / score.clicks).toFixed(2)
          return score
        })
      setScores(latestScoresWithAveragePointsPerClick)
      setLoading(false)
    }
    requestScores()
  }, [])

  function resetState () {
    setName('')
    setTotalPoints(0)
    setClickCount(0)
  }
  function adjustScore () {
    if (clickCount < MAX_CLICK_COUNT) {
      setClickCount(clickCount + 1)
      setTotalPoints(totalPoints + Math.round((Math.random() * 200)) - 100)
    }
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
    setRequestPending(false)
    const updatedScores = scores.slice()
    updatedScores.push(submittedScore)
    setScores(updatedScores)
    resetState()
  }

  return <div style={{ margin: '2rem' }}>
    <h1>High Score App</h1>
    <br/>
    {loading
      ? <>
      <div style={{ margin: 'auto' }}><ProgressSpinner className="p-d-block" /></div>
      <h3 style={{ textAlign: 'center' }}>Getting scores</h3>
    </>
      : <>
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
        <Button label="Submit" className="p-button" onClick={submitScores} loading={requestPending}/>
      </div>
    </div>
    <h3>Current score: {totalPoints}</h3>
    </>}
    {scores.length > 0 && <>
      <h2>Leader board</h2>
      <DataTable value={scores} sortField="totalPoints" sortOrder={-1}>
        <Column field="name" header="Name" sortable/>
        <Column field="totalPoints" header="Score"sortable/>
        <Column field="clicks" header="Clicks" sortable/>
        <Column field="avgPointsPerClick" header="Avg Points/Click" sortable/>
      </DataTable>
    </>}
  </div>
}

export default App
