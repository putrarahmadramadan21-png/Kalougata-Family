
export enum PlayerPosition {
  GK = 'Goalkeeper',
  DF = 'Defender',
  MF = 'Anggota Aktif',
  FW = 'Forward'
}

export interface Member {
  id: string;
  name: string;
  motherName: string; // Nama Lengkap Ibu untuk verifikasi reset password
  phoneNumber: string; // Nomor Handphone anggota
  position: PlayerPosition;
  points: number;
  joinedAt: string;
  avatarUrl: string;
  bio: string;
  loginCode: string; 
  birthDate: string; 
}

export interface PointActivity {
  id: string;
  memberId: string;
  points: number;
  reason: string;
  timestamp: string;
}

export interface AppState {
  members: Member[];
  activities: PointActivity[];
  currentUser: Member | null;
}
