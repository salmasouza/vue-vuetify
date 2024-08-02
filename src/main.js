import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;

Vue.filter('numberPrice', function(value) {
  if (!value) return '';
  value = parseFloat(value).toFixed(2);
  const [integerPart, decimalPart] = value.split('.');
  const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `R$ ${formattedIntegerPart},${decimalPart}`;
});

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app');
