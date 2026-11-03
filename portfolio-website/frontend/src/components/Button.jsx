import { forwardRef } from "react";
import { Link } from "react-router-dom";

/* -------------------------------------------------------------------------- */
/*  Variants                                                                  */
/*  Each variant owns its complete shadow (base/hover) so two `shadow-*`      */
/*  utilities never fight each other.                                         */
/* -------------------------------------------------------------------------- */
const variants = {
    primary: [
        "bg-linear-to-br from-primary to-primary/80 text-primary-foreground",
        "ring-1 ring-inset ring-white/20",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_10px_30px_-10px_color-mix(in_srgb,var(--primary)_70%,transparent)]",
        "hover:brightness-110",
        "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_16px_40px_-10px_color-mix(in_srgb,var(--primary)_85%,transparent)]",
    ].join(" "),

    secondary: [
        "bg-linear-to-b from-secondary to-secondary/70 text-secondary-foreground",
        "border border-border backdrop-blur-xl",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_8px_24px_-14px_rgba(0,0,0,0.5)]",
        "hover:border-primary/40 hover:from-secondary hover:to-secondary/90",
        "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_14px_32px_-14px_color-mix(in_srgb,var(--primary)_45%,transparent)]",
    ].join(" "),

    outline: [
        "border border-border bg-transparent text-foreground backdrop-blur-xl",
        "hover:border-primary/60 hover:bg-primary/10 hover:text-primary",
        "hover:shadow-[0_12px_30px_-14px_color-mix(in_srgb,var(--primary)_55%,transparent)]",
    ].join(" "),

    // `bg-ghost` / `text-ghost-foreground` don't exist in your theme tokens
    ghost: "bg-transparent text-foreground hover:bg-muted/80",
};

const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
};

/* NOTE: every fragment ends with a space — joining with " " also guards against
   the "…opacity-50backdrop-blur-2xl" class-merge bug from the old base string. */
const base = [
    "group relative isolate inline-flex shrink-0 items-center justify-center gap-2",
    "overflow-hidden rounded-full text-sm font-semibold tracking-wide whitespace-nowrap select-none",
    "transition-all duration-300 ease-out",
    "hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
    "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
    "focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    // <button disabled> and <a aria-disabled> both look and behave disabled
    "disabled:pointer-events-none disabled:opacity-50",
    "aria-disabled:pointer-events-none aria-disabled:opacity-50",
].join(" ");

/* -------------------------------------------------------------------------- */
/*  Hover effects: light sweep + top edge highlight                           */
/* -------------------------------------------------------------------------- */
/*  The band starts fully outside the left edge and ends fully outside the
    right edge. `duration-0` on the resting state makes it snap back
    instantly on mouse-leave, so you never see it sweep backwards.          */
const ButtonEffects = ({ variant }) => (
    <>
        <span
            aria-hidden="true"
            className={`pointer-events-none absolute inset-y-0 left-0 w-2/5 -translate-x-full -skew-x-12 bg-linear-to-r from-transparent to-transparent will-change-transform transition-transform duration-0 ease-out group-hover:translate-x-[350%] group-hover:duration-[900ms] motion-reduce:hidden ${variant === "primary" ? "via-white/45" : "via-primary/25"
                }`}
        />
        <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent via-white/50 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-100"
        />
    </>
);

/* -------------------------------------------------------------------------- */
/*  Button                                                                    */
/*  - `to` starting with http(s)/mailto/tel/# renders a plain <a>             */
/*  - any other `to` renders a react-router <Link>                            */
/*  - no `to` renders a <button>                                              */
/* -------------------------------------------------------------------------- */
const Button = forwardRef(function Button(
    {
        children,
        to,
        variant = "primary",
        size = "md",
        className = "",
        type = "button",
        disabled = false,
        ...props
    },
    ref
) {
    const classes = [
        base,
        variants[variant] ?? variants.primary,
        sizes[size] ?? sizes.md,
        className,
    ]
        .filter(Boolean)
        .join(" ");

    const content = (
        <>
            <ButtonEffects variant={variant} />
            <span className="relative z-10 inline-flex items-center justify-center gap-2">
                {children}
            </span>
        </>
    );

    /* ---------------------------- link variants ---------------------------- */
    if (to) {
        const { onClick, tabIndex, target, rel, ...rest } = props;

        const isHttp = /^https?:\/\//i.test(to);
        const isPlainAnchor = isHttp || /^(mailto:|tel:|#)/i.test(to);

        const handleClick = (event) => {
            if (disabled) {
                event.preventDefault();
                return;
            }
            onClick?.(event);
        };

        const linkProps = {
            ref,
            className: classes,
            "aria-disabled": disabled || undefined,
            tabIndex: disabled ? -1 : tabIndex,
            onClick: handleClick,
            ...rest,
        };

        if (isPlainAnchor) {
            // Caller-supplied target / rel win; otherwise open web links safely in a new tab
            const finalTarget = target ?? (isHttp ? "_blank" : undefined);
            const finalRel =
                rel ?? (finalTarget === "_blank" ? "noopener noreferrer" : undefined);

            return (
                <a href={to} target={finalTarget} rel={finalRel} {...linkProps}>
                    {content}
                </a>
            );
        }

        return (
            <Link to={to} target={target} rel={rel} {...linkProps}>
                {content}
            </Link>
        );
    }

    /* ------------------------------- <button> ------------------------------ */
    return (
        <button
            ref={ref}
            type={type}
            className={classes}
            disabled={disabled}
            {...props}
        >
            {content}
        </button>
    );
});

export default Button;