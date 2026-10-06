import React from 'react'

const SkillsSkeleton = () => {
    return (
        <div className="mt-5 grid gap-px overflow-hidden border border-border/60 bg-border/60 sm:grid-cols-2 lg:grid-cols-4 animate-pulse">
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-background p-6">
                    <div className="flex items-start justify-between">
                        <div className="h-11 w-11 rounded-xl bg-muted/30" />
                        <div className="h-3 w-6 bg-muted/20 rounded" />
                    </div>
                    <div className="mt-6 h-4 w-3/4 bg-muted/40 rounded" />
                    <div className="mt-3 h-3 w-full bg-muted/25 rounded" />
                    <div className="mt-5 h-2 w-20 bg-muted/20 rounded" />
                </div>
            ))}
        </div>
    )
}

export default SkillsSkeleton