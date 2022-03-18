import { HashRouter, Route, Routes } from 'react-router-dom'
import styled from 'styled-components'

import { TopBar } from './components/TopBar/TopBar'
import { Bids, Home } from './pages'

export function Root() {
  return (
    <RootContainer>
      <TopBar />
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bids" element={<Bids />} />
        </Routes>
      </HashRouter>
    </RootContainer>
  )
}

const RootContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
`
