import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import { CourseProvider } from './contexts/CourseContext';

function App() {
  return (
    <BrowserRouter>
      <CourseProvider>
        <div className="mx-auto">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
          <Footer />
        </div>
      </CourseProvider>
    </BrowserRouter>
  )
}

export default App
