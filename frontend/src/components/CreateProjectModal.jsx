import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Sparkles } from 'lucide-react';
import { createProject } from '../features/project';
import { useDispatch } from 'react-redux';
import { addNewProject } from '../redux/projectSlice';
import { createRootFolder } from '../features/file';

function CreateProjectModal({ onClose }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleCreate = async () => {
    if (!name.trim()) return;
    setLoading(true);
    const data = await createProject({ name, description });
    await createRootFolder({ projectId: data._id, projectName: data.name });
    dispatch(addNewProject(data));
    setLoading(false);
    onClose();
  };

  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) handleCreate(); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.97 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md overflow-hidden rounded-2xl border shadow-2xl"
        style={{
          background: 'var(--zoo-surface)',
          borderColor: 'var(--zoo-border)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(79,110,247,0.1)',
        }}
      >
        {/* Top accent line */}
        <div
          className="absolute inset-x-0 top-0 h-[1px]"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(79,110,247,0.6), transparent)' }}
        />

        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-5" style={{ borderColor: 'var(--zoo-border)' }}>
          <div className="flex items-center gap-3">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ background: 'rgba(79,110,247,0.15)', color: '#7c9bff' }}
            >
              <Sparkles size={15} />
            </div>
            <div>
              <h2 className="text-[15px] font-semibold" style={{ color: 'var(--zoo-text)' }}>New Project</h2>
              <p className="text-[12px]" style={{ color: 'var(--zoo-text-3)' }}>Set up your workspace in seconds</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
            style={{ color: 'var(--zoo-text-3)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--zoo-surface-2)'; e.currentTarget.style.color = 'var(--zoo-text)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--zoo-text-3)'; }}
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5 px-6 py-5">
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--zoo-text-3)' }}>
              Project Name
            </label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={handleKey}
              placeholder="my-awesome-project"
              autoFocus
              className="zoo-input w-full px-4 py-2.5 text-[14px]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--zoo-text-3)' }}>
              Description <span style={{ color: 'var(--zoo-text-3)', fontWeight: 400 }}>(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              placeholder="What are you building?"
              className="zoo-input w-full resize-none px-4 py-2.5 text-[14px]"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2.5 border-t px-6 py-4" style={{ borderColor: 'var(--zoo-border)' }}>
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-[13px] font-medium transition-colors"
            style={{ color: 'var(--zoo-text-2)', background: 'var(--zoo-surface-2)', border: '1px solid var(--zoo-border)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--zoo-text)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--zoo-text-2)'}
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={loading || !name.trim()}
            className="zoo-btn-primary rounded-lg px-5 py-2 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default CreateProjectModal;
