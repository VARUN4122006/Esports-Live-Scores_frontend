import React, { useState, useRef } from 'react';
import { Newspaper, ChevronRight, ChevronLeft, Clock, User } from 'lucide-react';
import { newsData } from '../data/newsData';
import NewsModal from './NewsModal';

const News = () => {
    const [selectedNews, setSelectedNews] = useState(null);
    const scrollContainerRef = useRef(null);

    const handleNewsClick = (newsItem) => {
        setSelectedNews(newsItem);
    };

    const handleCloseModal = () => {
        setSelectedNews(null);
    };

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = 400;
            const newScrollPosition = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
            scrollContainerRef.current.scrollTo({
                left: newScrollPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section id="news" className="py-24 bg-bg-dark relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
                    <div className="animate-fade-in-left">
                        <div className="flex items-center gap-3 text-gold mb-4">
                            <Newspaper className="w-6 h-6" />
                            <span className="text-xs font-black uppercase tracking-[0.4em]">Inside the Pulse</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">
                            BREAKING <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">TRANSMISSIONS</span>
                        </h2>
                    </div>

                    {/* Horizontal Scroll Controls */}
                    <div className="flex items-center gap-3 animate-fade-in-right">
                        <button
                            onClick={() => scroll('left')}
                            className="group w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:border-gold hover:bg-gold/10 transition-all"
                            aria-label="Scroll left"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-400 group-hover:text-gold transition-colors" />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="group w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:border-gold hover:bg-gold/10 transition-all"
                            aria-label="Scroll right"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gold transition-colors" />
                        </button>
                    </div>
                </div>

                {/* Horizontal Scrollable News Container */}
                <div
                    ref={scrollContainerRef}
                    className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none'
                    }}
                >
                    {newsData.map((item, idx) => (
                        <div
                            key={item.id}
                            onClick={() => handleNewsClick(item)}
                            className="group bg-bg-card border border-white/5 rounded-[2rem] overflow-hidden hover:border-gold/30 transition-all duration-500 hover:-translate-y-2 flex flex-col shadow-2xl animate-fade-in-up cursor-pointer flex-shrink-0 w-[320px] md:w-[380px]"
                            style={{ animationDelay: `${idx * 150}ms` }}
                        >
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-transparent to-transparent" />
                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1 bg-gold text-bg-dark text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg">
                                        {item.category}
                                    </span>
                                </div>
                                <div className="absolute top-4 right-4 translate-y-[-100%] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                    <div className="w-8 h-8 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/20">
                                        <ChevronRight className="w-4 h-4 text-white" />
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center gap-4 mb-4 text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-3 h-3" />
                                        {item.date}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <User className="w-3 h-3" />
                                        {item.author}
                                    </div>
                                </div>
                                <h3 className="text-xl font-black uppercase tracking-tight italic mb-3 leading-tight group-hover:text-gold transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-gray-400 text-xs leading-relaxed mb-6 line-clamp-3">
                                    {item.summary}
                                </p>
                                <div className="mt-auto pt-4 border-t border-white/5">
                                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] italic group-hover:text-gold/50 transition-colors">
                                        # {item.game}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* News Modal */}
            {selectedNews && (
                <NewsModal newsItem={selectedNews} onClose={handleCloseModal} />
            )}

            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </section>
    );
};

export default News;

