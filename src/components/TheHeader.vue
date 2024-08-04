<template>
  <header>
    <nav>
      <router-link to="/" class="logo">
        <img src="@/assets/logo.jpg" alt="Deep Space Store">
      </router-link>
      <div class="nav-links">
        <v-btn
          to="/carrinho"
          class="nav-button primary-btn"
          @click.native="checkAuthBeforeRedirect"
          icon
        >
          <v-icon>mdi-cart</v-icon>
        </v-btn>
        <v-btn
          v-if="$store.state.login"
          to="/usuario"
          class="nav-button primary-btn"
        >
          {{ getName }}
        </v-btn>
        <v-btn
          v-else
          to="/login"
          class="nav-button secondary-btn"
        >
          Vender / Login
        </v-btn>
      </div>
    </nav>
  </header>
</template>


<script>
export default {
  name: 'TheHeader',
  computed: {
    getName() {
     
      return this.$store.state.usuario.nome.split(' ')[0];
    }
  },
  methods: {
    checkAuthBeforeRedirect() {
      if (!this.$store.state.login) {
        this.$store.commit('setRedirectAfterLogin', '/carrinho');
        this.$router.push('/login');
      }
    }
  }
}
</script>


<style scoped>
nav {
  align-items: center;
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

.nav-links {
  display: flex;
  align-items: center;
}

.nav-button {
  margin-left: 10px;
  border-radius: 4px;
}

.nav-button:first-of-type {
  margin-left: 0;
}

.primary-btn {
  background-color: #063564 !important; 
  color: white !important;
}
.secondary-btn {
  background-color: #002244 !important; 
  color: white !important;
}
</style>

