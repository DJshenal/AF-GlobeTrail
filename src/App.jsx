import Header from './components/Header';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Footer from './components/Footer';
import { Home } from './pages/Home';
import { Live_World } from './pages/Live_World';
import { Favorites } from './pages/Favorites';
import { CountryDetail } from './pages/CountryDetail';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Live-world" element={<Live_World />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/country/:code" element={<CountryDetail />} />
            </Routes>
          </main>
          <Toaster position="top-center" />
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;