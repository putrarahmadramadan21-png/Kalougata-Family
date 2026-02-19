
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Users, Trophy } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="space-y-12 pb-24 md:pt-16">
      {/* Hero Section - Logo Dihilangkan */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1e293b] to-[#0f172a] border border-amber-500/30 px-6 py-16 md:px-12 md:py-24 text-center flex flex-col items-center shadow-2xl">
        
        <div className="relative z-10 max-w-3xl">
          <h1 className="font-sport text-5xl md:text-7xl mb-6 leading-tight text-white tracking-wider">
            WELCOME MEMBER <br />
            <span className="text-amber-400">KALOUGATA FAMILY</span>
          </h1>
          <p className="text-slate-300 mb-10 text-lg md:text-xl leading-relaxed font-medium">
            Wadah persaudaran dan perkumpulan. Jadilah bagian dari keluarga besar Kalougata. <br className="hidden md:block" />
            Bermain, Bersenang-senang dan kumpulkan poin untuk reward.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login" className="bg-amber-500 text-slate-900 px-10 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20 transform hover:-translate-y-1">
              MASUK MEMBER <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/register" className="bg-slate-800 text-white border border-amber-500/50 px-10 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-700 transition-all transform hover:-translate-y-1">
              DAFTAR BARU
            </Link>
          </div>
        </div>
        
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-amber-500 via-transparent to-transparent"></div>
        </div>
      </section>

      {/* Quick Stats/Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard 
          icon={<Users className="w-6 h-6 text-amber-400" />}
          title="Satu Keluarga"
          description="Mempererat tali silaturahmi antar anggota di setiap kegiatan KALOUGATA."
        />
        <FeatureCard 
          icon={<Trophy className="w-6 h-6 text-amber-400" />}
          title="Point & Reward"
          description="Kumpulkan poin dari setiap kehadiran untuk ditukarkan dengan hadiah menarik."
        />
        <FeatureCard 
          icon={<Star className="w-6 h-6 text-amber-400" />}
          title="Digital Badge"
          description="Setiap anggota memiliki QR Code unik sebagai tanda pengenal resmi."
        />
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 hover:border-amber-500/50 transition-all group backdrop-blur-sm">
    <div className="bg-slate-900 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-amber-500/20">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
    <p className="text-slate-400 leading-relaxed text-sm">{description}</p>
  </div>
);

export default Home;
