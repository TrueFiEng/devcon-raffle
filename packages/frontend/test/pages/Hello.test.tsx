import { screen, render } from '@testing-library/react'
import { Header } from 'src/components/Header'

it('something', async () => {
  renderHello()
  expect(await screen.findByText('Hello World!')).toBeDefined()
})

const renderHello = () => render(<Header />)
