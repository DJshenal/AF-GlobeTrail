import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Earth, Heart, Menu, X } from 'lucide-react';
import { AuthModal } from './AuthModal';
import { useAuth } from '../contexts/AuthContext';

function Header() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-gray-900">
            GlobalTrail
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <div className="flex gap-4">
                <div className="flex items-center">
                  <Link
                    to="/Live-world"
                    className="flex items-center gap-2 text-gray-900"
                  >
                    <span>LiveWorld</span>
                    <Earth className="text-gray-600" size={20} />
                  </Link>
                </div>
                <div className="flex items-center">
                  <Link
                    to='/favorites'
                    className="flex items-center gap-2 text-gray-900"
                  >
                    <span>Favorites</span>
                    <Heart className="text-gray-600" size={20} />
                  </Link>
                </div>
              </div>
            )}
            {user ? (
              <button
                onClick={() => signOut()}
                className="px-4 py-2 text-red-500 hover:text-red-600"
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-4 py-2 border-black border-2 text-black rounded-lg hover:bg-gray-500 transition-colors"
              >
                Sign In
              </button>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X size={24} className="text-gray-900" />
              ) : (
                <Menu size={24} className="text-gray-900" />
              )}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="flex flex-col px-4 py-2">
              {user ? (
                <>
                  <Link
                    to="/Live-world"
                    className="flex items-center gap-2 text-gray-900 py-3 border-b border-gray-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>LiveWorld</span>
                    <Earth className="text-gray-600" size={20} />
                  </Link>
                  <Link
                    to='/favorites'
                    className="flex items-center gap-2 text-gray-900 py-3 border-b border-gray-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>Favorites</span>
                    <Heart className="text-gray-600" size={20} />
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-left text-red-500 hover:text-red-600 py-3"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setIsAuthModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="my-2 px-4 py-2 border-black border-2 text-black rounded-lg hover:bg-gray-500 transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </header>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}

export default Header;