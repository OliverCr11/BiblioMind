import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, BookOpen, X, Edit3, Edit2, Trash2 } from 'lucide-react';

const ReviewCard = ({ review, isLoggedIn, currentUser, handleEditClick, handleDeleteClick }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.reviewer_name)}&background=0D0D0D&color=A855F7`;

    return (
        <div className="glassmorphism p-8 rounded-2xl group hover:border-brand/30 transition-all flex flex-col h-auto hover:-translate-y-1">
            <div className="flex items-center gap-4 mb-6">
                <img src={avatarUrl} alt={review.reviewer_name} className="w-12 h-12 rounded-full border border-white/20" />
                <div className="flex-1">
                    <h4 className="font-heading font-bold text-white group-hover:text-brand transition-colors">{review.reviewer_name}</h4>
                    <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`h-3 w-3 ${i < review.rating ? 'text-brand fill-brand glow-primary' : 'text-gray-600'}`}
                            />
                        ))}
                    </div>
                </div>
                {isLoggedIn && currentUser?.username === review.reviewer_name && (
                    <div className="flex gap-2">
                        <button onClick={() => handleEditClick(review)} className="p-2 glassmorphism rounded-lg text-gray-400 hover:text-brand border border-white/10 hover:border-brand/50 transition-all hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                            <Edit2 className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDeleteClick(review.id)} className="p-2 glassmorphism rounded-lg text-gray-400 hover:text-red-400 border border-white/10 hover:border-red-500/50 transition-all hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                )}
            </div>

            <div className="flex-1 flex flex-col">
                <h5 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2 border-b border-white/10 pb-3">
                    <BookOpen className="h-4 w-4 text-brand" /> {review.book_title}
                </h5>
                <div className="text-gray-400 italic leading-relaxed relative flex-1">
                    <MessageSquare className="h-8 w-8 text-white/5 absolute -top-4 -left-2 z-0" />
                    <p className={`relative z-10 text-sm hover-reveal ${isExpanded ? '' : 'line-clamp-3'}`}>
                        {review.comment}
                    </p>
                    {review.comment.length > 120 && (
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="mt-3 text-sm text-brand/70 hover:text-brand transition-colors font-semibold relative z-10"
                        >
                            {isExpanded ? 'Show less' : 'Read more'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default function RecentReviews({ isLoggedIn, books = [], currentUser }) {
    const [reviews, setReviews] = useState([]);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [selectedBookId, setSelectedBookId] = useState('');
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [editingReview, setEditingReview] = useState(null);
    const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
    const [reviewIdToDelete, setReviewIdToDelete] = useState(null);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/reviews/')
            .then(res => res.json())
            .then(data => {
                // Display only the 3 most recent community reviews
                setReviews(data.slice(0, 3));
            })
            .catch(err => console.error("Error fetching recent reviews:", err));
    }, []);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!selectedBookId || !comment.trim() || rating === 0) return;

        // If editing
        if (editingReview) {
            try {
                const token = localStorage.getItem('token');
                const headers = { 'Content-Type': 'application/json' };
                if (token) headers['Authorization'] = `Token ${token}`;

                const response = await fetch(`http://127.0.0.1:8000/api/reviews/${editingReview.id}/`, {
                    method: 'PATCH',
                    headers,
                    body: JSON.stringify({ rating, comment })
                });

                if (response.ok) {
                    const updatedReview = await response.json();
                    if (!updatedReview.book_title && editingReview.book_title) {
                        updatedReview.book_title = editingReview.book_title;
                    }
                    setReviews(prev => prev.map(r => r.id === updatedReview.id ? updatedReview : r));
                    closeModal();
                }
            } catch (error) {
                console.error("Error updating review:", error);
            }
            return;
        }

        // If creating
        const reviewPayload = {
            book: selectedBookId,
            reviewer_name: currentUser?.username || "Guest",
            rating: rating,
            comment: comment
        };

        try {
            const token = localStorage.getItem('token');
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Token ${token}`;

            const response = await fetch('http://127.0.0.1:8000/api/reviews/', {
                method: 'POST',
                headers,
                body: JSON.stringify(reviewPayload),
            });

            if (response.ok) {
                const newReview = await response.json();

                const bookObj = books.find(b => b.id === parseInt(selectedBookId));
                if (bookObj && !newReview.book_title) {
                    newReview.book_title = bookObj.title;
                }

                setReviews(prev => [newReview, ...prev].slice(0, 3));
                closeModal();
            } else {
                console.error("Failed to submit review");
            }
        } catch (error) {
            console.error("Error submitting review:", error);
        }
    };

    const handleDeleteClick = (id) => {
        setReviewIdToDelete(id);
        setIsConfirmDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!reviewIdToDelete) return;
        try {
            const token = localStorage.getItem('token');
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Token ${token}`;

            const response = await fetch(`http://127.0.0.1:8000/api/reviews/${reviewIdToDelete}/`, {
                method: 'DELETE',
                headers,
            });
            if (response.ok) {
                setReviews(prev => prev.filter(r => r.id !== reviewIdToDelete));
                setIsConfirmDeleteModalOpen(false);
                setReviewIdToDelete(null);
            }
        } catch (error) {
            console.error("Error deleting review:", error);
        }
    };

    const handleEditClick = (review) => {
        setEditingReview(review);
        setRating(review.rating);
        setComment(review.comment);
        setSelectedBookId(review.book);
        setIsReviewModalOpen(true);
    };

    const closeModal = () => {
        setIsReviewModalOpen(false);
        setEditingReview(null);
        setSelectedBookId('');
        setRating(0);
        setHoverRating(0);
        setComment('');
    };

    return (
        <>
            <section id="recent-reviews" className="py-20 relative z-20 bg-background-zinc border-t border-white/5 overflow-hidden">
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand/5 rounded-full blur-[150px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className="text-3xl font-heading font-bold mb-3 flex items-center gap-3">
                                <span className="w-2 h-8 bg-brand rounded-full inline-block"></span>
                                Recent Community Reviews
                            </h2>
                            <p className="text-gray-400 ml-5">Insights from leading academic critics and serious readers.</p>
                        </div>
                        {isLoggedIn && (
                            <button
                                onClick={() => setIsReviewModalOpen(true)}
                                className="hidden md:flex items-center gap-2 bg-brand/10 hover:bg-brand text-brand hover:text-white border border-brand/30 hover:border-brand px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-[0_0_15px_rgba(168,85,247,0.15)] hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                            >
                                <Edit3 className="h-4 w-4" /> Write a Review
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reviews.map((review) => (
                            <ReviewCard
                                key={review.id}
                                review={review}
                                isLoggedIn={isLoggedIn}
                                currentUser={currentUser}
                                handleEditClick={handleEditClick}
                                handleDeleteClick={handleDeleteClick}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {
                isReviewModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal}></div>

                        <div className="relative w-[95%] sm:w-full max-w-xl mx-auto bg-background-pure/95 border border-white/10 rounded-3xl shadow-2xl overflow-hidden glassmorphism animate-in fade-in zoom-in duration-300">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand to-transparent"></div>

                            <div className="flex justify-between items-center p-6 border-b border-white/10">
                                <h3 className="text-2xl font-heading font-bold text-white">{editingReview ? 'Edit Review' : 'Publish a Review'}</h3>
                                <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <form onSubmit={handleReviewSubmit} className="p-6 space-y-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300 ml-1">Select Book</label>
                                    <select
                                        value={selectedBookId}
                                        onChange={(e) => setSelectedBookId(e.target.value)}
                                        className={`w-full bg-background-zinc/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-all appearance-none ${editingReview ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                        required
                                        disabled={!!editingReview}
                                    >
                                        <option value="" disabled>Choose a book from the directory...</option>
                                        {books.map(book => (
                                            <option key={book.id} value={book.id} className="bg-background-pure">{book.title}</option>
                                        ))}
                                    </select>
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
                                                onClick={() => setRating(star)}
                                                className="focus:outline-none focus:scale-110 transition-transform"
                                            >
                                                <Star
                                                    className={`h-6 w-6 transition-colors ${star <= (hoverRating || rating)
                                                        ? 'text-brand fill-brand glow-primary scale-110'
                                                        : 'text-gray-600'
                                                        }`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300 ml-1">Analysis / Review</label>
                                    <textarea
                                        rows={4}
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        className="w-full bg-background-zinc/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-all resize-none"
                                        placeholder="What are your thoughts on this book?"
                                        required
                                    ></textarea>
                                </div>

                                <div className="pt-4 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/5 transition-colors border border-transparent"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-brand hover:bg-brand/90 text-white text-sm font-semibold px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition-all hover:-translate-y-0.5"
                                    >
                                        {editingReview ? 'Update Review' : 'Publish Review'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* Glassmorphism Delete Confirmation Modal */}
            {isConfirmDeleteModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsConfirmDeleteModalOpen(false)}></div>
                    <div className="relative w-[95%] sm:w-full max-w-sm mx-auto bg-[#0a0a0c]/80 border border-brand/50 rounded-3xl p-6 sm:p-8 shadow-[0_0_15px_rgba(168,85,247,0.3)] animate-in fade-in zoom-in duration-300 overflow-hidden glassmorphism">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand to-transparent"></div>

                        <div className="w-14 h-14 rounded-2xl bg-brand/10 border border-brand/30 text-brand flex items-center justify-center mb-6 mx-auto shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                            <Trash2 className="h-7 w-7" />
                        </div>
                        <h3 className="text-2xl font-heading font-bold text-white mb-3 text-center">Erase Thoughts?</h3>
                        <p className="text-gray-300 text-sm mb-8 text-center leading-relaxed">This action cannot be undone. This review and rating will be permanently removed.</p>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setIsConfirmDeleteModalOpen(false)}
                                className="flex-1 py-3 px-4 rounded-xl text-sm font-medium text-gray-400 bg-transparent border border-white/10 hover:border-brand/40 hover:text-white transition-all shadow-none"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 py-3 px-4 rounded-xl text-sm font-bold text-white bg-brand hover:bg-brand/90 transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.7)]"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
