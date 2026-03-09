import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, BookOpen } from 'lucide-react';

export default function RecentReviews() {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/reviews/')
            .then(res => res.json())
            .then(data => {
                // Display only the 3 most recent community reviews
                setReviews(data.slice(0, 3));
            })
            .catch(err => console.error("Error fetching recent reviews:", err));
    }, []);

    return (
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
    );
}
