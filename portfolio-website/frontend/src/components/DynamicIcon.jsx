import React from 'react';
import * as LucideIcons from 'lucide-react';
import { HelpCircle } from 'lucide-react';

/**
 * Renders a lucide-react icon from its string name (e.g. "Atom", "Server", "Code2").
 * Falls back to a generic icon if the name doesn't match any known icon —
 * this happens if the DB has an icon name that was renamed/removed in a lucide-react update,
 * or if the stored value is empty/invalid.
 *
 * Usage: <DynamicIcon name="Atom" size={18} className="text-primary" />
 */
export function DynamicIcon({ name, fallback: Fallback = HelpCircle, ...props }) {
    const Icon = name && LucideIcons[name];

    if (!Icon) {
        return <Fallback {...props} />;
    }

    return <Icon {...props} />;
}