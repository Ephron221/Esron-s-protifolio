import React from 'react';
import { motion } from 'framer-motion';
import { useServices } from '../../hooks/usePortfolio';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Code, Layout, Server, Database, Smartphone, Globe } from 'lucide-react';

const iconMap: Record<string, any> = {
  'Code': Code,
  'Layout': Layout,
  'Server': Server,
  'Database': Database,
  'Smartphone': Smartphone,
  'Globe': Globe
};

const Services = () => {
  const { data: services, isLoading } = useServices();

  if (isLoading) return <LoadingSpinner />;

  const dummyServices = [
    {
      _id: '1',
      title: 'Web Development',
      description: 'Building responsive and high-performance web applications using modern frameworks like React and Next.js.',
      icon: 'Globe'
    },
    {
      _id: '2',
      title: 'UI/UX Design',
      description: 'Designing intuitive and aesthetically pleasing user interfaces with a focus on user experience and accessibility.',
      icon: 'Layout'
    },
    {
      _id: '3',
      title: 'Backend Architecture',
      description: 'Developing robust and scalable server-side solutions with Node.js, Express, and distributed systems.',
      icon: 'Server'
    },
    {
      _id: '4',
      title: 'Database Management',
      description: 'Designing and optimizing complex database schemas using MongoDB, PostgreSQL, and Redis.',
      icon: 'Database'
    },
    {
      _id: '5',
      title: 'Mobile Apps',
      description: 'Creating cross-platform mobile applications using React Native for iOS and Android.',
      icon: 'Smartphone'
    },
    {
      _id: '6',
      title: 'Cloud Solutions',
      description: 'Deploying and managing applications on AWS, Google Cloud, and Azure with CI/CD pipelines.',
      icon: 'Code'
    }
  ];

  const displayServices = services || dummyServices;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="section-title">My <span className="text-primary">Services</span></h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayServices.map((service, index) => {
          const IconComponent = iconMap[service.icon] || Code;
          return (
            <motion.div
              key={service._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass p-8 rounded-2xl hover:border-primary/50 transition-all group"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <IconComponent className="text-primary w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
              <p className="text-gray-400 leading-relaxed">
                {service.description}
              </p>
              <div className="mt-6 flex items-center gap-2 text-primary font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                Learn more <Code size={16} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Services;
