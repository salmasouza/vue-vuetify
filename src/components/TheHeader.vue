<template>
  <header>
    <nav>
      <router-link to="/" class="logo">
        <img src="@/assets/logo.jpg" alt="Deep Space Store">
      </router-link>
      <router-link to="/usuario" class="btn" v-if="$store.state.login">
        {{ getName }}
      </router-link>
      <router-link to="/login" class="btn" v-else>
        Vender / Login
      </router-link>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'TheHeader',
  computed: {
    getName() {
      return this.$store.state.usuario.nome.replace(/ .*/, '')
    }
  }
}
</script>

<style scoped>
nav {
  align-items: center;
  box-shadow: 0 2px 4px rgba(30, 60, 90, 0.1);
  display: flex;
  justify-content: space-between;
  padding: 15px 20px;
}

.logo {
  padding: 10px 0;
}

.logo img {
  width: 250px;
}
</style>
