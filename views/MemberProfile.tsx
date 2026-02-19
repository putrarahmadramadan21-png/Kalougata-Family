
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Member, PointActivity } from '../types';
import { loadFromStorage, saveToStorage } from '../services/storage';
import { getCoachTips } from '../services/gemini';
import { QRCodeSVG } from 'qrcode.react';
import { Calendar, Award, BrainCircuit, RefreshCw, Star, Edit3, Save, LogOut, Camera, Cake, History, TrendingUp, TrendingDown, Phone, MessageSquare } from 'lucide-react';

const MemberProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [member, setMember] = useState<Member | null>(null);
  const [activities, setActivities] = useState<PointActivity[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editBio, setEditBio] = useState('');
  const [editPhoto, setEditPhoto] = useState('');
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  
  const [aiTips, setAiTips] = useState<{ tips: string[], motivation: string } | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    const data = loadFromStorage();
    const found = data.members.find(m => m.id === id);
    if (found) {
      setMember(found);
      setEditBio(found.bio);
      setEditPhoto(found.avatarUrl);
      
      // Filter activities for this member
      const memberActivities = data.activities.filter(a => a.memberId === found.id);
      setActivities(memberActivities);
      
      const session = localStorage.getItem('klg_session');
      if (session) {
        const loggedInUser = JSON.parse(session);
        setIsOwnProfile(loggedInUser.id === found.id);
      }
    }
  }, [id]);

  const handleLogout = () => {
    localStorage.removeItem('klg_session');
    navigate('/login');
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfileUpdates = () => {
    if (!member) return;
    const data = loadFromStorage();
    const idx = data.members.findIndex(m => m.id === member.id);
    
    if (idx !== -1) {
      data.members[idx].bio = editBio;
      data.members[idx].avatarUrl = editPhoto;
      saveToStorage(data);
      setMember(data.members[idx]);
      
      localStorage.setItem('klg_session', JSON.stringify(data.members[idx]));
      setIsEditing(false);
      alert("Profil berhasil diperbarui!");
    }
  };

  const fetchAiCoach = async () => {
    if (!member) return;
    setLoadingAi(true);
    const tips = await getCoachTips(member);
    setAiTips(tips);
    setLoadingAi(false);
  };

  if (!member) {
    return (
      <div className="text-center py-24 text-slate-400">
        <p>Anggota tidak ditemukan.</p>
        <button onClick={() => navigate('/login')} className="mt-4 text-amber-500 underline">Silakan Login</button>
      </div>
    );
  }

  // Format link WA
  const waLink = member.phoneNumber ? `https://wa.me/${member.phoneNumber.replace(/^0/, '62')}` : '#';

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 md:py-24 space-y-8">
      <div className="bg-slate-800 border border-slate-700 rounded-3xl overflow-hidden shadow-xl md:flex">
        <div className="md:w-1/3 p-8 flex flex-col items-center text-center border-b md:border-b-0 md:border-r border-slate-700 bg-slate-900/50">
          <div className="relative mb-6 group">
            <img 
              src={isEditing ? editPhoto : member.avatarUrl} 
              alt={member.name} 
              className="w-36 h-36 rounded-full object-cover border-4 border-amber-500 shadow-lg shadow-amber-500/20"
            />
            {isEditing && (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center cursor-pointer"
              >
                <Camera className="text-white w-8 h-8" />
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
              </div>
            )}
            {!isEditing && (
              <div className="absolute -bottom-2 right-0 bg-amber-500 text-slate-900 p-1.5 rounded-full border-2 border-slate-800">
                <Star className="w-4 h-4 fill-slate-900" />
              </div>
            )}
          </div>
          
          <h2 className="text-2xl font-bold mb-1 text-white">{member.name}</h2>
          <span className="bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border border-amber-500/20">
            {member.position}
          </span>

          <div className="bg-white p-3 rounded-xl shadow-inner mb-2">
            <QRCodeSVG value={member.id} size={140} />
          </div>
          <p className="text-[10px] font-mono text-slate-500 mb-6 uppercase tracking-widest">ID: {member.id}</p>
          
          {isOwnProfile && (
            <div className="flex flex-col gap-2 w-full mt-4">
              {!isEditing ? (
                <>
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center justify-center gap-2 w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-all"
                  >
                    <Edit3 className="w-4 h-4" /> Edit Profil
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full py-2 border border-red-500/50 text-red-400 hover:bg-red-500/10 rounded-lg text-sm transition-all"
                  >
                    <LogOut className="w-4 h-4" /> Keluar
                  </button>
                </>
              ) : (
                <button 
                  onClick={saveProfileUpdates}
                  className="flex items-center justify-center gap-2 w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-lg text-sm transition-all"
                >
                  <Save className="w-4 h-4" /> Simpan Perubahan
                </button>
              )}
            </div>
          )}
        </div>

        <div className="md:w-2/3 p-8 space-y-8">
          <section className="flex justify-between items-center">
             <div>
               <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
                 <Award className="w-4 h-4 text-amber-500" /> Prestasi Tahunan
               </h3>
               <div className="text-3xl font-sport text-amber-400 tracking-wider">
                 {member.points} <span className="text-sm font-sans text-slate-500 uppercase">Poin Akumulasi</span>
               </div>
               <p className="text-[9px] text-slate-500 mt-1">*Poin direset otomatis setiap 1 Januari</p>
             </div>
             <div className="text-right">
               <span className="text-xs text-slate-500 block uppercase font-bold">Status</span>
               <span className="text-blue-400 font-sport text-xl">#ANGGOTA_INTI</span>
             </div>
          </section>

          <section>
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">Biodata & Motto</h3>
            {isEditing ? (
              <textarea 
                value={editBio} 
                onChange={(e) => setEditBio(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none h-32"
                placeholder="Tuliskan biodata baru Anda..."
              />
            ) : (
              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                <p className="text-slate-300 italic">"{member.bio || 'Belum ada biodata yang ditambahkan.'}"</p>
              </div>
            )}
          </section>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-700/50">
                <Phone className="w-5 h-5 text-amber-500 mb-2" />
                <p className="text-[10px] text-slate-500 uppercase font-bold">Nomor Handphone</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-white font-semibold">{member.phoneNumber || '-'}</p>
                  {member.phoneNumber && (
                    <a href={waLink} target="_blank" rel="noreferrer" className="text-emerald-500 hover:text-emerald-400 transition-colors">
                      <MessageSquare className="w-4 h-4" />
                    </a>
                  )}
                </div>
             </div>
             <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-700/50">
                <Calendar className="w-5 h-5 text-amber-500 mb-2" />
                <p className="text-[10px] text-slate-500 uppercase font-bold">Anggota Sejak</p>
                <p className="text-sm text-white font-semibold">{new Date(member.joinedAt).toLocaleDateString()}</p>
             </div>
             <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-700/50">
                <Cake className="w-5 h-5 text-amber-500 mb-2" />
                <p className="text-[10px] text-slate-500 uppercase font-bold">Tanggal Lahir</p>
                <p className="text-sm text-white font-semibold">{new Date(member.birthDate).toLocaleDateString()}</p>
             </div>
          </div>

          {/* RIWAYAT AKTIVITAS PUBLIK */}
          <section className="space-y-4">
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <History className="w-4 h-4 text-amber-500" /> Riwayat Aktivitas
            </h3>
            <div className="bg-slate-900/30 rounded-2xl border border-slate-700 overflow-hidden">
              {activities.length === 0 ? (
                <p className="p-8 text-center text-slate-600 text-sm italic">Belum ada catatan aktivitas.</p>
              ) : (
                <div className="divide-y divide-slate-800">
                  {activities.slice(0, 5).map((act) => (
                    <div key={act.id} className="p-4 flex justify-between items-center hover:bg-slate-800/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${act.points > 0 ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                          {act.points > 0 ? <TrendingUp className="w-4 h-4 text-emerald-500" /> : <TrendingDown className="w-4 h-4 text-red-500" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-200">{act.reason}</p>
                          <p className="text-[10px] text-slate-500 uppercase">{new Date(act.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </div>
                      </div>
                      <div className={`font-sport text-xl ${act.points > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {act.points > 0 ? '+' : ''}{act.points}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="bg-amber-950/20 border border-amber-500/20 rounded-2xl p-6 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-4">
                <h3 className="flex items-center gap-2 text-amber-400 font-bold">
                  <BrainCircuit className="w-5 h-5" /> Motivasi Khusus (AI)
                </h3>
                <button 
                  onClick={fetchAiCoach}
                  disabled={loadingAi}
                  className="text-xs bg-amber-500/20 hover:bg-amber-500/40 text-amber-400 px-3 py-1 rounded-lg border border-amber-500/30 flex items-center gap-1 transition-all"
                >
                  <RefreshCw className={`w-3 h-3 ${loadingAi ? 'animate-spin' : ''}`} /> Update
                </button>
              </div>
              {!aiTips ? (
                <p className="text-slate-500 text-sm">Dapatkan pesan inspiratif harian berdasarkan kontribusi Anda.</p>
              ) : (
                <p className="text-sm italic text-amber-100/90 leading-relaxed border-l-2 border-amber-500 pl-4">
                  "{aiTips.motivation}"
                </p>
              )}
            </div>
            <BrainCircuit className="absolute -bottom-4 -right-4 w-24 h-24 text-amber-500/5 rotate-12" />
          </section>
        </div>
      </div>
    </div>
  );
};

export default MemberProfile;
