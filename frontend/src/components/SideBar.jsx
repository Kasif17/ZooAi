import React from 'react';
import { motion } from 'motion/react';
import { Coins, Folder, Star, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const NavItem = ({ icon: Icon, label, active, onClick }) => (
  <motion.button
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    className={`relative flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors duration-150 ${active ? 'zoo-nav-active' : ''}`}
    style={active ? {} : { color: 'var(--zoo-text-2)' }}
    onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--zoo-surface-2)'; }}
    onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
    aria-current={active ? 'page' : undefined}
  >
    <Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
    <span>{label}</span>
  </motion.button>
);

function SideBar({ activeSession, setActiveSession }) {
  const navigate = useNavigate();
  const { userData } = useSelector(state => state.user);

  return (
    <aside
      className="flex h-full w-60 shrink-0 flex-col border-r px-3 py-4"
      style={{ background: 'var(--zoo-surface)', borderColor: 'var(--zoo-border)' }}
    >
      {/* Section label */}
      <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--zoo-text-3)' }}>
        Workspace
      </p>

      <nav className="flex flex-col gap-0.5">
        <NavItem
          icon={Folder}
          label="Projects"
          active={activeSession === 'projects'}
          onClick={() => setActiveSession('projects')}
        />
        <NavItem
          icon={Star}
          label="Starred"
          active={activeSession === 'starred'}
          onClick={() => setActiveSession('starred')}
        />
      </nav>

      <div className="my-4 h-px" style={{ background: 'var(--zoo-border)' }} />

      {/* Credits card */}
      <div
        className="rounded-xl border p-3.5"
        style={{ background: 'var(--zoo-surface-2)', borderColor: 'var(--zoo-border)' }}
      >
        <div className="mb-1 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="flex h-6 w-6 items-center justify-center rounded-md"
              style={{ background: 'rgba(79,110,247,0.15)', color: '#7c9bff' }}
            >
              <Coins size={13} />
            </div>
            <span className="text-[12px] font-medium" style={{ color: 'var(--zoo-text-2)' }}>AI Credits</span>
          </div>
          <span className="text-[15px] font-bold" style={{ color: 'var(--zoo-text)' }}>
            {userData?.credits ?? 0}
          </span>
        </div>
        <div
          className="mt-2 h-1.5 w-full overflow-hidden rounded-full"
          style={{ background: 'var(--zoo-border)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(100, ((userData?.credits ?? 0) / 100) * 100)}%`,
              background: 'linear-gradient(90deg, #4f6ef7, #7c5cfc)',
            }}
          />
        </div>
      </div>

      <div className="mt-3">
        <motion.button
          onClick={() => navigate('/plan')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="zoo-btn-primary flex w-full items-center justify-center gap-1.5 rounded-lg py-2.5 text-[12.5px] font-semibold text-white"
        >
          <Zap size={13} fill="currentColor" />
          Upgrade Plan
        </motion.button>
      </div>
    </aside>
  );
}

export default SideBar;
