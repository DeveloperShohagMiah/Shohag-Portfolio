import React from 'react';
import * as Icons from 'lucide-react';

export function DynamicIcon({ name, className = 'w-4 h-4', fallback = 'Code2' }) {
  const IconComponent = Icons[name] || Icons[fallback] || Icons.Code2;
  return <IconComponent className={className} />;
}
