'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function BidPanel({ currentBid: initialBid, lotId, make, model, year, auction_end }: any) {
  const [currentBid, setCurrentBid] = useState(initialBid);
  const [bidAmount, setBidAmount] = useState(initialBid + 50000);
  const [user, setUser] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Таймер и уведомления
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [notification, setNotification] = useState<any>(null);
  const [isWinner, setIsWinner] = useState(false);

  // Рефы для звуков
  const bidSound = useRef<any>(null);
  const outbidSound = useRef<any>(null);
  const warnSound = useRef<any>(null);
  const winSound = useRef<any>(null);

  useEffect(() => {
    // Инициализация звуков
    bidSound.current = new Audio('/bid.mp3');
    outbidSound.current = new Audio('/outbid.mp3');
    warnSound.current = new Audio('/warning.mp3');
    winSound.current = new Audio('/win.mp3');

    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    // Загрузка истории
    const fetchHistory = async () => {
      const { data } = await supabase.from('bid_history').select('*').eq('car_id', lotId).order('created_at', { ascending: false });
      if (data) setHistory(data);
    };
    fetchHistory();

    // REAL-TIME ПОДПИСКА
    const channel = supabase.channel(`lot-${lotId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'cars', filter: `id=eq.${lotId}` }, (payload) => {
        const newPrice = payload.new.current_bid;
        
        // Звук "Вас перебили"
        if (user && payload.new.last_bidder_id !== user.id && currentBid < newPrice) {
            outbidSound.current?.play().catch(() => {});
            showNotify("ВАША СТАВКА СБИТА!", `Новая цена: ${newPrice.toLocaleString()} ₸`, "error");
        } else {
            bidSound.current?.play().catch(() => {});
            showNotify("НОВАЯ СТАВКА", `Текущая цена: ${newPrice.toLocaleString()} ₸`, "info");
        }
        
        setCurrentBid(newPrice);
        setBidAmount(newPrice + 50000);
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bid_history', filter: `car_id=eq.${lotId}` }, (payload) => {
        setHistory(prev => [payload.new, ...prev]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [lotId, user, currentBid]);

  // ЛОГИКА ТАЙМЕРА
  useEffect(() => {
    const end = new Date(auction_end).getTime();
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const diff = end - now;
      setTimeLeft(diff);

      // Уведомления за 15, 10, 5 минут
      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);

      if (secs === 0 && (mins === 15 || mins === 10 || mins === 5)) {
        warnSound.current?.play().catch(() => {});
        showNotify("ВНИМАНИЕ", `До конца торгов осталось ${mins} минут!`, "info");
      }

      // Если время вышло
      if (diff <= 0) {
        clearInterval(timer);
        checkWinner();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [auction_end]);

  const checkWinner = () => {
    if (history.length > 0 && history[0].user_id === user?.id) {
      setIsWinner(true);
      winSound.current?.play().catch(() => {});
    }
  };

  const showNotify = (title: string, msg: string, type: string) => {
    setNotification({ title, msg, type });
    setTimeout(() => setNotification(null), 6000);
  };

  const handlePlaceBid = async () => {
    if (!user) { showNotify("ОШИБКА", "Войдите в аккаунт", "error"); return; }
    
    const deposit = Math.round(bidAmount * 0.1);
    const confirmText = `ПОДТВЕРЖДЕНИЕ СТАВКИ: ${bidAmount.toLocaleString()} ₸\n\nС вашего счета будет временно списан гарантийный взнос 10% (${deposit.toLocaleString()} ₸).\n\nДеньги вернутся, если вашу ставку перебьют. Продолжить?`;
    
    if (!window.confirm(confirmText)) return;

    setLoading(true);
    await supabase.from('cars').update({ current_bid: bidAmount, last_bidder_id: user.id }).eq('id', lotId);
    await supabase.from('bid_history').insert({
        car_id: lotId, user_id: user.id, user_nickname: user.user_metadata.nickname, amount: bidAmount
    });
    setLoading(false);
  };

  // Форматирование времени
  const formatTime = (ms: number) => {
    if (ms <= 0) return "ТОРГИ ЗАВЕРШЕНЫ";
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${h}ч ${m}м ${s}с`;
  };

  return (
    <div className="space-y-6 text-left">
      {/* 1. ВСПЛЫВАЮЩЕЕ ОКНО */}
      {notification && (
        <div className="fixed top-24 right-6 z-[1000] animate-bounce-in min-w-[350px]">
           <div className={`p-8 rounded-[2.5rem] border backdrop-blur-3xl shadow-2xl ${notification.type === 'error' ? 'bg-red-500/20 border-red-500' : 'bg-orange-500/20 border-orange-500'}`}>
              <p className="font-black uppercase italic text-xs tracking-widest text-white mb-2">{notification.title}</p>
              <p className="text-[11px] font-bold text-slate-300 uppercase leading-relaxed">{notification.msg}</p>
           </div>
        </div>
      )}

      {/* 2. ОКНО ПОБЕДЫ */}
      {isWinner && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
          <div className="bg-slate-900 border-2 border-orange-500 p-12 rounded-[4rem] text-center shadow-[0_0_100px_rgba(249,115,22,0.3)] animate-pop-in">
             <span className="text-6xl mb-6 block">🏆</span>
             <h2 className="text-4xl font-black uppercase italic italic text-white mb-4">ПОЗДРАВЛЯЕМ, ВЫ ВЫИГРАЛИ!</h2>
             <p className="text-slate-400 uppercase font-bold text-sm tracking-widest mb-10">Автомобиль {make} {model} теперь ваш.</p>
             <button onClick={() => setIsWinner(false)} className="bg-orange-500 text-black font-black px-12 py-4 rounded-2xl uppercase italic italic hover:bg-white transition-all">В личный кабинет</button>
          </div>
        </div>
      )}

      {/* 3. ТЕРМИНАЛ СТАВОК */}
      <div className="sticky top-32 bg-slate-900 border border-orange-500/20 p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
        <div className="absolute -right-12 -top-12 text-white/5 font-black text-[12rem] italic select-none pointer-events-none">₸</div>
        
        <div className="relative z-10">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
               <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
               <p className="text-[10px] text-orange-500 font-black uppercase tracking-[0.5em] italic">Live Auction</p>
            </div>
            <h1 className="text-5xl font-black uppercase italic tracking-tighter leading-[0.85] text-white italic">
              {year} {make} <br /> <span className="text-orange-500">{model}</span>
            </h1>
          </div>

          <div className="bg-black/60 p-8 rounded-3xl border border-white/5 text-center mb-8">
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2 italic">Текущая ставка</p>
            <p className="text-6xl font-black italic text-white tracking-tighter italic">{currentBid.toLocaleString()} ₸</p>
          </div>

          {/* ТАЙМЕР */}
          <div className={`p-5 rounded-2xl border mb-10 flex justify-between items-center backdrop-blur-md ${timeLeft < 300000 ? 'bg-red-500/10 border-red-500 text-red-500 animate-pulse' : 'bg-white/5 border-white/10 text-white'}`}>
            <span className="text-[10px] font-black uppercase tracking-widest">До завершения:</span>
            <span className="text-lg font-black italic italic">{formatTime(timeLeft)}</span>
          </div>

          <div className="space-y-4">
             <div className="relative group text-center">
               <input type="number" value={bidAmount} onChange={(e) => setBidAmount(Number(e.target.value))} className="w-full bg-black/40 border border-white/10 p-6 rounded-2xl text-white outline-none focus:border-orange-500 transition-all font-black text-center text-3xl italic" />
               <div className="absolute top-2 left-6 text-[8px] font-black text-slate-600 uppercase tracking-widest italic">Ваша ставка (₸)</div>
             </div>
             <button onClick={handlePlaceBid} disabled={loading || timeLeft <= 0} className="w-full bg-orange-500 text-black font-black py-6 rounded-2xl hover:bg-white transition-all shadow-2xl uppercase text-[11px] tracking-[0.3em] italic active:scale-95 disabled:opacity-50">
               {loading ? 'ОБРАБОТКА...' : `ПОСТАВИТЬ (+10% ВЗНОС)`}
             </button>
          </div>
        </div>
      </div>

      {/* 4. ИСТОРИЯ (КТО, СКОЛЬКО, МЕСТО) */}
      <div className="bg-slate-900/40 border border-white/5 p-10 rounded-[3rem] backdrop-blur-xl">
        <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
           <h3 className="text-[11px] font-black uppercase text-orange-500 tracking-[0.3em] italic">Лента событий</h3>
           <span className="bg-white/5 px-3 py-1 rounded text-[9px] font-bold text-slate-500 uppercase">{history.length} участников</span>
        </div>
        <div className="space-y-5 max-h-[400px] overflow-y-auto no-scrollbar">
          {history.map((item, index) => (
            <div key={item.id} className={`flex justify-between items-center p-5 rounded-2xl border transition-all ${index === 0 ? 'bg-orange-500/10 border-orange-500' : 'bg-black/20 border-white/5'}`}>
              <div className="flex items-center gap-4 text-left">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-black uppercase italic ${index === 0 ? 'bg-orange-500 text-black' : 'bg-slate-800 text-white'}`}>{item.user_nickname?.charAt(0)}</div>
                <div>
                  <p className="text-[11px] font-black text-white uppercase italic">{item.user_nickname} {user?.id === item.user_id && "(ВЫ)"}</p>
                  <p className="text-[8px] text-slate-500 uppercase tracking-widest italic">{new Date(item.created_at).toLocaleTimeString()}</p>
                </div>
              </div>
              <p className={`text-xl font-black italic tracking-tighter ${index === 0 ? 'text-orange-500' : 'text-slate-300'}`}>{item.amount.toLocaleString()} ₸</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}