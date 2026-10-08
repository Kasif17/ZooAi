import React, { useEffect, useState } from 'react';
import TopBar from '../components/TopBar';
import ActivityBar from '../components/ActivityBar';
import { AnimatePresence, motion } from 'motion/react';
import Explorer from '../components/Explorer';
import { useParams } from 'react-router-dom';
import { getProjectById } from '../features/project';
import { useDispatch } from 'react-redux';
import { setCurrentProject } from '../redux/projectSlice';
import { getTree } from '../features/file';
import { Bot, Code2, Eye, Files, Maximize2, Minimize2, TerminalSquare } from 'lucide-react';
import Preview from '../components/Preview';
import Editor from '../components/Editor';
import BottomPanel from '../components/BottomPanel';
import AiChat from '../components/AiChat';

function ProjectPage() {
  const { id } = useParams();
  const [showExplorer, setShowExplorer] = useState(true);
  const [showAiChat, setShowAiChat] = useState(true);
  const [showBottomPanel, setShowBottomPanel] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [isPreviewFullScreen, setIsPreviewFullScreen] = useState(false);
  const [tree, setTree] = useState([]);
  const [mobilePane, setMobilePane] = useState('explorer');
  const [openTabs, setOpenTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const dispatch = useDispatch();

  const handleGetProject = async () => {
    const data = await getProjectById(id);
    dispatch(setCurrentProject(data));
  };

  const loadTree = async () => {
    const data = await getTree(id);
    setTree(data);
  };

  useEffect(() => {
    handleGetProject();
    loadTree();
  }, [id]);

  const openFile = (file) => {
    if (!openTabs.find(t => t._id === file._id)) setOpenTabs(prev => [...prev, file]);
    setActiveTab(file);
    setShowPreview(false);
  };

  return (
    <div className="relative flex h-screen flex-col overflow-hidden" style={{ background: 'var(--zoo-bg)' }}>
      <TopBar showPreview={showPreview} setShowPreview={setShowPreview} />

      <div className="flex flex-1 overflow-hidden">
        {/* Activity bar — desktop */}
        <div className="hidden md:block">
          <ActivityBar
            showAiChat={showAiChat}
            showExplorer={showExplorer}
            showTerminal={showBottomPanel}
            setShowAiChat={setShowAiChat}
            setShowExplorer={setShowExplorer}
            setShowTerminal={setShowBottomPanel}
          />
        </div>

        {/* Explorer */}
        <div className={`${mobilePane === 'explorer' ? 'flex' : 'hidden'} w-full md:flex md:w-auto`}>
          <AnimatePresence initial={false}>
            {showExplorer && (
              <Explorer projectId={id} tree={tree} openFile={openFile} reloadTree={loadTree} />
            )}
          </AnimatePresence>
        </div>

        {/* Editor / Preview area */}
        <div
          className={`${mobilePane === 'editor' ? 'flex' : 'hidden'} relative w-full min-w-0 flex-1 flex-col overflow-hidden border-x md:flex`}
          style={{ borderColor: 'var(--zoo-border)' }}
        >
          {/* Editor/Preview toggle overlay */}
          <div className="pointer-events-none absolute right-3 top-3 z-40 flex items-center gap-1.5">
            {showPreview && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => setIsPreviewFullScreen(v => !v)}
                title={isPreviewFullScreen ? 'Exit fullscreen' : 'Fullscreen preview'}
                className="pointer-events-auto flex items-center justify-center rounded-lg border p-1.5 transition-colors"
                style={{ background: 'var(--zoo-surface)', borderColor: 'var(--zoo-border)', color: 'var(--zoo-text-2)' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--zoo-text)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--zoo-text-2)'}
              >
                {isPreviewFullScreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
              </motion.button>
            )}
          </div>

          <div className="flex min-h-0 flex-1 overflow-hidden">
            {showPreview ? <Preview tree={tree} /> : (
              <Editor
                activeTab={activeTab}
                openTabs={openTabs}
                setOpenTabs={setOpenTabs}
                setActiveTab={setActiveTab}
              />
            )}
          </div>

          {/* Fullscreen preview */}
          <AnimatePresence>
            {showPreview && isPreviewFullScreen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="fixed inset-0 z-[100] bg-white"
              >
                <Preview tree={tree} />
                <button
                  onClick={() => setIsPreviewFullScreen(false)}
                  className="absolute right-3 top-3 z-[110] flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition-colors"
                  style={{ background: 'var(--zoo-surface)', borderColor: 'var(--zoo-border)', color: 'var(--zoo-text-2)' }}
                >
                  <Minimize2 size={12} />
                  Exit
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Terminal */}
          <AnimatePresence>
            {showBottomPanel && (
              <div className="max-h-[45vh] md:max-h-none">
                <BottomPanel projectId={id} onClose={() => setShowBottomPanel(false)} />
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* AI Chat */}
        <div className={`${mobilePane === 'chat' ? 'flex' : 'hidden'} w-full md:flex md:w-auto`}>
          <AnimatePresence initial={false}>
            {showAiChat && <AiChat projectId={id} reloadTree={loadTree} />}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <nav
        className="flex items-center justify-around border-t py-2 md:hidden"
        style={{ background: 'var(--zoo-surface)', borderColor: 'var(--zoo-border)' }}
      >
        {[
          { pane: 'explorer', icon: Files, label: 'Files', action: () => { setMobilePane('explorer'); setShowExplorer(true); } },
          { pane: 'editor', icon: Code2, label: 'Editor', action: () => setMobilePane('editor') },
          { pane: 'chat', icon: Bot, label: 'AI Chat', action: () => { setMobilePane('chat'); setShowAiChat(true); } },
          { pane: 'terminal', icon: TerminalSquare, label: 'Terminal', action: () => setShowBottomPanel(v => !v), active: showBottomPanel },
        ].map(({ pane, icon: Icon, label, action, active }) => (
          <button
            key={pane}
            onClick={action}
            className="flex flex-col items-center gap-1 px-4 py-1 text-[10px] font-medium transition-colors"
            style={{ color: (mobilePane === pane || active) ? '#7c9bff' : 'var(--zoo-text-3)' }}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default ProjectPage;
