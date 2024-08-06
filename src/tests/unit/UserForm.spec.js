import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuetify from 'vuetify';
import UserForm from '@/components/UserForm';
import Checkout from '@/components/Checkout'; 

const localVue = createLocalVue();
localVue.use(Vuetify);

describe('UserForm.vue', () => {
  let vuetify;

  beforeEach(() => {
    vuetify = new Vuetify();
  });

  it('preenche o formulário corretamente', async () => {
    const wrapper = shallowMount(UserForm, {
      localVue,
      vuetify,
      stubs: {
        Checkout 
      },
      data() {
        return {
          showLoginLabels: true,
          nome: '',
          email: '',
          senha: '',
          cep: '',
          rua: '',
          numero: '',
          bairro: '',
          cidade: '',
          estado: ''
        };
      },
    });
    await wrapper.vm.$nextTick();

    await wrapper.find('input[name="nome"]').setValue('Nome do Comprador');
    await wrapper.find('input[name="email"]').setValue('comprador@example.com');
    await wrapper.find('input[name="senha"]').setValue('senha123');
    await wrapper.find('input[name="cep"]').setValue('12345-678');
    await wrapper.find('input[name="rua"]').setValue('Rua Teste');
    await wrapper.find('input[name="numero"]').setValue('123');
    await wrapper.find('input[name="bairro"]').setValue('Bairro Teste');
    await wrapper.find('input[name="cidade"]').setValue('Cidade Teste');
    await wrapper.find('input[name="estado"]').setValue('Estado Teste');

    expect(wrapper.vm.nome).toBe('Nome do Comprador');
    expect(wrapper.vm.email).toBe('comprador@example.com');
    expect(wrapper.vm.senha).toBe('senha123');
    expect(wrapper.vm.cep).toBe('12345-678');
    expect(wrapper.vm.rua).toBe('Rua Teste');
    expect(wrapper.vm.numero).toBe('123');
    expect(wrapper.vm.bairro).toBe('Bairro Teste');
    expect(wrapper.vm.cidade).toBe('Cidade Teste');
    expect(wrapper.vm.estado).toBe('Estado Teste');
  });
});
