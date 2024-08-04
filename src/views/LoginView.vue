<template>
  <section class="login">
    <div v-if="createIsOpen === false">
      <h1>Login</h1>
      <form @submit.prevent="logar">
        <v-text-field
          v-model="login.email"
          label="Email"
          type="email"
          :class="{ 'invalid': emailError }"
          @blur="checkEmail"
          outlined
          dense
        ></v-text-field>
        <p v-if="emailError" class="error">{{ emailError }}</p>
        
        <v-text-field
          v-model="login.password"
          label="Senha"
          type="password"
          outlined
          dense
        ></v-text-field>
        
        <v-btn
          class="btn-secondary"
          type="submit"
          large
        >
          <span class="btn-text">Entrar</span>
        </v-btn>
      </form>
      <p class="forgot-password">
        Esqueceu a senha?
        <v-btn
          text
          color="primary"
          @click="$router.push('/')"
          class="forgot-link"
        >
          Clique aqui.
        </v-btn>
      </p>
      <p class="create-acc">
        <v-btn
          text
          color="primary"
          @click="createIsOpen = true"
        >
          Criar conta
        </v-btn>
      </p>
    </div>
    <div v-else>
      <CreateAcc />
    </div>
  </section>
</template>

<script>
import CreateAcc from '@/components/CreateAcc.vue'

export default {
  name: 'LoginView',
  components: { CreateAcc },
  data() {
    return {
      createIsOpen: false,
      login: {
        email: '',
        password: '',
      },
      emailError: '' 
    }
  },
  methods: {
    logar() {
      if (this.emailError) {
        this.$toast.error('Por favor, corrija os erros antes de enviar.'); 
        return;
      }

      this.$store.dispatch('getUser', this.login.email).then(() => {
        const redirectPath = this.$store.state.redirectAfterLogin || { name: 'usuario' };
        this.$store.commit('setRedirectAfterLogin', null);
        this.$router.push(redirectPath);
      });
    },
    checkEmail() {
      if (!this.login.email.includes('@')) {
        this.emailError = 'O email deve conter um "@".';
      } else {
        this.emailError = '';
      }
    }
  }
}
</script>

<style scoped>
.login {
  margin: 0 auto;
  max-width: 500px;
  padding: 0 20px;
}

h1 {
  color: #002244;
  font-size: 2rem;
  margin: 40px 0 20px;
  text-align: center;
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.invalid {
  border-color: red;
}

.forgot-password {
  font-weight: lighter;
  margin: 20px auto 0 auto;
  text-align: center;
}

.create-acc {
  margin-top: 5px;
  text-align: center;
}

.error {
  color: red;
  font-size: 0.875rem;
  margin-top: 5px;
}

.btn-secondary {
  background-color: #002244 !important; 
}

.btn-text {
  color: white;
}

.forgot-link {
  color: #002244;
  text-decoration: underline;
}

.forgot-link:hover {
  text-decoration: underline;
}
</style>
