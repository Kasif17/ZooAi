import React from 'react';
import { motion } from 'motion/react';
import { FolderTree, RefreshCcw } from 'lucide-react';
import Folder from './Folder';

function Explorer({ projectId, tree, reloadTree, openFile }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16, width: 0 }}
      animate={{ opacity: 1, x: 0, width: 260 }}
      exit={{ opacity: 0, x: -16, width: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="flex flex-col overflow-hidden border-r"
      style={{ background: 'var(--zoo-surface)', borderColor: 'var(--zoo-border)' }}
    >
      {/* Header */}
      <div
        className="flex h-10 w-[260px] shrink-0 items-center justify-between border-b px-3"
        style={{ borderColor: 'var(--zoo-border)' }}
      >
        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--zoo-text-3)' }}>
          Explorer
        </span>
        <motion.button
          whileHover={{ rotate: 60 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.2 }}
          onClick={reloadTree}
          className="flex h-6 w-6 items-center justify-center rounded-md transition-colors"
          style={{ color: 'var(--zoo-text-3)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--zoo-surface-2)'; e.currentTarget.style.color = 'var(--zoo-text)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--zoo-text-3)'; }}
          title="Refresh"
          aria-label="Refresh file tree"
        >
          <RefreshCcw size={13} />
        </motion.button>
      </div>

      {/* Tree */}
      <div className="w-[260px] flex-1 overflow-y-auto px-1 py-2">
        {tree.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-3 py-10 text-center">
            <FolderTree size={20} style={{ color: 'var(--zoo-text-3)' }} />
            <span className="text-[12px]" style={{ color: 'var(--zoo-text-3)' }}>Empty workspace</span>
          </div>
        ) : (
          tree.map(node => (
            <Folder
              key={node._id}
              projectId={projectId}
              node={node}
              tree={tree}
              reloadTree={reloadTree}
              openFile={openFile}
            />
          ))
        )}
      </div>
    </motion.div>
  );
}

export default Explorer;
