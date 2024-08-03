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
    getUserProducts({ commit, state }) {
      return api.get(`/produto?usuario_id=${state.usuario.id}`)
        .then(res => {
          if (res.status === 200) {
            commit('UPDATE_USER_PRODUCTS', res.data);
          }
        });
    },
    getUser({ commit }, payload) {
      return api.get(`/usuario/${payload}`)
        .then(res => {
          if (res.status === 200) {
            commit('UPDATE_USER', res.data);
            commit('UPDATE_LOGIN', true);
          }
        });
    },
    createUser({ commit }, payload) {
      commit('UPDATE_USER', { id: payload.email });
      return api.post('/usuario', payload)
        .then(res => {
          if (res.status === 201) {
            alert('Cadastrado com sucesso!');
          } else {
            alert('Ocorreu um erro. Tente novamente mais tarde.');
          }
        });
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
    addToCart({ commit, state }, product) {
      const cartItem = {
        id: Date.now(),
        produto: product,
        usuario_id: state.usuario.id
      };

      return api.post('/carrinho', cartItem).then(response => {
        commit('ADD_TO_CART', cartItem);
        return response.data;
      }).catch(error => {
        console.error('Erro ao adicionar produto ao carrinho:', error);
      });
    },
    fetchCart({ commit }) {
      return api.get('/carrinho').then(response => {
        commit('SET_CART', response.data);
      }).catch(error => {
        console.error('Erro ao buscar carrinho:', error);
      });
    },
    removeFromCart({ commit }, productId) {
      return api.delete(`/carrinho/${productId}`).then(() => {
        commit('REMOVE_FROM_CART', productId);
      }).catch(error => {
        console.error('Erro ao remover produto do carrinho:', error);
      });
    }
  }
});
