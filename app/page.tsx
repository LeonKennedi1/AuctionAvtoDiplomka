import { supabase } from '@/lib/supabase';

// Описываем структуру данных для TypeScript
interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  location: string;
  current_bid: number;
}

export default async function Home() {
  // Загружаем данные с указанием типа <Car[]>
  const { data: cars, error } = await supabase.from('cars').select('*');

  if (error) {
    return <div className="p-10 text-red-500">Ошибка базы: {error.message}</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-[#004684] text-white py-4 shadow-lg text-center">
        <h1 className="text-3xl font-black italic tracking-tighter">
          QAZ<span className="text-orange-500">DRIVE</span>
        </h1>
      </header>

      <section className="container mx-auto px-4 py-10">
        <h3 className="text-2xl font-bold mb-8 border-l-4 border-blue-800 pl-3 text-gray-800">Рекомендуемые лоты</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(cars as Car[])?.map((car) => (
            <div key={car.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-400 font-bold uppercase italic">
                Фото авто
              </div>
              <div className="p-4">
                <h4 className="font-extrabold text-blue-900 text-lg uppercase leading-tight">
                  {car.year} {car.make} {car.model}
                </h4>
                <p className="text-[10px] text-gray-400 mb-3 uppercase tracking-widest">VIN: {car.vin}</p>
                
                <div className="bg-blue-50 p-3 rounded-lg mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 uppercase font-bold text-black">Ставка:</span>
                    <span className="font-black text-green-700 text-xl">${car.current_bid.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[10px] text-gray-500 uppercase text-black">Город:</span>
                    <span className="text-[10px] font-bold uppercase text-black">{car.location}</span>
                  </div>
                </div>
                
                <button className="w-full bg-blue-800 text-white font-black py-3 rounded hover:bg-blue-700 transition uppercase text-sm">
                  Сделать ставку
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}