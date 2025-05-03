import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Globe, Users, MapPin, Clock, Languages, FileText, Map } from 'lucide-react';
import { getCountryByCode } from '../services/api';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export function CountryDetail() {
    const { code } = useParams();
    const [country, setCountry] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCountry = async () => {
            if (!code) return;

            try {
                setLoading(true);
                setError(null);
                const [data] = await getCountryByCode(code);
                setCountry(data);
                document.title = `${data.name.common} | World Explorer`;
            } catch (err) {
                setError('Failed to fetch country details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchCountry();

        return () => {
            document.title = 'World Explorer';
        };
    }, [code]);

    if (loading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100"
            >
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"
                ></motion.div>
                <motion.p
                    initial={{ y: 10 }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-4 text-blue-600 font-medium"
                >
                    Loading country information...
                </motion.p>
            </motion.div>
        );
    }

    if (error || !country) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-red-50 to-pink-100"
            >
                <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="bg-white rounded-xl shadow-xl p-8 max-w-md"
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-red-500 text-center text-xl font-semibold mb-4"
                    >
                        {error || 'Country not found'}
                    </motion.div>
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Link
                            to="/"
                            className="inline-flex items-center justify-center w-full px-4 py-3 mt-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
                        >
                            <ArrowLeft size={20} className="mr-2" />
                            Return to Home
                        </Link>
                    </motion.div>
                </motion.div>
            </motion.div>
        );
    }

    const coordinates = country.capitalInfo?.latlng || country.latlng || [0, 0];

    const getRegionGradient = () => {
        const regionMap = {
            'Africa': 'from-yellow-50 to-orange-100',
            'Americas': 'from-blue-50 to-cyan-100',
            'Asia': 'from-red-50 to-orange-100',
            'Europe': 'from-indigo-50 to-purple-100',
            'Oceania': 'from-teal-50 to-cyan-100',
            'Antarctic': 'from-blue-50 to-indigo-100'
        };
        return regionMap[country.region] || 'from-gray-50 to-gray-200';
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

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    const statCardVariants = {
        hover: { y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" },
        tap: { scale: 0.98 }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`min-h-screen bg-gradient-to-br ${getRegionGradient()} py-6 px-4 sm:px-6 lg:px-8`}
        >
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden"
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="relative h-48 md:h-64 bg-cover bg-center flex items-end"
                        style={{
                            backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url(${country.flags.svg})`,
                            backgroundPosition: 'center'
                        }}
                    >
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="absolute top-4 left-4 z-20"
                        >
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    to="/"
                                    className="inline-flex items-center px-4 py-2 bg-white/90 hover:bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 text-gray-700 backdrop-blur-sm"
                                >
                                    <ArrowLeft size={18} className="mr-2" />
                                    Back
                                </Link>
                            </motion.div>
                        </motion.div>
                        <div className="absolute inset-0 backdrop-blur-sm z-0"></div>
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="relative p-6 md:p-8 z-10 w-full"
                        >
                            <motion.h1
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1 }}
                                className="text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg"
                            >
                                {country.name.common}
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.2 }}
                                className="text-white text-opacity-90 mt-2 italic"
                            >
                                {country.name.official}
                            </motion.p>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="grid md:grid-cols-2 gap-8 p-6 md:p-8"
                    >
                        <motion.div variants={itemVariants} className="space-y-8">
                            <motion.div
                                variants={containerVariants}
                                className="grid grid-cols-2 gap-4"
                            >
                                {[
                                    { icon: Users, color: 'blue', label: 'Population', value: country.population.toLocaleString() },
                                    { icon: Globe, color: 'green', label: 'Region', value: country.region },
                                    { icon: MapPin, color: 'amber', label: 'Capital', value: country.capital?.[0] || 'N/A' },
                                    { icon: Map, color: 'purple', label: 'Area', value: country.area?.toLocaleString() || 'N/A' + ' km²' }
                                ].map((stat, index) => (
                                    <motion.div
                                        key={index}
                                        variants={itemVariants}
                                        whileHover="hover"
                                        whileTap="tap"
                                        // variants={statCardVariants}
                                        className={`bg-${stat.color}-50 p-4 rounded-lg flex flex-col items-center text-center`}
                                    >
                                        <stat.icon className={`h-8 w-8 text-${stat.color}-600 mb-2`} />
                                        <span className="text-sm text-gray-500">{stat.label}</span>
                                        <span className="text-xl font-bold text-gray-800">{stat.value}</span>
                                    </motion.div>
                                ))}
                            </motion.div>

                            <motion.div
                                variants={itemVariants}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4 }}
                                className="h-64 md:h-80 rounded-xl overflow-hidden shadow-md w-full ring-1 ring-gray-200"
                            >
                                <MapContainer
                                    center={coordinates}
                                    zoom={5}
                                    style={{ height: '100%', width: '100%' }}
                                    scrollWheelZoom={false}
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    />
                                    <Marker position={coordinates}>
                                        <Popup>
                                            {country.name.common}
                                            {country.capital?.[0] && `, Capital: ${country.capital[0]}`}
                                        </Popup>
                                    </Marker>
                                </MapContainer>
                            </motion.div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="space-y-6">
                            <motion.div
                                variants={itemVariants}
                                whileHover={{ y: -3 }}
                                className="bg-gray-50 p-6 rounded-xl"
                            >
                                <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                                    <FileText className="h-5 w-5 mr-2 text-gray-600" />
                                    National Flag
                                </h2>
                                <motion.img
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                    src={country.flags.svg}
                                    alt={country.flags.alt || `Flag of ${country.name.common}`}
                                    className="w-full h-auto rounded-lg border border-gray-200 shadow-md"
                                    whileHover={{ scale: 1.02 }}
                                />
                                {country.flags.alt && (
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.8 }}
                                        className="mt-3 text-sm text-gray-600 italic"
                                    >
                                        {country.flags.alt}
                                    </motion.p>
                                )}
                            </motion.div>

                            <motion.div
                                variants={itemVariants}
                                whileHover={{ y: -3 }}
                                className="bg-gray-50 p-6 rounded-xl"
                            >
                                <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                                    <Languages className="h-5 w-5 mr-2 text-gray-600" />
                                    Languages
                                </h2>
                                <motion.div
                                    className="flex flex-wrap gap-2"
                                    variants={containerVariants}
                                >
                                    {Object.values(country.languages || {}).length > 0 ? (
                                        Object.values(country.languages || {}).map((language, index) => (
                                            <motion.span
                                                key={language}
                                                variants={itemVariants}
                                                whileHover={{ scale: 1.05 }}
                                                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                            >
                                                {language}
                                            </motion.span>
                                        ))
                                    ) : (
                                        <motion.span
                                            variants={itemVariants}
                                            className="text-gray-600"
                                        >
                                            No language data available
                                        </motion.span>
                                    )}
                                </motion.div>
                            </motion.div>

                            <motion.div
                                variants={itemVariants}
                                whileHover={{ y: -3 }}
                                className="bg-gray-50 p-6 rounded-xl"
                            >
                                <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                                    <Clock className="h-5 w-5 mr-2 text-gray-600" />
                                    Additional Information
                                </h2>
                                <motion.div
                                    className="space-y-3"
                                    variants={containerVariants}
                                >
                                    {[
                                        { label: 'Subregion', value: country.subregion || 'N/A' },
                                        { label: 'Timezones', value: country.timezones?.length || 0 },
                                        ...(country.currencies ? [{ label: 'Currencies', value: Object.values(country.currencies).map(c => c.name).join(', ') }] : []),
                                        { label: 'Independent', value: country.independent ? 'Yes' : 'No' }
                                    ].map((info, index) => (
                                        <motion.div
                                            key={index}
                                            variants={itemVariants}
                                            className="flex justify-between border-b border-gray-200 pb-2"
                                        >
                                            <span className="text-gray-600">{info.label}</span>
                                            <span className="font-medium text-gray-800">{info.value}</span>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </motion.div>

                            {country.timezones && country.timezones.length > 0 && (
                                <motion.details
                                    variants={itemVariants}
                                    className="bg-gray-50 p-6 rounded-xl group"
                                    whileHover={{ y: -3 }}
                                >
                                    <summary className="text-xl font-semibold text-gray-800 flex items-center cursor-pointer">
                                        <Clock className="h-5 w-5 mr-2 text-gray-600" />
                                        Timezones
                                        <motion.div
                                            className="ml-auto transform group-open:rotate-180 transition-transform"
                                            whileHover={{ scale: 1.1 }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </motion.div>
                                    </summary>
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2"
                                    >
                                        {country.timezones.map((timezone, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="p-2 bg-white rounded-md text-center text-sm"
                                            >
                                                {timezone}
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                </motion.details>
                            )}
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    );
}