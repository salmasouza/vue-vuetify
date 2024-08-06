import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import CheckoutComponent from '@/components/CheckoutComponent.vue'; 
import Toast from 'vue-toastification';

const localVue = createLocalVue();
localVue.use(Vuex);

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
  let createCheckoutSpy;

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

    createCheckoutSpy = jest.spyOn(wrapper.vm, 'createCheckout').mockResolvedValue();
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

    await wrapper.find('#finalizar-pedido').trigger('click');

    expect(createCheckoutSpy).toHaveBeenCalled();
    expect(Toast.fire).toHaveBeenCalled();
    expect(Toast.fire).toHaveBeenCalledWith(expect.objectContaining({
      icon: 'success',
      title: 'Compra finalizada com sucesso!'
    }));
  });
});
