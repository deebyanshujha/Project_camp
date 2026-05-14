import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ClipboardList, LogOut, Menu, Settings } from 'lucide-react';
import { useAuthStore } from '../store';
import { toast } from 'react-toastify';
import SettingsModal from './SettingsModal';

export default function Navbar({ onMenuClick }) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  return (
    <>
      <nav className="bg-sketch-paper/95 border-b-4 border-sketch-ink shadow-sketch">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuClick}
              className="p-2 bg-white rounded-xl transition sketch-btn"
              aria-label="Toggle menu"
            >
              <Menu size={22} className="text-sketch-ink" />
            </button>
            <Link
              to="/"
              className="flex items-center gap-3 text-2xl font-black text-sketch-ink hover:text-sketch-primary"
            >
              <span className="brand-mark">
                <ClipboardList size={22} />
              </span>
              <span className="font-doodle text-3xl">ProjectCamp</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3">
              <div className="text-right leading-tight">
                <p className="font-black text-sketch-ink">{user?.username}</p>
                <p className="text-xs text-gray-600 capitalize">{user?.role}</p>
              </div>
              <div className="w-11 h-11 rounded-[45%_55%_49%_51%] bg-[#B7F7D0] border-2 border-sketch-ink shadow-sketch-hover flex items-center justify-center text-sketch-ink font-black">
                {user?.username?.[0]?.toUpperCase()}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 bg-white rounded-xl transition sketch-btn"
                title="Settings"
              >
                <Settings size={19} className="text-sketch-ink" />
              </button>
              <button
                onClick={handleLogout}
                className="p-2 bg-[#FFE0DC] rounded-xl transition sketch-btn text-red-700"
                title="Logout"
              >
                <LogOut size={19} />
              </button>
            </div>
          </div>
        </div>
      </nav>
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
}
