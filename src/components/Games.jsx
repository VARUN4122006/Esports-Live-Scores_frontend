
const games = [
    { name: "Free Fire", color: "from-orange-500 to-yellow-500", img: "https://static-cdn.jtvnw.net/ttv-boxart/502732-600x800.jpg" },
    { name: "Battlegrounds Mobile India", color: "from-yellow-400 to-orange-600", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMqXdkuLMcpArjl9XsU0gvWSscdyHefkoh9Q&s" },
    { name: "Valorant", color: "from-red-500 to-pink-600", img: "https://static-cdn.jtvnw.net/ttv-boxart/516575-600x800.jpg" },
    { name: "League of Legends", color: "from-blue-600 to-teal-400", img: "https://static-cdn.jtvnw.net/ttv-boxart/21779-600x800.jpg" },
    { name: "DOTA 2", color: "from-red-700 to-red-900", img: "https://static-cdn.jtvnw.net/ttv-boxart/29595-600x800.jpg" },
    { name: "CS 2", color: "from-yellow-600 to-yellow-800", img: "https://static-cdn.jtvnw.net/ttv-boxart/32399-600x800.jpg" },
];

const Games = ({ onGameSelect }) => {
    return (
        <section id="games" className="py-20 bg-bg-dark relative">
            <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-gold/5 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 animate-fade-in-up">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-heading font-black mb-2 tracking-tight uppercase">Supported <span className="text-gold">Games</span></h2>
                        <p className="text-gray-400 font-body"> comprehensive analytics for the biggest titles.</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
                    {games.map((game, index) => (
                        <div
                            key={index}
                            onClick={() => onGameSelect?.(game.name)}
                            className="relative group cursor-pointer z-20 transition-transform duration-300 hover:-translate-y-2"
                            role="button"
                            tabIndex={0}
                            aria-label={`View stats for ${game.name}`}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    onGameSelect?.(game.name);
                                }
                            }}
                        >
                            {/* Inner Glow/Ring */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-gold/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity" />

                            <div className={`absolute inset-0 bg-gradient-to-b ${game.color} opacity-0 group-hover:opacity-40 blur-xl transition-opacity duration-500`}></div>
                            <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-900 border border-gray-800 group-hover:border-gold/50 transition-all">
                                <img
                                    src={game.img}
                                    alt={game.name}
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                                <div className="absolute bottom-0 left-0 w-full p-4">
                                    <h3 className="text-white font-heading font-bold text-sm text-center group-hover:text-gold transition-colors uppercase tracking-wider">{game.name}</h3>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Games;
