
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './views/Home';
import Registration from './views/Registration';
import Leaderboard from './views/Leaderboard';
import MemberProfile from './views/MemberProfile';
import MembersList from './views/MembersList';
import AdminScanner from './views/AdminScanner';
import Login from './views/Login';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen pb-20 md:pb-0 md:pt-4">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/members" element={<MembersList />} />
            <Route path="/profile/:id" element={<MemberProfile />} />
            <Route path="/scan" element={<AdminScanner />} />
          </Routes>
        </main>
      </div>
      
      {/* Background blobs for aesthetics */}
      <div className="fixed top-0 left-0 w-full h-full -z-50 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]"></div>
      </div>
    </Router>
  );
};

export default App;
