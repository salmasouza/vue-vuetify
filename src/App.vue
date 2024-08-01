<template>
  <div id="app">
    <TheHeader />
    <main id="main">
      <transition mode="out-in">
        <router-view />
      </transition>
    </main>
    <TheFooter />
  </div>
</template>

<script>
import TheHeader from './components/TheHeader.vue'
import TheFooter from './components/TheFooter.vue'

export default {
  name: 'App',
  components: {
    TheHeader,
    TheFooter
  }
}
</script>

<style>
* {
  box-sizing: border-box;
}

body, ul, li, h1, h2, p {
  margin: 0;
  padding: 0;
}

ul {
  list-style-type: none;
}

body {
  color: #345;
  font-family: Arial, Helvetica, sans-serif;
  background: url('./assets/pattern.svg');
}

a {
  color: #345;
  list-style-type: none;
  text-decoration: none;
}

img {
  display: block;
  max-width: 100%;
}

label {
  margin-bottom: 5px;
}

input, textarea {
  border: 1px solid white;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(30, 60, 90, 0.1);
  font-size: 1rem;
  font-family: Arial, Helvetica, sans-serif;
  margin-bottom: 15px;
  padding: 15px;
  transition: all 0.3s;
}

input:hover, textarea:hover,
input:focus, textarea:focus {
  border-color: #87f;
  box-shadow: 0 6px 12px rgba(30, 60, 90, 0.2);
  outline: none;
  transition: all 0.3s;
}

.v-enter,
.v-leave-to {
  opacity: 0;
}

.v-enter {
  transform: translate3d(0, -20px, 0);
}

.v-leave-to {
  transform: translate3d(0, 20px, 0);
}

.v-enter-active,
.v-leave-active {
  transition: all 0.3s;
}

.btn {
  background: #87f;
  border: none;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(30, 60, 90, 0.2);
  color: #fff;
  cursor: pointer;
  display: block;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 1rem;
  padding: 10px 30px;
  transition: all 0.3s;
  text-align: center;
}

.btn:hover {
  background: #65d;
  transform: scale(1.1);
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

#main {
  flex: 1;
}
</style>
