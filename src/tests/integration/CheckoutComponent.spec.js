import { shallowMount, createLocalVue, flushPromises } from '@vue/test-utils';
import Vuex from 'vuex';
import CheckoutComponent from '@/components/CheckoutComponent.vue'; 
import Toast from 'vue-toastification';
import VMask from '../__mocks__/v-mask';
import * as api from '@/api'; // Importa o módulo API real

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.directive('mask', VMask);

jest.mock('@/api'); // Mocka o módulo API

jest.mock('vue-toastification', () => ({
  fire: jest.fn()
}));

const actions = {
  createCheckout: jest.fn().mockResolvedValue(),
};

const store = new Vuex.Store({
  state: {
    login: true,
    usuario: {
      id: 'user-id',
      email: 'user@example.com',
      cep: '12345678',
      rua: 'Rua Exemplo',
      bairro: 'Bairro Exemplo',
      cidade: 'Cidade Exemplo',
      estado: 'Estado Exemplo'
    }
  },
  actions
});

describe('CheckoutComponent', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(CheckoutComponent, {
      localVue,
      store,
      mocks: {
        $toast: Toast 
      },
      propsData: {
        produto: {
          nome: 'Produto Exemplo',
          preco: '100.00',
          usuario_id: 'vendedor@example.com'
        }
      }
    });
  });

  it('should show a success Toast message when checkout is finalized successfully', async () => {
    await wrapper.setData({
      paymentMethod: 'cartao',
      payment: {
        numeroCartao: '1234 5678 1234 5678',
        prazo: '12/25',
        cvc: '123',
        nomeCartao: 'Nome do Cartão',
        cpf: '123.456.789-00'
      }
    });

    const finishCheckoutSpy = jest.spyOn(wrapper.vm, 'finishCheckout').mockImplementation(async () => {
      console.log('finishCheckout chamado'); // Adicione este log
      await api.createCheckout();
    });

    await wrapper.find('#finalizar-pedido').trigger('click');
    await flushPromises(); // Aguarda as Promises se resolverem

    expect(finishCheckoutSpy).toHaveBeenCalled();
    expect(Toast.fire).toHaveBeenCalled();
    expect(Toast.fire).toHaveBeenCalledWith(expect.objectContaining({
      icon: 'success',
      title: 'Compra finalizada com sucesso!'
    }));
  });
});
