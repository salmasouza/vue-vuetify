<template>
  <section>
    <h1>Crie sua conta</h1>
    <UserForm>
      <button class="btn btn-form" @click.prevent="createUser">Criar Usuário</button>
    </UserForm>
  </section>
</template>

<script>
import UserForm from './UserForm.vue'

export default {
  name: 'CreateLogin',
  components: { UserForm },
  methods: {
    async createUser() {
      await this.$store.dispatch('createUser', this.$store.state.usuario)
      await this.$store.dispatch('getUser', this.$store.state.usuario.email)
      await this.$router.push({ name: 'usuario' })
    }
  },
}
</script>

<style scoped>
h1 {
  color: #87f;
  font-size: 2rem;
  margin: 40px 0 20px;
  text-align: center;
}

.btn {
  margin: 0 auto;
  max-width: 300px;
  width: 100%;
}

.btn-form {
  max-width: 100%;
}
</style>