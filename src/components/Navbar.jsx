import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, Search, User, Bell, LogOut, Settings } from 'lucide-react';

export default function Navbar({ searchQuery, setSearchQuery, books, isLoggedIn, setIsLoggedIn, isUserOpen, setIsUserOpen }) {
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const notifRef = useRef(null);
    const userRef = useRef(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setIsNotifOpen(false);
            }
            if (userRef.current && !userRef.current.contains(event.target)) {
                setIsUserOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const hasNewBooks = books && books.length > 0;

    const filteredBooks = books && searchQuery.trim() !== ''
        ? books.filter(book => {
            const query = searchQuery.toLowerCase();
            return (
                book.title.toLowerCase().includes(query) ||
                book.author.toLowerCase().includes(query)
            );
        })
        : [];

    const handleResultClick = (bookId) => {
        setSearchQuery('');

        setTimeout(() => {
            // Find the specific book card
            const cardElement = document.getElementById(`book-${bookId}`);

            if (cardElement) {
                // Scroll it into the center of the viewport
                cardElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

                // Apply the highlight glow effect
                cardElement.classList.add('highlight-glow');

                // Remove the glow effect after 3 seconds
                setTimeout(() => {
                    cardElement.classList.remove('highlight-glow');
                }, 3000);
            } else {
                // Fallback: just scroll to the grid if the card isn't found
                const section = document.getElementById('featured-books');
                if (section) section.scrollIntoView({ behavior: 'smooth' });
            }
        }, 150);
    };

    return (
        <nav className="fixed top-0 w-full z-50 glassmorphism border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">

                    {/* Logo & Section Links */}
                    <div className="flex items-center gap-8">
                        <a href="#top" className="flex items-center gap-3 cursor-pointer group">
                            <div className="w-10 h-10 rounded-xl bg-brand/20 flex items-center justify-center group-hover:glow-primary transition-all duration-300">
                                <img src="/logo.png" alt="BiblioMind Logo" className="w-6 h-6 object-contain" />
                            </div>
                            <span className="text-xl font-heading font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                                BiblioMind
                            </span>
                        </a>
                        {/* Search Bar  Just to meet the metrics, redundant opinion. */}
                        <div className="hidden lg:flex items-center gap-6">
                            <a href="#top" className="text-sm font-medium text-gray-300 hover:text-white hover:text-brand transition-colors">Home</a>
                            <a href="#featured-books" className="text-sm font-medium text-gray-300 hover:text-white hover:text-brand transition-colors">Books</a>
                            <a href="#recent-reviews" className="text-sm font-medium text-gray-300 hover:text-white hover:text-brand transition-colors">Reviews</a>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full pl-11 pr-4 py-2.5 bg-background-pure/50 border border-white/10 rounded-full text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
                            placeholder="Search by title or author..."
                        />

                        {/* Search Results Dropdown */}
                        {searchQuery.trim().length > 0 && (
                            <div className="absolute top-14 left-0 w-full glassmorphism border border-white/10 rounded-2xl shadow-2xl py-2 z-50 max-h-96 overflow-y-auto">
                                {filteredBooks.length === 0 ? (
                                    <div className="px-4 py-3 text-sm text-gray-400 text-center">
                                        No books found matching "{searchQuery}"
                                    </div>
                                ) : (
                                    filteredBooks.map((book) => (
                                        <div
                                            key={book.id}
                                            onClick={() => handleResultClick(book.id)}
                                            className="px-4 py-3 hover:bg-white/5 transition-colors cursor-pointer flex items-center gap-4 border-b border-white/5 last:border-0 relative overflow-hidden group"
                                        >
                                            <div className="absolute top-0 left-0 w-1 h-full bg-transparent group-hover:bg-brand transition-colors"></div>
                                            <img
                                                src={book.cover_url || '/book_1.png'}
                                                alt={book.title}
                                                className="w-10 h-14 object-cover rounded shadow-md group-hover:scale-110 transition-transform"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=800&auto=format&fit=crop";
                                                }}
                                            />
                                            <div>
                                                <p className="text-sm font-bold text-white group-hover:text-brand transition-colors line-clamp-1">{book.title}</p>
                                                <p className="text-xs text-purple-300 font-medium line-clamp-1">{book.author}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    {/* End Actions */}
                    <div className="flex items-center gap-4">

                        {/* Notifications Dropdown */}
                        <div className="relative" ref={notifRef}>
                            <button
                                onClick={() => setIsNotifOpen(!isNotifOpen)}
                                className="p-2 text-gray-400 hover:text-white transition-colors relative"
                            >
                                <Bell className="h-5 w-5" />
                                {hasNewBooks && (
                                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-brand rounded-full glow-primary animate-pulse"></span>
                                )}
                            </button>

                            {isNotifOpen && (
                                <div className="absolute right-0 mt-2 w-80 rounded-2xl glassmorphism border border-white/10 shadow-2xl py-2 z-50 transform origin-top-right transition-all">
                                    <div className="px-4 py-2 border-b border-white/5">
                                        <h3 className="text-sm font-bold text-white font-heading">Notifications</h3>
                                    </div>
                                    <div className="max-h-64 overflow-y-auto">
                                        {hasNewBooks ? (
                                            <div className="px-4 py-3 hover:bg-white/5 transition-colors cursor-pointer border-l-2 border-brand">
                                                <p className="text-sm text-gray-300 font-medium">New arrival!</p>
                                                <p className="text-xs text-gray-400 mt-1 line-clamp-2">"{books[books.length - 1].title}" was just added to the directory.</p>
                                            </div>
                                        ) : null}
                                        <div className="px-4 py-3 hover:bg-white/5 transition-colors cursor-pointer border-l-2 border-purple-400/50">
                                            <p className="text-sm text-gray-300 font-medium">Welcome to BiblioMind!</p>
                                            <p className="text-xs text-gray-400 mt-1">Start reviewing your favorite literature today.</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* User Menu Dropdown */}
                        <div className="relative" ref={userRef}>
                            <div
                                onClick={() => setIsUserOpen(!isUserOpen)}
                                className="h-8 w-8 rounded-full bg-gradient-to-tr from-brand to-brand/40 p-[2px] cursor-pointer hover:glow-primary transition-all"
                            >
                                <div className="h-full w-full rounded-full bg-background-pure flex items-center justify-center">
                                    <User className="h-4 w-4 text-white" />
                                </div>
                            </div>

                            {isUserOpen && (
                                <div className="absolute right-0 mt-2 w-56 rounded-2xl glassmorphism border border-white/10 shadow-2xl py-2 z-50 transform origin-top-right transition-all">
                                    {isLoggedIn ? (
                                        <>
                                            <div className="px-4 py-3 border-b border-white/5">
                                                <p className="text-sm font-medium text-white">Oliver C.</p>
                                                <p className="text-xs text-gray-400 truncate">oliver@bibliomind.test</p>
                                            </div>

                                            <div className="py-1">
                                                <a href="#" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                                                    <User className="h-4 w-4 text-brand" /> My Profile <span className="text-[10px] text-brand bg-brand/10 px-1.5 py-0.5 rounded-full ml-auto">Soon</span>
                                                </a>
                                                <a href="http://127.0.0.1:8000/admin/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                                                    <Settings className="h-4 w-4 text-gray-400" /> Django Admin
                                                </a>
                                                <button onClick={() => setIsLoggedIn(false)} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors">
                                                    <LogOut className="h-4 w-4" /> Log Out
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="px-4 py-3 border-b border-white/5">
                                                <p className="text-sm font-medium text-gray-400">Guest User</p>
                                                <p className="text-xs text-brand font-medium truncate">Not logged in</p>
                                            </div>

                                            <div className="py-2 px-4">
                                                <button onClick={() => setIsLoggedIn(true)} className="w-full bg-brand/10 hover:bg-brand text-brand hover:text-white border border-brand/30 hover:border-brand text-sm font-semibold py-2 rounded-xl transition-all shadow-[0_0_15px_rgba(168,85,247,0.15)] hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                                                    Log In to BiblioMind
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </nav>
    );
}
