import React from 'react';
import { motion } from 'motion/react';
import { TerminalSquare, X } from 'lucide-react';
import Terminal from './Terminal';
import { useSelector } from 'react-redux';

function BottomPanel({ onClose }) {
  const { currentProject } = useSelector(state => state.project);
  const projectId = currentProject?._id;
  const userId = currentProject?.owner;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 240, opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="flex shrink-0 flex-col overflow-hidden border-t"
      style={{ background: 'var(--zoo-surface)', borderColor: 'var(--zoo-border)' }}
    >
      {/* Panel header */}
      <div
        className="flex h-9 shrink-0 items-center justify-between border-b px-3"
        style={{ borderColor: 'var(--zoo-border)' }}
      >
        <div className="flex items-center gap-2">
          <TerminalSquare size={13} style={{ color: '#7c9bff' }} />
          <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--zoo-text-2)' }}>
            Terminal
          </span>
        </div>
        <button
          onClick={onClose}
          className="flex h-6 w-6 items-center justify-center rounded-md transition-colors"
          style={{ color: 'var(--zoo-text-3)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--zoo-surface-2)'; e.currentTarget.style.color = 'var(--zoo-text)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--zoo-text-3)'; }}
          title="Close terminal"
          aria-label="Close terminal"
        >
          <X size={13} />
        </button>
      </div>

      <div className="min-h-0 flex-1">
        <Terminal projectId={projectId} userId={userId} />
      </div>
    </motion.div>
  );
}

export default BottomPanel;
