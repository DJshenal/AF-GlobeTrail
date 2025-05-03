import React from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export function FavoriteButton({ countryCode, isFavorite, onToggle }) {
    const { user } = useAuth();

    const handleClick = () => {
        if (!user) {
            toast.error('Please sign in to add favorites');
            return;
        }
        onToggle();
    };

    return (
        <button
            onClick={handleClick}
            className={`p-2 rounded-full transition-colors ${isFavorite
                ? 'text-red-500 hover:text-red-600'
                : 'text-gray-400 hover:text-gray-500'
                }`}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
            <Heart
                size={24}
                fill={isFavorite ? 'currentColor' : 'none'}
            />
        </button>
    );
}