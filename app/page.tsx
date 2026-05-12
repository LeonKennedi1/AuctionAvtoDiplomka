import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* 1. Верхняя панель (Header) */}
      <header className="bg-[#004684] text-white py-3 shadow-lg">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <h1 className="text-3xl font-black tracking-tighter text-white italic">
              QAZ<span className="text-orange-500">DRIVE</span>
            </h1>
            <nav className="hidden md:flex gap-6 text-sm font-medium">
              <a href="#" className="hover:text-orange-400">АУКЦИОНЫ</a>
              <a href="#" className="hover:text-orange-400">ПЛОЩАДКИ</a>
              <a href="#" className="hover:text-orange-400">УСЛУГИ</a>
              <a href="#" className="hover:text-orange-400">ЦЕНТР ПОМОЩИ</a>
            </nav>
          </div>
          <div className="flex gap-4">
            <button className="text-sm font-bold border border-white px-4 py-1 rounded hover:bg-white hover:text-blue-900 transition">Войти</button>
            <button className="text-sm font-bold bg-orange-500 px-4 py-1 rounded hover:bg-orange-600 transition">Регистрация</button>
          </div>
        </div>
      </header>

      {/* 2. Секция поиска (Hero) */}
      <section className="bg-blue-900 py-12 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl font-bold mb-6">100% онлайн-аукцион авто в Казахстане</h2>
          <div className="max-w-3xl mx-auto bg-white p-2 rounded-lg flex shadow-2xl">
            <input 
              type="text" 
              placeholder="Поиск по марке, модели, VIN или лоту..." 
              className="flex-1 p-4 text-black outline-none text-lg"
            />
            <button className="bg-[#f28b00] text-black font-bold px-10 py-4 rounded hover:bg-orange-400 transition">
              ПОИСК
            </button>
          </div>
          <p className="mt-4 text-gray-300 italic text-sm">Более 50 000 автомобилей по всему Казахстану ежедневно</p>
        </div>
      </section>

      {/* 3. Список лотов (Пример) */}
      <main className="container mx-auto px-4 py-10">
        <div className="flex justify-between items-end mb-8">
          <h3 className="text-2xl font-bold text-gray-800 border-l-4 border-blue-800 pl-3">Рекомендуемые лоты</h3>
          <a href="#" className="text-blue-700 font-bold hover:underline">Посмотреть все →</a>
        </div>

        {/* Сетка карточек */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((id) => (
            <div key={id} className="bg-white rounded-md shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
              <div className="relative h-48 bg-gray-300">
                <div className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded">LIVE AUCTION</div>
                {/* Здесь будет реальное фото, пока заглушка */}
                <div className="w-full h-full flex items-center justify-center text-gray-500">Фото авто</div>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-blue-900 text-lg uppercase leading-tight mb-1">2022 TOYOTA CAMRY 75</h4>
                <p className="text-xs text-gray-500 mb-3">Лот: 5493012 • VIN: *********1234</p>
                
                <div className="bg-gray-50 p-2 rounded mb-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Текущая ставка:</span>
                    <span className="font-bold text-green-700 font-mono text-lg">$14,200</span>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-gray-600">Место:</span>
                    <span className="font-semibold uppercase">Алматы</span>
                  </div>
                </div>
                
                <button className="w-full bg-blue-800 text-white font-bold py-2 rounded hover:bg-blue-700 transition">
                  СДЕЛАТЬ СТАВКУ
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Футер для солидности */}
      <footer className="bg-gray-800 text-gray-400 py-10 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p>© 2024 QazDrive — Проект для дипломной работы</p>
        </div>
      </footer>
    </div>
  );
}