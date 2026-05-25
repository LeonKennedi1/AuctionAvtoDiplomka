export default function Hero() {
  return (
    <section className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center relative overflow-hidden bg-radial-at-t from-slate-900 via-[#020617] to-[#020617]">
      {/* Большой текст на фоне (Watermark) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.02] select-none text-[30vw] font-black italic">
        KAZAKHSTAN
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <h1 className="text-7xl md:text-[120px] font-black leading-none italic uppercase tracking-tighter mb-8">
          DRIVE <span className="text-transparent border-b-4 border-orange-500 pb-2" style={{ WebkitTextStroke: '1px white' }}>FUTURE</span>
        </h1>
        
        {/* Инновационный блок поиска */}
        <div className="max-w-4xl mx-auto bg-white/5 border border-white/10 p-2 rounded-3xl backdrop-blur-md shadow-2xl flex flex-col md:flex-row gap-2">
           <div className="flex-1 flex items-center px-6 border-r border-white/10">
              <span className="text-orange-500 mr-3 text-xl font-bold">Q</span>
              <input type="text" placeholder="Марка, модель или VIN..." className="bg-transparent w-full p-4 text-white outline-none font-bold" />
           </div>
           <div className="hidden lg:flex items-center px-6 text-gray-500 text-xs font-bold uppercase tracking-widest italic">
              Весь Казахстан
           </div>
           <button className="bg-white text-black font-black px-12 py-5 rounded-2xl hover:bg-orange-500 transition-all uppercase tracking-widest text-xs">
              Запустить поиск
           </button>
        </div>

        {/* Доверие (быстрые факты) */}
        <div className="mt-16 flex flex-wrap justify-center gap-12 opacity-40">
           <div className="text-center">
              <p className="text-2xl font-black italic italic uppercase tracking-tighter">50K+</p>
              <p className="text-[10px] font-bold uppercase">Активных лотов</p>
           </div>
           <div className="text-center border-x border-white/10 px-12">
              <p className="text-2xl font-black italic italic uppercase tracking-tighter">15+</p>
              <p className="text-[10px] font-bold uppercase">Городов РК</p>
           </div>
           <div className="text-center">
              <p className="text-2xl font-black italic italic uppercase tracking-tighter">24/7</p>
              <p className="text-[10px] font-bold uppercase">Онлайн торги</p>
           </div>
        </div>
      </div>
    </section>
  );
}