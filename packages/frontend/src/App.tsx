import { Root } from 'src/Root'

import { Providers } from './providers/Providers'
import { GlobalStyles } from './styles/GlobalStyles'

function App() {
  return (
    <Providers>
      <GlobalStyles />
      <Root />
    </Providers>
  )
}

export default App
