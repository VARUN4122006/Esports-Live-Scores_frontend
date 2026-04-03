
const CTA = () => {
    return (
        <section className="py-32 relative bg-bg-dark overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber/10 blur-[120px] rounded-full mix-blend-screen"></div>
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gold/10 blur-[120px] rounded-full mix-blend-screen"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10 text-center">
                <div className="max-w-3xl mx-auto animate-fade-in-up">
                    <h2 className="text-4xl md:text-6xl font-heading font-black mb-8 tracking-tight uppercase">
                        Track every match.<br />
                        Analyze every player.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-amber">
                            Stay ahead in esports.
                        </span>
                    </h2>
                    <p className="text-gray-400 text-lg md:text-2xl mb-12 max-w-2xl mx-auto font-body font-normal">
                        Join thousands of gamers who rely on our real-time data to master their favorite titles.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default CTA;
