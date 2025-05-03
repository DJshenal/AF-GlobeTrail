import React from 'react';
import { Globe } from 'lucide-react';

const regions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

export function RegionFilter({ selectedRegion, onRegionChange }) {
    return (
        <div className="w-full px-4 sm:px-0 sm:max-w-xl mx-auto my-4 sm:my-8">
            <div className="flex items-center bg-white rounded-full shadow-lg p-1">
                <div className="pl-2 sm:pl-4">
                    <Globe className="text-gray-400" size={18} />
                </div>
                <select
                    value={selectedRegion}
                    onChange={(e) => onRegionChange(e.target.value)}
                    className="w-full px-2 sm:px-5 py-2 sm:py-3 text-sm sm:text-base rounded-full focus:outline-none appearance-none bg-white"
                >
                    <option value="">Filter by Region</option>
                    {regions.map((region) => (
                        <option key={region} value={region}>
                            {region}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}