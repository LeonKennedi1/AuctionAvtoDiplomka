'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthHeader from '@/components/AuthHeader';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false); // Состояние для глазика
  const [rememberMe, setRememberMe] = useState(true); // Галочка сохранения
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setError('Неверный логин или пароль. Попробуйте еще раз.');
      setLoading(false);
    } else {
      router.push('/'); 
      router.refresh(); 
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col font-sans selection:bg-orange-500 selection:text-black">
      <AuthHeader type="login" />
      
      <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Декоративное свечение */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/5 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-[420px] w-full bg-slate-900/40 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative z-10">
          
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter italic">
              Вход в <span className="text-orange-500">Систему</span>
            </h1>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2 italic">Добро пожаловать в QazDrive</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <p className="text-red-500 text-[10px] font-black uppercase text-center bg-red-500/10 py-3 rounded-xl border border-red-500/20">
                {error}
              </p>
            )}

            {/* EMAIL */}
            <div>
              <label className="block text-[9px] font-black text-slate-500 mb-2 uppercase tracking-[0.2em] italic">Логин (Email)</label>
              <input 
                required
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-orange-500 transition-all font-bold text-sm"
                placeholder="vlas@example.com"
              />
            </div>

            {/* PASSWORD С ГЛАЗИКОМ */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] italic">Пароль</label>
                <span className="text-[9px] text-orange-500 font-bold uppercase cursor-pointer hover:text-white transition-colors">Забыли?</span>
              </div>
              <div className="relative">
                <input 
                  required
                  type={showPass ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-orange-500 transition-all font-bold text-sm" 
                />
                <button 
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-4 text-slate-600 hover:text-orange-500 transition-colors text-lg"
                >
                  {showPass ? "🔒" : "👁️"}
                </button>
              </div>
            </div>

            {/* ГАЛОЧКА "ЗАПОМНИТЬ МЕНЯ" */}
            <div className="flex items-center gap-3 px-1">
              <label className="relative flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="sr-only peer" 
                />
                <div className="w-5 h-5 bg-black/60 border border-white/10 rounded-md peer-checked:bg-orange-500 peer-checked:border-orange-500 transition-all flex items-center justify-center">
                  {rememberMe && <span className="text-black text-[10px] font-black">✓</span>}
                </div>
                <span className="ml-3 text-[10px] text-slate-400 font-black uppercase tracking-widest italic">Сохранить вход</span>
              </label>
            </div>

            {/* КНОПКА ВОЙТИ */}
            <button 
              disabled={loading}
              className="w-full bg-orange-500 text-black font-black py-5 rounded-2xl hover:bg-white transition-all shadow-xl shadow-orange-500/10 uppercase text-xs tracking-[0.2em] italic active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Авторизация...' : 'Войти в аккаунт'}
            </button>

            <div className="pt-6 border-t border-white/5 text-center">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                Нет аккаунта? {' '}
                <Link href="/register" className="text-orange-500 font-black hover:text-white transition-colors">
                  Создать
                </Link>
              </p>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}