<template>
  <header>
    <nav>
      <router-link to="/" class="logo">
        <img src="@/assets/logo.jpg" alt="Deep Space Store">
      </router-link>
      <div class="nav-links">
        <router-link
          to="/carrinho"
          class="btn cart-icon"
          @click.native="checkAuthBeforeRedirect"
        >
          <v-icon>mdi-cart</v-icon>
        </router-link>
        <router-link to="/usuario" class="btn" v-if="$store.state.login">
          {{ getName }}
        </router-link>
        <router-link to="/login" class="btn" v-else>
          Vender / Login
        </router-link>
      </div>
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

.nav-links {
  display: flex;
  align-items: center;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px; 
  padding: 0 15px;
  text-decoration: none;
  color: #000;
  font-weight: bold;
  border: 1px solid transparent; 
  border-radius: 4px; 
  transition: background-color 0.3s, color 0.3s;
  margin-left: 10px; 
}

.btn:first-of-type {
  margin-left: 0;
}

.cart-icon {
  width: 40px; 
  height: 40px; 
}

.cart-icon v-icon {
  font-size: 24px;
}
</style>
