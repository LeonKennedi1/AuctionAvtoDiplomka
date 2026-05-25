'use client';
import { useState } from 'react';

export default function Support() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-10 right-10 z-[9999]">
      {isOpen && (
        <div className="absolute bottom-24 right-0 w-80 bg-slate-900 border border-white/10 rounded-[3rem] shadow-2xl p-8 backdrop-blur-3xl animate-bounce-in">
           <h4 className="text-xs font-black uppercase text-orange-500 tracking-[0.3em] mb-4 italic">Центр поддержки</h4>
           <p className="text-[10px] text-slate-400 font-bold uppercase italic leading-relaxed mb-6">Наши менеджеры помогут вам 24/7. Ответ в течение 5 минут.</p>
           <a href="https://wa.me/77770000000" target="_blank" className="block text-center bg-white text-black py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-500 transition-all italic">Написать в WhatsApp</a>
        </div>
      )}
      <button onClick={() => setIsOpen(!isOpen)} className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-2xl shadow-[0_0_40px_rgba(249,115,22,0.4)] hover:scale-110 active:scale-90 transition-all border-4 border-[#020617] relative">
        {isOpen ? '✕' : '💬'}
        {!isOpen && <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-[#020617] text-[10px] flex items-center justify-center font-black">1</span>}
      </button>
    </div>
  );
}