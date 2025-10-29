import { BrowserRouter } from 'react-router-dom'

import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <BrowserRouter>
      <div className="mx-auto">
        <Header />
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
