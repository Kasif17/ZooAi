import { signInWithPopup } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { auth, googleProvider } from '../../firebase';
import { login } from '../features/login';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import { Folder, Loader2, Menu, Plus, Sparkles, X } from 'lucide-react';
import { getProjects, getStarredProjects } from '../features/project';
import { setProjects } from '../redux/projectSlice';
import ProjectCard from '../components/ProjectCard';
import CreateProjectModal from '../components/CreateProjectModal';
import { motion } from 'motion/react';

/* ── Skeleton card ─────────────────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="rounded-2xl border p-5" style={{ background: 'var(--zoo-surface)', borderColor: 'var(--zoo-border)' }}>
    <div className="zoo-skeleton mb-3 h-9 w-9 rounded-lg" />
    <div className="zoo-skeleton mb-2 h-4 w-3/4 rounded" />
    <div className="zoo-skeleton h-3 w-full rounded" />
    <div className="zoo-skeleton mt-1 h-3 w-2/3 rounded" />
    <div className="mt-4 border-t pt-3" style={{ borderColor: 'var(--zoo-border-2)' }}>
      <div className="zoo-skeleton h-3 w-16 rounded" />
    </div>
  </div>
);

/* ── Login screen ──────────────────────────────────────────────────── */
function LoginScreen({ onLogin, loading }) {
  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4"
      style={{ background: 'var(--zoo-bg)' }}
    >
      {/* Background glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30"
        style={{ background: 'radial-gradient(circle, rgba(79,110,247,0.25) 0%, transparent 70%)' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative w-full max-w-sm"
      >
        {/* Card */}
        <div
          className="overflow-hidden rounded-2xl border p-8 shadow-2xl"
          style={{
            background: 'var(--zoo-surface)',
            borderColor: 'var(--zoo-border)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(79,110,247,0.08)',
          }}
        >
          {/* Top accent */}
          <div
            className="absolute inset-x-0 top-0 h-[1px]"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(79,110,247,0.7), transparent)' }}
          />

          {/* Logo */}
          <div className="mb-6 flex flex-col items-center gap-3">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl border"
              style={{
                background: 'rgba(79,110,247,0.1)',
                borderColor: 'rgba(79,110,247,0.25)',
                boxShadow: '0 0 24px rgba(79,110,247,0.2)',
              }}
            >
              <img src="/ZooAi.png" alt="ZooAi" className="h-8 w-8 object-contain" />
            </div>
            <div className="text-center">
              <h1 className="text-[22px] font-bold tracking-tight" style={{ color: 'var(--zoo-text)' }}>
                Welcome to <span className="zoo-gradient-text">ZooAi</span>
              </h1>
              <p className="mt-1 text-[13px]" style={{ color: 'var(--zoo-text-2)' }}>
                Your AI-powered development workspace
              </p>
            </div>
          </div>

          {/* Sign in button */}
          <button
            onClick={onLogin}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-xl border py-3 text-[14px] font-medium transition-all duration-150 disabled:opacity-60"
            style={{
              background: 'var(--zoo-surface-2)',
              borderColor: 'var(--zoo-border)',
              color: 'var(--zoo-text)',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(79,110,247,0.4)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--zoo-border)'}
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <FcGoogle size={18} />
            )}
            {loading ? 'Signing in...' : 'Continue with Google'}
          </button>

          <p className="mt-5 text-center text-[11px]" style={{ color: 'var(--zoo-text-3)' }}>
            By continuing you agree to our Terms & Privacy Policy.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Dashboard ─────────────────────────────────────────────────────── */
function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [activeSession, setActiveSession] = useState('projects');
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [mobileSideBarOpen, setMobileSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const { userData } = useSelector(state => state.user);
  const { projects } = useSelector(state => state.project);

  const handleLogin = async () => {
    setLoading(true);
    const result = await signInWithPopup(auth, googleProvider);
    const token = await result.user.getIdToken();
    const data = await login(token);
    dispatch(setUserData(data));
    setLoading(false);
  };

  const fetchProjects = async () => {
    setLoadingProjects(true);
    const data = activeSession === 'projects' ? await getProjects() : await getStarredProjects();
    dispatch(setProjects(data));
    setLoadingProjects(false);
  };

  useEffect(() => { fetchProjects(); }, [activeSession, userData]);

  if (!userData) return <LoginScreen onLogin={handleLogin} loading={loading} />;

  const firstName = userData?.name?.split(' ')[0] || 'there';

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden" style={{ background: 'var(--zoo-bg)' }}>
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, rgba(79,110,247,0.3) 0%, transparent 70%)' }}
      />

      <NavBar />

      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        <div className="hidden md:block">
          <SideBar activeSession={activeSession} setActiveSession={setActiveSession} />
        </div>

        {/* Mobile drawer */}
        {mobileSideBarOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div
              onClick={() => setMobileSidebarOpen(false)}
              className="absolute inset-0"
              style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="absolute left-0 top-0 h-full w-72 border-r"
              style={{ background: 'var(--zoo-surface)', borderColor: 'var(--zoo-border)' }}
            >
              <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: 'var(--zoo-border)' }}>
                <span className="text-[13px] font-semibold" style={{ color: 'var(--zoo-text)' }}>Navigation</span>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg"
                  style={{ color: 'var(--zoo-text-2)' }}
                  aria-label="Close menu"
                >
                  <X size={16} />
                </button>
              </div>
              <SideBar activeSession={activeSession} setActiveSession={setActiveSession} />
            </motion.div>
          </div>
        )}

        {/* Main content */}
        <main className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-7 sm:py-7 lg:px-10 lg:py-8">

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="mb-5 flex items-center gap-2 rounded-lg border px-3 py-2 text-[12.5px] font-medium transition-colors md:hidden"
            style={{ background: 'var(--zoo-surface)', borderColor: 'var(--zoo-border)', color: 'var(--zoo-text-2)' }}
          >
            <Menu size={14} />
            Menu
          </button>

          {/* Welcome header */}
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-[24px] font-bold tracking-tight" style={{ color: 'var(--zoo-text)' }}>
                Hey, {firstName} 👋
              </h1>
              <p className="mt-1 text-[13px]" style={{ color: 'var(--zoo-text-2)' }}>
                {activeSession === 'starred' ? 'Your starred projects' : 'Your AI development workspace'}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setOpenModal(true)}
              className="zoo-btn-primary flex w-full shrink-0 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-semibold text-white sm:w-auto"
            >
              <Plus size={15} />
              New Project
            </motion.button>
          </div>

          {/* Section title */}
          <div className="mb-4 flex items-center gap-2">
            <h2 className="text-[14px] font-semibold" style={{ color: 'var(--zoo-text)' }}>
              {activeSession === 'starred' ? 'Starred Projects' : 'Recent Projects'}
            </h2>
            {!loadingProjects && projects?.length > 0 && (
              <span
                className="rounded-full px-2 py-0.5 text-[11px] font-medium"
                style={{ background: 'rgba(79,110,247,0.12)', color: '#7c9bff' }}
              >
                {projects.length}
              </span>
            )}
          </div>

          {/* Projects grid */}
          {loadingProjects ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : projects?.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-16 text-center"
              style={{ borderColor: 'var(--zoo-border)', background: 'var(--zoo-surface)' }}
            >
              <div
                className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border"
                style={{ background: 'rgba(79,110,247,0.08)', borderColor: 'rgba(79,110,247,0.2)', color: '#7c9bff' }}
              >
                {activeSession === 'starred' ? <Sparkles size={22} /> : <Folder size={22} />}
              </div>
              <h3 className="mb-1.5 text-[15px] font-semibold" style={{ color: 'var(--zoo-text)' }}>
                {activeSession === 'starred' ? 'No starred projects' : 'No projects yet'}
              </h3>
              <p className="mb-5 max-w-xs text-[13px]" style={{ color: 'var(--zoo-text-2)' }}>
                {activeSession === 'starred'
                  ? 'Star a project to pin it here for quick access.'
                  : 'Create your first project and start building with ZooAi.'}
              </p>
              {activeSession === 'projects' && (
                <button
                  onClick={() => setOpenModal(true)}
                  className="zoo-btn-primary flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-semibold text-white"
                >
                  <Plus size={14} />
                  Create Project
                </button>
              )}
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
              {projects.map(p => <ProjectCard key={p._id} project={p} />)}
            </div>
          )}
        </main>
      </div>

      {openModal && <CreateProjectModal open={openModal} onClose={() => setOpenModal(false)} />}
    </div>
  );
}

export default Dashboard;
