import React, { useRef, useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { SearchBar } from "./SearchBar";
import { RegionFilter } from "./RegionFilter";
import Globe from 'react-globe.gl';
import { motion } from 'framer-motion';

export function HeroSection({ value, onChange, selectedRegion, onRegionChange }) {
    const globeEl = useRef();
    const [globeMounted, setGlobeMounted] = useState(false);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 2,
                }
            }
        ]
    };
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    useEffect(() => {
        if (!globeEl.current) return;

        const timer = setTimeout(() => {
            setGlobeMounted(true);
            globeEl.current.pointOfView(
                { lat: 0, lng: 0, altitude: 1.5 },
                1000
            );
        }, 200);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!globeMounted || !globeEl.current) return;

        const controls = globeEl.current.controls();
        if (!controls) return;

        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.5;

        const handleInteractionEnd = () => {
            if (globeEl.current && globeEl.current.controls()) {
                globeEl.current.controls().autoRotate = true;
            }
        };

        controls.addEventListener('change', handleInteractionEnd);

        return () => {
            if (globeEl.current && globeEl.current.controls()) {
                globeEl.current.controls().autoRotate = false;
                globeEl.current.controls().removeEventListener('change', handleInteractionEnd);
            }
        };
    }, [globeMounted]);

    useEffect(() => {
        const handleResize = () => {
            if (globeEl.current) {
                globeEl.current.width(window.innerWidth);
                globeEl.current.height(window.innerHeight);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-indigo-900 to-gray-900 h-[70vh]">
            <div className="absolute inset-0 w-full h-full bg-black">
                {[...Array(200)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-white"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${Math.random() * 3}px`,
                            height: `${Math.random() * 3}px`,
                            opacity: Math.random(),
                        }}
                    />
                ))}
            </div>

            <div className="absolute inset-0 w-full h-screen">
                <Globe
                    ref={globeEl}
                    globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                    bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                    backgroundColor="rgba(0,0,0,0)"
                    pointLat="lat"
                    pointLng="lng"
                    pointLabel="name"
                    pointColor={() => '#ffba08'}
                    pointRadius={0.5}
                    pointAltitude={0.01}
                    pointsTransitionDuration={1000}
                    width={window.innerWidth}
                    height={window.innerHeight}
                />
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 mt-32"
            >
                <div className="text-center mb-10">
                    <motion.h1
                        variants={item}
                        className="text-5xl md:text-6xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-amber-400"
                    >
                        GlobalTrail
                    </motion.h1>
                    <motion.h2
                        variants={item}
                        className="text-2xl md:text-3xl font-bold mb-3 text-white"
                    >
                        Welcome to the Country Information App
                    </motion.h2>
                    <motion.p
                        variants={item}
                        className="text-lg text-gray-300 max-w-2xl mx-auto"
                    >
                        Discover fascinating information about countries around the world, from demographics to cultural heritage.
                    </motion.p>
                </div>

                <motion.div
                    variants={container}
                    className="flex mt-8 gap-4 justify-evenly"
                >
                    <motion.div variants={item} className="flex-1/2">
                        <SearchBar
                            value={value}
                            onChange={onChange}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        />
                    </motion.div>
                    <motion.div variants={item} className="flex-1/12">
                        <RegionFilter
                            selectedRegion={selectedRegion}
                            onRegionChange={onRegionChange}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                        />
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
}