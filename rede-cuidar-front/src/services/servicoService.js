import api from './api';

export const getServicos = async () => {
  const response = await api.get('/servicos');
  return response.data;
};

export const getServico = async (id) => {
  const response = await api.get(`/servicos/${id}`);
  return response.data;
};

export const createServico = async (servicoData) => {
  const response = await api.post('/servicos', servicoData);
  return response.data;
};

export const updateServico = async (id, servicoData) => {
  const response = await api.put(`/servicos/${id}`, servicoData);
  return response.data;
};

export const deleteServico = async (id) => {
  const response = await api.delete(`/servicos/${id}`);
  return response.data;
};

export const getServicosPorPrestador = async (prestadorId) => {
  const response = await api.get(`/servicos/prestador/${prestadorId}`);
  return response.data;
};