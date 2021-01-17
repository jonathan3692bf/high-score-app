import { useState } from 'react'
import { InputText } from 'primereact/inputtext'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import Button from './components/Button'
import api from './lib/api'

const MAX_CLICK_COUNT = 10

function App () {
  const [name, setName] = useState('')
  const [totalPoints, setTotalPoints] = useState(0)
  const [clickCount, setClickCount] = useState(0)
  const [nameError, setNameError] = useState(false)
  const [requestPending, setRequestPending] = useState(false)
  const [scores, setScores] = useState([])
  const disableAdjustButton = clickCount === MAX_CLICK_COUNT

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
    const submittedScore = { name, totalPoints, clicks: clickCount }
    const updatedScores = scores.slice()
    updatedScores.push(submittedScore)
    setScores(updatedScores)
    resetState()
    setRequestPending(true)
    try {
      await api.submitScore(submittedScore)
    } catch (error) {

    }
    setTimeout(() => {
      setRequestPending(false)
    }, 333)
  }

  return <div style={{ margin: '2rem' }}>
    <h1>High Score App</h1>
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
        <Button label="Submit" className="p-button" onClick={submitScores} loading={requestPending}/>
      </div>
    </div>
    <h3>Current score: {totalPoints}</h3>
    {scores.length > 0 && <>
      <h3>Leader board</h3>
      <DataTable value={scores}>
        <Column field="name" header="Name"></Column>
        <Column field="totalPoints" header="Score"></Column>
        <Column field="clicks" header="Clicks"></Column>
      </DataTable>
    </>}
  </div>
}

export default App
