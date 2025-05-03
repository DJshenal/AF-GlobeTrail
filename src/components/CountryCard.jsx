import React from 'react';
import { Link } from 'react-router-dom';
import { FavoriteButton } from './FavoriteButton';
import { useFavorites } from '../hooks/useFavorites';

export function CountryCard({ country }) {
    const { isFavorite, toggleFavorite } = useFavorites();

    return (
        <div
            className="relative bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl backdrop-blur-md p-6 shadow-lg overflow-hidden"
        >
            <div
                className="absolute inset-0 opacity-5 z-0"
                style={{
                    backgroundImage: `url(${country.flags.svg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            />

            <div className="relative z-10">
                <Link to={`/country/${country.cca3}`}>
                    <img
                        src={country.flags.svg}
                        alt={country.flags.alt || `Flag of ${country.name.common}`}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                </Link>
                <FavoriteButton
                    countryCode={country.cca3}
                    isFavorite={isFavorite(country.cca3)}
                    onToggle={() => toggleFavorite(country.cca3)}
                />
                <h2 className="text-xl font-bold mb-2">{country.name.common}</h2>
                <p className="text-sm text-gray-700 mb-1">{country.name.official}</p>
                <p className="text-sm mb-1"><span className="font-medium">Population:</span> {country.population.toLocaleString()}</p>
                <p className="text-sm mb-1"><span className="font-medium">Region:</span> {country.region}</p>
                <p className="text-sm mb-1"><span className="font-medium">Capital:</span> {country.capital?.[0] || 'N/A'}</p>
            </div>
        </div>
    );
}