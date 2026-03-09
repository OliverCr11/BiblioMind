import React, { useState, useEffect } from 'react';
import { BookMarked, Star, Edit3 } from 'lucide-react';

export default function Hero() {
    const [stats, setStats] = useState({
        total_books: 0,
        total_reviews: 0,
        average_rating: 0.0
    });

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/stats/')
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(err => console.error("Error fetching stats:", err));
    }, []);

    return (
        <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
            {/* Background with glowing particles and floating books representation */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-black via-background-pure to-background-zinc z-10 opacity-60"></div>
                <img
                    src="/hero_visual.png"
                    alt="Premium Digital Library"
                    className="w-full h-full object-cover opacity-30 animate-float"
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand/30 rounded-full blur-[120px] pointer-events-none"></div>
            </div>

            <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-heading font-extrabold tracking-tight mb-8">
                        Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-purple-300">Reader</span>.<br />
                        What are we reading today?
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-12 mb-10">
                        <a href="#featured-books" className="glassmorphism p-6 rounded-2xl flex items-center justify-between hover:glow-primary transition-all cursor-pointer relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-brand group-hover:bg-purple-300 transition-colors"></div>
                            <div>
                                <p className="text-sm text-gray-400 mb-1 pointer-events-none">Books Read</p>
                                <p className="text-3xl font-heading font-bold text-white pointer-events-none">{stats.total_books}</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center pointer-events-none">
                                <BookMarked className="h-6 w-6 text-brand" />
                            </div>
                        </a>

                        <a href="#recent-reviews" className="glassmorphism p-6 rounded-2xl flex items-center justify-between hover:glow-primary transition-all cursor-pointer relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-brand group-hover:bg-purple-300 transition-colors"></div>
                            <div>
                                <p className="text-sm text-gray-400 mb-1 pointer-events-none">Reviews Written</p>
                                <p className="text-3xl font-heading font-bold text-white pointer-events-none">{stats.total_reviews}</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center pointer-events-none">
                                <Edit3 className="h-6 w-6 text-brand" />
                            </div>
                        </a>

                        <a href="#recent-reviews" className="glassmorphism p-6 rounded-2xl flex items-center justify-between hover:glow-primary transition-all cursor-pointer relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-brand group-hover:bg-purple-300 transition-colors"></div>
                            <div>
                                <p className="text-sm text-gray-400 mb-1 pointer-events-none">Avg Rating</p>
                                <p className="text-3xl font-heading font-bold text-white pointer-events-none">{stats.average_rating}</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center pointer-events-none">
                                <Star className="h-6 w-6 text-brand" />
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
