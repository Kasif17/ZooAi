import React, { useMemo } from 'react';
import { Eye } from 'lucide-react';

function Preview({ tree }) {
  const srcDoc = useMemo(() => {
    let html = '', css = '', js = '';
    const walk = (items = []) => {
      for (const item of items) {
        if (item.type === 'file') {
          if (item.name === 'index.html') html = item.content || '';
          if (item.name.endsWith('css')) css = item.content || '';
          if (item.name.endsWith('js')) js = item.content || '';
        }
        if (item.children?.length) walk(item.children);
      }
    };
    walk(tree);

    if (!html) return `<!DOCTYPE html><html><body style="margin:0;background:#07080f;color:#8b8fa8;font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;"><div style="text-align:center;"><div style="font-size:32px;margin-bottom:12px;">📄</div><h3 style="margin:0 0 6px;color:#f0f1ff;font-size:15px;">No index.html found</h3><p style="margin:0;font-size:12px;">Create an HTML project to see the preview.</p></div></body></html>`;

    if (css) html = html.includes('</head>') ? html.replace('</head>', `<style>${css}</style></head>`) : `<style>${css}</style>${html}`;
    if (js) { const script = `<script>\n${js}\n<\/script>`; html = html.includes('</body>') ? html.replace('</body>', `${script}</body>`) : html + script; }
    return html;
  }, [tree]);

  return (
    <div className="flex h-full w-full flex-col" style={{ background: 'var(--zoo-bg)' }}>
      <div
        className="flex h-9 shrink-0 items-center gap-2 border-b px-4"
        style={{ background: 'var(--zoo-surface)', borderColor: 'var(--zoo-border)' }}
      >
        <Eye size={13} style={{ color: '#7c9bff' }} />
        <span className="text-[12px] font-medium" style={{ color: 'var(--zoo-text-2)' }}>Preview</span>
        <div className="ml-2 h-1.5 w-1.5 rounded-full" style={{ background: '#34d399', boxShadow: '0 0 6px #34d399' }} />
      </div>
      <div className="min-h-0 flex-1 bg-white">
        <iframe
          title="Project Preview"
          srcDoc={srcDoc}
          sandbox="allow-scripts allow-forms allow-modals"
          className="h-full w-full border-0"
        />
      </div>
    </div>
  );
}

export default Preview;
