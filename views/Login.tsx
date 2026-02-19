
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loadFromStorage, saveToStorage } from '../services/storage';
import { User, Lock, ArrowRight, Eye, EyeOff, Heart, RefreshCcw, AlertCircle } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [memberId, setMemberId] = useState('');
  const [loginCode, setLoginCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // State untuk Reset Password
  const [isResetMode, setIsResetMode] = useState(false);
  const [motherNameConfirm, setMotherNameConfirm] = useState('');
  const [newLoginCode, setNewLoginCode] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const data = loadFromStorage();
    const member = data.members.find(m => m.id === memberId.toUpperCase().trim() && m.loginCode === loginCode);

    if (member) {
      localStorage.setItem('klg_session', JSON.stringify(member));
      navigate(`/profile/${member.id}`);
    } else {
      alert("Login Gagal: ID Member atau Password salah.");
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    const data = loadFromStorage();
    const memberIdx = data.members.findIndex(m => 
      m.id === memberId.toUpperCase().trim() && 
      m.motherName.trim().toUpperCase() === motherNameConfirm.trim().toUpperCase()
    );

    if (memberIdx !== -1) {
      // Validasi password baru
      const letterCount = (newLoginCode.match(/[a-zA-Z]/g) || []).length;
      const numberCount = (newLoginCode.match(/[0-9]/g) || []).length;
      
      if (letterCount < 5 || numberCount < 1) {
        alert("Reset Gagal: Password baru harus mengandung minimal 5 huruf dan minimal 1 angka.");
        return;
      }

      data.members[memberIdx].loginCode = newLoginCode;
      saveToStorage(data);
      alert("Sukses! Password Anda telah diperbarui. Silakan login kembali.");
      setIsResetMode(false);
      setNewLoginCode('');
      setMotherNameConfirm('');
    } else {
      alert("Reset Gagal: ID Member atau Nama Lengkap Ibu tidak cocok. Pastikan penulisan sesuai pendaftaran (HURUF KAPITAL).");
    }
  };

  return (
    <div className="max-w-md mx-auto py-16 px-4">
      <div className="bg-slate-800 border border-slate-700 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-sport text-white tracking-wider">
            {isResetMode ? 'PULIHKAN AKSES' : 'MASUK MEMBER'}
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            {isResetMode ? 'Verifikasi Nama Ibu untuk reset password' : 'Akses dashboard KALOUGATA FAMILY'}
          </p>
        </div>

        {!isResetMode ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs text-slate-500 font-bold uppercase tracking-wider">ID Member (Contoh: KLGT-BUDI)</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                <input 
                  required 
                  type="text" 
                  value={memberId} 
                  onChange={(e) => setMemberId(e.target.value.toUpperCase())} 
                  placeholder="ID MEMBER"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all uppercase font-semibold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-500 font-bold uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                <input 
                  required 
                  type={showPassword ? "text" : "password"} 
                  value={loginCode} 
                  onChange={(e) => setLoginCode(e.target.value)} 
                  placeholder="Masukkan Password"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-11 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-amber-500 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <button 
                type="button"
                onClick={() => setIsResetMode(true)}
                className="text-xs text-amber-500/70 hover:text-amber-500 transition-colors underline block ml-auto font-bold"
              >
                Lupa Password?
              </button>
            </div>

            <button className="w-full bg-amber-500 text-slate-900 font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-amber-400 transition-all shadow-lg active:scale-95 uppercase tracking-widest">
              MASUK DASHBOARD <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-start gap-3 mb-4">
               <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
               <p className="text-[10px] text-slate-300 leading-tight">
                 Masukkan Nama Lengkap Ibu persis seperti saat pendaftaran (HURUF KAPITAL SEMUA).
               </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-500 font-bold uppercase tracking-wider">ID Member Anda</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                <input 
                  required 
                  type="text" 
                  value={memberId} 
                  onChange={(e) => setMemberId(e.target.value.toUpperCase())} 
                  placeholder="ID MEMBER"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all uppercase font-semibold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-amber-400 font-bold uppercase tracking-wider">Verifikasi: Nama Lengkap Ibu</label>
              <div className="relative">
                <Heart className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                <input 
                  required 
                  type="text" 
                  value={motherNameConfirm} 
                  onChange={(e) => setMotherNameConfirm(e.target.value.toUpperCase())} 
                  placeholder="NAMA LENGKAP IBU"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all uppercase font-semibold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-500 font-bold uppercase tracking-wider">Password Baru</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                <input 
                  required 
                  type="password" 
                  value={newLoginCode} 
                  onChange={(e) => setNewLoginCode(e.target.value)} 
                  placeholder="Min 5 Huruf + 1 Angka"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                />
              </div>
            </div>

            <button className="w-full bg-emerald-500 text-slate-900 font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-400 transition-all shadow-lg active:scale-95 uppercase tracking-widest">
              GANTI PASSWORD <RefreshCcw className="w-5 h-5" />
            </button>
            <button 
              type="button"
              onClick={() => setIsResetMode(false)}
              className="w-full text-slate-500 text-sm hover:text-white transition-colors font-bold"
            >
              Kembali ke Login
            </button>
          </form>
        )}

        <p className="text-center mt-8 text-slate-500 text-sm">
          Belum menjadi anggota? <Link to="/register" className="text-amber-500 hover:text-amber-400 font-bold underline">Daftar Sekarang</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
