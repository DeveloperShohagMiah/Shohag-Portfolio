import React from 'react'

const SectionHeader = ({ label }) => {
    return (
        <div className="inline-flex items-center gap-2.5  border border-primary bg-primary/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-muted-foreground backdrop-blur mb-6 clip-polygon">
            <span className='h-1 w-1 bg-primary '></span>
            <span className="font-code text-[11px] uppercase tracking-[0.2em] text-primary font-mono font-semibold">
                {label}
            </span>
        </div>
    )
}

export default SectionHeader