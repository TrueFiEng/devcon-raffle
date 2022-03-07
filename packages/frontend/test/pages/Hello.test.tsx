import { screen, render } from '@testing-library/react'
import React from 'react'

import { Hello } from '../../src/pages/Hello'

it('something', async () => {
  renderHello()
  expect(await screen.findByText('Hello World!')).toBeDefined()
})

const renderHello = () => render(<Hello />)
