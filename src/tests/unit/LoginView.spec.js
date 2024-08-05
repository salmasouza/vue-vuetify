import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuetify from 'vuetify';
import VueRouter from 'vue-router';
import LoginView from '@/views/LoginView.vue';

const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(Vuetify);

describe('LoginView.vue', () => {
  let vuetify;
  let router;

  beforeEach(() => {
    vuetify = new Vuetify();
    router = new VueRouter({
      routes: [
        { path: '/login', name: 'login', component: { template: '<div></div>' } },
        { path: '/criar-conta', name: 'criar-conta', component: { template: '<div></div>' } },
        { path: '/usuario', name: 'usuario', component: { template: '<div></div>' } },
      ],
    });
  });

  it('displays email error message for invalid email', async () => {
    const wrapper = shallowMount(LoginView, {
      localVue,
      vuetify,
      router,
    });

    await wrapper.setData({
      login: { email: 'invalid-email', password: '' },
    });

    wrapper.vm.checkEmail();

    expect(wrapper.vm.emailError).toBe('O email deve conter um "@".');
    
    const emailField = wrapper.find('[data-test="email-field"]');
    await emailField.trigger('blur');
    
    const errorMsg = wrapper.find('.error');
    expect(errorMsg.exists()).toBe(true);
    expect(errorMsg.text()).toBe('O email deve conter um "@".');
  });

  it('does not display error message for valid email', async () => {
    const wrapper = shallowMount(LoginView, {
      localVue,
      vuetify,
      router,
    });

    await wrapper.setData({
      login: { email: 'valid@example.com', password: '' },
    });

    wrapper.vm.checkEmail();

    expect(wrapper.vm.emailError).toBe('');
    
    const emailField = wrapper.find('[data-test="email-field"]');
    await emailField.trigger('blur');
    
    const errorMsg = wrapper.find('.error');
    expect(errorMsg.exists()).toBe(false);
  });
});
