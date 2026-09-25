'use client';

import { useEffect } from 'react';

export default function BodyClass({ cls }) {
  useEffect(() => {
    if (cls) document.body.className = cls;
  }, [cls]);
  return null;
}
