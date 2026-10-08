import { Bot, Files, SquareTerminal } from 'lucide-react';
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

function ActivityIcon({ icon: Icon, label, active, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={onClick}
        aria-label={label}
        aria-pressed={active}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl transition-colors"
        style={active
          ? { background: 'rgba(79,110,247,0.15)', color: '#7c9bff' }
          : { color: 'var(--zoo-text-3)' }
        }
        onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--zoo-surface-2)'; }}
        onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
      >
        {/* Active left indicator */}
        <AnimatePresence>
          {active && (
            <motion.div
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              exit={{ scaleY: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-full"
              style={{ background: 'linear-gradient(180deg, #4f6ef7, #7c5cfc)' }}
            />
          )}
        </AnimatePresence>

        <Icon size={18} strokeWidth={active ? 2.2 : 1.8} className="relative" />

        {/* Tooltip */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.12 }}
              className="pointer-events-none absolute left-12 top-1/2 z-50 -translate-y-1/2 whitespace-nowrap rounded-lg border px-2.5 py-1.5 text-[11px] font-medium shadow-xl"
              style={{
                background: 'var(--zoo-surface)',
                borderColor: 'var(--zoo-border)',
                color: 'var(--zoo-text)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              }}
            >
              {label}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}

function ActivityBar({ showAiChat, showExplorer, showTerminal, setShowAiChat, setShowExplorer, setShowTerminal }) {
  return (
    <aside
      className="flex w-14 shrink-0 flex-col items-center gap-1.5 border-r py-3"
      style={{ background: 'var(--zoo-surface)', borderColor: 'var(--zoo-border)' }}
    >
      <ActivityIcon icon={Files} label="Explorer" active={showExplorer} onClick={() => setShowExplorer(v => !v)} />
      <ActivityIcon icon={Bot} label="AI Chat" active={showAiChat} onClick={() => setShowAiChat(v => !v)} />

      <div className="mt-auto flex flex-col items-center gap-1.5">
        <div className="mb-1 h-px w-6" style={{ background: 'var(--zoo-border)' }} />
        <ActivityIcon icon={SquareTerminal} label="Terminal" active={showTerminal} onClick={() => setShowTerminal(v => !v)} />
      </div>
    </aside>
  );
}

export default ActivityBar;
