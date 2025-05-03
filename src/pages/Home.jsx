import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllCountries, getCountryByName, getCountriesByRegion } from '../services/api';
import { HeroSection } from '../components/HeroSection';
import { CountryCard } from '../components/CountryCard';

export function Home() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        setError(null);
        let data;

        if (searchQuery) {
          data = await getCountryByName(searchQuery);
        } else if (selectedRegion) {
          data = await getCountriesByRegion(selectedRegion);
        } else {
          data = await getAllCountries();
        }

        setCountries(data);
        setCurrentPage(1);
      } catch (err) {
        setError('Failed to fetch countries. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchCountries();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedRegion]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCountries = countries.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(countries.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const pageVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1 },
    out: { opacity: 0 }
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={{ duration: 0.3 }}
    >
      <HeroSection
        value={searchQuery}
        onChange={setSearchQuery}
        selectedRegion={selectedRegion}
        onRegionChange={setSelectedRegion}
      />

      <div className="container mx-auto px-4 py-6">
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-10 text-gray-600"
          >
            Loading countries...
          </motion.div>
        ) : error ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-red-500"
          >
            {error}
          </motion.p>
        ) : (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${searchQuery}-${selectedRegion}-${currentPage}`}
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6"
              >
                {currentCountries.map((country, index) => (
                  <motion.div
                    key={index}
                    variants={cardVariants}
                    whileHover={{ y: -5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <CountryCard country={country} />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap justify-center items-center mt-8 mb-4 gap-2"
              >
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`flex items-center justify-center min-w-12 h-10 px-3 py-2 rounded-lg transition-all duration-200 ${currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                    : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-gray-600 shadow-sm hover:shadow border border-transparent hover:border-blue-200'
                    }`}
                  aria-label="Previous page"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="hidden sm:inline">Previous</span>
                </motion.button>

                {currentPage > 3 && (
                  <>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePageChange(1)}
                      className="flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 shadow-sm hover:shadow border border-transparent hover:border-blue-200"
                    >
                      1
                    </motion.button>

                    {currentPage > 4 && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-center w-10 h-10 text-gray-500"
                      >
                        ...
                      </motion.span>
                    )}
                  </>
                )}

                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                  ) {
                    return (
                      <motion.button
                        key={pageNum}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePageChange(pageNum)}
                        className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 ${pageNum === currentPage
                          ? 'bg-gray-600 text-white shadow-md transform scale-110'
                          : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-gray-600 shadow-sm hover:shadow border border-transparent hover:border-blue-200'
                          }`}
                        whileHover={pageNum !== currentPage ? { scale: 1.05 } : {}}
                      >
                        {pageNum}
                      </motion.button>
                    );
                  }
                  if (pageNum === 2 && currentPage > 4) return null;
                  if (pageNum === totalPages - 1 && currentPage < totalPages - 3) return null;

                  if ((pageNum === 2 && currentPage > 3) || (pageNum === totalPages - 1 && currentPage < totalPages - 2)) {
                    return (
                      <motion.span
                        key={pageNum}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-center w-10 h-10 text-gray-500"
                      >
                        ...
                      </motion.span>
                    );
                  }

                  return null;
                })}

                {currentPage < totalPages - 2 && (
                  <>
                    {currentPage < totalPages - 3 && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-center w-10 h-10 text-gray-500"
                      >
                        ...
                      </motion.span>
                    )}

                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePageChange(totalPages)}
                      className="flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 shadow-sm hover:shadow border border-transparent hover:border-blue-200"
                    >
                      {totalPages}
                    </motion.button>
                  </>
                )}

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`flex items-center justify-center min-w-12 h-10 px-3 py-2 rounded-lg transition-all duration-200 ${currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                    : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-gray-600 shadow-sm hover:shadow border border-transparent hover:border-blue-200'
                    }`}
                  aria-label="Next page"
                >
                  <span className="hidden sm:inline">Next</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </motion.button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}