import { Github, Globe, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="bg-gray-800 text-gray-100 py-6 mt-10">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
                <div className="text-center md:text-left mb-4 md:mb-0">
                    <h2 className="text-lg font-semibold">GlobalTrail</h2>
                    <p className="text-sm text-gray-400">© {new Date().getFullYear()} All rights reserved.</p>
                </div>

                <div className="flex gap-4">
                    <a href="" target="_blank" rel="noopener noreferrer">
                        <Github className="w-5 h-5 hover:text-blue-400 transition" />
                    </a>
                    <a href="" target="_blank" rel="noopener noreferrer">
                        <Twitter className="w-5 h-5 hover:text-blue-400 transition" />
                    </a>
                    <Link to="/">
                        <Globe className="w-5 h-5 hover:text-blue-400 transition" />
                    </Link>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
