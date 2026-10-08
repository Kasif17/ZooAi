import { ChevronDown, LogOut, Moon, Sun } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/logout';
import { setUserData } from '../redux/userSlice';

function NavBar() {
  const [isDark, setIsDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const dispatch = useDispatch();
  const { userData } = useSelector(state => state.user);
  const name = userData?.name || 'Guest';
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const handleLogout = async () => {
    await logout();
    dispatch(setUserData(null));
  };

  useEffect(() => {
    const theme = window.localStorage.getItem('theme');
    const dark = theme ? theme === 'dark' : true;
    document.documentElement.classList.toggle('dark', dark);
    setIsDark(dark);
  }, []);

  useEffect(() => {
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    window.localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return (
    <header
      className="relative z-30 flex h-14 shrink-0 items-center gap-4 border-b px-5"
      style={{ background: 'var(--zoo-surface)', borderColor: 'var(--zoo-border)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 shrink-0">
        <img src="/ZooAi.png" alt="ZooAi" className="h-7 w-7 rounded-lg object-contain" />
        <span className="font-bold text-[16px] tracking-tight" style={{ color: 'var(--zoo-text)' }}>
          Zoo<span className="zoo-gradient-text">Ai</span>
        </span>
      </div>

      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-150"
          style={{ color: 'var(--zoo-text-2)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--zoo-surface-2)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(p => !p)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors duration-150"
            style={{ color: 'var(--zoo-text)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--zoo-surface-2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            aria-label="User menu"
            aria-expanded={menuOpen}
          >
            <div
              className="flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #4f6ef7, #7c5cfc)' }}
            >
              {initials}
            </div>
            <span className="hidden text-[13px] font-medium sm:inline" style={{ color: 'var(--zoo-text)' }}>
              {name.split(' ')[0]}
            </span>
            <ChevronDown
              size={13}
              className={`transition-transform duration-150 ${menuOpen ? 'rotate-180' : ''}`}
              style={{ color: 'var(--zoo-text-3)' }}
            />
          </button>

          {menuOpen && (
            <div
              className="zoo-fade-up absolute right-0 mt-1.5 w-52 overflow-hidden rounded-xl border py-1 shadow-2xl"
              style={{ background: 'var(--zoo-surface)', borderColor: 'var(--zoo-border)', boxShadow: '0 16px 48px rgba(0,0,0,0.4)' }}
            >
              <div className="flex items-center gap-2.5 border-b px-3.5 py-3" style={{ borderColor: 'var(--zoo-border)' }}>
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #4f6ef7, #7c5cfc)' }}
                >
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium" style={{ color: 'var(--zoo-text)' }}>{name}</p>
                  <p className="truncate text-[11px]" style={{ color: 'var(--zoo-text-3)' }}>{userData?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-[13px] transition-colors duration-150"
                style={{ color: 'var(--zoo-danger)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,113,113,0.08)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <LogOut size={14} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default NavBar;
