<template>
    <section class="user">
      <nav class="sidenav">
        <ul>
          <li>
            <router-link :to="{name: 'usuario'}">Produtos</router-link>
          </li>
          <li>
            <router-link :to="{name: 'compras'}">Compras</router-link>
          </li>
          <li>
            <router-link :to="{name: 'vendas'}">Vendas</router-link>
          </li>
          <li>
            <router-link :to="{name: 'usuario-editar'}">Editar Usuário</router-link>
          </li>
          <li>
            <button @click="logout">Deslogar</button>
          </li>
        </ul>
      </nav>
      <transition mode="out-in">
        <router-view></router-view>
      </transition>
    </section>
  </template>
  
  <script>
  export default {
    name: "UserView",
    components: {},
    methods: {
      logout () {
        this.$store.dispatch('logout');
        this.$router.push('/login');
      }
    },
  };
  </script>
  
  <style scoped>
  .user {
    display: grid;
    gap: 30px;
    grid-template-columns: minmax(140px, 200px) 1fr;
    margin: 40px auto;
    max-width: 900px;
    padding: 20px;
  }
  
  .sidenav a,
  .sidenav button {
    background: #f4f7fc;
    border-radius: 4px;
    display: block;
    margin-bottom: 10px;
    padding: 10px;
  }
  
  .sidenav a.router-link-exact-active,
  .sidenav a:hover,
  .sidenav button:hover {
    background: #87f;
    color: #fff;
  }
  
  .sidenav button {
    border: none;
    color: #345;
    cursor: pointer;
    font-family: "Avenir", Arial, Helvetica, sans-serif;
    font-size: 1rem;
    text-align: left;
    width: 100%;
  }
  
  @media screen and (max-width: 500px) {
    .user {
      grid-template-columns: 1fr;
      margin: 0 auto;
    }
  }
  </style>
  