export const initialProfile = {
  name: 'Shohag Miah',
  email: 'shohagmiah7474@gmail.com',
  role: 'Full Stack Engineer & UI Architect',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
};

export const initialAbout = {
  headline: 'Senior Full-Stack Developer & UI Architect',
  bio: `Passionate software craftsman with over **5+ years of experience** architecting resilient web applications, modern dashboards, and responsive digital products.

### Core Philosophy
- **Performance First**: Zero-latency interactions and optimized critical rendering paths.
- **Craftsmanship**: Clean architectures, type safety, and resilient error recovery.
- **Design Systems**: Cohesive spacing, typography hierarchy, and fluid transitions.

> *"Building software where mathematical precision meets intuitive human experiences."*`,
  coreStack: ['React', 'JavaScript', 'Node.js', 'Next.js', 'Tailwind CSS', 'PostgreSQL', 'Docker'],
  image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
  experience: 5,
  totalProjects: 38,
  location: 'San Francisco, CA (Open to Remote)',
  availableForHire: true
};

export const initialServices = [
  {
    id: 'srv-1',
    icon: 'Code2',
    title: 'Full-Stack Web Development',
    description: 'End-to-end web application development using modern frameworks, clean architecture, and robust REST/GraphQL APIs.',
    stacks: ['React', 'Next.js', 'Node.js', 'Express', 'JavaScript'],
    isActive: true,
    order: 1
  },
  {
    id: 'srv-2',
    icon: 'Layout',
    title: 'Frontend Architecture & Design Systems',
    description: 'Scalable UI component libraries, micro-frontends, accessible design tokens, and smooth responsive layouts.',
    stacks: ['Tailwind CSS', 'Radix UI', 'Storybook', 'Figma'],
    isActive: true,
    order: 2
  },
  {
    id: 'srv-3',
    icon: 'Database',
    title: 'Database & API Engineering',
    description: 'High-throughput relational and NoSQL database modeling, query optimization, migration pipelines, and security.',
    stacks: ['PostgreSQL', 'Prisma', 'Redis', 'MongoDB'],
    isActive: true,
    order: 3
  },
  {
    id: 'srv-4',
    icon: 'Cloud',
    title: 'Cloud DevOps & CI/CD Pipelines',
    description: 'Automated test runners, Docker containerization, zero-downtime Cloud deployment, and infrastructure monitoring.',
    stacks: ['Docker', 'AWS', 'Google Cloud', 'GitHub Actions'],
    isActive: true,
    order: 4
  }
];

export const initialSkills = [
  {
    id: 'skl-1',
    icon: 'Atom',
    skillName: 'React & React Native',
    shortDescription: 'Modern hooks, server components, state machines, and micro-interactions.',
    category: 'Frontend',
    isActive: true,
    proficiency: 95
  },
  {
    id: 'skl-2',
    icon: 'FileCode',
    skillName: 'JavaScript & TypeScript',
    shortDescription: 'Strict typing, generic abstractions, async events, and modern ESNext capabilities.',
    category: 'Frontend',
    isActive: true,
    proficiency: 94
  },
  {
    id: 'skl-3',
    icon: 'Palette',
    skillName: 'Tailwind CSS & Styling',
    shortDescription: 'Utility-first styling, CSS custom properties, fluid typography, and dark-mode theming.',
    category: 'Frontend',
    isActive: true,
    proficiency: 96
  },
  {
    id: 'skl-4',
    icon: 'Server',
    skillName: 'Node.js & Express',
    shortDescription: 'Event-driven backend services, middleware security, and streaming data APIs.',
    category: 'Backend',
    isActive: true,
    proficiency: 88
  },
  {
    id: 'skl-5',
    icon: 'Database',
    skillName: 'PostgreSQL & Databases',
    shortDescription: 'Schema migrations, ACID transactions, complex joins, and connection pooling.',
    category: 'Database',
    isActive: true,
    proficiency: 85
  },
  {
    id: 'skl-6',
    icon: 'Terminal',
    skillName: 'Docker & Containerization',
    shortDescription: 'Multi-stage builds, compose networks, and reproducible deployment containers.',
    category: 'DevOps & Cloud',
    isActive: true,
    proficiency: 82
  }
];

export const initialProjects = [
  {
    id: 'proj-1',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80',
    title: 'Nova SaaS Analytics Platform',
    description: 'Real-time telemetry and revenue analytics dashboard processing 2M+ daily events with sub-second chart rendering.',
    stacks: ['React', 'JavaScript', 'Tailwind CSS', 'Recharts', 'Node.js'],
    githubLink: 'https://github.com/shohagmiah/nova-analytics',
    liveLink: 'https://nova-analytics.demo.app',
    order: 1,
    isFeatured: true,
    isActive: true
  },
  {
    id: 'proj-2',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=900&q=80',
    title: 'Aura Commerce Engine',
    description: 'Headless storefront with dynamic cart reconciliation, multi-currency checkout, and instant search indexing.',
    stacks: ['Next.js', 'Tailwind CSS', 'Stripe', 'Redis', 'PostgreSQL'],
    githubLink: 'https://github.com/shohagmiah/aura-commerce',
    liveLink: 'https://aura-commerce.demo.app',
    order: 2,
    isFeatured: true,
    isActive: true
  },
  {
    id: 'proj-3',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80',
    title: 'Pulse Team Collaboration Suite',
    description: 'Collaborative task planner with optimistic UI updates, drag-and-drop kanban boards, and audit logging.',
    stacks: ['React', 'JavaScript', 'Tailwind CSS', 'Supabase', 'WebSockets'],
    githubLink: 'https://github.com/shohagmiah/pulse-suite',
    liveLink: 'https://pulse-suite.demo.app',
    order: 3,
    isFeatured: false,
    isActive: true
  }
];

export const initialBlogs = [
  {
    id: 'blog-1',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=80',
    title: 'Mastering React 19 Actions and Concurrent Transitions',
    content: `# Mastering React 19 Actions and Concurrent Transitions

React 19 introduces transformative paradigms for handling async mutations natively without boilerplate state machines.

## Key Primitives
- **useActionState**: Declarative pending and error states.
- **useOptimistic**: Instant client-side feedback before server roundtrips.
- **Async Transitions**: Non-blocking concurrent UI updates.

\`\`\`javascript
// Example: React 19 Optimistic Mutation
import { useOptimistic } from 'react';

export function LikeButton({ count, onLike }) {
  const [optimisticCount, setOptimistic] = useOptimistic(
    count,
    (state) => state + 1
  );

  return (
    <button onClick={() => { setOptimistic(); onLike(); }}>
      ❤️ {optimisticCount}
    </button>
  );
}
\`\`\`

> *"True performance is measured by perceived responsiveness as much as raw millisecond benchmarks."*

## Performance Comparison
| Paradigm | Client Boilerplate | Perceived Latency |
| --- | --- | --- |
| Legacy Redux/Thunk | High | Noticeable |
| React 19 Actions | Minimal | 0ms Instant |`,
    category: 'Frontend Engineering',
    tags: ['React 19', 'JavaScript', 'Performance', 'WebDev'],
    isFeatured: true,
    isActive: true,
    publishedAt: '2025-05-12',
    readTime: '6 min read'
  },
  {
    id: 'blog-2',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=900&q=80',
    title: 'Building Resilient REST APIs with Node.js and Express',
    content: 'A comprehensive guide to structured error propagation, schema validation, secure JWT rotation, and structured JSON logging for high-traffic environments.',
    category: 'Backend',
    tags: ['Node.js', 'Express', 'JavaScript', 'Security'],
    isFeatured: true,
    isActive: true,
    publishedAt: '2025-04-20',
    readTime: '8 min read'
  }
];

export const initialFaqs = [
  {
    id: 'faq-1',
    question: 'What types of projects do you typically take on?',
    answer: 'I specialize in full-stack web applications, SaaS dashboards, headless e-commerce platforms, and frontend design systems. I work with both venture-backed startups and established businesses.',
    order: 1,
    isActive: true
  },
  {
    id: 'faq-2',
    question: 'How do you handle project timelines and milestones?',
    answer: 'Every project begins with a discovery and scope milestone, followed by two-week iterative sprints with continuous demo deployments on preview environments.',
    order: 2,
    isActive: true
  },
  {
    id: 'faq-3',
    question: 'Are you open to contract or full-time opportunities?',
    answer: 'Yes, I am currently open to select contract consulting, technical advisory roles, and high-impact full-time engineering positions.',
    order: 3,
    isActive: true
  }
];

export const initialTestimonials = [
  {
    id: 'test-1',
    clientName: 'Sarah Jenkins',
    role: 'VP of Product',
    company: 'Apex Technologies',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    feedback: 'Shohag delivered our core dashboard weeks ahead of schedule. The code was exceptionally structured, responsive, and easy for our internal team to extend.',
    rating: 5,
    isActive: true
  },
  {
    id: 'test-2',
    clientName: 'David Chen',
    role: 'Founder & CTO',
    company: 'HyperScale AI',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    feedback: 'Incredible eye for detail and design polish. He transformed our complex analytical queries into an intuitive, ultra-fast interface.',
    rating: 5,
    isActive: true
  }
];

export const initialContactMessages = [
  {
    id: 'msg-1',
    name: 'Marcus Vance',
    email: 'marcus@vancemedia.io',
    subject: 'Project Inquiry: SaaS Dashboard Redesign',
    message: 'Hello Shohag, we came across your portfolio and were very impressed with your work. We are looking to revamp our enterprise analytics portal. Are you available for a discovery call this Thursday?',
    receivedAt: '2025-05-18 10:45 AM',
    status: 'unread'
  },
  {
    id: 'msg-2',
    name: 'Elena Rostova',
    email: 'elena@novacapital.com',
    subject: 'Consulting on Frontend Architecture',
    message: 'Hi there! We would love to discuss a 3-month consulting engagement to help establish our component design system and JavaScript best practices.',
    receivedAt: '2025-05-15 03:15 PM',
    status: 'read'
  }
];

export const initialContactInfo = {
  email: 'shohagmiah7474@gmail.com',
  phone: '+1 (555) 349-8291',
  location: 'San Francisco, CA & Remote Worldwide',
  github: 'https://github.com/shohagmiah',
  linkedin: 'https://linkedin.com/in/shohagmiah',
  twitter: 'https://twitter.com/shohag_dev',
  website: 'https://shohagmiah.dev',
  availableForFreelance: true
};

export const initialNotifications = [
  {
    id: 'notif-1',
    title: 'New Client Inquiry',
    description: 'Marcus Vance sent a message regarding SaaS Dashboard Redesign.',
    time: '2 hours ago',
    read: false,
    type: 'message'
  },
  {
    id: 'notif-2',
    title: 'Project Deployed',
    description: 'Nova SaaS Analytics platform live demo updated successfully.',
    time: 'Yesterday',
    read: false,
    type: 'project'
  },
  {
    id: 'notif-3',
    title: 'Blog Article Published',
    description: '"Mastering React 19 Actions" is now active on your portfolio.',
    time: '3 days ago',
    read: true,
    type: 'blog'
  }
];
