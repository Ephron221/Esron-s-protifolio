export interface HomeData {
  title: string;
  subtitle: string;
  description: string;
  profileImage: string;
  roles: string[];
  statistics: {
    label: string;
    value: string;
  }[];
  socialLinks: {
    platform: string;
    url: string;
    icon: string;
  }[];
}

export interface AboutData {
  biography: string;
  education: {
    institution: string;
    degree: string;
    year: string;
    description: string;
  }[];
  experience: {
    company: string;
    position: string;
    duration: string;
    description: string;
  }[];
  goals: string;
}

export interface ProjectData {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  image: string;
  githubLink: string;
  liveDemo: string;
  featured: boolean;
}

export interface ServiceData {
  _id: string;
  title: string;
  description: string;
  icon: string;
}

export interface SkillData {
  _id: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'Tools';
  name: string;
  level: number;
}

export interface TestimonialData {
  _id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  image: string;
  stars: number;
}

export interface ContactData {
  name: string;
  email: string;
  message: string;
}

export interface CVData {
  fileUrl: string;
  lastUpdated: string;
}
