export default function NPSHero() {
  return (
    <div className="relative rounded-2xl overflow-hidden bg-[#0f0b2a] px-8 py-10 mb-2">
      {/* Animated blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        <div className="blob blob-4" />
      </div>

      {/* Noise overlay for texture */}
      <div className="absolute inset-0 opacity-[0.04] [background-image:url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')]" />

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

        <div className="flex gap-6">
          <div className="text-center">
            <p className="text-[32px] font-bold text-emerald-400 leading-none">58%</p>
            <p className="text-[11px] text-white/50 mt-1">Promoters</p>
          </div>
          <div className="text-center">
            <p className="text-[32px] font-bold text-white/60 leading-none">24%</p>
            <p className="text-[11px] text-white/50 mt-1">Passives</p>
          </div>
          <div className="text-center">
            <p className="text-[32px] font-bold text-red-400 leading-none">18%</p>
            <p className="text-[11px] text-white/50 mt-1">Detractors</p>
          </div>
        </div>
      </div>

      <style>{`
        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(72px);
          opacity: 0.55;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          animation-direction: alternate;
        }
        .blob-1 {
          width: 420px; height: 420px;
          background: #6c5ae4;
          top: -120px; left: -80px;
          animation: blob1 9s infinite alternate;
        }
        .blob-2 {
          width: 340px; height: 340px;
          background: #a78bfa;
          top: -60px; right: 5%;
          animation: blob2 11s infinite alternate;
        }
        .blob-3 {
          width: 280px; height: 280px;
          background: #3b1fa8;
          bottom: -80px; left: 30%;
          animation: blob3 8s infinite alternate;
        }
        .blob-4 {
          width: 200px; height: 200px;
          background: #ec4899;
          bottom: -40px; right: 15%;
          opacity: 0.3;
          animation: blob4 13s infinite alternate;
        }
        @keyframes blob1 {
          0%   { transform: translate(0, 0) scale(1); }
          100% { transform: translate(40px, 30px) scale(1.15); }
        }
        @keyframes blob2 {
          0%   { transform: translate(0, 0) scale(1); }
          100% { transform: translate(-30px, 40px) scale(0.9); }
        }
        @keyframes blob3 {
          0%   { transform: translate(0, 0) scale(1); }
          100% { transform: translate(50px, -20px) scale(1.2); }
        }
        @keyframes blob4 {
          0%   { transform: translate(0, 0) scale(1); }
          100% { transform: translate(-40px, -30px) scale(1.1); }
        }
      `}</style>
    </div>
  );
}
