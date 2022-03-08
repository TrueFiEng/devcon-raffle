import { screen, render } from '@testing-library/react'
import React from 'react'
import { Header } from 'src/components/Header'

it('something', async () => {
  renderHello()
  expect(await screen.findByText('Devcon 6 Ticket Sale')).toBeDefined()
})

const renderHello = () => render(<Header />)
