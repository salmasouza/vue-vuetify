<template>
  <form @submit.prevent="searchProducts" class="search-form">
    <v-text-field
      v-model="search"
      label="Buscar..."
      class="search-input"
      color="secondary"
     
      dense
      :append-icon="'mdi-magnify'"
      @click:append="searchProducts"
    />
  </form>
</template>

<script>
import { VTextField } from 'vuetify/lib'

export default {
  name: 'SearchProducts',
  components: { VTextField },
  data() {
    return {
      search: ''
    }
  },
  methods: {
    searchProducts() {
      if (this.search.trim() === '') return; 
      this.$router.push({ query: { q: this.search }})
    }
  },
}
</script>

<style scoped>
.search-form {
  display: flex;
  align-items: center;
  margin: 30px auto 60px auto;
  max-width: 600px; 
}

.search-input {
  flex: 1; 
}

.search-input .v-input__append-inner {
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-input .v-icon {
  color: #002244; 
}
</style>
