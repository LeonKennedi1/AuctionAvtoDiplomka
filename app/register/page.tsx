'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthHeader from '@/components/AuthHeader';

export default function RegisterPage() {
  // Состояния для полей ввода
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Состояния для показа/скрытия паролей (глазики)
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 1. Проверка совпадения паролей
    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      setLoading(false);
      return;
    }

    // 2. Регистрация в Supabase с сохранением НИКНЕЙМА в метаданные
    const { data, error: regError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nickname: nickname, // Это поле сохранится в профиле пользователя
        }
      }
    });

    if (regError) {
      setError(regError.message);
      setLoading(false);
    } else {
      alert('Добро пожаловать в QazDrive, ' + nickname + '!');
      router.push('/'); // Сразу кидаем на главную, вход произойдет автоматически
      router.refresh(); 
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col font-sans selection:bg-orange-500 selection:text-black">
      <AuthHeader type="register" />
      
      <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Фоновое свечение */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/5 blur-[130px] rounded-full pointer-events-none"></div>

        <div className="max-w-[480px] w-full bg-slate-900/40 backdrop-blur-xl p-10 rounded-[3rem] border border-white/5 shadow-2xl relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter italic leading-none">
              Создать <span className="text-orange-500">Профиль</span>
            </h1>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-3">Станьте частью сообщества QazDrive</p>
          </div>
          
          <form onSubmit={handleRegister} className="space-y-5">
            {error && (
              <p className="text-red-500 text-[10px] font-black uppercase text-center bg-red-500/10 py-3 rounded-xl border border-red-500/20">
                {error}
              </p>
            )}

            {/* NICKNAME */}
            <div>
              <label className="block text-[9px] font-black text-slate-500 mb-2 uppercase tracking-[0.2em] italic">Ваш Никнейм</label>
              <input 
                required
                type="text" 
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-orange-500 transition-all font-bold text-sm"
                placeholder="Ivan_Auction"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-[9px] font-black text-slate-500 mb-2 uppercase tracking-[0.2em] italic">Электронная почта</label>
              <input 
                required
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-orange-500 transition-all font-bold text-sm"
                placeholder="name@mail.kz"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-[9px] font-black text-slate-500 mb-2 uppercase tracking-[0.2em] italic">Придумайте пароль</label>
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

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="block text-[9px] font-black text-slate-500 mb-2 uppercase tracking-[0.2em] italic">Подтвердите пароль</label>
              <div className="relative">
                <input 
                  required
                  type={showConfirm ? "text" : "password"} 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-orange-500 transition-all font-bold text-sm" 
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-4 text-slate-600 hover:text-orange-500 transition-colors text-lg"
                >
                  {showConfirm ? "🔒" : "👁️"}
                </button>
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full bg-orange-500 text-black font-black py-5 rounded-2xl hover:bg-white transition-all shadow-xl shadow-orange-500/10 uppercase text-xs tracking-[0.2em] italic disabled:opacity-50 active:scale-95 mt-4"
            >
              {loading ? 'Создание аккаунта...' : 'Зарегистрироваться и войти'}
            </button>

            <div className="pt-6 border-t border-white/5 text-center">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                Уже есть аккаунт? {' '}
                <Link href="/login" className="text-orange-500 font-black hover:text-white transition-colors">
                  Войти
                </Link>
              </p>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}