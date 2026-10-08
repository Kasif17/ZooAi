import {
  Bot, FileMinus, FilePen, FilePlus2, FolderPlus,
  Send, Sparkles, User, AlertCircle
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

const TOOL_META = {
  folder_created: { icon: FolderPlus,  color: '#06b6d4', label: 'Created folder' },
  file_created:   { icon: FilePlus2,   color: '#34d399', label: 'Created file'   },
  file_updated:   { icon: FilePen,     color: '#fbbf24', label: 'Updated file'   },
  file_deleted:   { icon: FileMinus,   color: '#f87171', label: 'Deleted file'   },
};

const ToolBadge = ({ toolType, detail }) => {
  const meta = TOOL_META[toolType];
  if (!meta) return null;
  const Icon = meta.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-center"
    >
      <div
        className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px]"
        style={{ background: 'var(--zoo-surface-2)', borderColor: 'var(--zoo-border)', color: 'var(--zoo-text-2)' }}
      >
        <Icon size={12} style={{ color: meta.color }} />
        <span>{meta.label}</span>
        {detail && <span style={{ color: 'var(--zoo-text-3)' }}>· {detail}</span>}
      </div>
    </motion.div>
  );
};

const ThinkingDots = () => (
  <div className="flex items-center gap-1 px-1 py-0.5">
    {[0, 1, 2].map(i => (
      <span
        key={i}
        className="zoo-dot h-1.5 w-1.5 rounded-full"
        style={{ background: '#7c9bff', animationDelay: `${i * 0.2}s` }}
      />
    ))}
  </div>
);

function AiChat({ projectId, history = [], reloadTree }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const onEvent = (toolType, data) => {
    if (['file_created', 'file_updated', 'file_deleted', 'folder_created'].includes(toolType)) {
      reloadTree();
      setMessages(prev => [...prev, { role: 'tool', toolType, detail: data.file?.name || data.folder?.name }]);
    }
    if (toolType === 'message') {
      const content = data?.content;
      if (!content) return;
      setMessages(prev => {
        const copy = [...prev];
        const last = copy[copy.length - 1];
        if (last?.role === 'assistant') {
          copy[copy.length - 1] = { ...last, content };
        } else {
          copy.push({ role: 'assistant', content });
        }
        return copy;
      });
    }
    if (toolType === 'error') throw new Error(data.message || 'AI error');
  };

  const handleChat = async () => {
    if (!message.trim() || loading) return;
    setLoading(true);
    const msg = message.trim();
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setMessage('');
    history = messages;

    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
        credentials: 'include',
        body: JSON.stringify({ projectId, message: msg, history }),
      });

      if (!response.ok) {
        let errMsg = 'AI request failed';
        try { const d = await response.json(); errMsg = d?.message || errMsg; } catch {}
        throw new Error(errMsg);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const events = buffer.split('\n\n');
          buffer = events.pop() || '';
          for (const eventText of events) {
            if (!eventText.trim()) continue;
            let eventType = 'message', dataText = '';
            for (const line of eventText.split('\n')) {
              if (line.startsWith('event:')) eventType = line.slice(6).trim();
              if (line.startsWith('data:')) dataText += line.slice(5).trim();
            }
            if (!dataText) continue;
            let data;
            try { data = JSON.parse(dataText); } catch { data = { content: dataText }; }
            onEvent(eventType, data);
          }
        }
      } finally { reader.releaseLock(); }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: err.message, error: true }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleChat(); }
  };

  return (
    <div
      className="flex w-80 shrink-0 flex-col border-l"
      style={{ background: 'var(--zoo-surface)', borderColor: 'var(--zoo-border)' }}
    >
      {/* Header */}
      <div
        className="flex h-10 shrink-0 items-center gap-2 border-b px-3"
        style={{ borderColor: 'var(--zoo-border)' }}
      >
        <div
          className="flex h-6 w-6 items-center justify-center rounded-lg"
          style={{ background: 'rgba(79,110,247,0.15)', color: '#7c9bff' }}
        >
          <Bot size={13} />
        </div>
        <span className="text-[12.5px] font-semibold" style={{ color: 'var(--zoo-text)' }}>ZooAi Chat</span>
        <div
          className="ml-auto flex h-1.5 w-1.5 rounded-full"
          style={{ background: '#34d399', boxShadow: '0 0 6px #34d399' }}
          title="AI ready"
        />
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-3 overflow-y-auto p-3">
        {messages.length === 0 && (
          <div className="mt-8 flex flex-col items-center gap-3 text-center">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl border"
              style={{ background: 'rgba(79,110,247,0.08)', borderColor: 'rgba(79,110,247,0.2)', color: '#7c9bff' }}
            >
              <Sparkles size={20} />
            </div>
            <div>
              <p className="text-[13px] font-medium" style={{ color: 'var(--zoo-text)' }}>What do you want to build?</p>
              <p className="mt-1 text-[12px]" style={{ color: 'var(--zoo-text-3)' }}>Ask ZooAi to create or modify files.</p>
            </div>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => {
            if (msg.role === 'tool') return <ToolBadge key={i} toolType={msg.toolType} detail={msg.detail} />;
            const isUser = msg.role === 'user';
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
                className={`flex items-start gap-2 ${isUser ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white"
                  style={isUser
                    ? { background: 'var(--zoo-surface-2)', color: 'var(--zoo-text-2)' }
                    : { background: 'linear-gradient(135deg, #4f6ef7, #7c5cfc)' }
                  }
                >
                  {isUser ? <User size={11} /> : <Bot size={11} />}
                </div>
                <div
                  className="max-w-[85%] rounded-xl px-3 py-2 text-[12.5px] leading-relaxed"
                  style={isUser
                    ? { background: 'linear-gradient(135deg, #4f6ef7, #6a52f5)', color: '#fff' }
                    : msg.error
                      ? { background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', color: '#fca5a5' }
                      : { background: 'var(--zoo-surface-2)', border: '1px solid var(--zoo-border)', color: 'var(--zoo-text)' }
                  }
                >
                  {msg.error && <AlertCircle size={12} className="mb-1 inline-block mr-1" />}
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {loading && (
          <div className="flex items-start gap-2">
            <div
              className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white"
              style={{ background: 'linear-gradient(135deg, #4f6ef7, #7c5cfc)' }}
            >
              <Bot size={11} />
            </div>
            <div
              className="rounded-xl px-3 py-2.5"
              style={{ background: 'var(--zoo-surface-2)', border: '1px solid var(--zoo-border)' }}
            >
              <ThinkingDots />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t p-3" style={{ borderColor: 'var(--zoo-border)' }}>
        <div
          className="flex items-end gap-2 rounded-xl border p-2.5 transition-all"
          style={{ background: 'var(--zoo-surface-2)', borderColor: 'var(--zoo-border)' }}
          onFocus={e => e.currentTarget.style.borderColor = 'rgba(79,110,247,0.4)'}
          onBlur={e => e.currentTarget.style.borderColor = 'var(--zoo-border)'}
        >
          <textarea
            ref={textareaRef}
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask ZooAi to build something..."
            rows={2}
            className="flex-1 resize-none bg-transparent text-[12.5px] outline-none"
            style={{ color: 'var(--zoo-text)', caretColor: '#7c9bff' }}
            disabled={loading}
          />
          <motion.button
            onClick={handleChat}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading || !message.trim()}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #4f6ef7, #6a52f5)', boxShadow: '0 2px 8px rgba(79,110,247,0.35)' }}
            aria-label="Send message"
          >
            <Send size={13} />
          </motion.button>
        </div>
        <p className="mt-1.5 text-center text-[10px]" style={{ color: 'var(--zoo-text-3)' }}>
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}

export default AiChat;
