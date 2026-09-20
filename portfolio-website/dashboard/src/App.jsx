import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { DataProvider } from './context/DataContext.jsx';
import { Layout } from './components/Layout.jsx';
import { DashboardOverview } from './pages/DashboardOverview.jsx';
import { AboutSection } from './pages/AboutSection.jsx';
import { ServicesSection } from './pages/ServicesSection.jsx';
import { SkillsSection } from './pages/SkillsSection.jsx';
import { ProjectsSection } from './pages/ProjectsSection.jsx';
import { BlogsSection } from './pages/BlogsSection.jsx';
import { FaqSection } from './pages/FaqSection.jsx';
import { TestimonialsSection } from './pages/TestimonialsSection.jsx';
import { ContactSection } from './pages/ContactSection.jsx';

export default function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<DashboardOverview />} />
              <Route path="about" element={<AboutSection />} />
              <Route path="services" element={<ServicesSection />} />
              <Route path="skills" element={<SkillsSection />} />
              <Route path="projects" element={<ProjectsSection />} />
              <Route path="blogs" element={<BlogsSection />} />
              <Route path="faq" element={<FaqSection />} />
              <Route path="testimonials" element={<TestimonialsSection />} />
              <Route path="contact" element={<ContactSection />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </ThemeProvider>
  );
}
