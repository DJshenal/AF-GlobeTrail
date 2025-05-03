import React, { useEffect, useState, useRef } from 'react';
import Globe from 'react-globe.gl';
import { getAllCountries, getCountryByName, getCountriesByRegion } from '../services/api';
import { SearchBar } from '../components/SearchBar';
import { CountryCard } from '../components/CountryCard';

export function Live_World() {
    const [countries, setCountries] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('');
    const [highlightedCountry, setHighlightedCountry] = useState(null);
    const [highlightedCountryData, setHighlightedCountryData] = useState(null);
    const [customLocation, setCustomLocation] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const [isRotating, setIsRotating] = useState(true);
    const [rotationSpeed, setRotationSpeed] = useState(0.5);
    const globeEl = useRef();

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();

        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (!globeEl.current) return;

        if (isRotating) {
            globeEl.current.controls().autoRotate = true;
            globeEl.current.controls().autoRotateSpeed = rotationSpeed;
        } else {
            globeEl.current.controls().autoRotate = false;
        }
    }, [isRotating, rotationSpeed]);

    const parseCoordinates = (query) => {
        const decimalPattern = /^\s*(-?\d+\.?\d*)\s*[,\s]\s*(-?\d+\.?\d*)\s*$/;
        const directionPattern = /^\s*(\d+\.?\d*)\s*([NS])\s*[,\s]\s*(\d+\.?\d*)\s*([EW])\s*$/i;

        let lat, lng;

        const decimalMatch = query.match(decimalPattern);
        if (decimalMatch) {
            lat = parseFloat(decimalMatch[1]);
            lng = parseFloat(decimalMatch[2]);
            return { lat, lng };
        }

        const directionMatch = query.match(directionPattern);
        if (directionMatch) {
            lat = parseFloat(directionMatch[1]);
            if (directionMatch[2].toUpperCase() === 'S') lat = -lat;

            lng = parseFloat(directionMatch[3]);
            if (directionMatch[4].toUpperCase() === 'W') lng = -lng;

            return { lat, lng };
        }

        return null;
    };

    const getMarkers = () => {
        const markers = [];
        const markerSize = isMobile ? 0.5 : 1.0;

        if (customLocation) {
            markers.push({
                name: 'Custom Location',
                lat: customLocation.lat,
                lng: customLocation.lng,
                size: markerSize,
                color: '#ffffff'
            });
        } else if (highlightedCountry) {
            markers.push({
                ...highlightedCountry,
                size: markerSize * 5,
                color: '#ffffff'
            });
        } else if (!searchQuery && countries.length > 0) {
            countries.forEach(country => {
                markers.push({
                    name: country.name.common,
                    lat: country.latlng[0],
                    lng: country.latlng[1],
                    size: markerSize * 0.7,
                    color: '#ffffff'
                });
            });
        }

        return markers;
    };

    useEffect(() => {
        const handleSearch = async () => {
            try {
                let data;
                const coordinates = parseCoordinates(searchQuery);

                if (coordinates) {
                    setCustomLocation(coordinates);
                    setHighlightedCountry(null);
                    setHighlightedCountryData(null);
                    setIsRotating(false);
                    const altitude = isMobile ? 2.5 : 1.5;
                    globeEl.current?.pointOfView({ lat: coordinates.lat, lng: coordinates.lng, altitude }, 1000);
                    data = await getAllCountries();
                } else if (searchQuery) {
                    setCustomLocation(null);
                    data = await getCountryByName(searchQuery);

                    if (data.length > 0) {
                        const country = data[0];
                        const newHighlight = {
                            name: country.name.common,
                            lat: country.latlng[0],
                            lng: country.latlng[1]
                        };
                        setHighlightedCountry(newHighlight);
                        setHighlightedCountryData(country);
                        setIsRotating(false);

                        const altitude = isMobile ? 2.5 : 1.5;
                        globeEl.current?.pointOfView({ lat: newHighlight.lat, lng: newHighlight.lng, altitude }, 1000);

                        if (isMobile) {
                            setIsInfoOpen(true);
                        }
                    } else {
                        setHighlightedCountry(null);
                        setHighlightedCountryData(null);
                        setIsInfoOpen(false);
                    }
                } else if (selectedRegion) {
                    setCustomLocation(null);
                    setHighlightedCountry(null);
                    setHighlightedCountryData(null);
                    setIsInfoOpen(false);
                    setIsRotating(true);
                    data = await getCountriesByRegion(selectedRegion);

                    const altitude = isMobile ? 3.5 : 2.5;
                    globeEl.current?.pointOfView({ lat: 20, lng: 0, altitude }, 1000);
                } else {
                    setCustomLocation(null);
                    setHighlightedCountry(null);
                    setHighlightedCountryData(null);
                    setIsInfoOpen(false);
                    setIsRotating(true);
                    data = await getAllCountries();
                }

                setCountries(data);
            } catch (err) {
                console.error('Failed to fetch countries:', err);
            }
        };

        const timer = setTimeout(handleSearch, 500);
        return () => clearTimeout(timer);
    }, [searchQuery, selectedRegion, isMobile]);

    const renderCountryInfo = () => {
        if (!highlightedCountryData) return null;

        if (isMobile) {
            return (
                <div className={`fixed bottom-0 left-0 right-0 z-20 bg-white rounded-t-lg shadow-lg 
                                transition-transform duration-300 transform 
                                ${isInfoOpen ? 'translate-y-0' : 'translate-y-full'}`}>
                    <div className="flex justify-between items-center p-3 border-b">
                        <h3 className="font-bold text-lg">{highlightedCountryData.name.common}</h3>
                        <button
                            onClick={() => setIsInfoOpen(!isInfoOpen)}
                            className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                        >
                            {isInfoOpen ? '▼' : '▲'}
                        </button>
                    </div>
                    <div className="p-4 max-h-64 overflow-y-auto">
                        <CountryCard country={highlightedCountryData} />
                    </div>
                </div>
            );
        } else {
            return (
                <div className="absolute top-24 right-5 z-20 w-96">
                    <CountryCard country={highlightedCountryData} />
                </div>
            );
        }
    };

    const getSearchBarClasses = () => {
        if (isMobile) {
            return "absolute top-24 left-0 right-0 z-10 px-4 mx-auto";
        }
        return "absolute top-16 left-4 z-10 w-64";
    };

    const renderLocationIndicator = () => {
        if (!customLocation && !highlightedCountry) return null;

        const location = customLocation || highlightedCountry;
        const name = customLocation ? 'Custom Location' : highlightedCountry.name;

        return (
            <div className="absolute bottom-4 left-4 bg-white p-2 rounded-lg shadow-lg z-10 text-xs">
                <div className="font-semibold">{name}</div>
                <div>
                    {location.lat.toFixed(2)}°{location.lat >= 0 ? 'N' : 'S'},
                    {location.lng.toFixed(2)}°{location.lng >= 0 ? 'E' : 'W'}
                </div>
            </div>
        );
    };

    const renderRotationControls = () => {
        return (
            <div className="absolute bottom-4 right-4 z-10 bg-white p-2 rounded-lg shadow-lg flex items-center space-x-2">
                <button
                    onClick={() => setIsRotating(!isRotating)}
                    className={`p-2 rounded-full ${isRotating ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}
                    title={isRotating ? 'Pause rotation' : 'Start rotation'}
                >
                    {isRotating ? '⏸️' : '▶️'}
                </button>

                {isRotating && (
                    <div className="flex items-center space-x-1">
                        <span className="text-xs">Speed:</span>
                        <input
                            type="range"
                            min="0.1"
                            max="2"
                            step="0.1"
                            value={rotationSpeed}
                            onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
                            className="w-20"
                        />
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <div className={getSearchBarClasses()}>
                <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    onRegionChange={setSelectedRegion}
                    selectedRegion={selectedRegion}
                    placeholder={isMobile ? "Search country or coordinates" : "Search country or enter coordinates"}
                />
            </div>

            <div className="w-full h-screen relative">
                <Globe
                    ref={globeEl}
                    globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                    bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                    backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
                    markers={getMarkers()}
                    markerColor={marker => marker.color}
                    markerRadius={marker => marker.size}
                    onMarkerClick={marker => {
                        const altitude = isMobile ? 2.5 : 1.5;
                        globeEl.current?.pointOfView(
                            { lat: marker.lat, lng: marker.lng, altitude },
                            1000
                        );
                        setIsRotating(false);

                        if (isMobile && marker.name !== 'Custom Location') {
                            setIsInfoOpen(true);
                        }
                    }}
                    markerLabel={marker => {
                        if (isMobile) {
                            return `
                                <div class="bg-white p-1 rounded shadow-lg border border-gray-200 max-w-xs">
                                    <b class="text-sm">${marker.name}</b>
                                </div>
                            `;
                        }

                        return `
                            <div class="bg-white p-2 rounded shadow-lg border border-gray-200 max-w-xs">
                                <b class="text-lg">${marker.name}</b>
                                <div class="text-sm">Latitude: ${marker.lat.toFixed(4)}°</div>
                                <div class="text-sm">Longitude: ${marker.lng.toFixed(4)}°</div>
                            </div>
                        `;
                    }}
                    width="100%"
                    height="100%"
                    animateIn={false}
                    enablePointerInteraction={true}
                />

                {renderLocationIndicator()}
                {renderRotationControls()}
                {renderCountryInfo()}

                {isMobile && highlightedCountryData && !isInfoOpen && (
                    <button
                        onClick={() => setIsInfoOpen(true)}
                        className="fixed bottom-4 right-4 z-30 bg-blue-500 text-white p-3 rounded-full shadow-lg"
                    >
                        ℹ️
                    </button>
                )}
            </div>
        </div>
    );
}