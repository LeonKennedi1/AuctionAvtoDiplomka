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
  const [myBids, setMyBids] = useState<any[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }
      
      setUser(session.user);
      setAvatarUrl(session.user.user_metadata?.avatar_url || null);

      // ЗАПРОС: Получаем историю ставок этого пользователя с данными о машинах
      const { data: bids } = await supabase
        .from('bid_history')
        .select('*, cars(make, model, year)') 
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (bids) setMyBids(bids);
      setLoading(false);
    };
    getData();
  }, [router]);

  // ФУНКЦИЯ ЗАГРУЗКИ АВАТАРКИ
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) return;

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // 1. Загружаем в бакет 'avatars' (Убедись, что он создан в Supabase и он PUBLIC)
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Получаем публичную ссылку
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);

      // 3. Обновляем профиль
      await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      setAvatarUrl(publicUrl);
      alert('Профиль обновлен!');
    } catch (error: any) {
      alert('Ошибка доступа: проверьте политики RLS в Supabase. ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center text-orange-500 font-black uppercase italic tracking-[0.5em]">
      Синхронизация профиля...
    </div>
  );

  if (!user) return null;

  const nickname = user.user_metadata?.nickname || "Участник";
  const avatarLetter = nickname.charAt(0).toUpperCase();
  const shortId = user.id.slice(0, 6).toUpperCase();

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-orange-500 selection:text-black">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 pt-44 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
          
          {/* ЛЕВАЯ ПАНЕЛЬ (4 колонки) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900/40 border border-white/5 p-12 rounded-[3.5rem] text-center backdrop-blur-3xl relative overflow-hidden shadow-2xl">
              
              <div className="flex justify-center mb-10">
                <span className="bg-white/5 border border-white/10 px-6 py-2 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">
                  Участник ID: <span className="text-white">{shortId}</span>
                </span>
              </div>

              {/* Аватарка с загрузкой */}
              <div className="relative w-44 h-44 mx-auto mb-10 group">
                <div className="w-full h-full rounded-full border-[6px] border-slate-900 overflow-hidden shadow-2xl bg-slate-800 transition-transform duration-500 group-hover:scale-105">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-orange-500 flex items-center justify-center">
                      <span className="text-black font-black text-7xl italic">{avatarLetter}</span>
                    </div>
                  )}
                </div>
                <label className="absolute bottom-1 right-1 bg-white text-black w-12 h-12 rounded-full flex items-center justify-center cursor-pointer border-[5px] border-[#020617] hover:bg-orange-500 transition-all shadow-2xl active:scale-90">
                  <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
                  <span className="text-xl">{uploading ? '⏳' : '📸'}</span>
                </label>
              </div>
              
              <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white mb-2 leading-none italic">{nickname}</h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.3em] mb-12 opacity-60 italic">{user.email}</p>
              
              {/* БАЛАНС */}
              <div className="bg-black/60 border border-white/5 p-8 rounded-[2.5rem] mb-10 shadow-inner">
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
          </div>

          {/* ПРАВАЯ ПАНЕЛЬ (8 колонок) */}
          <div className="lg:col-span-8 space-y-10">
            {/* Статистика */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-900/30 border border-white/5 p-10 rounded-[3rem] flex justify-between items-center group hover:border-orange-500 transition-all shadow-lg">
                  <div>
                    <p className="text-[11px] text-slate-500 uppercase font-black mb-3 italic">Активные ставки</p>
                    <p className="text-5xl font-black italic text-white group-hover:text-orange-500 transition-colors tracking-tighter italic">{myBids.length} лотов</p>
                  </div>
                  <span className="text-5xl opacity-10 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0">⚡️</span>
                </div>
                <div className="bg-slate-900/30 border border-white/5 p-10 rounded-[3rem] flex justify-between items-center opacity-40">
                  <div>
                    <p className="text-[11px] text-slate-500 uppercase font-black mb-3 italic">Избранные авто</p>
                    <p className="text-5xl font-black italic text-white tracking-tighter italic">0 машин</p>
                  </div>
                  <span className="text-5xl opacity-10">⭐</span>
                </div>
            </div>

            {/* Список последних торгов */}
            <div className="bg-slate-900/40 border border-white/5 rounded-[4rem] p-16 min-h-[520px] shadow-2xl backdrop-blur-sm relative overflow-hidden">
               <h3 className="text-sm font-black uppercase text-orange-500 tracking-[0.4em] mb-12 italic border-b border-white/5 pb-8">Лента вашей активности</h3>

               {myBids.length > 0 ? (
                 <div className="space-y-6">
                    {myBids.map((bid) => (
                      <div key={bid.id} className="flex justify-between items-center p-8 bg-black/40 border border-white/5 rounded-[2.5rem] hover:border-orange-500/30 transition-all shadow-lg group">
                        <div className="flex items-center gap-8 text-left">
                           <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center font-black text-[10px] text-orange-500 border border-white/5 italic">LOT</div>
                           <div>
                              <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1 italic">Торговая позиция</p>
                              <h4 className="text-2xl font-black uppercase italic text-white group-hover:text-orange-500 transition-colors tracking-tighter italic">
                                {bid.cars?.year} {bid.cars?.make} {bid.cars?.model}
                              </h4>
                              <p className="text-[8px] text-slate-600 font-bold uppercase mt-1">ID Транзакции: {bid.id.slice(0,12)}</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1 italic">Ваша ставка</p>
                           <p className="text-3xl font-black text-orange-500 italic tracking-tighter">{bid.amount.toLocaleString()} ₸</p>
                        </div>
                      </div>
                    ))}
                 </div>
               ) : (
                 <div className="flex flex-col items-center justify-center pt-20 text-center opacity-30">
                    <span className="text-7xl mb-8 grayscale">🏁</span>
                    <p className="text-lg font-black text-slate-400 uppercase tracking-widest italic">Активность отсутствует</p>
                    <a href="/" className="mt-10 bg-white text-black px-12 py-5 rounded-2xl font-black uppercase italic text-[11px] tracking-widest hover:bg-orange-500 transition-all">Перейти к торгам →</a>
                 </div>
               )}
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}