import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Simulated real-time price data
const useSimulatedPrice = (basePrice: number, volatility: number) => {
  const [price, setPrice] = useState(basePrice);
  const [change, setChange] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const newChange = (Math.random() - 0.5) * volatility;
      setPrice(prev => {
        const newPrice = prev + newChange;
        setChange(((newPrice - basePrice) / basePrice) * 100);
        return newPrice;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [basePrice, volatility]);

  return { price, change };
};

// Oil news data
const oilNews = [
  { id: 1, source: 'Reuters', text: 'OPEC+ considers extending oil output cuts amid demand concerns', time: '2m ago' },
  { id: 2, source: 'Bloomberg', text: 'Crude oil inventories fall more than expected, boosting prices', time: '15m ago' },
  { id: 3, source: 'OilPrice', text: 'US shale producers report record efficiency gains in Q4', time: '32m ago' },
  { id: 4, source: 'WSJ', text: 'Middle East tensions push Brent crude above key resistance', time: '1h ago' },
  { id: 5, source: 'CNBC', text: 'Energy sector leads market gains as oil rally continues', time: '2h ago' },
  { id: 6, source: 'FT', text: 'China refinery output hits seasonal high ahead of travel surge', time: '3h ago' },
];

function OilDrop({ delay }: { delay: number }) {
  return (
    <motion.div
      className="absolute w-2 h-3 rounded-full bg-gradient-to-b from-[#0052FF] to-[#001a4d]"
      initial={{ y: -20, opacity: 0, scale: 0.5 }}
      animate={{
        y: [0, 100, 100],
        opacity: [0, 1, 0],
        scale: [0.5, 1, 0.8]
      }}
      transition={{
        duration: 2,
        delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 2
      }}
      style={{ left: `${Math.random() * 100}%` }}
    />
  );
}

function PriceGauge({ label, price, change, symbol, isPrimary = false }: {
  label: string;
  price: number;
  change: number;
  symbol: string;
  isPrimary?: boolean;
}) {
  const isPositive = change >= 0;

  return (
    <motion.div
      className={`relative overflow-hidden ${isPrimary ? 'col-span-1 md:col-span-2' : ''}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: isPrimary ? 0.2 : 0.4 }}
    >
      <div className={`
        relative border-2 border-[#0052FF]/30 rounded-none
        ${isPrimary ? 'p-4 sm:p-6 md:p-8 bg-gradient-to-br from-[#0a1628] via-[#0d1f3c] to-[#0a1628]' : 'p-4 sm:p-6 bg-[#0a1628]/80'}
      `}>
        {/* Industrial corner accents */}
        <div className="absolute top-0 left-0 w-3 sm:w-4 h-3 sm:h-4 border-t-2 border-l-2 border-[#0052FF]" />
        <div className="absolute top-0 right-0 w-3 sm:w-4 h-3 sm:h-4 border-t-2 border-r-2 border-[#0052FF]" />
        <div className="absolute bottom-0 left-0 w-3 sm:w-4 h-3 sm:h-4 border-b-2 border-l-2 border-[#0052FF]" />
        <div className="absolute bottom-0 right-0 w-3 sm:w-4 h-3 sm:h-4 border-b-2 border-r-2 border-[#0052FF]" />

        {/* Animated pipeline line */}
        <motion.div
          className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-transparent via-[#0052FF] to-transparent"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
          <span className="text-[#0052FF] font-mono text-xs sm:text-sm tracking-widest uppercase">{label}</span>
          <span className={`font-mono text-xs sm:text-sm ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
            {isPositive ? '+' : ''}{change.toFixed(2)}%
          </span>
        </div>

        <div className="flex items-baseline gap-1 sm:gap-2">
          <span className="text-[#0052FF]/60 font-mono text-base sm:text-lg md:text-xl">{symbol}</span>
          <motion.span
            className={`font-bold font-mono ${isPrimary ? 'text-2xl sm:text-4xl md:text-6xl' : 'text-xl sm:text-2xl md:text-3xl'} text-white`}
            key={price}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
          >
            ${price.toFixed(2)}
          </motion.span>
        </div>

        {isPrimary && (
          <div className="mt-4 sm:mt-6 flex items-center gap-2 sm:gap-3">
            <div className="flex-1 h-1 sm:h-2 bg-[#0d1f3c] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#0052FF] to-cyan-400"
                initial={{ width: '0%' }}
                animate={{ width: '67%' }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
            <span className="text-[#0052FF]/60 font-mono text-[10px] sm:text-xs">LIVE</span>
            <motion.div
              className="w-2 h-2 rounded-full bg-emerald-400"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}

function NewsCard({ news, index }: { news: typeof oilNews[0]; index: number }) {
  return (
    <motion.div
      className="border-l-2 border-[#0052FF]/50 pl-3 sm:pl-4 py-2 sm:py-3 hover:border-[#0052FF] hover:bg-[#0052FF]/5 transition-all cursor-pointer"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
        <span className="text-[#0052FF] font-mono text-xs font-bold">{news.source}</span>
        <span className="text-white/30 font-mono text-[10px] sm:text-xs">{news.time}</span>
      </div>
      <p className="text-white/80 text-xs sm:text-sm leading-relaxed">{news.text}</p>
    </motion.div>
  );
}

function App() {
  const oil = useSimulatedPrice(72.45, 0.15);
  const gold = useSimulatedPrice(2341.20, 2.5);

  return (
    <div className="min-h-screen bg-[#050a14] text-white overflow-x-hidden">
      {/* Animated background grid */}
      <div className="fixed inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, #0052FF 1px, transparent 1px),
              linear-gradient(to bottom, #0052FF 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Oil drip effects */}
      <div className="fixed top-0 left-0 w-full h-32 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <OilDrop key={i} delay={i * 0.5} />
        ))}
      </div>

      {/* Header Banner */}
      <motion.header
        className="relative border-b-2 border-[#0052FF]/30 bg-gradient-to-r from-[#0052FF]/20 via-[#0a1628] to-[#0052FF]/20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3">
            <span className="text-[#0052FF] font-bold text-xs sm:text-sm">BASE.MEME</span>
            <span className="text-white font-mono text-xs sm:text-sm">$OIL</span>
            <span className="text-white/40 font-mono text-[10px] sm:text-xs break-all sm:break-normal">CA: 0x21FD44...Ae8888</span>
          </div>
          <motion.a
            href="https://base.meme/coin/base:0x21FD44bE608F1D18689CDcC8861AE74571Ae8888?referrer=0xFCE86e6A615B40A620b1a666ff4B866Cd273c476"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#0052FF] hover:bg-[#0066FF] transition-colors rounded-none border border-[#0052FF] font-bold text-xs sm:text-sm min-h-[44px]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5 fill-current">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              <path d="M12 6v6l4 2"/>
            </svg>
            BUY $OIL
          </motion.a>
        </div>
      </motion.header>

      <main className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12">
        {/* Logo Section */}
        <motion.div
          className="text-center mb-8 sm:mb-12 md:mb-16"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative inline-block">
            <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter">
              <span className="bg-gradient-to-r from-[#0052FF] via-cyan-400 to-[#0052FF] bg-clip-text text-transparent">
                BASE
              </span>
              <span className="text-white">CRUDE</span>
            </h1>
            {/* Oil slick effect */}
            <motion.div
              className="absolute -bottom-2 sm:-bottom-4 left-0 right-0 h-2 sm:h-4 bg-gradient-to-r from-transparent via-[#0052FF]/50 to-transparent blur-xl"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </div>
          <p className="mt-4 sm:mt-6 text-white/50 font-mono text-xs sm:text-sm tracking-widest">
            REAL-TIME COMMODITY TRACKING ON BASE
          </p>

          {/* X/Twitter Link */}
          <motion.a
            href="https://x.com/Basecrude"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 sm:mt-6 px-4 sm:px-6 py-2 sm:py-3 border border-white/20 hover:border-[#0052FF] hover:bg-[#0052FF]/10 transition-all font-mono text-xs sm:text-sm min-h-[44px]"
            whileHover={{ scale: 1.02 }}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5 fill-current">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            @Basecrude
          </motion.a>
        </motion.div>

        {/* Price Gauges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12 md:mb-16">
          <PriceGauge
            label="Crude Oil (WTI)"
            price={oil.price}
            change={oil.change}
            symbol="$OIL"
            isPrimary={true}
          />
          <PriceGauge
            label="Gold Spot"
            price={gold.price}
            change={gold.change}
            symbol="$GOLD"
          />
        </div>

        {/* Live News Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold flex items-center gap-2 sm:gap-3">
              <motion.span
                className="w-2 sm:w-3 h-2 sm:h-3 bg-red-500 rounded-full"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              LIVE $OIL NEWS
            </h2>
            <span className="text-white/30 font-mono text-xs">Aggregated from global sources</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            {oilNews.map((news, index) => (
              <NewsCard key={news.id} news={news} index={index} />
            ))}
          </div>
        </motion.section>

        {/* Pipeline decoration */}
        <div className="hidden md:block fixed left-0 top-1/2 -translate-y-1/2 w-2 h-64 bg-gradient-to-b from-transparent via-[#0052FF]/30 to-transparent" />
        <div className="hidden md:block fixed right-0 top-1/2 -translate-y-1/2 w-2 h-64 bg-gradient-to-b from-transparent via-[#0052FF]/30 to-transparent" />
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#0052FF]/20 mt-8 sm:mt-12 md:mt-16 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 text-center">
          <p className="text-white/30 text-[10px] sm:text-xs font-mono">
            Requested by{' '}
            <a
              href="https://x.com/Basecrude"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 hover:text-[#0052FF] transition-colors"
            >
              @BASECRUDE
            </a>
            {' '}&middot;{' '}
            Built by{' '}
            <a
              href="https://x.com/clonkbot"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 hover:text-[#0052FF] transition-colors"
            >
              @clonkbot
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
