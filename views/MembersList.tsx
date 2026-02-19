
import React, { useEffect, useState } from 'react';
import { Member } from '../types';
import { loadFromStorage } from '../services/storage';
import { Search, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const MembersList: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const data = loadFromStorage();
    setMembers(data.members);
  }, []);

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 md:py-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="font-sport text-4xl mb-1">SKUAD KOMUNITAS</h1>
          <p className="text-slate-400">Direktori seluruh pemain terdaftar.</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
          <input 
            type="text" 
            placeholder="Cari nama atau ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-80 bg-slate-800 border border-slate-700 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {filteredMembers.map((member) => (
          <Link 
            to={`/profile/${member.id}`} 
            key={member.id}
            className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 md:p-6 flex flex-col items-center text-center group hover:bg-slate-800 hover:border-emerald-500/50 transition-all shadow-xl"
          >
            <div className="relative mb-4">
              <img 
                src={member.avatarUrl} 
                className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-2 border-slate-700 group-hover:border-emerald-500 transition-colors" 
              />
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                {member.points} pts
              </div>
            </div>
            <h3 className="font-bold text-sm md:text-base line-clamp-1 mb-1">{member.name}</h3>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{member.position}</p>
            <p className="text-[9px] text-slate-600 mt-2 font-mono">{member.id}</p>
          </Link>
        ))}

        {filteredMembers.length === 0 && (
          <div className="col-span-full py-24 text-center">
             <User className="w-12 h-12 text-slate-700 mx-auto mb-4" />
             <p className="text-slate-500">Pemain tidak ditemukan.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MembersList;
