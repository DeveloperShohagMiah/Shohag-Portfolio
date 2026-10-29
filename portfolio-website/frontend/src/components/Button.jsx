import { Link } from "react-router-dom";

const variants = {
    primary: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    ghost: "bg-ghost text-ghost-foreground",
    outline: "border border-border bg-transparent text-foreground",
};

const base =
    "group relative isolate inline-flex shrink-0 items-center justify-center gap-2 overflow-hidden rounded-sm px-6 py-3.5 text-xs font-semibold uppercase tracking-widest transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50";

const getVariantClasses = (variant) =>
    variants[variant] ?? variants.primary;

const ButtonEffects = () => (
    <>
        {/* Hover light sweep */}
        <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full"
        />

        {/* Ambient inner glow */}
        <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-12 h-24 w-24 rounded-full bg-white/10 blur-xl transition-all duration-500 group-hover:scale-150 group-hover:bg-white/20"
        />
    </>
);

const Button = ({
    children,
    to,
    variant = "primary",
    className = "",
    type = "button",
    disabled = false,
    ...props
}) => {
    const classes = [
        base,
        getVariantClasses(variant),
        "shadow-[0_0_28px_-6px_var(--accent)] hover:-translate-y-0.5 shadow-xl shadow-primary/30",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    const content = (
        <>
            <ButtonEffects />
            <span className="relative z-10 inline-flex items-center justify-center gap-2">
                {children}
            </span>
        </>
    );

    if (to) {
        const isExternal =
            /^(https?:\/\/|mailto:|tel:)/i.test(to);

        const isHashLink = to.startsWith("#");

        if (isExternal || isHashLink) {
            return (
                <a
                    href={to}
                    className={classes}
                    aria-disabled={disabled || undefined}
                    tabIndex={disabled ? -1 : undefined}
                    onClick={disabled ? (event) => event.preventDefault() : props.onClick}
                    {...Object.fromEntries(
                        Object.entries(props).filter(
                            ([key]) => key !== "onClick"
                        )
                    )}
                >
                    {content}
                </a>
            );
        }

        return (
            <Link
                to={to}
                className={classes}
                aria-disabled={disabled || undefined}
                tabIndex={disabled ? -1 : undefined}
                onClick={disabled ? (event) => event.preventDefault() : props.onClick}
                {...Object.fromEntries(
                    Object.entries(props).filter(
                        ([key]) => key !== "onClick"
                    )
                )}
            >
                {content}
            </Link>
        );
    }

    return (
        <button
            type={type}
            className={classes}
            disabled={disabled}
            {...props}
        >
            {content}
        </button>
    );
};

export default Button;