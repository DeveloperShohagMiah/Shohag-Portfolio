import {
    useState,
    useEffect,
    useLayoutEffect,
    useRef,
    useCallback,
} from "react";
import { Link, useLocation } from "react-router-dom";
import {
    FiMenu,
    FiX,
    FiMoon,
    FiSun,
    FiArrowUpRight,
    FiGithub,
    FiSend,
} from "react-icons/fi";

const NAV_LINKS = [
    { id: "about", label: "About", path: "/about" },
    { id: "services", label: "Services", path: "/services" },
    { id: "skills", label: "Skills", path: "/skills" },
    { id: "portfolio", label: "Projects", path: "/portfolio" },
    { id: "blog", label: "Blogs", path: "/blogs" },
    { id: "testimonial", label: "Testimonials", path: "/testimonials" },
    { id: "contact", label: "Contact", path: "/contact" },
];

const GITHUB_URL = "https://github.com/DeveloperShohagMiah";

/** Distance from the top of the viewport used to decide the "current" section */
const SPY_OFFSET = 160;
/** Offset applied when scrolling to a section (fixed navbar height) */
const SCROLL_OFFSET = 88;

const FOCUS =
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

/* -------------------------------------------------------------------------- */
/*  Theme helpers (safe for SSR / blocked storage)                            */
/* -------------------------------------------------------------------------- */
const readStoredTheme = () => {
    if (typeof window === "undefined") return false;
    try {
        return localStorage.getItem("theme") === "light";
    } catch {
        return false;
    }
};

/* -------------------------------------------------------------------------- */
/*  ShineButton — filled pill with a hover shine sweep                        */
/*  Renders whatever element you pass in `as` (<a> by default, or <Link>)    */
/* -------------------------------------------------------------------------- */
const ShineButton = ({ as: Tag = "a", className = "", children, ...props }) => (
    <Tag
        className={`
      group/btn relative inline-flex items-center justify-center gap-2
      overflow-hidden rounded-full bg-linear-to-br from-primary to-primary/80
      font-semibold text-primary-foreground ring-1 ring-inset ring-white/20
      shadow-lg shadow-primary/25 transition-all duration-300
      hover:shadow-xl hover:shadow-primary/40 hover:brightness-110
      active:scale-[0.97] ${FOCUS} ${className}
    `}
        {...props}
    >
        <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-2/5 -translate-x-full -skew-x-12 bg-linear-to-r from-transparent via-white/45 to-transparent will-change-transform transition-transform duration-0 ease-out group-hover/btn:translate-x-[350%] group-hover/btn:duration-[900ms] motion-reduce:hidden"
        />
        {children}
    </Tag>
);

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("home");
    const [hovered, setHovered] = useState(null);
    const [pill, setPill] = useState({ left: 0, width: 0, visible: false });
    const [pillReady, setPillReady] = useState(false);
    const [isLight, setIsLight] = useState(readStoredTheme);

    const location = useLocation();
    const isHome = location.pathname === "/";

    const trackRef = useRef(null);
    const itemRefs = useRef({});
    const progressRef = useRef(null);
    const toggleRef = useRef(null);

    /* ------------------------------ Theme ---------------------------------- */
    // Layout effect = applied before paint, so no flash after mount
    useLayoutEffect(() => {
        document.documentElement.classList.toggle("light", isLight);
        document.documentElement.style.colorScheme = isLight ? "light" : "dark";
    }, [isLight]);

    const toggleTheme = useCallback(() => {
        const next = !isLight;
        setIsLight(next);
        try {
            localStorage.setItem("theme", next ? "light" : "dark");
        } catch {
            /* storage unavailable — theme still changes for this session */
        }
    }, [isLight]);

    /* ------------------- Scroll / active section / progress ---------------- */
    useEffect(() => {
        let raf = 0;

        const update = () => {
            raf = 0;
            const y = window.scrollY;
            setScrolled(y > 24);

            // Progress is written straight to the DOM — no re-render per frame
            const max =
                document.documentElement.scrollHeight - window.innerHeight;
            const p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
            if (progressRef.current) {
                progressRef.current.style.transform = `scaleX(${p})`;
            }

            // The current section is the one whose top most recently crossed the
            // spy line. This works in any DOM order and has no "gaps" between
            // sections that would make the highlight flicker back to "home".
            let current = "home";
            let lastId = null;
            let bestTop = -Infinity;
            for (const { id } of NAV_LINKS) {
                const el = document.getElementById(id);
                if (!el) continue;
                lastId = id;
                const top = el.getBoundingClientRect().top;
                if (top <= SPY_OFFSET && top > bestTop) {
                    bestTop = top;
                    current = id;
                }
            }
            // Short last sections (e.g. Contact) can never reach the spy line
            if (max > 0 && y >= max - 4 && lastId) current = lastId;

            setActiveSection(current);
        };

        const onScroll = () => {
            if (!raf) raf = requestAnimationFrame(update);
        };

        update();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
            if (raf) cancelAnimationFrame(raf);
        };
    }, [location.pathname]); // re-run when a different page's sections mount

    /* ------------------------ Mobile menu behaviour ------------------------ */
    useEffect(() => {
        setIsOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        if (!isOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const onKey = (e) => {
            if (e.key === "Escape") {
                setIsOpen(false);
                toggleRef.current?.focus(); // hand focus back to the trigger
            }
        };
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
            const top =
                el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
            window.scrollTo({ top, behavior: "smooth" });
        } else if (id === "home") {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
        setIsOpen(false);
    }, []);

    // On the home page links scroll to their section; elsewhere they navigate.
    const handleNav = useCallback(
        (id) => (event) => {
            if (isHome) scrollToSection(id, event);
            else setIsOpen(false);
        },
        [isHome, scrollToSection]
    );

    const isRouteActive = (link) => location.pathname === link.path;
    const isLinkActive = useCallback(
        (link) =>
            location.pathname === link.path ||
            (isHome && activeSection === link.id),
        [location.pathname, isHome, activeSection]
    );

    /* ------------------- Sliding indicator (desktop nav) ------------------- */
    const activeLink = NAV_LINKS.find(isLinkActive);
    const targetId = hovered ?? activeLink?.id ?? null;

    const measure = useCallback(() => {
        const el = targetId ? itemRefs.current[targetId] : null;
        if (!el) {
            setPill((p) => (p.visible ? { ...p, visible: false } : p));
            return;
        }
        const left = el.offsetLeft;
        const width = el.offsetWidth;
        setPill((p) =>
            p.visible && p.left === left && p.width === width
                ? p
                : { left, width, visible: true }
        );
    }, [targetId]);

    useLayoutEffect(() => {
        measure();
        // Skip the slide-in from x = 0 on the very first measurement
        const raf = requestAnimationFrame(() => setPillReady(true));

        // Re-measure whenever the track changes size (resize, web fonts loading)
        const ro =
            typeof ResizeObserver !== "undefined"
                ? new ResizeObserver(measure)
                : null;
        if (ro && trackRef.current) ro.observe(trackRef.current);
        document.fonts?.ready?.then(measure);

        return () => {
            cancelAnimationFrame(raf);
            ro?.disconnect();
        };
    }, [measure]);

    const floating = scrolled || isOpen;

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

            {/* pointer-events-none: the full-width bar must not block clicks on the
          page behind it — only the island and the menu panel are interactive */}
            <nav
                aria-label="Primary"
                className={`
          pointer-events-none fixed inset-x-0 top-0 z-50 font-body
          px-3 transition-all duration-500 sm:px-6
          ${scrolled ? "pt-2 sm:pt-3" : "pt-3 sm:pt-5"}
        `}
            >
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
              rounded-full bg-primary/15 blur-3xl transition-opacity duration-700
              ${scrolled ? "opacity-100" : "opacity-0"}
            `}
                    />

                    {/* ---------- Island: 1px gradient border wrapper + glass body ---------- */}
                    <div
                        className={`
              pointer-events-auto rounded-full p-px transition-all duration-500
              ${floating
                                ? "bg-linear-to-b from-primary/50 via-border to-border/20 shadow-[var(--elev-md)]"
                                : "bg-transparent"
                            }
            `}
                    >
                        <div
                            className={`
                relative flex h-14 items-center justify-between rounded-full
                transition-all duration-500 md:h-[3.75rem]
                ${floating
                                    ? "bg-background/75 px-4 backdrop-blur-2xl md:px-8"
                                    : "bg-transparent px-0"
                                }
              `}
                        >
                            {/* Top highlight line */}
                            <span
                                aria-hidden="true"
                                className={`
                  pointer-events-none absolute inset-x-10 top-0 h-px
                  bg-linear-to-r from-transparent via-primary/70 to-transparent
                  transition-opacity duration-500
                  ${floating ? "opacity-100" : "opacity-0"}
                `}
                            />

                            {/* ------------------------------ Logo ------------------------------ */}
                            <Link
                                to="/"
                                aria-label="Go to homepage"
                                onClick={(e) => {
                                    if (isHome) scrollToSection("home", e);
                                }}
                                className={`group relative z-10 flex shrink-0 items-center rounded-md ${FOCUS}`}
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
                                        className={`
                      pointer-events-none absolute inset-y-1 rounded-full
                      bg-linear-to-b from-primary/20 to-primary/5
                      ring-1 ring-inset ring-primary/25
                      shadow-[0_0_24px_-6px] shadow-primary/50
                      ${pillReady
                                                ? "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                                                : ""
                                            }
                    `}
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
                                                aria-current={
                                                    isRouteActive(link)
                                                        ? "page"
                                                        : active
                                                            ? "location"
                                                            : undefined
                                                }
                                                className={`
                          relative rounded-full px-3 py-2 font-display text-xs
                          font-medium tracking-wide transition-colors duration-300
                          xl:px-4 ${FOCUS}
                          ${active
                                                        ? "text-primary"
                                                        : "text-muted-foreground hover:text-foreground"
                                                    }
                        `}
                                            >
                                                {link.label}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* --------------------------- Right controls -------------------------- */}
                            <div className="relative z-10 flex items-center gap-1.5 sm:gap-2">
                                <button
                                    type="button"
                                    onClick={toggleTheme}
                                    aria-label={
                                        isLight ? "Switch to dark theme" : "Switch to light theme"
                                    }
                                    className={`relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-transparent text-muted-foreground transition-all duration-300 hover:border-border hover:bg-foreground/[0.05] hover:text-foreground ${FOCUS}`}
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
                                    className="mx-0.5 hidden h-5 w-px bg-border lg:block"
                                />

                                {/* GitHub — label hides where space is tight (< sm, and lg only) */}
                                <ShineButton
                                    href={GITHUB_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Open GitHub profile (opens in a new tab)"
                                    className="h-10 px-3.5 text-xs font-display sm:px-5"
                                >
                                    <FiGithub aria-hidden="true" className="h-4 w-4" />
                                    <span className="hidden sm:inline lg:hidden xl:inline">
                                        GitHub
                                    </span>
                                </ShineButton>

                                {/* Menu toggle — below lg */}
                                <button
                                    ref={toggleRef}
                                    type="button"
                                    onClick={() => setIsOpen((c) => !c)}
                                    aria-label={
                                        isOpen ? "Close navigation menu" : "Open navigation menu"
                                    }
                                    aria-expanded={isOpen}
                                    aria-controls="mobile-menu"
                                    className={`relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-transparent text-foreground transition-all duration-300 hover:border-border hover:bg-foreground/[0.05] lg:hidden ${FOCUS}`}
                                >
                                    <FiMenu
                                        aria-hidden="true"
                                        className={`absolute h-5 w-5 transition-all duration-300 ${isOpen
                                            ? "rotate-90 scale-0 opacity-0"
                                            : "rotate-0 scale-100 opacity-100"
                                            }`}
                                    />
                                    <FiX
                                        aria-hidden="true"
                                        className={`absolute h-5 w-5 transition-all duration-300 ${isOpen
                                            ? "rotate-0 scale-100 opacity-100"
                                            : "-rotate-90 scale-0 opacity-0"
                                            }`}
                                    />
                                </button>
                            </div>

                            {/* Scroll progress — on the island's bottom edge */}
                            <span
                                aria-hidden="true"
                                className={`
                  pointer-events-none absolute inset-x-10 bottom-0 h-[2px]
                  overflow-hidden rounded-full transition-opacity duration-500
                  ${scrolled ? "opacity-100" : "opacity-0"}
                `}
                            >
                                <span
                                    ref={progressRef}
                                    className="block h-full origin-left bg-linear-to-r from-primary/30 to-primary"
                                    style={{ transform: "scaleX(0)" }}
                                />
                            </span>
                        </div>
                    </div>

                    {/* --------------------------- Mobile menu --------------------------- */}
                    {/* `invisible` when closed removes the links from the tab order,
              so keyboard users can't focus items they can't see */}
                    <div
                        id="mobile-menu"
                        className={`
              grid transition-all duration-500 ease-out lg:hidden
              ${isOpen
                                ? "visible grid-rows-[1fr] pt-2 opacity-100"
                                : "pointer-events-none invisible grid-rows-[0fr] opacity-0"
                            }
            `}
                    >
                        <div className="min-h-0 overflow-hidden">
                            <div className="pointer-events-auto max-h-[calc(100dvh-6.5rem)] overflow-y-auto rounded-3xl border border-border/70 bg-background/90 font-display shadow-[var(--elev-lg)] backdrop-blur-2xl">
                                <ul className="p-2">
                                    {NAV_LINKS.map((link, i) => {
                                        const active = isLinkActive(link);
                                        return (
                                            <li key={link.id}>
                                                <Link
                                                    to={link.path}
                                                    onClick={handleNav(link.id)}
                                                    aria-current={
                                                        isRouteActive(link)
                                                            ? "page"
                                                            : active
                                                                ? "location"
                                                                : undefined
                                                    }
                                                    style={{
                                                        transitionDelay: isOpen
                                                            ? `${80 + i * 40}ms`
                                                            : "0ms",
                                                    }}
                                                    className={`group flex items-center justify-between rounded-2xl px-4 py-3.5 transition-all duration-500 ${FOCUS}
                            ${isOpen
                                                            ? "translate-y-0 opacity-100"
                                                            : "translate-y-2 opacity-0"
                                                        }
                            ${active
                                                            ? "bg-primary/10 text-foreground"
                                                            : "text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground"
                                                        }
                          `}
                                                >
                                                    <span className="flex items-center gap-3">
                                                        <span
                                                            aria-hidden="true"
                                                            className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${active
                                                                ? "scale-125 bg-primary shadow-[0_0_10px] shadow-primary"
                                                                : "bg-border"
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

                                <div className="flex flex-col gap-2 border-t border-border/60 p-3">
                                    {/* Fixed: was <Button to="#contact">, which neither scrolled nor closed the menu */}
                                    <ShineButton
                                        as={Link}
                                        to="/contact"
                                        onClick={handleNav("contact")}
                                        className="w-full px-5 py-3.5 text-sm"
                                    >
                                        Start a project
                                        <FiSend aria-hidden="true" className="h-4 w-4" />
                                    </ShineButton>
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