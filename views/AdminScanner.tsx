
import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { loadFromStorage, saveToStorage, generateId } from '../services/storage';
import { Member, PointActivity } from '../types';
import { QrCode, History, Lock, CheckCircle, LogOut, Shield, Eye, EyeOff, Trophy, Zap, Activity, MinusCircle, AlertCircle, Search, User } from 'lucide-react';

const AdminScanner: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activities, setActivities] = useState<PointActivity[]>([]);
  
  // States untuk pencarian manual
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Member[]>([]);
  const [showSearch, setShowSearch] = useState(false);

  // States untuk pengurangan poin
  const [reduceAmount, setReduceAmount] = useState<string>('');
  const [reduceReason, setReduceReason] = useState<string>('');

  useEffect(() => {
    const adminSession = localStorage.getItem('klg_admin_active');
    if (adminSession === 'true') {
      setIsAdmin(true);
    }
  }, []);

  useEffect(() => {
    if (!isAdmin || selectedMember || successMessage || showSearch) return;

    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scanner.render((decodedText) => {
      const data = loadFromStorage();
      const member = data.members.find(m => m.id === decodedText);
      
      if (member) {
        setSelectedMember(member);
        scanner.clear().catch(e => console.error(e));
        if (navigator.vibrate) navigator.vibrate(100);
      } else {
        alert("ID Anggota tidak valid!");
      }
    }, (error) => {});

    setActivities(loadFromStorage().activities.slice(0, 10));

    return () => {
      scanner.clear().catch(e => console.error(e));
    };
  }, [isAdmin, selectedMember, successMessage, showSearch]);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'Kalougatafamily16') {
      setIsAdmin(true);
      localStorage.setItem('klg_admin_active', 'true');
    } else {
      alert("Passcode Admin Salah!");
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('klg_admin_active');
    setIsAdmin(false);
    setPasscode('');
  };

  const handleSearch = (val: string) => {
    setSearchTerm(val);
    if (val.length > 1) {
      const data = loadFromStorage();
      const filtered = data.members.filter(m => 
        m.name.toLowerCase().includes(val.toLowerCase()) || 
        m.id.toLowerCase().includes(val.toLowerCase())
      );
      setSearchResults(filtered.slice(0, 5));
    } else {
      setSearchResults([]);
    }
  };

  const selectMember = (member: Member) => {
    setSelectedMember(member);
    setShowSearch(false);
    setSearchTerm('');
    setSearchResults([]);
  };

  const addPoints = (type: 'minsoc' | 'futsal' | 'bola') => {
    if (!selectedMember) return;

    const pointMap = {
      minsoc: { points: 5, label: 'MINSOC' },
      futsal: { points: 4, label: 'FUTSAL' },
      bola: { points: 3, label: 'BOLA' }
    };

    const config = pointMap[type];
    const data = loadFromStorage();
    const memberIdx = data.members.findIndex(m => m.id === selectedMember.id);

    if (memberIdx !== -1) {
      data.members[memberIdx].points += config.points;
      
      const newActivity: PointActivity = {
        id: generateId(),
        memberId: selectedMember.id,
        points: config.points,
        reason: `Kegiatan ${config.label}`,
        timestamp: new Date().toISOString()
      };

      data.activities.unshift(newActivity);
      saveToStorage(data);
      
      setActivities(data.activities.slice(0, 10));
      setSuccessMessage(`Berhasil menambahkan +${config.points} poin (${config.label}) ke ${selectedMember.name}`);
      
      setTimeout(() => {
        setSuccessMessage(null);
        setSelectedMember(null);
      }, 3000);
    }
  };

  const handleReducePoints = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;
    
    const pointsToSubtract = parseInt(reduceAmount);
    if (isNaN(pointsToSubtract) || pointsToSubtract <= 0) {
      alert("Masukkan jumlah poin yang valid!");
      return;
    }

    if (!reduceReason.trim()) {
      alert("Alasan pengurangan wajib diisi!");
      return;
    }

    const data = loadFromStorage();
    const memberIdx = data.members.findIndex(m => m.id === selectedMember.id);

    if (memberIdx !== -1) {
      data.members[memberIdx].points -= pointsToSubtract;
      
      const newActivity: PointActivity = {
        id: generateId(),
        memberId: selectedMember.id,
        points: -pointsToSubtract,
        reason: `Pengurangan: ${reduceReason}`,
        timestamp: new Date().toISOString()
      };

      data.activities.unshift(newActivity);
      saveToStorage(data);
      
      setActivities(data.activities.slice(0, 10));
      setSuccessMessage(`Poin ${selectedMember.name} dikurangi ${pointsToSubtract} karena: ${reduceReason}`);
      
      setReduceAmount('');
      setReduceReason('');
      
      setTimeout(() => {
        setSuccessMessage(null);
        setSelectedMember(null);
      }, 3000);
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center">
        <div className="bg-slate-800 border border-slate-700 p-8 rounded-3xl shadow-2xl">
          <div className="bg-amber-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-white">Akses Admin KALOUGATA</h2>
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Masukkan Passcode Admin"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-12 focus:outline-none focus:ring-2 focus:ring-amber-500 text-center text-white"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-500 hover:text-amber-500 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <button className="w-full bg-amber-500 text-slate-900 font-bold py-3 rounded-xl hover:bg-amber-400 transition-colors">
              Konfirmasi Admin
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 md:py-24 space-y-8">
      <div className="flex justify-between items-center bg-slate-800 p-4 rounded-2xl border border-slate-700 shadow-lg">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-amber-500" />
          <span className="font-sport text-xl tracking-wider text-white">ADMIN DASHBOARD</span>
        </div>
        <button 
          onClick={handleAdminLogout}
          className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-xl text-sm transition-all border border-red-500/30 font-bold"
        >
          <LogOut className="w-4 h-4" /> LOGOUT ADMIN
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-xl min-h-[400px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2 text-white uppercase font-sport tracking-widest">
                {showSearch ? <Search className="text-amber-500" /> : <QrCode className="text-amber-500" />} 
                {showSearch ? 'PENCARIAN MANUAL' : 'SCAN KEGIATAN'}
              </h2>
              <button 
                onClick={() => setShowSearch(!showSearch)}
                className="text-xs bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded-lg border border-slate-600 transition-all"
              >
                {showSearch ? 'Ganti ke Scan QR' : 'Cari Member Manual'}
              </button>
            </div>
            
            {successMessage ? (
              <div className="bg-emerald-500/10 border border-emerald-500/50 p-8 rounded-2xl text-center space-y-4 animate-in zoom-in duration-300">
                <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto" />
                <p className="text-white font-bold">{successMessage}</p>
                <p className="text-xs text-slate-500">Mereset panel...</p>
              </div>
            ) : selectedMember ? (
              <div className="bg-slate-900 rounded-2xl p-6 border border-amber-500/30 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-4 mb-6">
                  <img src={selectedMember.avatarUrl} className="w-16 h-16 rounded-full border-2 border-amber-500" />
                  <div>
                    <h3 className="text-white font-bold text-lg">{selectedMember.name}</h3>
                    <p className="text-xs text-slate-500 font-mono">{selectedMember.id}</p>
                    <p className="text-amber-500 font-bold text-sm">Poin Saat Ini: {selectedMember.points}</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <p className="text-xs text-slate-400 mb-3 font-bold uppercase tracking-wider">Tambah Poin Kegiatan:</p>
                    <div className="grid grid-cols-3 gap-2">
                      <button onClick={() => addPoints('minsoc')} className="bg-emerald-600 hover:bg-emerald-500 text-white p-3 rounded-xl font-bold transition-all text-sm flex flex-col items-center gap-1">
                        <Zap className="w-4 h-4" /> MINSOC
                        <span className="text-[10px]">+5</span>
                      </button>
                      <button onClick={() => addPoints('futsal')} className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl font-bold transition-all text-sm flex flex-col items-center gap-1">
                        <Activity className="w-4 h-4" /> FUTSAL
                        <span className="text-[10px]">+4</span>
                      </button>
                      <button onClick={() => addPoints('bola')} className="bg-amber-600 hover:bg-amber-500 text-white p-3 rounded-xl font-bold transition-all text-sm flex flex-col items-center gap-1">
                        <Trophy className="w-4 h-4" /> BOLA
                        <span className="text-[10px]">+3</span>
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800">
                    <p className="text-xs text-red-400 mb-3 font-bold uppercase tracking-wider flex items-center gap-2">
                      <MinusCircle className="w-4 h-4" /> Pengurangan Poin:
                    </p>
                    <form onSubmit={handleReducePoints} className="space-y-3">
                      <div className="grid grid-cols-4 gap-2">
                        <input 
                          type="number" 
                          placeholder="Pts" 
                          value={reduceAmount}
                          required
                          onChange={(e) => setReduceAmount(e.target.value)}
                          className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-white text-sm focus:ring-1 focus:ring-red-500 outline-none"
                        />
                        <input 
                          type="text" 
                          placeholder="Alasan (Contoh: Pelanggaran Kode Etik)" 
                          value={reduceReason}
                          required
                          onChange={(e) => setReduceReason(e.target.value)}
                          className="col-span-3 bg-slate-800 border border-slate-700 rounded-lg p-2 text-white text-sm focus:ring-1 focus:ring-red-500 outline-none"
                        />
                      </div>
                      <button type="submit" className="w-full bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-600/30 p-2 rounded-lg text-xs font-bold transition-all uppercase">
                        EKSEKUSI PENGURANGAN POIN
                      </button>
                    </form>
                  </div>

                  <button 
                    onClick={() => setSelectedMember(null)}
                    className="w-full text-slate-500 text-xs hover:text-white transition-colors"
                  >
                    Batal / Kembali ke Menu Utama
                  </button>
                </div>
              </div>
            ) : showSearch ? (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                  <input 
                    type="text"
                    placeholder="Masukkan Nama atau ID Member..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  {searchResults.map((m) => (
                    <button 
                      key={m.id}
                      onClick={() => selectMember(m)}
                      className="w-full flex items-center gap-3 p-3 bg-slate-900/50 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors"
                    >
                      <img src={m.avatarUrl} className="w-10 h-10 rounded-full border border-amber-500/30" />
                      <div className="text-left">
                        <p className="text-sm font-bold text-white">{m.name}</p>
                        <p className="text-[10px] text-slate-500 font-mono uppercase">{m.id}</p>
                      </div>
                      <User className="ml-auto w-4 h-4 text-slate-600" />
                    </button>
                  ))}
                  {searchTerm.length > 1 && searchResults.length === 0 && (
                    <p className="text-center text-slate-500 text-xs py-4">Tidak ada member ditemukan.</p>
                  )}
                </div>
              </div>
            ) : (
              <div id="reader" className="overflow-hidden rounded-2xl border-4 border-amber-500/20 shadow-inner"></div>
            )}
            
            <div className="mt-6 p-4 bg-slate-900 rounded-xl text-xs text-slate-400 flex items-start gap-3">
               <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
               <p>Gunakan tombol "Cari Member Manual" jika anggota lupa membawa ID atau QR Code tidak dapat terbaca.</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-xl h-full">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
              <History className="text-amber-400" /> Log Aktivitas Admin
            </h2>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scroll">
              {activities.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-12">Belum ada aktivitas.</p>
              ) : (
                activities.map((act) => (
                  <div key={act.id} className="bg-slate-900/50 p-4 rounded-xl border border-slate-700 flex justify-between items-center hover:bg-slate-900 transition-colors">
                    <div className="flex-1">
                      <p className={`text-sm font-bold ${act.points < 0 ? 'text-red-400' : 'text-slate-200'}`}>{act.reason}</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">ID: {act.memberId}</p>
                      <p className="text-[10px] text-slate-600 font-mono">{new Date(act.timestamp).toLocaleString()}</p>
                    </div>
                    <div className={`font-sport text-2xl ml-4 ${act.points < 0 ? 'text-red-500' : 'text-amber-400'}`}>
                      {act.points > 0 ? '+' : ''}{act.points}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminScanner;
