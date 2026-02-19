
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Users, Trophy, MessageCircle, Globe, QrCode, Copy, CheckCircle2 } from 'lucide-react';

const Home: React.FC = () => {
  const handleShareApp = async () => {
    // URL LENGKAP: Sangat penting menggunakan window.location.href 
    // agar menyertakan bagian domain + path + hash (#)
    const shareUrl = window.location.href;
    const shareText = `*PORTAL RESMI KALOUGATA FAMILY*\n\nSelamat datang di pusat data komunitas kita. Klik link di bawah untuk masuk ke dashboard atau daftar sebagai anggota baru:\n\n🔗 ${shareUrl}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Portal KALOUGATA',
          text: 'Portal resmi komunitas Kalougata Family',
          url: shareUrl
        });
      } else {
        const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
        window.open(waUrl, '_blank');
      }
    } catch (err) {
      const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
      window.open(waUrl, '_blank');
    }
  };

  const copyToClipboard = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl);
    alert("LINK DISALIN!\nSekarang Anda bisa menempelkan (paste) link ini di grup WhatsApp keluarga.");
  };

  return (
    <div className="space-y-12 pb-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 px-6 py-16 md:py-28 text-center flex flex-col items-center shadow-2xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-amber-500/10 blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl">
          <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-[0.2em] mb-6 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> System Status: Online & Stable
          </div>
          
          <h1 className="font-sport text-6xl md:text-9xl mb-6 leading-none text-white tracking-tighter">
            KALOUGATA<br />
            <span className="text-amber-500">FAMILY HUB</span>
          </h1>
          
          <p className="text-slate-400 mb-12 text-lg md:text-2xl max-w-2xl mx-auto leading-relaxed">
            Portal digital mandiri untuk manajemen anggota dan poin prestasi. 
            Cukup klik, masuk, dan tunjukkan badge QR Anda.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md mx-auto">
            <Link to="/login" className="w-full bg-amber-500 text-slate-950 px-8 py-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/20 active:scale-95 text-lg">
              MASUK SEKARANG <ArrowRight className="w-6 h-6" />
            </Link>
            
            <button 
              onClick={handleShareApp}
              className="w-full bg-slate-800 text-white border border-slate-700 px-8 py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-700 transition-all active:scale-95 shadow-lg"
            >
              <MessageCircle className="w-6 h-6 text-emerald-500" /> BAGIKAN LINK
            </button>
          </div>

          <button 
            onClick={copyToClipboard}
            className="mt-8 text-slate-500 hover:text-amber-500 flex items-center gap-2 mx-auto text-sm font-bold transition-colors bg-slate-800/30 px-4 py-2 rounded-lg border border-slate-800"
          >
            <Copy className="w-4 h-4" /> Salin Link Website
          </button>
        </div>
      </section>

      {/* Grid Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <WebsiteFeature 
          icon={<QrCode className="w-6 h-6 text-amber-400" />}
          title="QR Badge Digital"
          description="Akses profil instan dengan scan kode unik masing-masing anggota keluarga."
        />
        <WebsiteFeature 
          icon={<Trophy className="w-6 h-6 text-amber-400" />}
          title="Update Skor Realtime"
          description="Poin otomatis terupdate setelah admin melakukan scan kehadiran kegiatan."
        />
        <WebsiteFeature 
          icon={<Users className="w-6 h-6 text-amber-400" />}
          title="Direktori Skuad"
          description="Cari dan temukan profil semua anggota keluarga Kalougata yang terdaftar."
        />
      </div>

      {/* Domain Info Help */}
      <div className="bg-blue-500/5 border border-blue-500/10 p-8 rounded-3xl text-center">
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-4">Tips Akses:</p>
        <p className="text-slate-400 text-sm leading-relaxed max-w-xl mx-auto">
          Jika Anda ingin website ini bisa dibuka dengan alamat <span className="text-blue-400">www.kalougatafamily.com</span>, 
          silakan hubungi admin IT untuk mendaftarkan nama domain tersebut dan menghubungkannya ke sistem ini.
        </p>
      </div>
    </div>
  );
};

const WebsiteFeature = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="bg-slate-900/40 p-8 rounded-[2rem] border border-slate-800 hover:border-amber-500/20 transition-all group backdrop-blur-sm">
    <div className="bg-slate-800/50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-slate-700">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
    <p className="text-slate-500 leading-relaxed text-sm font-medium">{description}</p>
  </div>
);

export default Home;
