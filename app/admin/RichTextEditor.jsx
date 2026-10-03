'use client';

import { useRef, useEffect } from 'react';

const TOOLBAR = [
  { cmd: 'bold', label: 'B', title: 'Bold' },
  { cmd: 'italic', label: 'I', title: 'Italic', italic: true },
  { cmd: 'underline', label: 'U', title: 'Underline', underline: true },
  { type: 'sep' },
  { cmd: 'insertUnorderedList', label: '• List', title: 'Bullet list' },
  { cmd: 'insertOrderedList', label: '1. List', title: 'Numbered list' },
  { type: 'sep' },
  { cmd: 'createLink', label: 'Link', title: 'Insert link' },
  { cmd: 'removeFormat', label: 'Tx', title: 'Clear formatting' },
];

export function RichTextEditor({ value, onChange, placeholder }) {
  const editorRef = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && editorRef.current) {
      editorRef.current.innerHTML = value || '';
      initialized.current = true;
    }
  }, [value]);

  function exec(cmd) {
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    if (cmd === 'createLink') {
      const url = prompt('Enter URL:');
      if (url) document.execCommand('createLink', false, url);
      else return;
    } else {
      document.execCommand(cmd, false, null);
    }
    onChange?.(editor.innerHTML);
  }

  function handleInput() {
    if (editorRef.current) onChange?.(editorRef.current.innerHTML);
  }

  return (
    <div className="adm-rte">
      <div className="adm-rte-bar">
        {TOOLBAR.map((t, i) =>
          t.type === 'sep' ? (
            <div key={i} className="adm-rte-sep" />
          ) : (
            <button
              key={i}
              type="button"
              onClick={() => exec(t.cmd)}
              title={t.title}
              className="adm-rte-btn"
              style={t.italic ? { fontStyle: 'italic' } : t.underline ? { textDecoration: 'underline' } : undefined}
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
        className="adm-rte-area"
        data-placeholder={placeholder || 'Write here…'}
      />
    </div>
  );
}
