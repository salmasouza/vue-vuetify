<template>
  <section class="login">
    <div v-if="createIsOpen === false">
    <h1>Login</h1>
    <form>
      <label for="email">Email</label>
      <input type="email" name="email" id="email" v-model="login.email" >
      <label for="password">Senha</label>
      <input type="password" name="password" id="password" v-model="login.password" >
      <button class="btn" @click.prevent="logar">Entrar</button>
    </form>
    <p class="forgot-password">
      Esqueceu a senha?
      <a href="/">Clique aqui.</a>
    </p>
    <p class="create-acc" @click="createIsOpen = true">Criar conta</p>
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
      }
    }
  },
  methods: {
    logar() {
      this.$store.dispatch('getUser', this.login.email)
      this.$router.push({ name: 'usuario'})
    }
  },
}
</script>

<style scoped>
.login {
  margin: 0 auto;
  max-width: 500px;
  padding: 0 20px;
}

h1 {
  color: #87f;
  font-size: 2rem;
  margin: 40px 0 20px;
  text-align: center;
}

form {
  display: grid;
}

.btn {
  margin: 0 auto;
  max-width: 300px;
  width: 100%;
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

.forgot-password a,
.create-acc {
  color: #87f;
  cursor: pointer;
  font-weight: bold;
}

.forgot-password a:hover,
.create-acc:hover {
  text-decoration: underline;
}
</style>
