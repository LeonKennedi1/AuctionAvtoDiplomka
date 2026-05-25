import Link from 'next/link';

interface AuthHeaderProps {
  type: 'login' | 'register';
}

export default function AuthHeader({ type }: AuthHeaderProps) {
  return (
    <header className="flex justify-between items-center px-8 py-6 bg-[#020617] border-b border-white/5 relative z-50">
      <Link href="/" className="text-2xl font-black italic tracking-tighter text-white hover:text-orange-500 transition-colors">
        QAZ<span className="text-orange-500 underline decoration-2 underline-offset-4">DRIVE</span>
      </Link>

      <div className="flex items-center gap-8">
        <div className="hidden md:flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest cursor-pointer hover:text-white transition-colors">
          <span>🌐 Русский</span>
        </div>
        
        {type === 'register' ? (
          <Link href="/login" className="text-[10px] font-black text-white uppercase tracking-widest border border-white/10 px-6 py-2 rounded-full hover:bg-white hover:text-black transition-all italic">
            Уже есть аккаунт? Войти
          </Link>
        ) : (
          <Link href="/register" className="text-[10px] font-black text-orange-500 uppercase tracking-widest border border-orange-500/20 px-6 py-2 rounded-full hover:bg-orange-500 hover:text-black transition-all italic">
            Создать аккаунт
          </Link>
        )}
      </div>
    </header>
  );
}