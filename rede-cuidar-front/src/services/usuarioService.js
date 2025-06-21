// src/services/usuarioService.js
import api from './api';

export const getUsuario = async (id) => {
  try {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    throw error;
  }
};




// Adicione esta função
export const createUsuario = async (usuarioData) => {
  try {
    const response = await api.post('/usuarios', usuarioData);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    throw error;
  }
};

export const updateUsuario = (id, formData) => {
  return axios.put(`http://localhost:8080/usuarios/${id}`, formData, {
    headers: {
      // NÃO defina o Content-Type manualmente aqui!
      // O axios cuida disso automaticamente para multipart/form-data
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    withCredentials: true,
  });
};





// Exportação correta das funções
export const getUsuarios = async () => {
  const response = await api.get('/usuarios');
  return response.data;
};

export const getPrestadores = async () => {
  const response = await api.get('/usuarios/prestadores');
  return response.data;
};