import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Star, Trash2 } from 'lucide-react';
import { deleteProject, toggleStar } from '../features/project';
import { useDispatch } from 'react-redux';
import { setDeleteProject, starProject } from '../redux/projectSlice';
import { useNavigate } from 'react-router-dom';

const TYPE_COLORS = {
  js: '#f7df1e', ts: '#3178c6', py: '#3572a5', html: '#e34c26',
  css: '#563d7c', jsx: '#61dafb', tsx: '#3178c6',
};

function getProjectAccent(name = '') {
  const colors = ['#4f6ef7', '#7c5cfc', '#34d399', '#f59e0b', '#f87171', '#06b6d4'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function ProjectCard({ project }) {
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accent = getProjectAccent(project?.name);

  const handleToggleStar = async (e) => {
    e.stopPropagation();
    await toggleStar(project?._id);
    dispatch(starProject(project?._id));
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    setLoadingDelete(true);
    await deleteProject(project?._id);
    dispatch(setDeleteProject(project?._id));
    setLoadingDelete(false);
  };

  const updatedAt = project?.updatedAt
    ? new Date(project.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      onClick={() => navigate(`/project/${project?._id}`)}
      className="zoo-card group relative flex cursor-pointer flex-col p-5"
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && navigate(`/project/${project?._id}`)}
      aria-label={`Open project ${project?.name}`}
    >
      {/* Accent top bar */}
      <div
        className="absolute inset-x-0 top-0 h-[2px] rounded-t-[16px] opacity-60 transition-opacity duration-200 group-hover:opacity-100"
        style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
      />

      {/* Star */}
      <button
        onClick={handleToggleStar}
        aria-label={project?.starred ? 'Unstar project' : 'Star project'}
        className={`absolute right-4 top-4 rounded-md p-1 transition-all duration-150 ${
          project?.starred ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
        style={{ color: project?.starred ? '#fbbf24' : 'var(--zoo-text-3)' }}
        onMouseEnter={e => e.currentTarget.style.color = '#fbbf24'}
        onMouseLeave={e => { if (!project?.starred) e.currentTarget.style.color = 'var(--zoo-text-3)'; }}
      >
        <Star size={14} fill={project?.starred ? 'currentColor' : 'none'} />
      </button>

      {/* Project icon */}
      <div
        className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg text-[13px] font-bold text-white"
        style={{ background: `${accent}22`, color: accent, border: `1px solid ${accent}33` }}
      >
        {(project?.name?.[0] || 'P').toUpperCase()}
      </div>

      <h3
        className="mb-1 truncate pr-6 text-[14px] font-semibold"
        style={{ color: 'var(--zoo-text)' }}
      >
        {project?.name}
      </h3>
      <p
        className="line-clamp-2 min-h-[2.5em] text-[12px] leading-relaxed"
        style={{ color: 'var(--zoo-text-2)' }}
      >
        {project?.description || 'No description'}
      </p>

      <div
        className="mt-4 flex items-center justify-between border-t pt-3"
        style={{ borderColor: 'var(--zoo-border-2)' }}
        onClick={e => e.stopPropagation()}
      >
        {updatedAt && (
          <span className="text-[11px]" style={{ color: 'var(--zoo-text-3)' }}>
            {updatedAt}
          </span>
        )}
        <div className="ml-auto">
          {confirmDelete ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
              <button
                onClick={e => { e.stopPropagation(); setConfirmDelete(false); }}
                className="rounded-md px-2 py-1 text-[11px] transition-colors"
                style={{ color: 'var(--zoo-text-3)' }}
              >
                Cancel
              </button>
              <button
                disabled={loadingDelete}
                onClick={handleDelete}
                className="rounded-md px-2 py-1 text-[11px] font-medium transition-colors disabled:opacity-50"
                style={{ background: 'rgba(248,113,113,0.12)', color: 'var(--zoo-danger)' }}
              >
                {loadingDelete ? '...' : 'Delete'}
              </button>
            </motion.div>
          ) : (
            <button
              onClick={e => { e.stopPropagation(); setConfirmDelete(true); }}
              className="rounded-md p-1.5 opacity-0 transition-all duration-150 group-hover:opacity-100"
              style={{ color: 'var(--zoo-text-3)' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--zoo-danger)'; e.currentTarget.style.background = 'rgba(248,113,113,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--zoo-text-3)'; e.currentTarget.style.background = 'transparent'; }}
              aria-label="Delete project"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default ProjectCard;
