import Link from 'next/link';

export default function PricingPlans() {
  const plans = [
    { 
      name: "Базовый", 
      price: "0 ₸", 
      features: ["1 активная ставка", "Поиск по фильтрам", "Email-уведомления"], 
      color: "border-slate-700",
      desc: "Для ознакомления"
    },
    { 
      name: "Стандарт", 
      price: "25 000 ₸", 
      features: ["До 3 активных ставок", "История продаж авто", "SMS-оповещения"], 
      color: "border-blue-500",
      desc: "Для частных лиц"
    },
    { 
      name: "Драйв", 
      price: "55 000 ₸", 
      features: ["Безлимитные ставки", "Полный отчет по VIN", "Техподдержка 24/7"], 
      color: "border-orange-500",
      desc: "Самый популярный"
    },
    { 
      name: "Бизнес", 
      price: "125 000 ₸", 
      features: ["Приоритетные доки", "Скидка на доставку", "До 10 авто в месяц"], 
      color: "border-purple-500",
      desc: "Для малых дилеров"
    },
    { 
      name: "VIP", 
      price: "250 000 ₸", 
      features: ["Закрытые аукционы", "Личный менеджер", "Помощь в растаможке"], 
      color: "border-yellow-500",
      desc: "Полный эксклюзив"
    },
  ];

  return (
    <section className="py-24 bg-[#020617] border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-4">
            Тарифные <span className="text-orange-500 underline decoration-1 underline-offset-8">Планы</span>
          </h2>
          <p className="text-slate-500 uppercase text-[10px] tracking-[0.4em] font-bold">Выберите подходящий уровень доступа к торгам</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {plans.map((plan) => (
            <div key={plan.name} className={`bg-slate-900/50 border-t-4 ${plan.color} p-8 rounded-[2rem] flex flex-col justify-between hover:bg-slate-800 transition-all duration-500 group cursor-pointer hover:-translate-y-2 shadow-2xl relative overflow-hidden`}>
              
              {/* Декор на фоне карточки */}
              <div className="absolute -right-4 -top-4 text-white/5 font-black text-6xl italic italic select-none uppercase">
                {plan.name[0]}
              </div>

              <div className="relative z-10">
                <p className="text-[9px] text-orange-500 font-black uppercase tracking-widest mb-2 italic italic">{plan.desc}</p>
                <h4 className="text-2xl font-black uppercase italic text-white group-hover:text-orange-500 transition-colors tracking-tighter">
                  {plan.name}
                </h4>
                <p className="text-3xl font-black text-white mt-6 mb-8 tracking-tighter">{plan.price}</p>
                
                <ul className="space-y-4">
                  {plan.features.map(f => (
                    <li key={f} className="text-[10px] text-slate-400 uppercase font-bold flex items-start gap-2 leading-relaxed">
                      <span className="text-orange-500">/</span> {f}
                    </li>
                  ))}
                </ul>
              </div>

              <Link 
                href="/register"
                className="w-full mt-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all italic italic text-center"
              >
                Выбрать план
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}