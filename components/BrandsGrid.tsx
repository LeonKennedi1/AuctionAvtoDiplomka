export default function BrandsGrid() {
  const topBrands = ["Toyota", "BMW", "Mercedes", "Lexus", "Hyundai", "Kia", "Nissan", "Audi"];

  return (
    <section className="py-20 bg-[#020617] border-y border-white/5">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
           <h3 className="text-2xl font-black uppercase italic tracking-tighter italic">Мировые <span className="text-orange-500">Легенды</span></h3>
           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Всего 40+ марок</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {topBrands.map((brand) => (
            <div key={brand} className="aspect-square bg-slate-900 border border-white/5 rounded-2xl flex flex-col items-center justify-center group hover:border-orange-500 transition-all cursor-pointer">
              {/* Здесь можно потом вставить иконки, пока сделаем стильный текст */}
              <span className="text-3xl font-black text-white/10 group-hover:text-orange-500 transition-colors uppercase italic mb-2 leading-none">
                {brand[0]}
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors">
                {brand}
              </span>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
           <button className="px-12 py-4 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-orange-500 hover:text-black transition-all italic">
              Открыть весь каталог марок
           </button>
        </div>
      </div>
    </section>
  );
}