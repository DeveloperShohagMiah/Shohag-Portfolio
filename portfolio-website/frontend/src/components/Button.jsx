import { Link } from 'react-router-dom'

const primary = "bg-primary text-primary-foreground"
const secondary = "bg-secondary text-secondary-foreground"
const ghost = "bg-ghost text-ghost-foreground"
const outline = "bg-transparent border border-border text-foreground"
const base =
    "group inline-flex shrink-0 items-center justify-center gap-2 px-6 py-3.5 text-xs uppercase font-medium font-display shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/50 clip-polygon"


const getVariantClasses = (variant) => {
    switch (variant) {
        case "primary":
            return primary
        case "secondary":
            return secondary
        case "ghost":
            return ghost
        case "outline":
            return outline
        default:
            return primary
    }
}
const Button = ({
    children,
    to,
    variant = "primary",
    className = "",
    type = "button",
    ...props
}) => {
    const classes = [base, getVariantClasses(variant), className]
        .filter(Boolean)
        .join(" ")

    if (to) {
        if (to.startsWith("#") || to.startsWith("http") || to.startsWith("mailto:")) {
            return (
                <a href={to} className={classes} {...props}>
                    {children}
                </a>
            )
        }

        return (
            <Link to={to} className={classes} {...props}>
                {children}
            </Link>
        )
    }

    return (
        <button type={type} className={classes} {...props}>
            {children}
        </button>
    )
}

export default Button
