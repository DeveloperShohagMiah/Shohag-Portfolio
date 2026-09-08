import React from 'react'

const SectionHeader = ({ label }) => {
    return (
        <div className="inline-flex items-center gap-2.5 rounded-full border border-border/60 bg-muted/30 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-muted-foreground backdrop-blur mb-6">
            <span className='h-1 w-1 bg-muted-foreground rounded-full'></span>
            <span className="font-code text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                {label}
            </span>
        </div>
    )
}

export default SectionHeader