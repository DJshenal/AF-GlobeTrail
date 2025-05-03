import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const FAVORITES_KEY = 'countries_app_favorites';

export function useFavorites() {
    const { user } = useAuth();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            const storedFavorites = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '{}');
            setFavorites(storedFavorites[user.id] || []);
        } else {
            setFavorites([]);
        }
        setLoading(false);
    }, [user]);

    const toggleFavorite = async (countryCode) => {
        if (!user) return;

        try {
            const storedFavorites = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '{}');
            const userFavorites = storedFavorites[user.id] || [];
            const isFavorite = userFavorites.includes(countryCode);

            if (isFavorite) {
                const updatedFavorites = userFavorites.filter(code => code !== countryCode);
                storedFavorites[user.id] = updatedFavorites;
                setFavorites(updatedFavorites);
                toast.success('Removed from favorites');
            } else {
                const updatedFavorites = [...userFavorites, countryCode];
                storedFavorites[user.id] = updatedFavorites;
                setFavorites(updatedFavorites);
                toast.success('Added to favorites');
            }

            localStorage.setItem(FAVORITES_KEY, JSON.stringify(storedFavorites));
        } catch (error) {
            console.error('Error toggling favorite:', error);
            toast.error('Failed to update favorites');
        }
    };

    return {
        favorites,
        loading,
        toggleFavorite,
        isFavorite: (countryCode) => favorites.includes(countryCode),
    };
}