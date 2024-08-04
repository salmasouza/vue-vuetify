import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import 'vuetify/dist/vuetify.min.css';
import '@mdi/font/css/materialdesignicons.css';

Vue.use(Vuetify);

const vuetify = new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#1976D2',
        secondary2: '#424242',
        accent: '#82B1FF',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FB8C00',
        primary2: '#003366', // Azul-marinho
        secondary: '#002244',
        red:'#B71C1C',
      },
    },
  },
});

export default vuetify;
