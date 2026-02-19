
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Member, PointActivity } from '../types';
import { loadFromStorage, saveToStorage } from '../services/storage';
import { getCoachTips } from '../services/gemini';
import { QRCodeSVG } from 'qrcode.react';
import { Calendar, Award, BrainCircuit, RefreshCw, Star, Edit3, Save, LogOut, Camera, Cake, History, TrendingUp, TrendingDown, Phone, MessageSquare, Share2, MessageCircle } from 'lucide-react';

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

  const handleShareProfile = async () => {
    if (!member) return;
    
    // Sangat penting: gunakan window.location.href secara utuh
    const profileUrl = window.location.href;
    const shareText = `*PROFIL ANGGOTA KALOUGATA*\n\nNama: ${member.name}\nID: ${member.id}\nPoin: ${member.points}\n\nLihat profil lengkap di sini:\n${profileUrl}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `Profil ${member.name}`,
          text: `Cek badge digital ${member.name} di Kalougata Family.`,
          url: profileUrl
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

  const waLink = member.phoneNumber ? `https://wa.me/${member.phoneNumber.replace(/^0/, '62')}` : '#';

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 md:py-24 space-y-8 animate-in fade-in duration-700">
      <div className="bg-slate-800 border border-slate-700 rounded-[2.5rem] overflow-hidden shadow-2xl md:flex">
        <div className="md:w-1/3 p-10 flex flex-col items-center text-center border-b md:border-b-0 md:border-r border-slate-700 bg-slate-900/50">
          <div className="relative mb-8 group">
            <img 
              src={isEditing ? editPhoto : member.avatarUrl} 
              alt={member.name} 
              className="w-40 h-40 rounded-full object-cover border-4 border-amber-500 shadow-2xl shadow-amber-500/20"
            />
            {isEditing && (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center cursor-pointer backdrop-blur-sm"
              >
                <Camera className="text-white w-8 h-8" />
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
              </div>
            )}
            {!isEditing && (
              <div className="absolute -bottom-2 right-2 bg-amber-500 text-slate-900 p-2 rounded-full border-4 border-slate-800 shadow-lg">
                <Star className="w-5 h-5 fill-slate-900" />
              </div>
            )}
          </div>
          
          <h2 className="text-3xl font-bold mb-1 text-white uppercase tracking-tight">{member.name}</h2>
          <span className="bg-amber-500/10 text-amber-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-8 border border-amber-500/20">
            {member.position}
          </span>

          <div className="bg-white p-4 rounded-3xl shadow-2xl mb-4 transform hover:rotate-1 transition-transform">
            <QRCodeSVG value={member.id} size={160} />
          </div>
          <p className="text-[10px] font-mono text-slate-500 mb-8 uppercase tracking-widest bg-slate-800 px-3 py-1 rounded-full">ID: {member.id}</p>
          
          <div className="flex flex-col gap-3 w-full mt-auto">
            {!isEditing ? (
              <>
                <button 
                  onClick={handleShareProfile}
                  className="flex items-center justify-center gap-2 w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl text-sm transition-all shadow-xl shadow-emerald-500/20 active:scale-95 uppercase"
                >
                  <MessageCircle className="w-5 h-5" /> BAGIKAN PROFIL
                </button>
                {isOwnProfile && (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-2xl text-sm transition-all active:scale-95"
                  >
                    <Edit3 className="w-4 h-4" /> Edit Bio
                  </button>
                )}
              </>
            ) : (
              <button 
                onClick={saveProfileUpdates}
                className="flex items-center justify-center gap-2 w-full py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-black rounded-2xl text-sm transition-all shadow-xl active:scale-95 uppercase"
              >
                <Save className="w-5 h-5" /> SIMPAN PERUBAHAN
              </button>
            )}
            
            {isOwnProfile && !isEditing && (
              <button 
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full py-2 text-slate-500 hover:text-red-400 text-xs font-bold transition-all mt-2"
              >
                <LogOut className="w-3 h-3" /> Keluar Sesi
              </button>
            )}
          </div>
        </div>

        <div className="md:w-2/3 p-10 space-y-10">
          <section className="flex justify-between items-end border-b border-slate-700 pb-8">
             <div>
               <h3 className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                 <Award className="w-4 h-4 text-amber-500" /> TOTAL POIN AKTIF
               </h3>
               <div className="text-6xl font-sport text-amber-400 tracking-wider">
                 {member.points}
               </div>
             </div>
             <div className="text-right">
               <span className="text-[10px] text-slate-500 block uppercase font-black mb-1">Peringkat Skuad</span>
               <span className="text-blue-400 font-sport text-3xl">#ANGGOTA_INTI</span>
             </div>
          </section>

          <section>
            <h3 className="text-slate-500 text-xs font-black uppercase tracking-widest mb-4">Biodata & Motto</h3>
            {isEditing ? (
              <textarea 
                value={editBio} 
                onChange={(e) => setEditBio(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none h-32 text-sm leading-relaxed"
                placeholder="Tuliskan biodata baru Anda..."
              />
            ) : (
              <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                <p className="text-slate-300 italic text-lg leading-relaxed">"{member.bio || 'Belum ada biodata.'}"</p>
              </div>
            )}
          </section>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
             <div className="bg-slate-900/40 p-5 rounded-3xl border border-slate-700/50">
                <Phone className="w-5 h-5 text-amber-500 mb-3" />
                <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Handphone</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-white font-bold">{member.phoneNumber || '-'}</p>
                  {member.phoneNumber && (
                    <a href={waLink} target="_blank" rel="noreferrer" className="text-emerald-500 hover:bg-emerald-500/10 p-1.5 rounded-lg transition-all">
                      <MessageSquare className="w-5 h-5" />
                    </a>
                  )}
                </div>
             </div>
             <div className="bg-slate-900/40 p-5 rounded-3xl border border-slate-700/50">
                <Calendar className="w-5 h-5 text-amber-500 mb-3" />
                <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Member Sejak</p>
                <p className="text-sm text-white font-bold">{new Date(member.joinedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
             </div>
             <div className="bg-slate-900/40 p-5 rounded-3xl border border-slate-700/50">
                <Cake className="w-5 h-5 text-amber-500 mb-3" />
                <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Ulang Tahun</p>
                <p className="text-sm text-white font-bold">{new Date(member.birthDate).toLocaleDateString('id-ID', { month: 'long', day: 'numeric' })}</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberProfile;
