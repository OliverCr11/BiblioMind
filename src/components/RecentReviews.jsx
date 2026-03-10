import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, BookOpen, X, Edit3 } from 'lucide-react';

export default function RecentReviews({ isLoggedIn, books = [] }) {
    const [reviews, setReviews] = useState([]);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [selectedBookId, setSelectedBookId] = useState('');
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');

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

        const reviewPayload = {
            book: selectedBookId,
            reviewer_name: "Oliver C.",
            rating: rating,
            comment: comment
        };

        try {
            const response = await fetch('http://127.0.0.1:8000/api/reviews/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reviewPayload),
            });

            if (response.ok) {
                const newReview = await response.json();

                const bookObj = books.find(b => b.id === parseInt(selectedBookId));
                if (bookObj && !newReview.book_title) {
                    newReview.book_title = bookObj.title;
                }

                setReviews(prev => [newReview, ...prev].slice(0, 3));
                setIsReviewModalOpen(false);
                setSelectedBookId('');
                setRating(0);
                setHoverRating(0);
                setComment('');
            } else {
                console.error("Failed to submit review");
            }
        } catch (error) {
            console.error("Error submitting review:", error);
        }
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
                        {reviews.map((review) => {
                            const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.reviewer_name)}&background=0D0D0D&color=A855F7`;
                            return (
                                <div key={review.id} className="glassmorphism p-8 rounded-2xl group hover:border-brand/30 transition-all flex flex-col h-full hover:-translate-y-1">
                                    <div className="flex items-center gap-4 mb-6">
                                        <img src={avatarUrl} alt={review.reviewer_name} className="w-12 h-12 rounded-full border border-white/20" />
                                        <div>
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
                                    </div>

                                    <div className="flex-1">
                                        <h5 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2 border-b border-white/10 pb-3">
                                            <BookOpen className="h-4 w-4 text-brand" /> {review.book_title}
                                        </h5>
                                        <p className="text-gray-400 italic leading-relaxed relative">
                                            <MessageSquare className="h-8 w-8 text-white/5 absolute -top-4 -left-2 z-0" />
                                            <span className="relative z-10 text-sm hover-reveal line-clamp-4">{review.comment}</span>
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {
                isReviewModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsReviewModalOpen(false)}></div>

                        <div className="relative w-full max-w-xl bg-background-pure/95 border border-white/10 rounded-3xl shadow-2xl overflow-hidden glassmorphism animate-in fade-in zoom-in duration-300">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand to-transparent"></div>

                            <div className="flex justify-between items-center p-6 border-b border-white/10">
                                <h3 className="text-2xl font-heading font-bold text-white">Publish a Review</h3>
                                <button onClick={() => setIsReviewModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <form onSubmit={handleReviewSubmit} className="p-6 space-y-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300 ml-1">Select Book</label>
                                    <select
                                        value={selectedBookId}
                                        onChange={(e) => setSelectedBookId(e.target.value)}
                                        className="w-full bg-background-zinc/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-all appearance-none cursor-pointer"
                                        required
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
                                        onClick={() => setIsReviewModalOpen(false)}
                                        className="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/5 transition-colors border border-transparent"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-brand hover:bg-brand/90 text-white text-sm font-semibold px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition-all hover:-translate-y-0.5"
                                    >
                                        Publish Review
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </>
    );
}
