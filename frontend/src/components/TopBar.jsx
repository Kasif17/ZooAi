import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'motion/react';
import { Code2, Eye, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function TopBar({ showPreview, setShowPreview }) {
  const { currentProject } = useSelector(state => state.project);
  const navigate = useNavigate();

  return (
    <header
      className="relative z-20 flex h-12 shrink-0 items-center justify-between border-b px-4"
      style={{ background: 'var(--zoo-surface)', borderColor: 'var(--zoo-border)' }}
    >
      {/* Left: breadcrumb */}
      <div className="flex items-center gap-2 min-w-0">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 shrink-0"
          aria-label="Go to dashboard"
        >
          <img src="/ZooAi.png" alt="ZooAi" className="h-5 w-5 rounded object-contain" />
          <span className="hidden text-[13px] font-bold sm:inline" style={{ color: 'var(--zoo-text)' }}>
            Zoo<span className="zoo-gradient-text">Ai</span>
          </span>
        </button>

        <ChevronRight size={13} style={{ color: 'var(--zoo-text-3)' }} />

        <div className="flex min-w-0 items-center gap-1.5">
          <span className="text-base">📁</span>
          <span className="max-w-[180px] truncate text-[13px] font-medium" style={{ color: 'var(--zoo-text)' }}>
            {currentProject?.name || 'Project'}
          </span>
        </div>
      </div>

      {/* Right: editor/preview toggle */}
      <div
        className="flex items-center gap-0.5 rounded-lg border p-1"
        style={{ background: 'var(--zoo-surface-2)', borderColor: 'var(--zoo-border)' }}
      >
        <button
          onClick={() => setShowPreview?.(false)}
          className={`relative flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[11px] font-semibold transition-colors ${!showPreview ? 'text-white' : ''}`}
          style={!showPreview ? {} : { color: 'var(--zoo-text-3)' }}
          aria-pressed={!showPreview}
        >
          {!showPreview && (
            <motion.div
              layoutId="tab-bg"
              className="absolute inset-0 rounded-md"
              style={{ background: 'var(--zoo-accent)', opacity: 0.9 }}
              transition={{ type: 'spring', duration: 0.35, bounce: 0.15 }}
            />
          )}
          <Code2 size={12} className="relative" />
          <span className="relative hidden sm:inline">Editor</span>
        </button>

        <button
          onClick={() => setShowPreview?.(true)}
          className={`relative flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[11px] font-semibold transition-colors ${showPreview ? 'text-white' : ''}`}
          style={showPreview ? {} : { color: 'var(--zoo-text-3)' }}
          aria-pressed={showPreview}
        >
          {showPreview && (
            <motion.div
              layoutId="tab-bg"
              className="absolute inset-0 rounded-md"
              style={{ background: 'var(--zoo-accent)', opacity: 0.9 }}
              transition={{ type: 'spring', duration: 0.35, bounce: 0.15 }}
            />
          )}
          <Eye size={12} className="relative" />
          <span className="relative hidden sm:inline">Preview</span>
        </button>
      </div>
    </header>
  );
}

export default TopBar;
