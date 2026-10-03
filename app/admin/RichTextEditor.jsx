'use client';

import { useState, useRef, useEffect } from 'react';

const TOOLBAR = [
  { cmd: 'bold', label: 'B', title: 'Bold' },
  { cmd: 'italic', label: 'I', title: 'Italic' },
  { cmd: 'underline', label: 'U', title: 'Underline' },
  { type: 'sep' },
  { cmd: 'insertUnorderedList', label: '•', title: 'Bullet list' },
  { cmd: 'insertOrderedList', label: '1.', title: 'Numbered list' },
  { type: 'sep' },
  { cmd: 'createLink', label: '🔗', title: 'Insert link' },
  { cmd: 'removeFormat', label: 'Tx', title: 'Clear formatting' },
];

export function RichTextEditor({ value, onChange, placeholder }) {
  const [html, setHtml] = useState(value || '');
  const editorRef = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && editorRef.current) {
      editorRef.current.innerHTML = value || '';
      initialized.current = true;
    }
  }, [value]);

  function exec(cmd, arg) {
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    if (cmd === 'createLink') {
      const url = prompt('Enter URL:');
      if (url) document.execCommand('createLink', false, url);
      return;
    }
    document.execCommand(cmd, false, arg);
    setHtml(editor.innerHTML);
    onChange?.(editor.innerHTML);
  }

  function handleInput() {
    if (editorRef.current) {
      setHtml(editorRef.current.innerHTML);
      onChange?.(editorRef.current.innerHTML);
    }
  }

  return (
    <div className="border border-slate-300 rounded-lg bg-white overflow-hidden">
      <div className="flex flex-wrap gap-1 p-2 border-b border-slate-200 bg-slate-50">
        {TOOLBAR.map((t, i) =>
          t.type === 'sep' ? (
            <div key={i} className="w-px h-6 bg-slate-300 mx-1" />
          ) : (
            <button
              key={i}
              type="button"
              onClick={() => exec(t.cmd)}
              title={t.title}
              className="w-8 h-8 rounded flex items-center justify-center text-sm font-bold text-slate-700 hover:bg-slate-200 transition"
            >
              {t.label}
            </button>
          )
        )}
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        className="min-h-[120px] p-3 text-sm text-slate-900 outline-none focus:ring-0"
        style={{ fontFamily: 'inherit' }}
        data-placeholder={placeholder}
      />
      <style jsx>{`
        div[contentEditable]:empty::before {
          content: attr(data-placeholder);
          color: #94a3b8;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}