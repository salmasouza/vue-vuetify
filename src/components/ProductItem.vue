<template>
  <div class="product" v-if="product">
    <router-link class="product-img" :to="{ name: 'produto', params: { id: product.id } }">
     
      <img
        v-if="product.fotos && product.fotos.length"
        :src="product.fotos[0]"  
        :alt="product.nome"
      />
      <p>Ver produto</p>
    </router-link>
    <div class="info">
      <p class="price">{{ product.preco | numberPrice }}</p>
      <h2 class="title">{{ product.nome }}</h2>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProductItem",
  props: ["product"],
};
</script>

<style scoped>
.product {
  display: grid;
  gap: 20px;
  grid-template-columns: minmax(100px, 200px) 1fr;
  margin-bottom: 40px;
  position: relative;
}

.info {
  align-self: end;
}

.product-img {
  border-radius: 4px;
  height: 100px;
  overflow: hidden;
}

.product-img img {
  width: 100%;
  height: auto;
  object-fit: cover;
}
</style>
