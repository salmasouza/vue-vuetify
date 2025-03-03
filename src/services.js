import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000'
});

export const api = {
  get(endpoint) {
    return axiosInstance.get(endpoint);
  },
  post(endpoint, body) {
    return axiosInstance.post(endpoint, body);
  },
  put(endpoint, body) {
    return axiosInstance.put(endpoint, body);
  },
  delete(endpoint) {
    return axiosInstance.delete(endpoint);
  },
  getCartByUserId(userId) {
    return axiosInstance.get(`/carrinho?usuario_id=${userId}`);
  },
  getUserById(userId) {
    return axiosInstance.get(`/usuario/${userId}`);
  },
  createUser(userData) {
    return axiosInstance.post('/usuario', userData);
  },
  deleteUser(userId) {
    return axiosInstance.delete(`/usuario/${userId}`);
  },
  loginUser(email, senha) {
    return axiosInstance.post('/login', { email, senha });
  }
};

export function getCep(cep) {
  return axios.get(`https://viacep.com.br/ws/${cep}/json/`);
}
