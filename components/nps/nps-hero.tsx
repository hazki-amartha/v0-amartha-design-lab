import styles from './nps-hero.module.css';

export default function NPSHero() {
  return (
    <div className="relative rounded-2xl overflow-hidden bg-[#0f0b2a] px-8 py-10">
      {/* Animated blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`${styles.blob} ${styles.blob1}`} />
        <div className={`${styles.blob} ${styles.blob2}`} />
        <div className={`${styles.blob} ${styles.blob3}`} />
        <div className={`${styles.blob} ${styles.blob4}`} />
      </div>

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
      />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-between flex-wrap gap-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/50 mb-2">
            Net Promoter Score · Q4 2025
          </p>
          <div className="flex items-end gap-4">
            <span className="text-[72px] font-bold leading-none text-white tracking-tight">40</span>
            <div className="mb-2">
              <span className="text-[14px] font-medium text-red-400">↓4 from Q3</span>
              <p className="text-[12px] text-white/40 mt-0.5">Previous: 44</p>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          <div className="text-center">
            <p className="text-[36px] font-bold text-emerald-400 leading-none">58%</p>
            <p className="text-[11px] text-white/50 mt-1.5">Promoters</p>
          </div>
          <div className="text-center">
            <p className="text-[36px] font-bold text-white/60 leading-none">24%</p>
            <p className="text-[11px] text-white/50 mt-1.5">Passives</p>
          </div>
          <div className="text-center">
            <p className="text-[36px] font-bold text-red-400 leading-none">18%</p>
            <p className="text-[11px] text-white/50 mt-1.5">Detractors</p>
          </div>
        </div>
      </div>
    </div>
  );
}
