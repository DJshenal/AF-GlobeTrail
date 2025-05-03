import React from 'react';
import { Search } from 'lucide-react';

export function SearchBar({ value, onChange }) {
    return (
        <div className=" max-w-xl sm:w-3/2 px-4 sm:px-0 sm:max-w-xl mx-auto my-4 sm:my-8">
            <div className="flex items-center bg-white rounded-full shadow-lg p-1">
                <div className="pl-3 sm:pl-4">
                    <Search className="text-gray-400" size={18} sm:size={20} />
                </div>
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Search for a country..."
                    className="w-full px-3 py-2 sm:px-5 sm:py-3 rounded-full focus:outline-none text-sm sm:text-base"
                />
            </div>
        </div>
    );
}