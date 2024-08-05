<template>
  <section class="login">
    <div>
      <h1>Login</h1>
      <form @submit.prevent="logar">
        <v-text-field
          v-model="login.email"
          label="Email"
          type="email"
          :class="{ 'invalid': emailError }"
          @blur="checkEmail"
          required
          dense
          color="secondary"
          data-test="email-field" 
        ></v-text-field>
        <p v-if="emailError" class="error">{{ emailError }}</p>
        
        <v-text-field
          v-model="login.password"
          label="Senha"
          type="password"
          required
          dense
          color="secondary"
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
          color="secondary"
          @click="$router.push('/')"
          class="forgot-link"
        >
          Clique aqui.
        </v-btn>
      </p>
      <p class="create-acc">
        <v-btn
          text
          color="secondary"
          @click="irParaCriarConta"
        >
          Criar conta
        </v-btn>
      </p>
    </div>
   
  </section>
</template>

<script>


export default {
  name: 'LoginView',
  data() {
    return {
      login: {
        email: '',
        password: '',
      },
      emailError: '',
      createIsOpen: false 
    };
  },
  methods: {
    async logar() {
  if (this.emailError) {
    this.$toast.error('Por favor, corrija os erros antes de enviar.');
    return;
  }

  try {
    const user = await this.$store.dispatch('login', { email: this.login.email, senha: this.login.password });
    if (user) {
      this.$router.push({ name: 'usuario' });
    }
  } catch (error) {
    this.$toast.error('Falha ao fazer login.');
    console.error('Erro ao fazer login:', error);
  }
},



    checkEmail() {
      if (!this.login.email.includes('@')) {
        this.emailError = 'O email deve conter um "@".';
      } else {
        this.emailError = '';
      }
    },
    irParaCriarConta() {
    this.$router.push({ name: 'criar-conta' }); 
  }
  }
};

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
  color: white; 
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
