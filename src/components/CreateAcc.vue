<template>
  <v-container class="container" fluid>
    <v-row justify="center" align="center">
      <v-col cols="auto">
        <h1>Crie sua conta</h1>
        <UserForm>
          <v-btn
            class="btn-form custom-btn"
            @click.prevent="createUser"
          >
            Criar Usuário
          </v-btn>
        </UserForm>
      </v-col>
    </v-row>
  </v-container>
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
.container {
  min-height: 100vh; 
  padding: 0 16px; 
}

h1 {
  color: #002244;
  font-size: 2rem;
  margin-bottom: 20px;
  text-align: center;
}

.btn-form {
  margin-top: 20px; 
}

.custom-btn {
  background-color: #002244 !important; 
  color: white !important;
}
</style>
