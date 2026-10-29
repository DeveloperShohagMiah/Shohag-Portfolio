import React, { Children } from 'react'

const SectionHeader = ({ label, title, highlight, children }) => {
    return (
        <div>
            <div className="inline-flex items-center gap-2.5 bg-linear-to-r from-violet-500/5 to-primary/50 border border-primary/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] backdrop-blur mb-6 rounded-full">
                <span className='h-1 w-1 bg-primary rounded-full'></span>
                <span className="font-code text-[11px] uppercase tracking-[0.2em] font-semibold">
                    {label}
                </span>

            </div>
            <h2 className="text-balance font-display text-5xl font-semibold leading-[0.95] tracking-[-0.05em] text-foreground sm:text-2xl lg:text-4xl">
                {title} <span className="text-gradient">{highlight}</span>
            </h2>
            {children}
        </div>
    )
}

export default SectionHeader