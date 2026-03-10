import React, { useState } from 'react';
import { Star, Edit2, Trash2, ChevronRight, X, Save } from 'lucide-react';

export default function BookGrid({ books, setBooks, searchQuery = '', isLoggedIn, currentUser }) {
    const [editingBook, setEditingBook] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [detailBook, setDetailBook] = useState(null);
    const [bookIdToDelete, setBookIdToDelete] = useState(null);
    const [hoverRating, setHoverRating] = useState(0);
    const getAverageRating = (reviews) => {
        if (!reviews || reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        return sum / reviews.length;
    };

    const handleDelete = (id, e) => {
        e.stopPropagation();
        setBookIdToDelete(id);
        setIsConfirmModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!bookIdToDelete) return;

        try {
            const token = localStorage.getItem('token');
            const headers = { 'Content-Type': 'application/json' };
            if (token) {
                headers['Authorization'] = `Token ${token}`;
            }

            const response = await fetch(`http://127.0.0.1:8000/api/books/${bookIdToDelete}/`, {
                method: 'DELETE',
                headers,
            });

            if (response.ok) {
                setBooks(prevBooks => prevBooks.filter(book => book.id !== bookIdToDelete));
                setIsConfirmModalOpen(false);
                setBookIdToDelete(null);
            } else {
                console.error('Failed to delete book');
            }
        } catch (error) {
            console.error('Error deleting book:', error);
        }
    };

    const handleEditClick = (book, e) => {
        e.stopPropagation();
        const currentRating = Math.round(getAverageRating(book.reviews));
        setEditingBook({ ...book, rating: currentRating });
        setHoverRating(0);
        setIsEditModalOpen(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/books/${editingBook.id}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: editingBook.title,
                    author: editingBook.author,
                    description: editingBook.description,
                    cover_url: editingBook.cover_url,
                    rating: editingBook.rating
                }),
            });

            if (response.ok) {
                const updatedBook = await response.json();

                // Keep the reviews array intact since PATCH to Book won't return nested Review data directly
                const bookWithReviews = {
                    ...updatedBook,
                    reviews: editingBook.reviews
                };

                // Update the state inline without refreshing via map replace
                setBooks(prevBooks => prevBooks.map(book =>
                    book.id === updatedBook.id ? bookWithReviews : book
                ));
                setIsEditModalOpen(false);
                setEditingBook(null);
            } else {
                console.error('Failed to update book');
            }
        } catch (error) {
            console.error('Error updating book:', error);
        }
    };

    const filteredBooks = books.filter(book => {
        const query = searchQuery.toLowerCase();
        return (
            book.title.toLowerCase().includes(query) ||
            book.author.toLowerCase().includes(query)
        );
    });

    const handleDetailClick = (book, e) => {
        e.stopPropagation();
        setDetailBook(book);
        setIsDetailModalOpen(true);
    };

    return (
        <section id="featured-books" className="py-20 relative z-20 bg-background-zinc">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 justify-items-center">
                    {filteredBooks.length === 0 ? (
                        <div className="col-span-full text-center py-12 glassmorphism rounded-2xl w-full mx-a">
                            <p className="text-gray-400">No books found matching "{searchQuery}"</p>
                        </div>
                    ) : (
                        filteredBooks.map((book) => {
                            const avgRating = getAverageRating(book.reviews);
                            return (
                                <div id={`book-${book.id}`} key={book.id} className="book-card h-[450px] w-full max-w-[340px] group cursor-pointer transition-all duration-500">
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
                                                <h3 className="text-xl font-heading font-bold text-white mb-1 group-hover:text-brand transition-colors line-clamp-2">{book.title}</h3>
                                                <p className="text-gray-400 text-sm font-medium">{book.author}</p>
                                            </div>
                                        </div>

                                        {/* BACK OF CARD */}
                                        <div className="book-card-back p-8 flex flex-col justify-between border border-white/10 glassmorphism rounded-2xl relative overflow-hidden">
                                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand/20 blur-3xl rounded-full"></div>

                                            <div className="relative z-10 flex flex-col h-full flex-grow">
                                                <h3 className="text-2xl font-heading font-bold mb-2 text-white line-clamp-2 shrink-0">{book.title}</h3>
                                                <p className="text-brand font-medium mb-1">{book.author}</p>
                                                <p className="text-xs text-gray-400 font-medium mb-4">Added by: <span className="text-gray-300">{book.owner_name || 'System'}</span></p>

                                                <div className="flex items-center gap-1 mb-6">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`h-4 w-4 ${i < Math.floor(avgRating) ? 'text-brand fill-brand glow-primary' : 'text-gray-600'}`}
                                                        />
                                                    ))}
                                                    <span className="ml-2 text-sm text-gray-300 font-bold">{avgRating > 0 ? avgRating.toFixed(1) : 'No reviews'}</span>
                                                </div>

                                                <p className="text-gray-300 text-sm leading-relaxed line-clamp-4 mb-2">
                                                    {book.description}
                                                </p>
                                                {book.description?.length > 150 && (
                                                    <button
                                                        onClick={(e) => handleDetailClick(book, e)}
                                                        className="text-brand/80 hover:text-brand text-sm font-semibold transition-colors mt-auto text-left w-fit relative z-20"
                                                    >
                                                        Read Full Analysis
                                                    </button>
                                                )}
                                            </div>

                                            {isLoggedIn && book.owner_name === currentUser?.username && (
                                                <div className="flex gap-3 mt-6 relative z-10 shrink-0">
                                                    <button onClick={(e) => handleEditClick(book, e)} className="flex-1 glassmorphism hover:bg-white/5 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all border border-white/10 hover:border-brand/50 hover:text-brand hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                                                        <Edit2 className="h-4 w-4" /> Edit
                                                    </button>
                                                    <button onClick={(e) => handleDelete(book.id, e)} className="flex-1 glassmorphism hover:bg-red-500/10 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-medium text-red-400 hover:text-red-300 transition-all border border-white/10 hover:border-red-500/50 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                                                        <Trash2 className="h-4 w-4" /> Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Glassmorphism Edit Modal */}
            {isEditModalOpen && editingBook && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)}></div>

                    <div className="relative w-[95%] sm:w-full max-w-2xl mx-auto bg-background-pure/95 border border-white/10 rounded-3xl shadow-2xl overflow-y-auto max-h-full glassmorphism animate-in fade-in zoom-in duration-300">
                        {/* Glow Accent */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand to-transparent"></div>

                        <div className="flex justify-between items-center p-6 border-b border-white/10">
                            <h3 className="text-2xl font-heading font-bold text-white">Edit Book Profile</h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleUpdate} className="p-6 space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300 ml-1">Title</label>
                                    <input
                                        type="text"
                                        value={editingBook.title}
                                        onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                                        className="w-full bg-background-zinc/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-all"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300 ml-1">Author</label>
                                    <input
                                        type="text"
                                        value={editingBook.author}
                                        onChange={(e) => setEditingBook({ ...editingBook, author: e.target.value })}
                                        className="w-full bg-background-zinc/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 ml-1">Cover URL</label>
                                <input
                                    type="url"
                                    value={editingBook.cover_url}
                                    onChange={(e) => setEditingBook({ ...editingBook, cover_url: e.target.value })}
                                    className="w-full bg-background-zinc/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-all"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 ml-1">Rating</label>
                                <div className="flex items-center gap-2 bg-background-zinc/50 border border-white/10 rounded-xl px-4 py-3 w-max">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            onClick={() => setEditingBook({ ...editingBook, rating: star })}
                                            className="focus:outline-none focus:scale-110 transition-transform"
                                        >
                                            <Star
                                                className={`h-6 w-6 transition-colors ${star <= (hoverRating || editingBook.rating)
                                                    ? 'text-brand fill-brand glow-primary scale-110'
                                                    : 'text-gray-600'
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 ml-1">Analysis / Description</label>
                                <textarea
                                    rows={4}
                                    value={editingBook.description}
                                    onChange={(e) => setEditingBook({ ...editingBook, description: e.target.value })}
                                    className="w-full bg-background-zinc/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-all resize-none"
                                    required
                                ></textarea>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/5 transition-colors border border-transparent"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-brand hover:bg-brand/90 text-white text-sm font-semibold px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition-all hover:-translate-y-0.5"
                                >
                                    <Save className="h-4 w-4" /> Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Glassmorphism Detail Read Modal */}
            {isDetailModalOpen && detailBook && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsDetailModalOpen(false)}></div>

                    <div className="relative w-[95%] sm:w-full max-w-3xl mx-auto bg-background-pure/95 border border-white/10 rounded-3xl shadow-2xl overflow-hidden glassmorphism animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]">
                        {/* Glow Accent */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand to-transparent"></div>

                        <div className="flex justify-between items-start p-6 border-b border-white/10 shrink-0">
                            <div>
                                <h3 className="text-3xl font-heading font-bold text-white mb-2">{detailBook.title}</h3>
                                <p className="text-brand font-medium text-lg">{detailBook.author}</p>
                            </div>
                            <button onClick={() => setIsDetailModalOpen(false)} className="text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-full">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto max-h-[70vh] custom-scrollbar">
                            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                                <div>
                                    <p className="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wider">Curated By</p>
                                    <p className="text-white font-medium flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-brand/20 flex items-center justify-center border border-brand/30">
                                            <span className="text-xs text-brand">{detailBook.owner_name?.charAt(0) || 'S'}</span>
                                        </div>
                                        {detailBook.owner_name || 'System Catalog'}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wider">Community Rating</p>
                                    <div className="flex items-center gap-1 justify-end">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-4 w-4 ${i < Math.floor(getAverageRating(detailBook.reviews)) ? 'text-brand fill-brand glow-primary' : 'text-gray-600'}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="prose prose-invert max-w-none">
                                <p className="text-gray-300 text-lg leading-loose whitespace-pre-wrap">
                                    {detailBook.description}
                                </p>
                            </div>
                        </div>

                        <div className="p-6 border-t border-white/10 bg-black/20 shrink-0">
                            <p className="text-xs text-gray-500 text-center font-medium font-heading">
                                BiblioMind Archival Vault • {new Date().getFullYear()}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Glassmorphism Delete Confirmation Modal */}
            {isConfirmModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsConfirmModalOpen(false)}></div>
                    <div className="relative w-[95%] sm:w-full max-w-sm mx-auto bg-[#0a0a0c]/80 border border-brand/50 rounded-3xl p-6 sm:p-8 shadow-[0_0_15px_rgba(168,85,247,0.3)] animate-in fade-in zoom-in duration-300 overflow-hidden glassmorphism">
                        {/* Glow Accent */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand to-transparent"></div>

                        <div className="w-14 h-14 rounded-2xl bg-brand/10 border border-brand/30 text-brand flex items-center justify-center mb-6 mx-auto shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                            <Trash2 className="h-7 w-7" />
                        </div>
                        <h3 className="text-2xl font-heading font-bold text-white mb-3 text-center">Delete Masterpiece?</h3>
                        <p className="text-gray-300 text-sm mb-8 text-center leading-relaxed">This action cannot be undone. This title and all its scholarly reviews will be permanently removed.</p>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setIsConfirmModalOpen(false)}
                                className="flex-1 py-3 px-4 rounded-xl text-sm font-medium text-gray-400 bg-transparent border border-white/10 hover:border-brand/40 hover:text-white transition-all shadow-none"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 py-3 px-4 rounded-xl text-sm font-bold text-white bg-brand hover:bg-brand/90 shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition-all hover:-translate-y-0.5 border-none"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
