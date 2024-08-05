import { mount, createLocalVue } from '@vue/test-utils';
import Vuetify from 'vuetify';
import CheckoutComponent from '@/components/CheckoutComponent.vue';
import Vue from 'vue';
import Vuex from 'vuex';
import VMask from 'v-mask';


Vue.directive('mask', VMask);

const localVue = createLocalVue();
localVue.use(Vuetify);
localVue.use(Vuex);

describe('CheckoutComponent', () => {
  let wrapper;
  let vuetify;
  let store;
  let actions;
  let state;

  beforeEach(() => {
    vuetify = new Vuetify();
    
    state = {
      usuario: {
        email: 'usuario@example.com',
        cep: '12345-678',
        rua: 'Rua Exemplo',
        bairro: 'Bairro Exemplo',
        cidade: 'Cidade Exemplo',
        estado: 'Estado Exemplo'
      }
    };

    actions = {
      createUser: jest.fn(),
      getUser: jest.fn()
    };

    store = new Vuex.Store({
      state,
      actions
    });

    wrapper = mount(CheckoutComponent, {
      localVue,
      vuetify,
      store,
      propsData: {
        produto: {
          usuario_id: 'vendedor@example.com',
          nome: 'Produto Exemplo',
          preco: 100
        }
      }
    });
  });

  it('should use usuario_id as email of the logged-in user', () => {
    const compradorId = wrapper.vm.compra.comprador_id;
    expect(compradorId).toBe('usuario@example.com');
  });

  it('should validate CPF correctly', async () => {
    const cpfInput = wrapper.find('input[name="cpf"]'); 
    const cpfValid = '123.456.789-09'; 
    const cpfInvalid = '123.456.789-00'; 

    await cpfInput.setValue(cpfValid);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.validCpf).toBe(true);
    expect(wrapper.find('.error-message').exists()).toBe(false);

    await cpfInput.setValue(cpfInvalid);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.validCpf).toBe(false);
    expect(wrapper.find('.error-message').exists()).toBe(true);
    expect(wrapper.find('.error-message').text()).toBe('CPF inválido');
  });
});
