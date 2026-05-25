'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function Header() {
  const [user, setUser] = useState<any>(null);

  const navLinks = [
    { name: "Каталог", href: "/" },
    { name: "Аукционы", href: "#" },
    { name: "О нас", href: "#" },
    { name: "Помощь", href: "#" },
  ];

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  // Данные для отображения
  const nickname = user?.user_metadata?.nickname || user?.email?.split('@')[0] || "User";
  const avatarUrl = user?.user_metadata?.avatar_url;
  const avatarLetter = nickname.charAt(0).toUpperCase();

  return (
    <div className="fixed top-6 left-0 w-full z-50 px-4">
      {/* Увеличили max-w до 7xl для большего охвата экрана */}
      <nav className="max-w-7xl mx-auto bg-black/60 backdrop-blur-xl border border-white/10 p-3 rounded-2xl flex justify-between items-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] font-sans">
        
        {/* Логотип (чуть крупнее) */}
        <div className="pl-6">
          <Link href="/" className="group flex items-center">
            <span className="text-2xl font-black italic tracking-tighter text-white group-hover:text-orange-500 transition-colors">
              QAZ<span className="text-orange-500 underline decoration-2 underline-offset-4">DRIVE</span>
            </span>
          </Link>
        </div>

        {/* Центрированное меню (увеличили отступы до gap-12) */}
        <div className="hidden lg:flex gap-12 items-center">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-white transition-all italic duration-300"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Блок пользователя (РАСШИРЕННЫЙ) */}
        <div className="flex gap-4 pr-2">
          {user ? (
            <div className="flex items-center gap-6 pl-6 border-l border-white/5">
              
              {/* Профиль: увеличили min-width и gap */}
              <Link href="/profile" className="flex items-center gap-5 group active:scale-95 transition-all min-w-[170px]">
                
                {/* Увеличенная аватарка (w-12 h-12) */}
                <div className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-orange-500/20 shadow-[0_0_25px_rgba(249,115,22,0.15)] group-hover:bg-white overflow-hidden transition-all duration-300">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-orange-500 flex items-center justify-center">
                      <span className="text-black font-black text-xl uppercase italic select-none">
                        {avatarLetter}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Информация: Ник + БАЛАНС (стали крупнее) */}
                <div className="flex flex-col text-left justify-center">
                  <span className="text-[12px] font-black text-white uppercase italic tracking-widest group-hover:text-orange-500 transition-colors duration-300 leading-none">
                    {nickname}
                  </span>
                  <span className="text-[10px] text-green-500 font-black tracking-[0.2em] leading-none mt-1.5 shadow-sm">
                    0 ₸
                  </span>
                </div>
              </Link>

              {/* Кнопка выхода (с рамкой для солидности) */}
              <button 
                onClick={handleLogout}
                className="text-[10px] font-black text-slate-500 uppercase hover:text-red-500 transition-all italic border border-white/5 px-4 py-2 rounded-xl hover:bg-red-500/10"
              >
                Выйти
              </button>
            </div>
          ) : (
            // Кнопки для гостей (тоже чуть шире)
            <div className="flex gap-4">
              <Link 
                href="/login" 
                className="text-[10px] font-black uppercase tracking-widest text-white px-8 py-3 rounded-xl border border-white/10 hover:bg-white hover:text-black transition-all duration-300 active:scale-95 italic"
              >
                Вход
              </Link>

              <Link 
                href="/register" 
                className="bg-orange-500 text-black text-[10px] font-black px-10 py-3 rounded-xl uppercase tracking-widest hover:bg-white transition-all duration-300 shadow-lg shadow-orange-500/20 active:scale-95 italic"
              >
                Регистрация
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}