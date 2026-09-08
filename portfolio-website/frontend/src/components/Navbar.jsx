
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    FiMenu,
    FiX,
    FiMoon,
    FiSun,
    FiArrowUpRight,
} from 'react-icons/fi';

const NAV_LINKS = [
    { id: 'about', label: 'About', path: '/about' },
    { id: 'services', label: 'Services', path: '/services' },
    { id: 'skills', label: 'Skills', path: '/skills' },
    { id: 'portfolio', label: 'Projects', path: '/portfolio' },
    { id: 'blog', label: 'Blogs', path: '/blogs' },
    { id: 'contact', label: 'Contact', path: '/contact' },
];

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [progress, setProgress] = useState(0);
    const [activeSection, setActiveSection] = useState('home');

    const [isLight, setIsLight] = useState(() => {
        if (typeof window === 'undefined') return false;

        return localStorage.getItem('theme') === 'light';
    });

    const location = useLocation();

    /* ------------------------------------------------------------------------
       Theme
       ------------------------------------------------------------------------ */

    useEffect(() => {
        document.documentElement.classList.toggle('light', isLight);
        document.documentElement.style.colorScheme = isLight ? 'light' : 'dark';
    }, [isLight]);

    /* ------------------------------------------------------------------------
       Scroll / Active Section / Progress
       ------------------------------------------------------------------------ */

    useEffect(() => {
        const sectionIds = NAV_LINKS.map((link) => link.id);

        const handleScroll = () => {
            const y = window.scrollY;

            setScrolled(y > 24);

            const documentHeight =
                document.documentElement.scrollHeight - window.innerHeight;

            setProgress(
                documentHeight > 0
                    ? Math.min(100, (y / documentHeight) * 100)
                    : 0
            );

            let currentSection = 'home';

            for (const id of sectionIds) {
                const element = document.getElementById(id);

                if (!element) continue;

                const rect = element.getBoundingClientRect();

                if (rect.top <= 140 && rect.bottom >= 140) {
                    currentSection = id;
                    break;
                }
            }

            setActiveSection(currentSection);
        };

        handleScroll();

        window.addEventListener('scroll', handleScroll, {
            passive: true,
        });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    /* ------------------------------------------------------------------------
       Close mobile navigation on route change
       ------------------------------------------------------------------------ */

    useEffect(() => {
        setIsOpen(false);
    }, [location.pathname]);

    /* ------------------------------------------------------------------------
       Smooth scroll
       ------------------------------------------------------------------------ */

    const scrollToSection = useCallback((id, event) => {
        if (event) {
            event.preventDefault();
        }

        const element = document.getElementById(id);

        if (element) {
            const offset = 88;

            const top =
                element.getBoundingClientRect().top +
                window.scrollY -
                offset;

            window.scrollTo({
                top,
                behavior: 'smooth',
            });
        }

        setIsOpen(false);
    }, []);

    /* ------------------------------------------------------------------------
       Theme toggle
       ------------------------------------------------------------------------ */

    const toggleTheme = useCallback(() => {
        setIsLight((current) => {
            const next = !current;

            localStorage.setItem(
                'theme',
                next ? 'light' : 'dark'
            );

            return next;
        });
    }, []);

    /* ------------------------------------------------------------------------
       Active navigation item
       ------------------------------------------------------------------------ */

    const isLinkActive = useMemo(
        () => (link) => {
            if (location.pathname === link.path) {
                return true;
            }

            return (
                location.pathname === '/' &&
                activeSection === link.id
            );
        },
        [location.pathname, activeSection]
    );

    return (
        <nav
            className={`
        fixed inset-x-0 top-0 z-50
        font-body
        transition-all duration-500
        ${scrolled
                    ? 'bg-background/75 backdrop-blur-2xl'
                    : 'bg-transparent'
                }
      `}
        >
            {/* --------------------------------------------------------------------
          Subtle top glow
          -------------------------------------------------------------------- */}

            <div
                aria-hidden="true"
                className={`
          pointer-events-none absolute inset-x-0 top-0 h-px
          transition-opacity duration-500
          ${scrolled
                        ? 'bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-100'
                        : 'opacity-0'
                    }
        `}
            />

            {/* --------------------------------------------------------------------
          Main Navbar
          -------------------------------------------------------------------- */}

            <div
                className={`
          mx-auto max-w-7xl px-5 transition-all duration-500
          sm:px-8
          ${scrolled ? 'py-2' : 'py-3 md:py-4'}
        `}
            >
                <div
                    className={`
            relative flex h-14 items-center justify-between
            rounded-2xl border px-3
            transition-all duration-500
            md:h-16 md:px-4
            ${scrolled
                            ? 'border-border/70 bg-card/35 shadow-lg shadow-black/10 backdrop-blur-xl'
                            : 'border-transparent bg-transparent'
                        }
          `}
                >
                    {/* ----------------------------------------------------------------
              Logo
              ---------------------------------------------------------------- */}

                    <Link
                        to="/"
                        onClick={(event) => {
                            if (location.pathname === '/') {
                                scrollToSection('home', event);
                            }
                        }}
                        aria-label="Go to homepage"
                        className="group flex shrink-0 items-center"
                    >
                        <div className="flex items-center font-code text-base font-semibold tracking-tight md:text-lg">
                            <span
                                className="
                  text-primary
                  transition-transform duration-300
                  group-hover:-translate-x-0.5
                "
                            >
                                {'<'}
                            </span>

                            <span
                                className="
                  mx-0.5 text-foreground
                  transition-all duration-300
                  group-hover:text-primary
                "
                            >
                                shohag
                            </span>

                            <span
                                className="
                  text-primary
                  transition-transform duration-300
                  group-hover:translate-x-0.5
                "
                            >
                                {'/>'}
                            </span>
                        </div>

                        {/* Small status indicator */}
                        <span className="ml-3 hidden h-1.5 w-1.5 rounded-full bg-[#ff4d00] shadow-[0_0_10px_rgba(255,77,0,0.5)] sm:block" />
                    </Link>

                    {/* ----------------------------------------------------------------
              Desktop Navigation
              ---------------------------------------------------------------- */}

                    <div className="absolute left-1/2 hidden -translate-x-1/2 md:flex">
                        <div className="flex items-center rounded-full border border-border/60 bg-muted/30 p-1 shadow-sm backdrop-blur-xl">
                            {NAV_LINKS.map((link) => {
                                const active = isLinkActive(link);

                                return (
                                    <Link
                                        key={link.id}
                                        to={link.path}
                                        onClick={(event) => {
                                            if (location.pathname === '/') {
                                                scrollToSection(link.id, event);
                                            }
                                        }}
                                        className={`
                      group relative rounded-full
                      px-3.5 py-2
                      text-[10px] font-medium uppercase
                      tracking-[0.08em]
                      transition-all duration-300
                      md:px-4
                      ${active
                                                ? 'text-foreground'
                                                : 'text-muted-foreground hover:text-foreground'
                                            }
                    `}
                                    >
                                        {/* Active pill */}
                                        {active && (
                                            <span
                                                aria-hidden="true"
                                                className="
                          absolute inset-0 -z-10
                          rounded-full
                          bg-foreground/6
                          shadow-sm
                        "
                                            />
                                        )}

                                        <span className="relative">
                                            {link.label}
                                        </span>

                                        {/* Active indicator */}
                                        <span
                                            className={`
                        absolute bottom-1 left-1/2
                        h-0.5 -translate-x-1/2
                        rounded-full bg-primary
                        transition-all duration-300
                        ${active
                                                    ? 'w-3 opacity-100'
                                                    : 'w-0 opacity-0'
                                                }
                      `}
                                        />
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* ----------------------------------------------------------------
              Right Controls
              ---------------------------------------------------------------- */}

                    <div className="flex items-center gap-1">
                        {/* Theme Toggle */}

                        <button
                            type="button"
                            onClick={toggleTheme}
                            aria-label={
                                isLight
                                    ? 'Switch to dark theme'
                                    : 'Switch to light theme'
                            }
                            className="
                group relative flex h-10 w-10
                items-center justify-center
                rounded-full
                text-muted-foreground
                transition-all duration-300
                hover:bg-card
                hover:text-foreground
              "
                        >
                            <FiMoon
                                className={`
                  absolute h-[17px] w-[17px]
                  transition-all duration-500
                  ${isLight
                                        ? 'rotate-90 scale-0 opacity-0'
                                        : 'rotate-0 scale-100 opacity-100'
                                    }
                `}
                            />

                            <FiSun
                                className={`
                  absolute h-[17px] w-[17px]
                  transition-all duration-500
                  ${isLight
                                        ? 'rotate-0 scale-100 opacity-100'
                                        : '-rotate-90 scale-0 opacity-0'
                                    }
                `}
                            />
                        </button>

                        {/* Desktop divider */}

                        <span
                            aria-hidden="true"
                            className="mx-2 hidden h-5 w-px bg-border md:block"
                        />

                        {/* Desktop CTA */}

                        <a
                            href="#contact"
                            onClick={(event) => {
                                if (location.pathname === '/') {
                                    scrollToSection('contact', event);
                                }
                            }}
                            className="
                group hidden
                h-10 items-center gap-2
                rounded-full
                bg-primary px-4
                text-xs font-semibold
                text-primary-foreground
                shadow-lg shadow-primary/10
                transition-all duration-300
                hover:-translate-y-0.5
                hover:shadow-xl hover:shadow-primary/20
                md:inline-flex
              "
                        >
                            <span>Start a project</span>

                            <FiArrowUpRight
                                className="
                  h-3.5 w-3.5
                  transition-transform duration-300
                  group-hover:-translate-y-0.5
                  group-hover:translate-x-0.5
                "
                            />
                        </a>

                        {/* Mobile menu */}

                        <button
                            type="button"
                            onClick={() => setIsOpen((current) => !current)}
                            aria-label={
                                isOpen
                                    ? 'Close navigation menu'
                                    : 'Open navigation menu'
                            }
                            aria-expanded={isOpen}
                            className="
                flex h-10 w-10
                items-center justify-center
                rounded-full
                text-foreground
                transition-all duration-300
                hover:bg-card
                md:hidden
              "
                        >
                            {isOpen ? (
                                <FiX className="h-5 w-5" />
                            ) : (
                                <FiMenu className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </div>

                {/* ------------------------------------------------------------------
            Mobile Navigation
            ------------------------------------------------------------------ */}

                <div
                    className={`
            overflow-hidden transition-all duration-500
            md:hidden
            ${isOpen
                            ? 'max-h-[30rem] pt-2 opacity-100'
                            : 'max-h-0 opacity-0'
                        }
          `}
                >
                    <div
                        className="
              overflow-hidden rounded-2xl
              border border-border/70
              bg-background/85
              shadow-2xl shadow-black/20
              backdrop-blur-2xl
            "
                    >
                        {/* Mobile links */}

                        <div className="p-2">
                            {NAV_LINKS.map((link) => {
                                const active = isLinkActive(link);

                                return (
                                    <Link
                                        key={link.id}
                                        to={link.path}
                                        onClick={(event) => {
                                            if (location.pathname === '/') {
                                                scrollToSection(link.id, event);
                                            } else {
                                                setIsOpen(false);
                                            }
                                        }}
                                        className={`
                      group flex items-center
                      justify-between
                      rounded-xl px-4 py-3.5
                      transition-all duration-300
                      ${active
                                                ? 'bg-card text-foreground'
                                                : 'text-muted-foreground hover:bg-card/60 hover:text-foreground'
                                            }
                    `}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span
                                                className={`
                          h-1.5 w-1.5 rounded-full
                          transition-all duration-300
                          ${active
                                                        ? 'bg-primary shadow-[0_0_8px_rgba(255,255,255,0.35)]'
                                                        : 'bg-border'
                                                    }
                        `}
                                            />

                                            <span className="text-xs font-medium uppercase tracking-[0.08em]">
                                                {link.label}
                                            </span>
                                        </div>

                                        <FiArrowUpRight
                                            className="
                        h-4 w-4
                        opacity-0
                        -translate-x-1
                        transition-all duration-300
                        group-hover:translate-x-0
                        group-hover:opacity-100
                      "
                                        />
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Mobile CTA */}

                        <div className="border-t border-border/60 p-2">
                            <a
                                href="#contact"
                                onClick={(event) => {
                                    if (location.pathname === '/') {
                                        scrollToSection('contact', event);
                                    } else {
                                        setIsOpen(false);
                                    }
                                }}
                                className="
                  group flex items-center
                  justify-between
                  rounded-xl
                  bg-primary
                  px-4 py-3.5
                  text-sm font-semibold
                  text-primary-foreground
                  transition-all duration-300
                  hover:opacity-90
                "
                            >
                                <span>Start a project</span>

                                <FiArrowUpRight
                                    className="
                    h-4 w-4
                    transition-transform duration-300
                    group-hover:-translate-y-0.5
                    group-hover:translate-x-0.5
                  "
                                />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* --------------------------------------------------------------------
          Scroll Progress
          -------------------------------------------------------------------- */}

            <div
                aria-hidden="true"
                className={`
          absolute bottom-0 left-0 right-0
          h-px overflow-hidden
          transition-opacity duration-500
          ${scrolled ? 'opacity-100' : 'opacity-0'}
        `}
            >
                <div
                    className="
            h-full
            bg-gradient-to-r
            from-primary/0
            via-primary
            to-primary/0
            transition-[width]
            duration-150
            ease-out
          "
                    style={{
                        width: `${progress}%`,
                    }}
                />
            </div>
        </nav>
    );
};

export default Navbar;

