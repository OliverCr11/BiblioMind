import React from 'react';
import { BookOpen, Search, User, Bell } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="fixed top-0 w-full z-50 glassmorphism border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-10 h-10 rounded-xl bg-brand/20 flex items-center justify-center group-hover:glow-primary transition-all duration-300">
                            <img src="/logo.png" alt="BiblioMind Logo" className="w-6 h-6 object-contain" />
                        </div>
                        <span className="text-xl font-heading font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                            BiblioMind
                        </span>
                    </div>

                    <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-11 pr-4 py-2.5 bg-background-pure/50 border border-white/10 rounded-full text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
                            placeholder="Search books, authors, or reviews..."
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-400 hover:text-white transition-colors relative">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-2 right-2.5 w-2 h-2 bg-brand rounded-full glow-primary"></span>
                        </button>
                        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-brand to-brand/40 p-[2px] cursor-pointer hover:glow-primary transition-all">
                            <div className="h-full w-full rounded-full bg-background-pure flex items-center justify-center">
                                <User className="h-4 w-4 text-white" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
