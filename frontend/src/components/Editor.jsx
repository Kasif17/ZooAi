import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect, useState } from 'react';
import { getFileIcon } from '../utils/customizeIcon';
import { Check, FileCode, Loader2, Save, X } from 'lucide-react';
import { updateFile } from '../features/file';
import MonacoEditor from '@monaco-editor/react';

function Editor({ activeTab, openTabs, setOpenTabs, setActiveTab }) {
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [code, setCode] = useState('');

  useEffect(() => { setCode(activeTab?.content ?? ''); }, [activeTab]);

  const handleCloseTab = (e, id) => {
    e.stopPropagation();
    const result = openTabs.filter(tab => tab._id !== id);
    setOpenTabs(result);
    if (activeTab?._id === id) setActiveTab(result.length ? result[result.length - 1] : null);
  };

  const save = async () => {
    if (!activeTab) return;
    setSaving(true);
    try {
      await updateFile({ name: activeTab.name, content: code, id: activeTab._id });
      setActiveTab({ ...activeTab, content: code });
      setOpenTabs(tabs => tabs.map(t => t._id === activeTab._id ? { ...t, content: code } : t));
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 1500);
    } catch (err) { console.error(err); }
    setSaving(false);
  };

  if (!activeTab) return (
    <div
      className="flex flex-1 flex-col items-center justify-center gap-3"
      style={{ background: 'var(--zoo-bg)' }}
    >
      <div
        className="flex h-14 w-14 items-center justify-center rounded-2xl border"
        style={{ background: 'var(--zoo-surface)', borderColor: 'var(--zoo-border)', color: 'var(--zoo-text-3)' }}
      >
        <FileCode size={22} />
      </div>
      <div className="text-center">
        <p className="text-[14px] font-medium" style={{ color: 'var(--zoo-text-2)' }}>No file open</p>
        <p className="mt-0.5 text-[12px]" style={{ color: 'var(--zoo-text-3)' }}>Select a file from the explorer</p>
      </div>
    </div>
  );

  const { icon: ActiveIcon, color: activeColor } = getFileIcon(activeTab.name);

  return (
    <div className="flex flex-1 flex-col" style={{ background: 'var(--zoo-bg)' }}>
      {/* Tabs */}
      <div
        className="flex h-10 shrink-0 items-center overflow-x-auto border-b"
        style={{ background: 'var(--zoo-surface)', borderColor: 'var(--zoo-border)' }}
      >
        <AnimatePresence initial={false}>
          {openTabs.map(tab => {
            const active = activeTab?._id === tab._id;
            const { icon: Icon, color } = getFileIcon(tab.name);
            return (
              <motion.div
                key={tab._id}
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15 }}
                onClick={() => setActiveTab(tab)}
                className="group relative flex h-full cursor-pointer items-center gap-2 whitespace-nowrap border-r px-3.5 transition-colors"
                style={{
                  borderColor: 'var(--zoo-border)',
                  background: active ? 'var(--zoo-bg)' : 'transparent',
                  color: active ? 'var(--zoo-text)' : 'var(--zoo-text-3)',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'var(--zoo-text-2)'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'var(--zoo-text-3)'; }}
              >
                <Icon size={13} className={color} />
                <span className="text-[12.5px]">{tab.name}</span>
                <button
                  className="rounded p-0.5 opacity-0 transition-all group-hover:opacity-100"
                  style={{ color: 'var(--zoo-text-3)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--zoo-surface-2)'; e.currentTarget.style.color = 'var(--zoo-text)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--zoo-text-3)'; }}
                  onClick={e => handleCloseTab(e, tab._id)}
                  aria-label={`Close ${tab.name}`}
                >
                  <X size={12} />
                </button>
                {active && (
                  <div
                    className="absolute inset-x-0 bottom-0 h-[2px] rounded-t"
                    style={{ background: 'linear-gradient(90deg, #4f6ef7, #7c5cfc)' }}
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* File info + save bar */}
      <div
        className="flex h-9 shrink-0 items-center justify-between border-b px-4"
        style={{ background: 'var(--zoo-surface)', borderColor: 'var(--zoo-border)' }}
      >
        <div className="flex items-center gap-2" style={{ color: 'var(--zoo-text-2)' }}>
          <ActiveIcon size={13} className={activeColor} />
          <span className="text-[12.5px]">{activeTab.name}</span>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={save}
          disabled={saving}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
          style={{ background: 'linear-gradient(135deg, #4f6ef7, #6a52f5)', boxShadow: '0 2px 8px rgba(79,110,247,0.3)' }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {saving ? (
              <motion.span key="saving" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5">
                <Loader2 size={12} className="animate-spin" /> Saving
              </motion.span>
            ) : justSaved ? (
              <motion.span key="saved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5">
                <Check size={12} /> Saved
              </motion.span>
            ) : (
              <motion.span key="save" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5">
                <Save size={12} /> Save
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Monaco */}
      <div className="min-h-0 flex-1">
        <MonacoEditor
          height="100%"
          theme="vs-dark"
          language={activeTab.language || 'plaintext'}
          value={code}
          onChange={v => setCode(v || '')}
          options={{
            fontSize: 13,
            automaticLayout: true,
            minimap: { enabled: false },
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            padding: { top: 12 },
            fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, monospace",
            fontLigatures: true,
          }}
        />
      </div>
    </div>
  );
}

export default Editor;
