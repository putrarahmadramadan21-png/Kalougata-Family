
import React, { useEffect, useState } from 'react';
import { Member } from '../types';
import { loadFromStorage } from '../services/storage';
import { Medal, Trophy, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Leaderboard: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    const data = loadFromStorage();
    const sorted = [...data.members].sort((a, b) => b.points - a.points);
    setMembers(sorted);
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 md:py-24">
      <div className="text-center mb-12">
        <h1 className="font-sport text-5xl text-emerald-400 mb-2">PAPAN PERINGKAT</h1>
        <p className="text-slate-400">Pemain paling aktif dan berkontribusi bulan ini.</p>
      </div>

      <div className="space-y-4">
        {members.length === 0 ? (
          <div className="bg-slate-800 p-12 rounded-3xl text-center border border-slate-700">
            <Trophy className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500">Belum ada member terdaftar.</p>
          </div>
        ) : (
          members.map((member, index) => {
            const isTop3 = index < 3;
            return (
              <Link 
                to={`/profile/${member.id}`} 
                key={member.id}
                className={`flex items-center gap-4 p-4 md:p-6 rounded-2xl transition-all border ${
                  index === 0 ? 'bg-emerald-500/10 border-emerald-500/50 scale-[1.02] shadow-lg shadow-emerald-500/10' : 
                  index === 1 ? 'bg-slate-800/80 border-slate-700 shadow-md' :
                  index === 2 ? 'bg-slate-800/80 border-slate-700 shadow-sm' :
                  'bg-slate-800/30 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="w-10 text-center flex justify-center">
                  {index === 0 ? <Medal className="w-8 h-8 text-yellow-400" /> :
                   index === 1 ? <Medal className="w-7 h-7 text-slate-300" /> :
                   index === 2 ? <Medal className="w-6 h-6 text-amber-600" /> :
                   <span className="text-xl font-sport text-slate-500">{index + 1}</span>}
                </div>

                <img 
                  src={member.avatarUrl} 
                  className={`w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border-2 ${
                    index === 0 ? 'border-yellow-400' : 'border-slate-700'
                  }`} 
                />

                <div className="flex-1">
                  <h3 className="font-bold text-lg md:text-xl flex items-center gap-2">
                    {member.name}
                    {index === 0 && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />}
                  </h3>
                  <p className="text-xs text-slate-500 uppercase font-semibold">{member.position}</p>
                </div>

                <div className="text-right">
                  <div className={`font-sport text-2xl md:text-4xl ${
                    index === 0 ? 'text-emerald-400' : 'text-slate-200'
                  }`}>
                    {member.points}
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">POIN</p>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
