import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import About from '../components/About'
import Services from '../components/Services'
import Skills from '../components/Skills'
import Projects from '../components/Projects'
import Contact from '../components/Contact '
import Blog from '../components/Blogs'
import FAQ from '../components/Faq'
import FloatingDock from '../ui/FlaotingDock'


const Layout = () => {
    return (
        <><Navbar />
            <Hero />
            <About />
            <Services />
            <Skills />
            <Projects />
            <Blog />
            <FAQ />
            <Contact />
            <FloatingDock
                xUrl="https://x..com/YOUR_USERNAME"
                telegramUrl="https://t..me/YOUR_USERNAME"
            /></>
    )
}

export default Layout