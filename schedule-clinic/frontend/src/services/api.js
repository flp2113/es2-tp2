import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

export const pacienteService = {
  listar: () => api.get('/pacientes'),
  criar: (dados) => api.post('/pacientes', dados),
  remover: (id) => api.delete(`/pacientes/${id}`)
};

export const profissionalService = {
  listar: () => api.get('/profissionais'),
  criar: (dados) => api.post('/profissionais', dados),
  remover: (id) => api.delete(`/profissionais/${id}`)
};

export const agendamentoService = {
  listar: () => api.get('/agendamentos'),
  criar: (dados) => api.post('/agendamentos', dados),
  remover: (id) => api.delete(`/agendamentos/${id}`)
};

export default api;