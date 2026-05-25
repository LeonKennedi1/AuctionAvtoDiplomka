export default function Footer() {
  const columns = [
    { 
      title: "Узнайте о нас больше", 
      links: ["О компании", "Наша история", "Новости", "Вакансии"] 
    },
    { 
      title: "Поиск авто", 
      links: ["Список машин", "Сохраненные поиски", "История торгов"] 
    },
    { 
      title: "Услуги", 
      links: ["Доставка", "Отчеты по авто", "Брокеры"] 
    },
    { 
      title: "Помощь", 
      links: ["Как покупать", "Словарь терминов", "Видео-уроки"] 
    },
  ];

  return (
    <footer className="bg-[#0a0a0a] text-white pt-20 pb-10 border-t border-white/5">
      <div className="container mx-auto px-4">
        {/* Основные колонки ссылок */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">
          {columns.map((col) => (
            <div key={col.title}>
              <h5 className="text-orange-500 font-black text-[10px] mb-6 uppercase tracking-[0.3em] italic italic">
                {col.title}
              </h5>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-slate-500 hover:text-white text-xs transition-colors duration-300 font-medium">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Нижняя информационная панель */}
        <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Копирайт */}
          <div className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
            © 2024 <span className="text-slate-400">QAZDRIVE</span>. Все права защищены
          </div>

          {/* Правовая информация (без Карты сайта) */}
          <div className="flex gap-8 text-[9px] text-slate-600 font-black uppercase tracking-[0.2em]">
            <a href="#" className="hover:text-orange-500 transition-colors">Конфиденциальность</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Условия использования</a>
          </div>
        </div>
      </div>
    </footer>
  );
}