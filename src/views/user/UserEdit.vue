<template>
  <section>
    <UserForm>
      <button class="btn" @click.prevent="updateUser">Atualizar dados</button>
    </UserForm>
  </section>
</template>

<script>
import UserForm from '@/components/UserForm'
import { api } from '@/services.js'

export default {
  name: "UserEdit",
  components: { UserForm },
  methods: {
    async updateUser () {
      await api.put(`/usuario/${this.$store.state.usuario.id}`, this.$store.state.usuario)
      await this.$store.dispatch('getUser', this.$store.state.usuario.email)
      await this.$router.push({ name: 'usuario' })
    }
  },
}
</script>

<style>

</style>