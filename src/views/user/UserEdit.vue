<template>
  <v-container class="container" fluid>
    <v-row justify="center" align="center">
      <v-col cols="auto">
        <h1>Atualize seus dados</h1>
        <v-row>
          <v-col cols="12">
            <UserForm :user="user" />
          </v-col>
        </v-row>
        <v-row>
          <v-col class="text-center">
            <v-btn
              class="custom-btn"
              color="secondary"
              @click.prevent="updateUser"
            >
              Atualizar dados
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import UserForm from '@/components/UserForm'
import { api } from '@/services.js'

export default {
  name: "UserEdit",
  components: { UserForm },
  computed: {
    user() {
      return this.$store.state.usuario;
    }
  },
  methods: {
    async updateUser() {
      try {
        await api.put(`/usuario/${this.$store.state.usuario.id}`, this.$store.state.usuario);
        await this.$store.dispatch('getUser', this.$store.state.usuario.email);
        await this.$router.push({ name: 'usuario' });
      } catch (error) {
        console.error('Erro ao atualizar dados do usuário:', error);
      }
    }
  }
}
</script>
