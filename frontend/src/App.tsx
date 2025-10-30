import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import { CourseProvider } from './contexts/CourseContext';
import { DrawerProvider } from './contexts/DrawerContext';
import CourseDrawer from './components/CourseDrawer';

function App() {
  return (
    <BrowserRouter>
      <CourseProvider>
        <DrawerProvider>
          <div className="mx-auto">
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
            <Footer />
            <CourseDrawer />
          </div>
        </DrawerProvider>
      </CourseProvider>
    </BrowserRouter>
  )
}

export default App
