import React from 'react';
import { Star, Edit2, Trash2, ChevronRight } from 'lucide-react';

export default function BookGrid({ books, setBooks }) {
    const getAverageRating = (reviews) => {
        if (!reviews || reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        return sum / reviews.length;
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/books/${id}/`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setBooks(prevBooks => prevBooks.filter(book => book.id !== id));
            } else {
                console.error('Failed to delete book');
            }
        } catch (error) {
            console.error('Error deleting book:', error);
        }
    };

    return (
        <section className="py-20 relative z-20 bg-background-zinc">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-3 flex items-center gap-3">
                            <span className="w-2 h-8 bg-brand rounded-full inline-block"></span>
                            Featured Books
                        </h2>
                        <p className="text-gray-400 max-w-2xl ml-5">Discover critically acclaimed masterpieces and deep literary analysis curated for the discerning reader.</p>
                    </div>
                    <button className="flex items-center gap-2 text-brand hover:text-purple-300 font-medium transition-colors">
                        View Gallery <ChevronRight className="h-4 w-4" />
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {books.map((book) => {
                        const avgRating = getAverageRating(book.reviews);
                        return (
                            <div key={book.id} className="book-card h-[450px] w-full group cursor-pointer">
                                <div className="book-card-inner relative w-full h-full rounded-2xl shadow-2xl">

                                    {/* FRONT OF CARD */}
                                    <div className="book-card-front bg-card flex flex-col items-center">
                                        <img
                                            src={book.cover_url || '/book_1.png'}
                                            alt={book.title}
                                            className="w-full h-full object-cover rounded-inherit"
                                            style={{ borderRadius: 'inherit' }}
                                            onError={(e) => {
                                                e.target.onerror = null; // Prevent infinite loops
                                                e.target.src = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=800&auto=format&fit=crop"; // Premium "mystery" fallback book
                                            }}
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6 pt-20 rounded-b-2xl">
                                            <h3 className="text-xl font-heading font-bold text-white mb-1 group-hover:text-brand transition-colors">{book.title}</h3>
                                            <p className="text-gray-400 text-sm font-medium">{book.author}</p>
                                        </div>
                                    </div>

                                    {/* BACK OF CARD */}
                                    <div className="book-card-back p-8 flex flex-col justify-between border border-white/10 glassmorphism rounded-2xl relative overflow-hidden">
                                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand/20 blur-3xl rounded-full"></div>

                                        <div className="relative z-10">
                                            <h3 className="text-2xl font-heading font-bold mb-2 text-white">{book.title}</h3>
                                            <p className="text-brand font-medium mb-4">{book.author}</p>

                                            <div className="flex items-center gap-1 mb-6">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`h-4 w-4 ${i < Math.floor(avgRating) ? 'text-brand fill-brand glow-primary' : 'text-gray-600'}`}
                                                    />
                                                ))}
                                                <span className="ml-2 text-sm text-gray-300 font-bold">{avgRating > 0 ? avgRating.toFixed(1) : 'No reviews'}</span>
                                            </div>

                                            <p className="text-gray-300 text-sm leading-relaxed line-clamp-6">
                                                {book.description}
                                            </p>
                                        </div>

                                        <div className="flex gap-3 mt-6 relative z-10">
                                            <button className="flex-1 glassmorphism hover:bg-white/5 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-colors border border-white/10 hover:border-brand/50 hover:text-brand">
                                                <Edit2 className="h-4 w-4" /> Edit
                                            </button>
                                            <button onClick={(e) => handleDelete(book.id, e)} className="flex-1 glassmorphism hover:bg-red-500/10 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors border border-white/10 hover:border-red-500/50">
                                                <Trash2 className="h-4 w-4" /> Delete
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
