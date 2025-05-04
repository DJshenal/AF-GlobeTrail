import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function ErrorPage() {
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    const pulseVariants = {
        initial: { scale: 1 },
        animate: {
            scale: [1, 1.05, 1],
            transition: {
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen flex flex-col justify-center items-center px-4 py-12"
            style={{
                backgroundImage: "url('https://www.shutterstock.com/image-photo/earth-he-night-abstract-wallpaper-600nw-1558058690.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat"
            }}
        >
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="max-w-lg w-full text-center bg-gray-950/55 p-8 rounded-lg backdrop-blur-sm"
            >
                <motion.div
                    variants={pulseVariants}
                    initial="initial"
                    animate="animate"
                    className="mb-8"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="w-32 h-32 mx-auto text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 8v4M12 16h.01" />
                    </svg>
                </motion.div>

                <motion.h1
                    variants={itemVariants}
                    className="text-6xl font-bold text-gray-200 mb-4"
                >
                    404
                </motion.h1>

                <motion.h2
                    variants={itemVariants}
                    className="text-2xl font-semibold text-gray-300 mb-6"
                >
                    Page Not Found
                </motion.h2>

                <motion.p
                    variants={itemVariants}
                    className="text-gray-400 mb-8"
                >
                    The page you're looking for doesn't exist or has been moved.
                </motion.p>
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
        </motion.div>
    );
}