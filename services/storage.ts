
import { Member, PointActivity } from '../types';

const STORAGE_KEY = 'bolacomm_data';

interface StorageData {
  members: Member[];
  activities: PointActivity[];
  lastResetYear: number;
}

export const saveToStorage = (data: StorageData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const loadFromStorage = (): StorageData => {
  const data = localStorage.getItem(STORAGE_KEY);
  const currentYear = new Date().getFullYear();

  if (!data) {
    return { members: [], activities: [], lastResetYear: currentYear };
  }

  const parsedData: StorageData = JSON.parse(data);

  // LOGIKA RESET TAHUNAN
  // Jika tahun saat ini lebih besar dari tahun reset terakhir yang tersimpan
  if (parsedData.lastResetYear < currentYear) {
    const updatedMembers = parsedData.members.map(member => ({
      ...member,
      points: 0 // Reset poin ke nol
    }));

    const resetData = {
      ...parsedData,
      members: updatedMembers,
      lastResetYear: currentYear,
      // Opsional: kita bisa membersihkan riwayat lama atau membiarkannya sebagai arsip
      activities: [] 
    };

    saveToStorage(resetData);
    return resetData;
  }

  return parsedData;
};

export const generateId = () => Math.random().toString(36).substr(2, 9).toUpperCase();
