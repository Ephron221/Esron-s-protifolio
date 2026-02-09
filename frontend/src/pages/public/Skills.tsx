import React from 'react';
import { motion } from 'framer-motion';
import { useSkills } from '../../hooks/usePortfolio';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Skills = () => {
  const { data: skills, isLoading } = useSkills();

  if (isLoading) return <LoadingSpinner />;

  const dummySkills = [
    { _id: '1', category: 'Frontend', name: 'React.js', level: 90 },
    { _id: '2', category: 'Frontend', name: 'TypeScript', level: 85 },
    { _id: '3', category: 'Frontend', name: 'Tailwind CSS', level: 95 },
    { _id: '4', category: 'Backend', name: 'Node.js', level: 88 },
    { _id: '5', category: 'Backend', name: 'Express.js', level: 85 },
    { _id: '6', category: 'Database', name: 'MongoDB', level: 80 },
    { _id: '7', category: 'Database', name: 'PostgreSQL', level: 75 },
    { _id: '8', category: 'Tools', name: 'Docker', level: 70 },
    { _id: '9', category: 'Tools', name: 'Git', level: 92 },
  ];

  const displaySkills = skills || dummySkills;

  const categories = ['Frontend', 'Backend', 'Database', 'Tools'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="section-title">Technical <span className="text-primary">Skills</span></h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {categories.map((category, catIndex) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, x: catIndex % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: catIndex * 0.1 }}
            viewport={{ once: true }}
            className="glass p-8 rounded-2xl"
          >
            <h2 className="text-2xl font-bold mb-8 text-primary border-b border-primary/20 pb-2">
              {category}
            </h2>
            
            <div className="space-y-6">
              {displaySkills
                .filter(skill => skill.category === category)
                .map((skill, index) => (
                  <div key={skill._id}>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">{skill.name}</span>
                      <span className="text-primary">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: 0.2 + (index * 0.1) }}
                        viewport={{ once: true }}
                        className="h-full bg-gradient-to-r from-primary/50 to-primary rounded-full relative"
                      >
                        <div className="absolute top-0 right-0 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_#00FFFF]"></div>
                      </motion.div>
                    </div>
                  </div>
                ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Skills;
