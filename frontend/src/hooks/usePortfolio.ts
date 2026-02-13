import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { HomeData, AboutData, ProjectData, ServiceData, SkillData, TestimonialData } from '../types';

export const useHome = () => {
  return useQuery<HomeData>(['home'], async () => {
    const { data } = await api.get('/home');
    return data;
  });
};

export const useAbout = () => {
  return useQuery<AboutData>(['about'], async () => {
    const { data } = await api.get('/about');
    return data;
  });
};

export const useProjects = () => {
  return useQuery<ProjectData[]>(['projects'], async () => {
    const { data } = await api.get('/projects');
    return data;
  });
};

export const useServices = () => {
  return useQuery<ServiceData[]>(['services'], async () => {
    const { data } = await api.get('/services');
    return data;
  });
};

export const useSkills = () => {
  return useQuery<SkillData[]>(['skills'], async () => {
    const { data } = await api.get('/skills');
    return data;
  });
};

export const useTestimonials = () => {
  return useQuery<TestimonialData[]>(['testimonials'], async () => {
    const { data } = await api.get('/testimonials');
    return data;
  });
};

export const useDocuments = () => {
  return useQuery(['documents'], async () => {
    const { data } = await api.get('/documents');
    return data;
  });
};
