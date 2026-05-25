'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        setUser(session.user);
        setAvatarUrl(session.user.user_metadata?.avatar_url || null);
      }
      setLoading(false);
    };
    checkUser();
  }, [router]);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) return;

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);

      await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      setAvatarUrl(publicUrl);
      alert('Фото профиля успешно обновлено!');
    } catch (error: any) {
      alert('Ошибка: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center text-orange-500 font-black uppercase italic tracking-[0.5em]">
      Загрузка системы...
    </div>
  );

  if (!user) return null;

  const nickname = user.user_metadata?.nickname || "Участник";
  const email = user.email;
  const avatarLetter = nickname.charAt(0).toUpperCase();
  const shortId = user.id.slice(0, 6).toUpperCase();

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-orange-500 selection:text-black">
      <Header />
      
      {/* Контейнер расширен до 7xl для простора */}
      <main className="max-w-7xl mx-auto px-6 pt-44 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* ЛЕВАЯ ПАНЕЛЬ: ЗАНИМАЕТ 4 КОЛОНКИ */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900/40 border border-white/5 p-12 rounded-[3.5rem] text-center backdrop-blur-3xl relative overflow-hidden shadow-2xl">
              
              {/* ID СВЕРХУ */}
              <div className="flex justify-center mb-10">
                <span className="bg-white/5 border border-white/10 px-6 py-2 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">
                  Участник ID: <span className="text-white">{shortId}</span>
                </span>
              </div>

              {/* УВЕЛИЧЕННАЯ АВАТАРКА (w-40) */}
              <div className="relative w-40 h-40 mx-auto mb-10 group">
                <div className="w-full h-full rounded-full border-[6px] border-slate-900 overflow-hidden shadow-[0_0_60px_rgba(249,115,22,0.15)] bg-slate-800 transition-transform duration-500 group-hover:scale-105">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-orange-500 flex items-center justify-center">
                      <span className="text-black font-black text-6xl italic">{avatarLetter}</span>
                    </div>
                  )}
                </div>
                
                {/* Кнопка смены фото */}
                <label className="absolute bottom-1 right-1 bg-white text-black w-12 h-12 rounded-full flex items-center justify-center cursor-pointer border-[5px] border-[#020617] hover:bg-orange-500 transition-all shadow-2xl active:scale-90 z-20">
                  <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
                  <span className="text-xl">{uploading ? '⌛' : '📸'}</span>
                </label>
              </div>
              
              <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white mb-2 leading-none italic">{nickname}</h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.3em] mb-12 opacity-60 italic">{email}</p>
              
              {/* БЛОК БАЛАНСА: СТАЛ БОЛЬШЕ И ЗАМЕТНЕЕ */}
              <div className="bg-black/60 border border-white/5 p-8 rounded-[2.5rem] mb-10 shadow-inner group">
                <p className="text-[10px] text-slate-500 uppercase font-black mb-2 tracking-[0.3em]">Ваш капитал</p>
                <p className="text-4xl font-black text-white italic tracking-tighter italic">0 ₸</p>
                <button className="mt-5 text-[10px] font-black uppercase text-orange-500 hover:text-white transition-colors tracking-widest italic underline decoration-1 underline-offset-8 decoration-orange-500/20">
                  Пополнить баланс
                </button>
              </div>

              <div className="pt-8 border-t border-white/5">
                <span className="bg-slate-500/10 text-slate-300 border border-slate-500/20 px-8 py-2.5 rounded-full text-[11px] font-black uppercase italic italic">
                  Тариф: БАЗОВЫЙ
                </span>
              </div>
            </div>

            <button className="w-full py-5 bg-white/5 border border-white/10 rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all italic active:scale-95 shadow-xl">
              Настройки безопасности
            </button>
          </div>

          {/* ПРАВАЯ ПАНЕЛЬ: ЗАНИМАЕТ 8 КОЛОНОК */}
          <div className="lg:col-span-8 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { label: "Активные ставки", val: "0 лотов", icon: "⚡️" },
                { label: "Избранные авто", val: "0 машин", icon: "⭐" },
              ].map((stat) => (
                <div key={stat.label} className="bg-slate-900/30 border border-white/5 p-10 rounded-[3rem] flex justify-between items-center group hover:border-orange-500/30 transition-all cursor-default shadow-lg">
                  <div>
                    <p className="text-[11px] text-slate-500 uppercase font-black tracking-widest mb-3 italic">{stat.label}</p>
                    <p className="text-5xl font-black italic text-white group-hover:text-orange-500 transition-colors tracking-tighter italic">{stat.val}</p>
                  </div>
                  <span className="text-5xl opacity-10 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0">{stat.icon}</span>
                </div>
              ))}
            </div>

            {/* ГЛАВНЫЙ БЛОК АКТИВНОСТИ */}
            <div className="bg-slate-900/40 border border-white/5 rounded-[4rem] p-16 min-h-[520px] backdrop-blur-sm relative overflow-hidden shadow-2xl">
               <div className="flex gap-12 border-b border-white/5 pb-8 mb-12 overflow-x-auto no-scrollbar">
                <button className="text-[13px] font-black uppercase tracking-widest text-orange-500 border-b-2 border-orange-500 pb-3 italic whitespace-nowrap">История активности</button>
                <button className="text-[13px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors pb-3 italic whitespace-nowrap opacity-50">Уведомления</button>
                <button className="text-[13px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors pb-3 italic whitespace-nowrap opacity-50">Мои документы</button>
              </div>

              <div className="flex flex-col items-center justify-center pt-16 text-center">
                <div className="w-28 h-28 bg-slate-800/50 rounded-full flex items-center justify-center mb-10 border border-white/5 shadow-2xl">
                  <span className="text-6xl opacity-20">🏎️</span>
                </div>
                <h4 className="text-2xl font-black uppercase italic text-white tracking-tighter italic italic">Каталог пуст</h4>
                <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mt-4 max-w-[360px] leading-relaxed italic opacity-70">
                  Вы еще не выбрали ни одного автомобиля для участия в торгах.
                </p>
                <a href="/" className="mt-14 bg-white text-black px-14 py-5 rounded-2xl font-black uppercase italic text-[12px] tracking-[0.3em] hover:bg-orange-500 transition-all active:scale-95 shadow-[0_25px_50px_rgba(255,255,255,0.1)] hover:shadow-orange-500/20">
                  Найти автомобиль →
                </a>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}