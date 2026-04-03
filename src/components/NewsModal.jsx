import React from 'react';
import { X, Clock, User, Tag } from 'lucide-react';

const NewsModal = ({ newsItem, onClose }) => {
    if (!newsItem) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-4xl max-h-[90vh] bg-bg-card border border-white/10 rounded-3xl overflow-hidden shadow-2xl animate-scale-in">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 transition-all group"
                >
                    <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-300" />
                </button>

                {/* Scrollable Content */}
                <div className="overflow-y-auto max-h-[90vh] custom-scrollbar">
                    {/* Hero Image */}
                    <div className="relative h-80 overflow-hidden">
                        <img
                            src={newsItem.image}
                            alt={newsItem.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-bg-card/50 to-transparent" />

                        {/* Category Badge */}
                        <div className="absolute top-6 left-6">
                            <span className="px-4 py-2 bg-gold text-bg-dark text-xs font-black uppercase tracking-widest rounded-full shadow-lg">
                                {newsItem.category}
                            </span>
                        </div>
                    </div>

                    {/* Article Content */}
                    <div className="p-8 md:p-12">
                        {/* Meta Information */}
                        <div className="flex flex-wrap items-center gap-6 mb-6 text-xs font-bold text-gray-500 uppercase tracking-widest">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                {newsItem.date}
                            </div>
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                {newsItem.author}
                            </div>
                            <div className="flex items-center gap-2">
                                <Tag className="w-4 h-4" />
                                {newsItem.game}
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight italic mb-6 leading-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                            {newsItem.title}
                        </h1>

                        {/* Summary */}
                        <p className="text-xl text-gray-300 mb-8 leading-relaxed font-medium">
                            {newsItem.summary}
                        </p>

                        {/* Divider */}
                        <div className="w-20 h-1 bg-gradient-to-r from-gold to-amber-600 mb-8 rounded-full" />

                        {/* Full Content */}
                        <div className="prose prose-invert prose-lg max-w-none">
                            {newsItem.fullContent.split('\n\n').map((paragraph, index) => (
                                <p key={index} className="text-gray-400 leading-relaxed mb-6">
                                    {paragraph}
                                </p>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="mt-12 pt-8 border-t border-white/10">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-black text-gray-600 uppercase tracking-[0.2em] italic">
                                    # {newsItem.game}
                                </span>
                                <button
                                    onClick={onClose}
                                    className="px-6 py-3 bg-gold hover:bg-amber-600 text-bg-dark font-black uppercase tracking-wider text-sm rounded-full transition-all hover:scale-105"
                                >
                                    Close Article
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(212, 175, 55, 0.5);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(212, 175, 55, 0.8);
                }
                @keyframes scale-in {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                .animate-scale-in {
                    animation: scale-in 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default NewsModal;
