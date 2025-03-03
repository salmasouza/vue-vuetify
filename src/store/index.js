import Vue from "vue";
import Vuex from "vuex";
import { api } from '@/services.js';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    login: false,
    usuario: {
      id: '',
      nome: '',
      email: '',
      senha: '',
      cep: '',
      rua: '',
      numero: '',
      bairro: '',
      cidade: '',
      estado: ''
    },
    usuario_produtos: null,
    carrinho: [],
    redirectAfterLogin: null
  },
  mutations: {
    UPDATE_LOGIN(state, payload) {
      state.login = payload;
    },
    UPDATE_USER(state, payload) {
      state.usuario = { ...state.usuario, ...payload };
    },
    UPDATE_USER_PRODUCTS(state, payload) {
      state.usuario_produtos = payload;
    },
    ADD_USER_PRODUCTS(state, payload) {
      state.usuario_produtos.unshift(payload);
    },
    SET_REDIRECT_AFTER_LOGIN(state, payload) {
      state.redirectAfterLogin = payload;
    },
    ADD_TO_CART(state, payload) {
      state.carrinho.push(payload);
    },
    SET_CART(state, payload) {
      state.carrinho = payload;
    },
    REMOVE_FROM_CART(state, productId) {
      state.carrinho = state.carrinho.filter(item => item.produto.id !== productId);
    }
  },
  actions: {
    async getUserProducts({ commit, state }) {
      try {
        const res = await api.get(`/produto?usuario_id=${state.usuario.id}`);
        console.log('Produtos recebidos:', res.data); 
        if (res.status === 200) {
          commit('UPDATE_USER_PRODUCTS', res.data);
        }
      } catch (error) {
        console.error('Erro ao buscar produtos do usuário:', error);
      }
    },
    
    async getUser({ commit }, userId) {
      try {
        const res = await api.get(`/usuario/${userId}`);
        if (res.status === 200) {
          commit('UPDATE_USER', res.data);
          commit('UPDATE_LOGIN', true);
        } else {
          console.error(`Erro ao buscar usuário: ${res.status}`);
        }
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
      }
    },
    async createUser({ commit }, userData) {
      try {
        const res = await api.createUser(userData);
        if (res.status === 201) {
          console.log('Usuário criado com sucesso:', res.data);
          commit('UPDATE_USER', { id: userData.email });
          return res.data;
        }
      } catch (error) {
        const errorMsg = error.response ? error.response.data : error.message;
        console.error('Erro ao criar usuário:', errorMsg);
        throw new Error(`Erro ao criar usuário: ${errorMsg}`);
      }
    },
    async login({ commit }, { email, senha }) {
      try {
        const response = await api.get(`/usuario?email=${email}`);
        if (response.status === 200) {
          const user = response.data.find(user => user.senha === senha);
          if (user) {
            commit('UPDATE_USER', user);
            commit('UPDATE_LOGIN', true);
            return user;
          } else {
            throw new Error('Email ou senha incorretos.');
          }
        } else {
          console.error(`Erro ao buscar usuário: ${response.status}`);
        }
      } catch (error) {
        console.error('Erro ao fazer login:', error);
        throw new Error('Falha ao fazer login');
      }
    },
    logout({ commit }) {
      commit('UPDATE_USER', {
        id: '',
        nome: '',
        email: '',
        senha: '',
        cep: '',
        rua: '',
        numero: '',
        bairro: '',
        cidade: '',
        estado: ''
      });
      commit('UPDATE_LOGIN', false);
    },
    async addToCart({ commit, state }, product) {
      try {
        const cartItem = {
          id: Date.now(),
          produto: product,
          usuario_id: state.usuario.id
        };
        const response = await api.post('/carrinho', cartItem);
        commit('ADD_TO_CART', cartItem);
        return response.data;
      } catch (error) {
        console.error('Erro ao adicionar produto ao carrinho:', error);
      }
    },
    async fetchCart({ commit }) {
      try {
        const response = await api.get('/carrinho');
        commit('SET_CART', response.data);
      } catch (error) {
        console.error('Erro ao buscar carrinho:', error);
      }
    },
    async removeFromCart({ commit }, productId) {
      try {
        await api.delete(`/carrinho/${productId}`);
        commit('REMOVE_FROM_CART', productId);
      } catch (error) {
        console.error('Erro ao remover produto do carrinho:', error);
      }
    }
  }
});
