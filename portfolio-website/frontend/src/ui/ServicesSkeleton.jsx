import React from 'react'

const ServicesSkeleton = () => {
    return (
        <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                    key={i}
                    className="clip-polygon border border-border/60 bg-card/40 p-7 h-64"
                >
                    <div className="h-12 w-12 bg-muted/30 clip-polygon mb-7" />
                    <div className="h-5 w-2/3 bg-muted/40 rounded mb-4" />
                    <div className="h-3 w-full bg-muted/30 rounded mb-2" />
                    <div className="h-3 w-5/6 bg-muted/30 rounded mb-2" />
                    <div className="h-3 w-4/6 bg-muted/30 rounded" />
                </div>
            ))}
        </div>
    )
}

export default ServicesSkeleton