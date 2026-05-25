'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

export default function AuctionChat({ carId }: { carId: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    // Загрузка сообщений
    const fetchMessages = async () => {
      const { data } = await supabase.from('auction_messages').select('*').eq('car_id', carId).order('created_at', { ascending: true });
      if (data) setMessages(data);
    };
    fetchMessages();

    // REAL-TIME ЧАТ
    const channel = supabase.channel(`chat-${carId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'auction_messages', filter: `car_id=eq.${carId}` }, 
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      ).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [carId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;
    await supabase.from('auction_messages').insert({
      car_id: carId,
      user_id: user.id,
      user_nickname: user.user_metadata.nickname || "Аноним",
      content: newMessage
    });
    setNewMessage('');
  };

  return (
    <div className="bg-slate-900/40 border border-white/5 rounded-[3rem] flex flex-col h-[500px] overflow-hidden shadow-2xl backdrop-blur-md">
      <div className="p-6 border-b border-white/5 bg-white/5 flex justify-between items-center">
        <h3 className="text-[11px] font-black uppercase text-orange-500 tracking-[0.4em] italic">Auction Room Chat</h3>
        <div className="flex items-center gap-2">
           <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
           <span className="text-[9px] font-bold text-slate-500 uppercase">Live</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-4 no-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.user_id === user?.id ? 'items-end' : 'items-start'}`}>
            <span className="text-[8px] font-black text-slate-600 uppercase mb-1 px-2 italic">{msg.user_nickname}</span>
            <div className={`px-5 py-2.5 rounded-2xl text-xs font-bold max-w-[80%] ${msg.user_id === user?.id ? 'bg-orange-500 text-black rounded-tr-none' : 'bg-slate-800 text-white rounded-tl-none border border-white/5'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      <form onSubmit={sendMessage} className="p-6 bg-black/20 border-t border-white/5 flex gap-3">
        <input 
          type="text" 
          placeholder={user ? "Напишите в чат..." : "Войдите, чтобы писать"}
          disabled={!user}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 bg-slate-900/50 border border-white/10 rounded-xl px-5 py-3 text-xs text-white outline-none focus:border-orange-500 transition-all italic"
        />
        <button disabled={!user} className="bg-white text-black px-6 rounded-xl font-black text-[10px] uppercase hover:bg-orange-500 transition-all active:scale-95 disabled:opacity-20 italic">Отправить</button>
      </form>
    </div>
  );
}