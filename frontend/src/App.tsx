import { BrowserRouter } from 'react-router-dom'

import Menu from './components/Header';

function App() {
  return (
    <BrowserRouter>
      <div className="max-w-[1366px] mx-auto">
        <Menu />
      </div>
    </BrowserRouter>
  )
}

export default App
