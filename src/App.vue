<template>
  <v-app>
  <div id="app">
    <TheHeader />
    <main id="main">
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
    </main>
    <TheFooter />
  </div>
</v-app>
</template>

<script>
import TheHeader from './components/TheHeader.vue';
import TheFooter from './components/TheFooter.vue';

export default {
  name: 'App',
  components: {
    TheHeader,
    TheFooter
  }
}
</script>

<style>

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

body {
  color: #345;
  font-family: Arial, Helvetica, sans-serif;
  background: url('./assets/pattern.svg');
}

#main {
  flex: 1;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
