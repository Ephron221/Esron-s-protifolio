import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useHome, useProjects, useServices, useSkills, useTestimonials } from '../../hooks/usePortfolio';
import { BASE_URL } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { 
  ArrowRight, 
  FileText, 
  Send, 
  Github, 
  Linkedin, 
  Twitter, 
  Mail, 
  ExternalLink, 
  Layers, 
  Code, 
  Database, 
  Layout, 
  Star,
  Quote
} from 'lucide-react';

const iconMap: Record<string, any> = {
  Github,
  Linkedin,
  Twitter,
  Mail,
  Layers,
  Code,
  Database,
  Layout
};

const Typewriter = ({ texts }: { texts: string[] }) => {
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!texts || texts.length === 0) {
      setDisplayText('Developer');
      return;
    }

    const currentWord = texts[index] || '';
    let timer: NodeJS.Timeout;

    if (isDeleting) {
      timer = setTimeout(() => {
        setDisplayText(currentWord.substring(0, displayText.length - 1));
        if (displayText === '') {
          setIsDeleting(false);
          setIndex((prev) => (prev + 1) % texts.length);
        }
      }, 50);
    } else {
      timer = setTimeout(() => {
        setDisplayText(currentWord.substring(0, displayText.length + 1));
        if (displayText === currentWord) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      }, 100);
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, index, texts]);

  return (
    <div className="flex items-center justify-center lg:justify-start min-h-[60px] md:min-h-[80px]">
      <span className="text-primary/40 mr-4 text-4xl md:text-6xl font-thin select-none">|</span>
      <span className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-cyan-400 to-blue-500 bg-clip-text text-transparent">
        {displayText || '\u00A0'}
        <span className="text-primary animate-pulse ml-1">_</span>
      </span>
    </div>
  );
};

const Home = () => {
  const { data: homeData, isLoading: homeLoading } = useHome();
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: services, isLoading: servicesLoading } = useServices();
  const { data: skills, isLoading: skillsLoading } = useSkills();
  const { data: testimonials, isLoading: testimonialsLoading } = useTestimonials();

  if (homeLoading || projectsLoading || servicesLoading || skillsLoading || testimonialsLoading) {
    return <LoadingSpinner />;
  }

  const validRoles = homeData?.roles?.filter((r: string) => r && r.trim() !== '') || [];

  const heroData = {
    title: homeData?.title || "Hi, I'm Esron",
    description: homeData?.description || "I build modern, scalable, and interactive digital experiences with passion and precision.",
    profileImage: homeData?.profileImage ? (homeData.profileImage.startsWith('http') ? homeData.profileImage : `${BASE_URL}${homeData.profileImage}`) : "https://via.placeholder.com/400",
    roles: validRoles.length > 0 ? validRoles : ["Full-Stack Developer", "Software Architect", "UI/UX Designer"],
    statistics: homeData?.statistics || [],
    socialLinks: homeData?.socialLinks || []
  };

  const featuredProjects = projects?.filter(p => p.featured).slice(0, 3) || [];

  return (
    <div className="space-y-32 pb-32">
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] animate-pulse delay-700"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex-1 text-center lg:text-left"
            >
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-block text-primary font-bold tracking-[0.2em] uppercase mb-6 text-sm py-1 px-3 border border-primary/20 rounded-full bg-primary/5"
              >
                Available for new projects
              </motion.span>

              <h1 className="text-6xl md:text-8xl font-black mb-4 leading-none tracking-tighter text-gray-900 dark:text-white">
                {heroData.title}
              </h1>

              <Typewriter texts={heroData.roles} />

              <p className="text-xl text-gray-600 dark:text-gray-400 mt-10 mb-12 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {heroData.description}
              </p>

              <div className="flex flex-wrap gap-5 justify-center lg:justify-start mb-12">
                <Link to="/projects" className="btn-primary flex items-center gap-2 h-14 px-8 group">
                  Explore Work
                  <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <Link to="/cv" className="btn-secondary flex items-center gap-2 h-14 px-8 group">
                  View CV
                  <FileText size={20} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              <div className="flex justify-center lg:justify-start gap-4">
                {heroData.socialLinks.map((link: any, i: number) => {
                  const Icon = iconMap[link.platform] || Github;
                  return (
                    <a key={i} href={link.url} target="_blank" rel="noreferrer" className="p-3 bg-gray-100 dark:bg-white/5 rounded-xl hover:bg-primary hover:text-black transition-all border border-gray-200 dark:border-white/5 hover:border-primary">
                      <Icon size={20} />
                    </a>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="flex-1 relative"
            >
              <div className="relative w-72 h-72 md:w-[450px] md:h-[450px] mx-auto">
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping blur-3xl opacity-20"></div>
                <div className="relative w-full h-full rounded-3xl border-2 border-primary/30 p-3 overflow-hidden bg-white dark:bg-[#0A0A0A] rotate-3 hover:rotate-0 transition-transform duration-700 shadow-[0_0_50px_rgba(0,255,255,0.1)]">
                  <img
                    src={heroData.profileImage}
                    alt="Esron Profile"
                    className="w-full h-full object-cover rounded-2xl grayscale hover:grayscale-0 transition-all duration-700"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {heroData.statistics.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 py-12 px-8 bg-gray-50 dark:glass-dark rounded-[40px] border border-gray-200 dark:border-white/5 shadow-2xl"
            >
              {heroData.statistics.map((stat: any, index: number) => (
                <div key={index} className="text-center group border-r last:border-r-0 border-gray-200 dark:border-white/10">
                  <h3 className="text-4xl md:text-5xl font-black text-primary mb-2 group-hover:cyan-glow transition-all">{stat.value}</h3>
                  <p className="text-gray-500 dark:text-gray-400 uppercase tracking-widest text-xs font-bold">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Services Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="section-title">What I <span className="text-primary">Offer</span></h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Providing high-end digital solutions tailored to your business needs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services?.map((service, index) => {
            const Icon = iconMap[service.icon] || Layers;
            return (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 dark:glass-dark p-10 rounded-[40px] border border-gray-200 dark:border-white/5 hover:border-primary/30 transition-all group shadow-sm hover:shadow-xl"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary transition-colors text-primary group-hover:text-black">
                  <Icon size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{service.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">{service.description}</p>
                <Link to="/contact" className="text-primary font-bold flex items-center gap-2 group/link">
                  Learn more <ArrowRight size={16} className="transition-transform group-hover/link:translate-x-1" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="bg-gray-50 dark:bg-white/5 py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="section-title text-left">Featured <span className="text-primary">Work</span></h2>
              <p className="text-gray-600 dark:text-gray-400">A selection of my most impactful and complex builds.</p>
            </div>
            <Link to="/projects" className="btn-secondary flex items-center gap-2 group">
              View All Projects <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="group relative bg-white dark:bg-[#0A0A0A] rounded-[40px] overflow-hidden border border-gray-200 dark:border-white/5 shadow-2xl"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={project.image.startsWith('http') ? project.image : `${BASE_URL}${project.image}`}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-8">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 3).map((tech, i) => (
                      <span key={i} className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-primary/10 text-primary rounded-md border border-primary/20">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-primary transition-colors">{project.title}</h3>
                  <p className="text-gray-600 dark:text-gray-500 text-sm mb-6 line-clamp-2">{project.description}</p>
                  <div className="flex gap-4">
                    <a href={project.liveDemo} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-900 dark:bg-white text-white dark:text-black font-bold rounded-2xl hover:bg-primary transition-colors">
                      Live <ExternalLink size={16} />
                    </a>
                    <a href={project.githubLink} target="_blank" rel="noreferrer" className="p-3 bg-gray-100 dark:glass rounded-2xl hover:bg-gray-200 dark:hover:bg-white/10 transition-colors dark:text-white">
                      <Github size={20} />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills / Tech Stack Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="section-title text-left mb-8">Technical <span className="text-primary">Proficiency</span></h2>
            <p className="text-gray-600 dark:text-gray-400 mb-10 text-lg leading-relaxed">
              My expertise spans across the entire development lifecycle, from designing intuitive user interfaces to architecting robust server-side systems and managing scalable databases.
            </p>
            <div className="space-y-6">
              {['Frontend', 'Backend', 'Database'].map((category) => (
                <div key={category}>
                  <p className="text-sm font-bold uppercase tracking-widest text-primary mb-4">{category} Stack</p>
                  <div className="flex flex-wrap gap-3">
                    {skills?.filter(s => s.category === category).map(skill => (
                      <span key={skill._id} className="px-5 py-2 bg-gray-100 dark:glass rounded-full text-sm font-medium border border-gray-200 dark:border-white/5 text-gray-800 dark:text-gray-200">
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-6 pt-12">
              <div className="p-8 bg-gray-50 dark:glass-dark rounded-[40px] border border-gray-200 dark:border-white/5 flex flex-col items-center text-center">
                <Layout size={40} className="text-primary mb-4" />
                <h4 className="font-bold text-gray-900 dark:text-white">UI/UX Design</h4>
              </div>
              <div className="p-8 bg-gray-50 dark:glass-dark rounded-[40px] border border-gray-200 dark:border-white/5 flex flex-col items-center text-center">
                <Code size={40} className="text-primary mb-4" />
                <h4 className="font-bold text-gray-900 dark:text-white">Web Dev</h4>
              </div>
            </div>
            <div className="space-y-6">
              <div className="p-8 bg-gray-50 dark:glass-dark rounded-[40px] border border-gray-200 dark:border-white/5 flex flex-col items-center text-center">
                <Database size={40} className="text-primary mb-4" />
                <h4 className="font-bold text-gray-900 dark:text-white">Backend</h4>
              </div>
              <div className="p-8 bg-gray-50 dark:glass-dark rounded-[40px] border border-gray-200 dark:border-white/5 flex flex-col items-center text-center">
                <Layers size={40} className="text-primary mb-4" />
                <h4 className="font-bold text-gray-900 dark:text-white">Architecture</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {testimonials && testimonials.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="section-title">Client <span className="text-primary">Feedback</span></h2>
            <p className="text-gray-600 dark:text-gray-400">What partners and clients say about our collaboration.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={t._id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="p-10 bg-gray-50 dark:glass-dark rounded-[40px] border border-gray-200 dark:border-white/5 relative"
              >
                <Quote className="absolute top-8 right-10 text-primary opacity-20" size={48} />
                <div className="flex gap-1 mb-6">
                  {[...Array(t.stars)].map((_, idx) => <Star key={idx} size={16} className="fill-primary text-primary" />)}
                </div>
                <p className="text-gray-700 dark:text-gray-300 italic mb-8 leading-relaxed">"{t.content}"</p>
                <div className="flex items-center gap-4">
                  {t.image && (
                    <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover border-2 border-primary" />
                  )}
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{t.name}</h4>
                    <p className="text-xs text-primary">{t.role}{t.company ? ` @ ${t.company}` : ''}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="relative bg-gray-900 dark:glass-dark p-12 md:p-20 rounded-[60px] border border-primary/20 overflow-hidden text-center shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full bg-primary/5 -z-10"></div>
          <h2 className="text-4xl md:text-6xl font-black mb-8 text-white">Ready to start your <br /><span className="text-primary">next big project?</span></h2>
          <p className="text-gray-300 dark:text-gray-400 text-lg mb-12 max-w-xl mx-auto">Let's collaborate to build something exceptional that stands out in the digital landscape.</p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/contact" className="btn-primary h-16 px-12 flex items-center gap-2 text-lg">
              Get In Touch <Send size={20} />
            </Link>
            <a href="mailto:esront21@gmail.com" className="h-16 px-12 bg-white/10 dark:glass rounded-2xl flex items-center justify-center font-bold hover:bg-white/20 transition-all text-lg text-white">
              Send Email
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
