import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

jest.mock('./lib/api')

describe('App', () => {
  test('renders initially without crashing', () => {
    render(<App />)
    const h1 = screen.getByRole('heading', { name: /high score app/i })
    expect(h1).toBeInTheDocument()
  })
  test('renders input elements after loading scores', async () => {
    render(<App />)
    await waitForElementToBeRemoved(() => screen.getByRole('heading', { name: /getting scores/i }))

    const input = screen.getByLabelText('Name', { exact: true })
    const adjustScoreButton = screen.getByRole('button', { name: /adjust score/i })
    const saveButton = screen.getByRole('button', { name: /save/i })

    expect(input).toBeInTheDocument()
    expect(adjustScoreButton).toBeInTheDocument()
    expect(saveButton).toBeInTheDocument()
  })
  test('"adjust score" button changes user\'s score and number remaining', async () => {
    render(<App />)
    await waitForElementToBeRemoved(() => screen.getByRole('heading', { name: /getting scores/i }))

    const input = screen.getByLabelText('Name', { exact: true })
    const userName = 'Test name'
    const adjustScoreButton = screen.getByRole('button', { name: /adjust score/i })
    const userScore = screen.getByText('Current score: 0')
    const remainingAdjustments = screen.getByText('Remaining adjustments: 10')
    userEvent.type(input, userName)
    userEvent.click(adjustScoreButton)
    expect(input).toHaveValue(userName)
    expect(remainingAdjustments).toHaveTextContent('Remaining adjustments: 9')
    expect(userScore).not.toHaveTextContent('Current score: 0')
  })
})
