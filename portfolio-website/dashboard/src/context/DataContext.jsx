import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialProfile,
  initialAbout,
  initialServices,
  initialSkills,
  initialProjects,
  initialBlogs,
  initialFaqs,
  initialTestimonials,
  initialContactMessages,
  initialContactInfo,
  initialNotifications
} from '../data/mockData.js';
import toast from 'react-hot-toast';

const DataContext = createContext(null);

function loadFromStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(`portfolio_cms_${key}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (typeof fallback === 'object' && fallback !== null && !Array.isArray(fallback)) {
        return {
          ...fallback,
          ...parsed,
          ...(fallback.socialLinks
            ? { socialLinks: { ...fallback.socialLinks, ...(parsed.socialLinks || {}) } }
            : {})
        };
      }
      return parsed;
    }
  } catch (e) {
    console.error(`Failed to load ${key} from storage`, e);
  }
  return fallback;
}

function saveToStorage(key, val) {
  try {
    localStorage.setItem(`portfolio_cms_${key}`, JSON.stringify(val));
  } catch (e) {
    console.error(`Failed to save ${key} to storage`, e);
  }
}

export function DataProvider({ children }) {
  const [profile, setProfile] = useState(() => loadFromStorage('profile', initialProfile));
  const [about, setAbout] = useState(() => loadFromStorage('about', initialAbout));
  const [services, setServices] = useState(() => loadFromStorage('services', initialServices));
  const [skills, setSkills] = useState(() => loadFromStorage('skills', initialSkills));
  const [projects, setProjects] = useState(() => loadFromStorage('projects', initialProjects));
  const [blogs, setBlogs] = useState(() => loadFromStorage('blogs', initialBlogs));
  const [faqs, setFaqs] = useState(() => loadFromStorage('faqs', initialFaqs));
  const [testimonials, setTestimonials] = useState(() => loadFromStorage('testimonials', initialTestimonials));
  const [messages, setMessages] = useState(() => loadFromStorage('messages', initialContactMessages));
  const [contactInfo, setContactInfo] = useState(() => loadFromStorage('contactInfo', initialContactInfo));
  const [notifications, setNotifications] = useState(() => loadFromStorage('notifications', initialNotifications));
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { saveToStorage('profile', profile); }, [profile]);
  useEffect(() => { saveToStorage('about', about); }, [about]);
  useEffect(() => { saveToStorage('services', services); }, [services]);
  useEffect(() => { saveToStorage('skills', skills); }, [skills]);
  useEffect(() => { saveToStorage('projects', projects); }, [projects]);
  useEffect(() => { saveToStorage('blogs', blogs); }, [blogs]);
  useEffect(() => { saveToStorage('faqs', faqs); }, [faqs]);
  useEffect(() => { saveToStorage('testimonials', testimonials); }, [testimonials]);
  useEffect(() => { saveToStorage('messages', messages); }, [messages]);
  useEffect(() => { saveToStorage('contactInfo', contactInfo); }, [contactInfo]);
  useEffect(() => { saveToStorage('notifications', notifications); }, [notifications]);

  // Profile actions
  const updateProfile = (updated) => {
    setProfile(prev => {
      const merged = {
        ...prev,
        ...updated,
        socialLinks: {
          ...(prev.socialLinks || {}),
          ...(updated.socialLinks || {})
        }
      };
      return merged;
    });

    // Keep contactInfo and about in sync if corresponding fields change
    if (updated.address) {
      setContactInfo(prev => ({ ...prev, location: updated.address }));
      setAbout(prev => ({ ...prev, location: updated.address }));
    }
    if (updated.isAvailable !== undefined) {
      setContactInfo(prev => ({ ...prev, availableForFreelance: updated.isAvailable }));
      setAbout(prev => ({ ...prev, availableForHire: updated.isAvailable }));
    }
    if (updated.email) {
      setContactInfo(prev => ({ ...prev, email: updated.email }));
    }
    if (updated.phone) {
      setContactInfo(prev => ({ ...prev, phone: updated.phone }));
    }
    if (updated.socialLinks) {
      setContactInfo(prev => ({
        ...prev,
        github: updated.socialLinks.github || prev.github,
        linkedin: updated.socialLinks.linkedin || prev.linkedin,
        twitter: updated.socialLinks.twitter || prev.twitter,
        website: updated.socialLinks.website || prev.website
      }));
    }

    toast.success('Profile updated successfully');
  };

  // About actions
  const updateAbout = (data) => {
    setAbout(data);
    toast.success('About section updated successfully');
  };

  // Services actions
  const addService = (item) => {
    const newItem = { ...item, id: `srv-${Date.now()}` };
    setServices(prev => [newItem, ...prev]);
    toast.success('New service created successfully');
  };

  const updateService = (id, item) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, ...item } : s));
    toast.success('Service updated successfully');
  };

  const deleteService = (id) => {
    setServices(prev => prev.filter(s => s.id !== id));
    toast.success('Service deleted');
  };

  // Skills actions
  const addSkill = (item) => {
    const newItem = { ...item, id: `skl-${Date.now()}` };
    setSkills(prev => [newItem, ...prev]);
    toast.success('Skill added successfully');
  };

  const updateSkill = (id, item) => {
    setSkills(prev => prev.map(s => s.id === id ? { ...s, ...item } : s));
    toast.success('Skill updated successfully');
  };

  const deleteSkill = (id) => {
    setSkills(prev => prev.filter(s => s.id !== id));
    toast.success('Skill deleted');
  };

  // Projects actions
  const addProject = (item) => {
    const newItem = { ...item, id: `proj-${Date.now()}` };
    setProjects(prev => [newItem, ...prev]);
    toast.success('Project added successfully');
  };

  const updateProject = (id, item) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...item } : p));
    toast.success('Project updated successfully');
  };

  const deleteProject = (id) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    toast.success('Project deleted');
  };

  // Blogs actions
  const addBlog = (item) => {
    const newItem = {
      ...item,
      id: `blog-${Date.now()}`,
      publishedAt: item.publishedAt || new Date().toISOString().split('T')[0],
      readTime: item.readTime || '5 min read'
    };
    setBlogs(prev => [newItem, ...prev]);
    toast.success('Blog article published successfully');
  };

  const updateBlog = (id, item) => {
    setBlogs(prev => prev.map(b => b.id === id ? { ...b, ...item } : b));
    toast.success('Blog article updated successfully');
  };

  const deleteBlog = (id) => {
    setBlogs(prev => prev.filter(b => b.id !== id));
    toast.success('Blog article removed');
  };

  // FAQs actions
  const addFaq = (item) => {
    const newItem = { ...item, id: `faq-${Date.now()}` };
    setFaqs(prev => [...prev, newItem]);
    toast.success('FAQ item added successfully');
  };

  const updateFaq = (id, item) => {
    setFaqs(prev => prev.map(f => f.id === id ? { ...f, ...item } : f));
    toast.success('FAQ item updated successfully');
  };

  const deleteFaq = (id) => {
    setFaqs(prev => prev.filter(f => f.id !== id));
    toast.success('FAQ item removed');
  };

  // Testimonials actions
  const addTestimonial = (item) => {
    const newItem = { ...item, id: `test-${Date.now()}` };
    setTestimonials(prev => [newItem, ...prev]);
    toast.success('Testimonial added successfully');
  };

  const updateTestimonial = (id, item) => {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, ...item } : t));
    toast.success('Testimonial updated');
  };

  const deleteTestimonial = (id) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));
    toast.success('Testimonial deleted');
  };

  // Contact actions
  const updateMessageStatus = (id, status) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, status } : m));
    toast.success(`Message marked as ${status}`);
  };

  const deleteMessage = (id) => {
    setMessages(prev => prev.filter(m => m.id !== id));
    toast.success('Message deleted');
  };

  const updateContactInfo = (info) => {
    setContactInfo(info);
    toast.success('Contact info & social profiles updated');
  };

  // Notification actions
  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const resetAllToDefault = () => {
    setProfile(initialProfile);
    setAbout(initialAbout);
    setServices(initialServices);
    setSkills(initialSkills);
    setProjects(initialProjects);
    setBlogs(initialBlogs);
    setFaqs(initialFaqs);
    setTestimonials(initialTestimonials);
    setMessages(initialContactMessages);
    setContactInfo(initialContactInfo);
    setNotifications(initialNotifications);
    toast.success('Database restored to default');
  };

  return (
    <DataContext.Provider
      value={{
        profile,
        updateProfile,
        about,
        updateAbout,
        services,
        addService,
        updateService,
        deleteService,
        skills,
        addSkill,
        updateSkill,
        deleteSkill,
        projects,
        addProject,
        updateProject,
        deleteProject,
        blogs,
        addBlog,
        updateBlog,
        deleteBlog,
        faqs,
        addFaq,
        updateFaq,
        deleteFaq,
        testimonials,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        messages,
        updateMessageStatus,
        deleteMessage,
        contactInfo,
        updateContactInfo,
        notifications,
        markNotificationRead,
        clearAllNotifications,
        searchQuery,
        setSearchQuery,
        resetAllToDefault
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
