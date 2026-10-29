
import { Link } from "react-router-dom";

const variants = {
    primary:
        " bg-linear-to-r from-primary/35 via-primary/60 to-primary/85 text-primary-foreground",

    secondary:
        " bg-linear-to-r from-secondary via-secondary/90 to-white/20 text-secondary-foreground",

    ghost:
        "bg-ghost text-ghost-foreground hover:bg-muted/70",

    outline:
        "border border-border bg-transparent text-foreground hover:border-primary/50 hover:bg-primary/5",
};

const base =
    "group relative isolate inline-flex shrink-0 items-center justify-center gap-2 " +
    "overflow-hidden rounded-sm px-6 py-3 text-xs font-semibold uppercase tracking-widest " +
    "transition-all duration-300 ease-out " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary " +
    "focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
    "disabled:pointer-events-none disabled:opacity-50";

const getVariantClasses = (variant) =>
    variants[variant] ?? variants.primary;

const ButtonEffects = ({ variant }) => (
    <>
        {/* Animated gradient light sweep */}
        <span
            aria-hidden="true"
            className="
                pointer-events-none absolute inset-0 -z-10
                -translate-x-full
                bg-linear-to-r
                from-transparent via-white/20 to-transparent
                transition-transform duration-700 ease-in-out
                group-hover:translate-x-full
            "
        />

        {/* Top gradient highlight */}
        <span
            aria-hidden="true"
            className="
                pointer-events-none absolute top-[1px] left-0 right-0 mx-auto w-20
                h-px
                bg-linear-to-r
                from-transparent via-white/30 to-transparent
                opacity-70
                transition-opacity duration-300
                group-hover:opacity-100
                inset-0
            "
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
        "shadow-[0_0_28px_-8px_var(--accent)]",
        "hover:-translate-y-0.5 hover:shadow-[0_8px_30px_-8px_var(--accent)]",
        "active:translate-y-0 active:shadow-[0_2px_12px_-6px_var(--accent)]",
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

    if (to) {
        const isExternal = /^(https?:\/\/|mailto:|tel:)/i.test(to);
        const isHashLink = to.startsWith("#");

        const linkProps = {
            className: classes,
            "aria-disabled": disabled || undefined,
            tabIndex: disabled ? -1 : props.tabIndex,
            onClick: (event) => {
                if (disabled) {
                    event.preventDefault();
                    return;
                }

                props.onClick?.(event);
            },
            ...Object.fromEntries(
                Object.entries(props).filter(
                    ([key]) => !["onClick", "tabIndex", "type"].includes(key)
                )
            ),
        };

        if (isExternal || isHashLink) {
            return (
                <a
                    href={to}
                    {...linkProps}
                    target={
                        /^https?:\/\//i.test(to)
                            ? "_blank"
                            : undefined
                    }
                    rel={
                        /^https?:\/\//i.test(to)
                            ? "noopener noreferrer"
                            : undefined
                    }
                >
                    {content}
                </a>
            );
        }

        return (
            <Link to={to} {...linkProps}>
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
