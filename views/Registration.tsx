
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayerPosition, Member } from '../types';
import { loadFromStorage, saveToStorage } from '../services/storage';
import { User, Shield, Save, Camera, Upload, Lock, Calendar, Eye, EyeOff, Heart, AlertCircle, Phone } from 'lucide-react';

const Registration: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [name, setName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loginCode, setLoginCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [birthDate, setBirthDate] = useState('');
  const [bio, setBio] = useState('');
  const [avatarBase64, setAvatarBase64] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1.5 * 1024 * 1024) {
        alert("Pendaftaran Gagal: Ukuran foto profil terlalu besar. Harap gunakan foto di bawah 1.5MB agar aplikasi tetap lancar untuk 500+ anggota.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi Detail Alasan Gagal
    if (!name.trim()) {
      alert("Pendaftaran Gagal: Nama Lengkap tidak boleh kosong.");
      return;
    }
    
    if (!motherName.trim()) {
      alert("Pendaftaran Gagal: Nama Lengkap Ibu wajib diisi. Data ini digunakan untuk keamanan reset password.");
      return;
    }

    if (!phoneNumber.trim()) {
      alert("Pendaftaran Gagal: Nomor Handphone wajib diisi untuk koordinasi komunitas.");
      return;
    }

    if (!birthDate) {
      alert("Pendaftaran Gagal: Tanggal Lahir harus dipilih.");
      return;
    }

    if (!loginCode.trim()) {
      alert("Pendaftaran Gagal: Kode Akses/Password tidak boleh kosong.");
      return;
    }

    const currentData = loadFromStorage();
    
    // Cek Nama Duplikat
    const isNameExists = currentData.members.some(m => m.name.trim().toUpperCase() === name.trim().toUpperCase());
    if (isNameExists) {
      alert(`Pendaftaran Gagal: Nama "${name.toUpperCase()}" sudah terdaftar. Tambahkan inisial unik agar tidak tertukar.`);
      return;
    }

    // Validasi Keamanan Password
    const letterCount = (loginCode.match(/[a-zA-Z]/g) || []).length;
    const numberCount = (loginCode.match(/[0-9]/g) || []).length;
    
    if (letterCount < 5) {
      alert("Pendaftaran Gagal: Password minimal harus mengandung 5 huruf (A-Z).");
      return;
    }
    if (numberCount < 1) {
      alert("Pendaftaran Gagal: Password wajib mengandung minimal 1 angka.");
      return;
    }

    const sanitizedId = name.trim().toUpperCase().replace(/\s+/g, '');
    const memberId = `KLGT-${sanitizedId}`;

    // Pastikan ID unik
    const isIdExists = currentData.members.some(m => m.id === memberId);
    const finalId = isIdExists ? `${memberId}-${Math.floor(Math.random() * 1000)}` : memberId;

    const newMember: Member = {
      id: finalId,
      name: name.toUpperCase().trim(),
      motherName: motherName.toUpperCase().trim(),
      phoneNumber: phoneNumber.trim(),
      position: PlayerPosition.MF,
      points: 0,
      joinedAt: new Date().toISOString(),
      avatarUrl: avatarBase64 || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      bio: bio.trim(),
      loginCode,
      birthDate,
    };

    try {
      currentData.members.push(newMember);
      saveToStorage(currentData);

      localStorage.setItem('klg_session', JSON.stringify(newMember));
      alert(`PENDAFTARAN BERHASIL!\n\nID MEMBER ANDA: ${finalId}\n\nGunakan ID ini untuk masuk.`);
      navigate(`/profile/${newMember.id}`);
    } catch (err) {
      alert("Pendaftaran Gagal: Masalah teknis. Kurangi ukuran foto Anda.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 md:py-16">
      <div className="bg-slate-800 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">
        <div className="bg-amber-600 px-8 py-6 text-center">
          <h2 className="font-sport text-3xl text-white tracking-wide uppercase">REGISTRASI ANGGOTA</h2>
          <p className="text-amber-100 text-sm">Gabung dalam basis data 500+ keluarga KALOUGATA.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="flex flex-col items-center gap-4 mb-4">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-32 h-32 rounded-full bg-slate-900 border-2 border-dashed border-slate-700 flex items-center justify-center overflow-hidden cursor-pointer hover:border-amber-500 transition-all relative group"
            >
              {avatarBase64 ? (
                <img src={avatarBase64} className="w-full h-full object-cover" />
              ) : (
                <Camera className="w-8 h-8 text-slate-600 group-hover:text-amber-500" />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Upload className="text-white w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Foto Profil (Max 1.5MB)</p>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400 block uppercase tracking-wider">Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                <input 
                  required 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value.toUpperCase())} 
                  placeholder="NAMA LENGKAP" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-amber-500 text-white uppercase font-semibold" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400 block text-amber-400 uppercase tracking-wider">Nama Lengkap Ibu</label>
              <div className="relative">
                <Heart className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                <input 
                  required 
                  type="text" 
                  value={motherName} 
                  onChange={(e) => setMotherName(e.target.value.toUpperCase())} 
                  placeholder="NAMA LENGKAP IBU" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-amber-500 text-white uppercase font-semibold" 
                />
              </div>
              <p className="text-[10px] text-slate-500 italic">*Penting: Untuk kunci pemulihan password.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400 block uppercase tracking-wider">Nomor Handphone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                <input 
                  required 
                  type="tel" 
                  value={phoneNumber} 
                  onChange={(e) => setPhoneNumber(e.target.value)} 
                  placeholder="0812XXXXXXXX" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-amber-500 text-white font-semibold" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400 block uppercase tracking-wider">Tanggal Lahir</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                <input required type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-amber-500 text-white" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-400 block uppercase tracking-wider">Password (Minimal 5 Huruf + 1 Angka)</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
              <input 
                required 
                type={showPassword ? "text" : "password"} 
                value={loginCode} 
                onChange={(e) => setLoginCode(e.target.value)} 
                placeholder="Password Rahasia" 
                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-11 pr-12 focus:outline-none focus:ring-2 focus:ring-amber-500 text-white" 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-500 hover:text-amber-500 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-400 block uppercase tracking-wider">Bio Singkat</label>
            <textarea rows={2} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Motto hidup Anda..." className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-amber-500 text-white resize-none" />
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-start gap-3">
             <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
             <p className="text-xs text-slate-300 leading-relaxed">
               Pastikan <strong>Nama Lengkap Ibu</strong> diingat dengan benar (HURUF KAPITAL) karena merupakan satu-satunya cara mereset password secara mandiri.
             </p>
          </div>

          <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 uppercase tracking-widest">
            <Save className="w-5 h-5" /> KONFIRMASI PENDAFTARAN
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registration;
