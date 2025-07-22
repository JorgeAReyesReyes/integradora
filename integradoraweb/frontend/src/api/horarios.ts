import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3001/api',
});

export const fetchHorarios = () => API.get('/horarios');
export const createHorario = (data: any) => API.post('/horarios', data);
export const updateHorario = (id: string, data: any) => API.put(`/horarios/${id}`, data);
export const deleteHorario = (id: string) => API.delete(`/horarios/${id}`);

export const deleteHorariosPorSalon = (salon: string) => 
  API.delete(`/horarios/salon/${salon}`);