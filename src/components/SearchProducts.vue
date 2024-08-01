<template>
  <form>
    <input type="text" name="search" id="search" placeholder="Buscar..." v-model="search" />
    <input type="submit" value="Buscar" id="btn-search" @click.prevent="searchProducts" />
  </form>
</template>

<script>
export default {
  name: 'SearchProducts',
  data() {
    return {
      search: ''
    }
  },
  methods: {
    searchProducts() {
      this.$router.push({ query: { q: this.search }})
    }
  },
}
</script>

<style scoped>
form {
  margin: 30px auto 60px auto;
  max-width: 600px;
  position: relative;
}

#search {
  border: none;
  padding: 20px;
  width: 100%;
}

#search:hover,
#search:focus {
  transform: scale(1.1);
}

#btn-search {
  background: url('../assets/search.svg') no-repeat center center;
  border: none;
  box-shadow: none;
  cursor: pointer;
  height: 62px;
  position: absolute;
  right: 0;
  text-indent: -150px;
  top: 0;
  width: 62px;
}
</style>
