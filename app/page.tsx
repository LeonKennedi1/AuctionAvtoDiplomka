import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import BrandsGrid from '@/components/BrandsGrid';
import PricingPlans from '@/components/PricingPlans';
import SocialMedia from '@/components/SocialMedia';
import Footer from '@/components/Footer';
import Link from 'next/link'; // 1. ДОБАВЛЕН ИМПОРТ

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  location: string;
  current_bid: number;
  image_url?: string;
}

export default async function Home() {
  const { data: cars } = await supabase.from('cars').select('*');

  return (
    <main className="bg-[#020617] min-h-screen text-white">
      <Header />
      <Hero />

      <section className="container mx-auto px-4 py-20">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div className="border-l-4 border-orange-500 pl-6">
            <h3 className="text-4xl font-black uppercase italic tracking-tighter leading-none">
              Популярные <span className="text-orange-500">лоты</span>
            </h3>
            <p className="text-gray-500 text-sm mt-2 uppercase tracking-widest font-bold">Лучшие предложения в Казахстане</p>
          </div>
          <button className="text-orange-500 font-black hover:text-white transition-colors text-xs uppercase tracking-widest border-b-2 border-orange-500 pb-1 italic">
            Смотреть весь каталог →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {(cars as Car[])?.map((car) => (
            <div 
              key={car.id} 
              className="bg-[#0f172a] rounded-2xl border border-slate-800 overflow-hidden hover:border-orange-500 transition-all duration-300 group shadow-2xl"
            >
              <div className="relative h-56 bg-slate-800 overflow-hidden">
                {car.image_url ? (
                  <img 
                    src={car.image_url} 
                    alt={car.model} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600 font-black italic uppercase text-xs">Фото в процессе загрузки</div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-transparent opacity-60"></div>
                
                <div className="absolute top-4 left-4 bg-orange-500 text-black text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter animate-pulse">
                  Live Auction
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <h4 className="font-black text-white text-xl uppercase italic tracking-tighter leading-tight group-hover:text-orange-500 transition-colors">
                    {car.year} {car.make}
                  </h4>
                  <p className="text-gray-400 font-bold text-sm uppercase">{car.model}</p>
                </div>

                <div className="space-y-3">
                  <div className="bg-black/40 p-4 rounded-xl border border-slate-800/50 flex justify-between items-center">
                    <div>
                      <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Текущая ставка</p>
                      <p className="font-black text-white text-2xl tracking-tighter italic">
                        ${car.current_bid.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Локация</p>
                      <p className="font-bold text-slate-200 text-xs uppercase">{car.location}</p>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-600 font-mono uppercase text-center">
                    VIN: {car.vin} • LOT: {car.id.slice(0,8)}
                  </p>

                  {/* 2. ИЗМЕНЕНО: Заменили <button> на <Link> */}
                  <Link 
                    href={`/lot/${car.id}`}
                    className="w-full bg-white text-black font-black py-4 rounded-xl hover:bg-orange-500 hover:text-black transition-all uppercase text-xs tracking-widest shadow-xl shadow-orange-500/10 active:scale-95 block text-center"
                  >
                    Участвовать в торгах
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <BrandsGrid />
      <PricingPlans />
      <SocialMedia />
      <Footer />
    </main>
  );
}