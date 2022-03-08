import { Hello } from './pages/Hello'
import { Providers } from './providers/Providers'
import { GlobalStyles } from './styles/GlobalStyles'

function App() {
  return (
    <Providers>
      <GlobalStyles />
      <Hello />
    </Providers>
  )
}

export default App
