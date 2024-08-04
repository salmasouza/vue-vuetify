<template>
  <section>
    <h1>Compre ou Venda</h1>
    <SearchProducts />
    <ListProducts />
  </section>
</template>

<script>
import SearchProducts from '@/components/SearchProducts.vue'
import ListProducts from '@/components/ListProducts.vue'

export default {
  name: 'HomeView',
  components: {
    SearchProducts,
    ListProducts
  }
}
</script>

<style scoped>
h1 {
  color: #002244;
  font-size: 2rem;
  margin-top: 40px;
  text-align: center;
}
</style>
