import {
    useState,
    useEffect,
    useLayoutEffect,
    useRef,
    useCallback,
} from "react";
import { Link, useLocation } from "react-router-dom";
import { FiMenu, FiX, FiMoon, FiSun, FiArrowUpRight, FiGithub, FiSend } from "react-icons/fi";
import Button from "./Button";
import logo from "../assets/logo.png"
const NAV_LINKS = [
    { id: "about", label: "About", path: "/about" },
    { id: "services", label: "Services", path: "/services" },
    { id: "skills", label: "Skills", path: "/skills" },
    { id: "portfolio", label: "Projects", path: "/portfolio" },
    { id: "blog", label: "Blogs", path: "/blogs" },
    { id: "faq", label: "Faq", path: "/faq" },
    { id: "contact", label: "Contact", path: "/contact" },
];

const FOCUS =
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

/* -------------------------------------------------------------------------- */
/*  CTA — one component, fits every breakpoint                                */
/*  < sm : compact "Start"   |   sm+ : "Start a project"                      */
/*  `full` makes it a block-level button (used inside the mobile menu)        */
/* -------------------------------------------------------------------------- */
const CtaButton = ({ onClick, full = false }) => (
    <Link
        to="/contact"
        onClick={onClick}
        className={`
      group/cta relative inline-flex items-center justify-center gap-1.5
      overflow-hidden rounded-xl bg-primary font-semibold
      text-primary-foreground transition-all duration-300
      hover:brightness-110 active:scale-[0.97] ${FOCUS}
      ${full
                ? "w-full px-5 py-4 text-sm"
                : "h-10 whitespace-nowrap px-3.5 text-xs sm:px-5 sm:text-[13px]"
            }
    `}
    >
        {/* shine sweep */}
        <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/30 opacity-0 transition-all duration-700 group-hover/cta:translate-x-[420%] group-hover/cta:opacity-100"
        />
        <span className="relative">
            {full ? (
                "Start a project"
            ) : (
                <>
                    <span className="sm:hidden">Start</span>
                    <span className="hidden sm:inline">Start a project</span>
                </>
            )}
        </span>
        <FiArrowUpRight
            aria-hidden="true"
            className="relative h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5"
        />
    </Link>
);

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [progress, setProgress] = useState(0);
    const [activeSection, setActiveSection] = useState("home");
    const [hovered, setHovered] = useState(null);
    const [pill, setPill] = useState({ left: 0, width: 0, visible: false });

    const [isLight, setIsLight] = useState(() => {
        if (typeof window === "undefined") return false;
        return localStorage.getItem("theme") === "light";
    });

    const location = useLocation();
    const isHome = location.pathname === "/";
    const trackRef = useRef(null);
    const itemRefs = useRef({});

    /* ------------------------------ Theme ---------------------------------- */
    useEffect(() => {
        document.documentElement.classList.toggle("light", isLight);
        document.documentElement.style.colorScheme = isLight ? "light" : "dark";
    }, [isLight]);

    const toggleTheme = useCallback(() => {
        setIsLight((current) => {
            const next = !current;
            localStorage.setItem("theme", next ? "light" : "dark");
            return next;
        });
    }, []);

    /* ------------------- Scroll / active section / progress ---------------- */
    useEffect(() => {
        const ids = NAV_LINKS.map((l) => l.id);
        let raf = 0;

        const update = () => {
            raf = 0;
            const y = window.scrollY;
            setScrolled(y > 24);

            const max = document.documentElement.scrollHeight - window.innerHeight;
            setProgress(max > 0 ? Math.min(100, (y / max) * 100) : 0);

            let current = "home";
            for (const id of ids) {
                const el = document.getElementById(id);
                if (!el) continue;
                const rect = el.getBoundingClientRect();
                if (rect.top <= 140 && rect.bottom >= 140) {
                    current = id;
                    break;
                }
            }
            setActiveSection(current);
        };

        const onScroll = () => {
            if (!raf) raf = requestAnimationFrame(update);
        };

        update();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", onScroll);
            if (raf) cancelAnimationFrame(raf);
        };
    }, []);

    /* ------------------------ Mobile menu behaviour ------------------------ */
    useEffect(() => {
        setIsOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        if (!isOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const onKey = (e) => e.key === "Escape" && setIsOpen(false);
        const onResize = () => window.innerWidth >= 1024 && setIsOpen(false);
        window.addEventListener("keydown", onKey);
        window.addEventListener("resize", onResize);
        return () => {
            document.body.style.overflow = prev;
            window.removeEventListener("keydown", onKey);
            window.removeEventListener("resize", onResize);
        };
    }, [isOpen]);

    /* ------------------------------ Navigation ----------------------------- */
    const scrollToSection = useCallback((id, event) => {
        if (event) event.preventDefault();
        const el = document.getElementById(id);
        if (el) {
            const top = el.getBoundingClientRect().top + window.scrollY - 88;
            window.scrollTo({ top, behavior: "smooth" });
        } else if (id === "home") {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
        setIsOpen(false);
    }, []);

    const handleNav = useCallback(
        (id) => (event) => {
            if (isHome) scrollToSection(id, event);
            else setIsOpen(false);
        },
        [isHome, scrollToSection]
    );

    const isLinkActive = useCallback(
        (link) =>
            location.pathname === link.path ||
            (isHome && activeSection === link.id),
        [location.pathname, isHome, activeSection]
    );

    /* ------------------- Sliding indicator (desktop nav) ------------------- */
    const activeLink = NAV_LINKS.find(isLinkActive);
    const targetId = hovered ?? activeLink?.id ?? null;

    useLayoutEffect(() => {
        const measure = () => {
            const el = targetId ? itemRefs.current[targetId] : null;
            if (!el) return setPill((p) => ({ ...p, visible: false }));
            setPill({ left: el.offsetLeft, width: el.offsetWidth, visible: true });
        };
        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, [targetId, scrolled]);

    return (
        <>
            {/* Backdrop for the mobile menu */}
            <div
                aria-hidden="true"
                onClick={() => setIsOpen(false)}
                className={`
          fixed inset-0 z-40 bg-background/60 backdrop-blur-sm
          transition-opacity duration-500 lg:hidden
          ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}
        `}
            />

            <nav
                aria-label="Primary"
                className={`
          fixed inset-x-0 top-0 z-50 font-body
          px-3 transition-all duration-500 sm:px-6
          ${scrolled ? "pt-2 sm:pt-3" : "pt-3 sm:pt-5"}
        `}
            >
                {/* ------------------------- Floating island ------------------------- */}
                <div
                    className={`
            relative mx-auto transition-all duration-500 ease-out
            ${scrolled ? "max-w-5xl" : "max-w-7xl"}
          `}
                >
                    {/* Ambient glow behind the island */}
                    <div
                        aria-hidden="true"
                        className={`
              pointer-events-none absolute -inset-x-6 -inset-y-3 -z-10
              bg-primary/10 blur-3xl transition-opacity duration-700
              ${scrolled ? "opacity-100" : "opacity-0"}
            `}
                    />

                    <div
                        className={`
              relative flex items-center justify-between
              transition-all duration-500
              h-14 md:h-[3.75rem]
              ${scrolled || isOpen
                                ? "px-4 md:px-8 rounded-full border border-border/60 bg-background/70 backdrop-blur-2xl shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset,0_12px_40px_-12px_rgba(0,0,0,0.5)]"
                                : "border border-transparent bg-transparent"
                            }
            `}
                    >
                        {/* Top highlight line */}
                        <span
                            aria-hidden="true"
                            className={`
                pointer-events-none absolute inset-x-8 top-0 h-px
                bg-gradient-to-r from-transparent via-primary/70 to-transparent
                transition-opacity duration-500
                ${scrolled || isOpen ? "opacity-100" : "opacity-0"}
              `}
                        />

                        {/* ------------------------------ Logo ------------------------------ */}
                        <Link
                            to="/"
                            aria-label="Go to homepage"
                            onClick={(e) => {
                                if (isHome) scrollToSection("home", e);
                            }}
                            className={`group relative z-10 flex shrink-0 items-center gap-2.5 ${FOCUS}`}
                        >
                            <span className="flex items-center text-base font-semibold tracking-tight md:text-lg">
                                <span className="text-primary transition-transform duration-300 group-hover:-translate-x-0.5">
                                    {"<"}
                                </span>
                                <span className="mx-0.5 font-display! text-foreground transition-colors duration-300 group-hover:text-primary">
                                    shohag
                                </span>
                                <span className="text-primary transition-transform duration-300 group-hover:translate-x-0.5">
                                    {"/>"}
                                </span>
                            </span>

                            {/* <img src={logo} alt="Shohag Miah Logo"
                                className="h-25 w-auto object-contain" /> */}


                        </Link>

                        {/* ------------------------ Desktop navigation ------------------------ */}
                        <div className="absolute left-1/2 hidden -translate-x-1/2 lg:block">
                            <div
                                ref={trackRef}
                                onMouseLeave={() => setHovered(null)}
                                className="relative flex items-center p-1"
                            >
                                {/* sliding indicator */}
                                <span
                                    aria-hidden="true"
                                    className="pointer-events-none absolute inset-y-1 rounded-full bg-primary/[0.07] ring-1 ring-inset ring-primary/20 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                                    style={{
                                        left: pill.left,
                                        width: pill.width,
                                        opacity: pill.visible ? 1 : 0,
                                    }}
                                />

                                {NAV_LINKS.map((link) => {
                                    const active = isLinkActive(link);
                                    return (
                                        <Link
                                            key={link.id}
                                            ref={(el) => (itemRefs.current[link.id] = el)}
                                            to={link.path}
                                            onClick={handleNav(link.id)}
                                            onMouseEnter={() => setHovered(link.id)}
                                            onFocus={() => setHovered(link.id)}
                                            onBlur={() => setHovered(null)}
                                            aria-current={active ? "page" : undefined}
                                            className={`
                        relative px-3.5 py-2 xl:px-4
                        font-code text-xs font-medium tracking-wide
                        transition-colors duration-300 ${FOCUS}
                        ${active
                                                    ? "text-primary"
                                                    : "text-muted-foreground hover:text-foreground"
                                                }
                      `}
                                        >
                                            {link.label}
                                            <span
                                                aria-hidden="true"
                                                className={`
                          absolute -bottom-0.5 left-1/2 h-[2px] -translate-x-1/2
                          rounded-full bg-primary transition-all duration-500
                          ${active ? "w-4 opacity-100" : "w-0 opacity-0"}
                        `}
                                            />
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* --------------------------- Right controls -------------------------- */}
                        <div className="relative z-10 flex items-center gap-1 sm:gap-1.5">
                            <button
                                type="button"
                                onClick={toggleTheme}
                                aria-label={
                                    isLight ? "Switch to dark theme" : "Switch to light theme"
                                }
                                className={`group relative flex h-10 w-10 items-center justify-center rounded-sm text-muted-foreground transition-all duration-300 hover:bg-foreground/[0.06] hover:text-foreground ${FOCUS}`}
                            >
                                <FiMoon
                                    aria-hidden="true"
                                    className={`absolute h-[17px] w-[17px] transition-all duration-500 ${isLight
                                        ? "rotate-90 scale-0 opacity-0"
                                        : "rotate-0 scale-100 opacity-100"
                                        }`}
                                />
                                <FiSun
                                    aria-hidden="true"
                                    className={`absolute h-[17px] w-[17px] transition-all duration-500 ${isLight
                                        ? "rotate-0 scale-100 opacity-100"
                                        : "-rotate-90 scale-0 opacity-0"
                                        }`}
                                />
                            </button>

                            <span
                                aria-hidden="true"
                                className="mx-1 hidden h-5 w-px bg-border/60 lg:block"
                            />

                            {/* CTA — visible on every device */}
                            <Button to="https://github.com/DeveloperShohagMiah" target="_blank" className=" font-display font-semibold py-2.5! px-3! md:py-3! md:px-6!"><FiGithub /> <span >Github</span> </Button>

                            {/* Menu toggle — below lg */}
                            <button
                                type="button"
                                onClick={() => setIsOpen((c) => !c)}
                                aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
                                aria-expanded={isOpen}
                                aria-controls="mobile-menu"
                                className={`relative flex h-10 w-10 items-center justify-center rounded-sm text-foreground transition-all duration-300 hover:bg-foreground/[0.06] lg:hidden ${FOCUS}`}
                            >
                                <FiMenu
                                    aria-hidden="true"
                                    className={`absolute h-5 w-5 transition-all duration-300 ${isOpen ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
                                        }`}
                                />
                                <FiX
                                    aria-hidden="true"
                                    className={`absolute h-5 w-5 transition-all duration-300 ${isOpen ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
                                        }`}
                                />
                            </button>
                        </div>

                        {/* Scroll progress — sits on the island's bottom edge */}
                        <span
                            aria-hidden="true"
                            className={`
                pointer-events-none absolute inset-x-6 bottom-0 h-px overflow-hidden
                transition-opacity duration-500
                ${scrolled ? "opacity-100" : "opacity-0"}
              `}
                        >
                            <span
                                className="block h-full bg-gradient-to-r from-primary/0 via-primary to-primary/0 transition-[width] duration-150 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </span>
                    </div>

                    {/* --------------------------- Mobile menu --------------------------- */}
                    <div
                        id="mobile-menu"
                        className={`
              grid transition-all duration-500 ease-out lg:hidden
              ${isOpen
                                ? "grid-rows-[1fr] pt-2 opacity-100"
                                : "pointer-events-none grid-rows-[0fr] opacity-0"
                            }
            `}
                    >
                        <div className="min-h-0 overflow-hidden">
                            <div className="max-h-[calc(100dvh-6.5rem)] font-display overflow-y-auto rounded-xl border border-border/60 bg-background/90 backdrop-blur-2xl shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)]">
                                <ul className="p-2">
                                    {NAV_LINKS.map((link, i) => {
                                        const active = isLinkActive(link);
                                        return (
                                            <li key={link.id}>
                                                <Link
                                                    to={link.path}
                                                    onClick={handleNav(link.id)}
                                                    aria-current={active ? "page" : undefined}
                                                    style={{
                                                        transitionDelay: isOpen ? `${80 + i * 40}ms` : "0ms",
                                                    }}
                                                    className={`group flex items-center justify-between px-4 py-3.5 transition-all duration-500 rounded-md ${FOCUS}
                            ${isOpen ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}
                            ${active
                                                            ? "bg-foreground/[0.06] text-foreground"
                                                            : "text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground"
                                                        }
                          `}
                                                >
                                                    <span className="flex items-center gap-3">
                                                        <span
                                                            aria-hidden="true"
                                                            className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${active ? "scale-125 bg-primary" : "bg-border"
                                                                }`}
                                                        />
                                                        <span className="text-base font-medium">
                                                            {link.label}
                                                        </span>
                                                    </span>
                                                    <FiArrowUpRight
                                                        aria-hidden="true"
                                                        className="h-4 w-4 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                                                    />
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>

                                <div className="border-t border-border/60 p-2">
                                    <Button to="#contact" className="w-full">Start A project <FiSend /></Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;