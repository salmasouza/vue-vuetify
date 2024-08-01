import Vue from "vue";
import Vuex from "vuex";
import { api } from '@/services.js'

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
    usuario_produtos: null
  },
  mutations: {
    UPDATE_LOGIN (state, payload) {
      state.login = payload;
    },
    UPDATE_USER (state, payload) {
      state.usuario = Object.assign(state.usuario, payload);
    },
    UPDATE_USER_PRODUCTS (state, payload) {
      state.usuario_produtos = payload  ;
    },
    ADD_USER_PRODUCTS (state, payload) {
      state.usuario_produtos.unshift(payload);
    },
  },
  actions: {
    getUserProducts (context) {
      return api.get(`/produto?usuario_id=${context.state.usuario.id}`)
                  .then(res => {
                    if (res.status === 200) {
                      context.commit('UPDATE_USER_PRODUCTS', res.data)
                    }
                  })
    },
    getUser (context, payload) {
      return api.get(`/usuario/${payload}`)
                  .then(res => {
                    if (res.status === 200) {
                      context.commit('UPDATE_USER', res.data)
                      context.commit('UPDATE_LOGIN', true)
                    }
                  })
    },
    createUser (context, payload) {
      context.commit('UPDATE_USER', { id: payload.email })
      return api.post('/usuario', payload)
                  .then(res => res.status === 201 ? alert('Cadastrado com sucesso!') : alert('Ocorreu um erro. Tente novamente mais tarde.'))
    },
    logout (context) {
      context.commit('UPDATE_USER', {
        id: '',
        nome: '',
        email: '',
        senha: '',
        cep: '',
        rua: '',
        numero: '',
        bairro: '',
        cidade: '',
        estado: '',
        // numeroCartao: '',
        // prazo: '',
        // cvc: '',
        // nomeCartao: '',
        // cpf: '',
      })
      context.commit('UPDATE_LOGIN', false)
    }
  }
});
