import React, { useState, useEffect } from 'react';
import { CountryCard } from '../components/CountryCard';
import { useFavorites } from '../hooks/useFavorites';
import { getCountryByCode } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

export function Favorites() {
  const { favorites, loading: favoritesLoading } = useFavorites();
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavoriteCountries = async () => {
      if (favoritesLoading) return;

      try {
        setLoading(true);
        setError(null);

        const countriesData = await Promise.all(
          favorites.map(code => getCountryByCode(code))
        );

        setCountries(countriesData.map(data => data[0]));
      } catch (err) {
        setError('Failed to fetch favorite countries. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteCountries();
  }, [favorites, favoritesLoading]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (loading || favoritesLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center h-64"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400"
        ></motion.div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-red-500 dark:text-red-400 text-center py-4"
      >
        {error}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 py-8"
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-bold mb-8 text-gray-900 "
      >
        My Favorite Countries
      </motion.h1>

      <AnimatePresence>
        {countries.length === 0 ? (
          <motion.div
            key="empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center text-gray-600 dark:text-gray-400 py-8"
          >
            <p>You haven't added any countries to your favorites yet.</p>
          </motion.div>
        ) : (
          <motion.div
            key="countries-grid"
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          >
            {countries.map((country, index) => (
              <motion.div
                key={country.cca3}
                variants={item}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <CountryCard country={country} index={index} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}