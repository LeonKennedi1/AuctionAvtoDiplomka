import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import BidPanel from '@/components/BidPanel';
import AuctionChat from '@/components/AuctionChat'; // 1. ДОБАВЛЕН ИМПОРТ ЧАТА

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  location: string;
  current_bid: number;
  image_url?: string;
  auction_end: string; // Поле для таймера
}

// В Next.js 15 'params' — это Promise, который нужно 'await'
export default async function LotPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const { data: car, error } = await supabase
    .from('cars')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !car) {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-20 font-sans">
        <h1 className="text-4xl font-black uppercase italic mb-4 text-orange-500">Лот не найден</h1>
        <Link href="/" className="border border-white/20 px-8 py-3 rounded-full uppercase text-[10px] font-black tracking-widest hover:bg-white hover:text-black transition-all italic">
          Вернуться в каталог
        </Link>
      </div>
    );
  }

  const vehicle = car as Car;

  const specs = [
    { label: "Год выпуска", val: vehicle.year },
    { label: "VIN номер", val: vehicle.vin },
    { label: "Локация", val: vehicle.location },
    { label: "Двигатель", val: "2.5L DYNAMIC FORCE" },
    { label: "Трансмиссия", val: "8-SPEED AUTOMATIC" },
    { label: "Привод", val: "FWD PERFORMANCE" },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-orange-500 selection:text-black font-sans">
      <Header />
      
      <main className="container mx-auto px-4 pt-40 pb-20">
        {/* Хлебные крошки */}
        <div className="flex gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-slate-600 mb-12 italic">
          <Link href="/" className="hover:text-orange-500 transition-colors">Главная</Link>
          <span>/</span>
          <span className="text-slate-400">{vehicle.make}</span>
          <span>/</span>
          <span className="text-orange-500 underline underline-offset-8 decoration-1 decoration-orange-500/30">{vehicle.model}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* ЛЕВАЯ КОЛОНКА (Контент) */}
          <div className="lg:col-span-2 space-y-16">
            
            {/* ГЛАВНОЕ ФОТО */}
            <div className="relative rounded-[3.5rem] overflow-hidden border border-white/5 bg-slate-900 shadow-2xl aspect-video group">
              {vehicle.image_url ? (
                <img src={vehicle.image_url} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" alt={vehicle.model} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-800 font-black italic uppercase text-xs tracking-widest text-center">
                  Загрузка изображения...
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent opacity-40"></div>
            </div>

            {/* ТЕХНИЧЕСКИЙ ПАСПОРТ */}
            <div className="bg-slate-900/30 backdrop-blur-3xl rounded-[3rem] border border-white/5 p-12 shadow-xl">
              <h2 className="text-3xl font-black uppercase italic italic mb-12 border-l-4 border-orange-500 pl-8">
                Технический <span className="text-orange-500">Паспорт</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-8">
                {specs.map((item) => (
                  <div key={item.label} className="flex justify-between border-b border-white/5 pb-4">
                    <span className="text-[9px] font-black uppercase text-slate-600 tracking-[0.3em]">{item.label}</span>
                    <span className="text-sm font-black text-slate-100 uppercase italic tracking-tighter">{item.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. ЖИВОЙ ЧАТ (ВСТАВЛЕН ПОД СПЕЦИФИКАЦИЕЙ) */}
            <AuctionChat carId={vehicle.id} />

          </div>

          {/* ПРАВАЯ КОЛОНКА (Терминал ставок) */}
          <div className="relative">
            <BidPanel 
              currentBid={vehicle.current_bid} 
              lotId={vehicle.id} 
              make={vehicle.make} 
              model={vehicle.model} 
              year={vehicle.year} 
              auction_end={vehicle.auction_end} // ПЕРЕДАЕМ ВРЕМЯ КОНЦА ДЛЯ ТАЙМЕРА
            />
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}