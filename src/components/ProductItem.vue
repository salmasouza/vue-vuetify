<template>
  <div class="product" v-if="product">
    <router-link class="product-img" :to="{ name: 'produto', params: { id: product.id } }">
      <img v-if="product.fotos && product.fotos.length" :src="product.fotos[0]" :alt="product.nome" />
      <p class="view-text">Ver produto</p>
    </router-link>
    <div class="infos ml-9">
      <p class="price mt-3">{{ product.preco | numberPrice }}</p>
      <h2 class="title">{{ product.nome }}</h2>
      <slot></slot>
    </div>
  </div>
</template>


<script>
export default {
  name: "ProductItem",
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  filters: {
    numberPrice(value) {
      return `R$ ${(value / 100).toFixed(2).replace('.', ',')}`;
    }
  }
};
</script>



<style scoped>
.product {
  display: grid;
  grid-template-columns: 150px 1fr;
  /* Aumenta a largura da imagem para 150px */
  gap: 15px;
  margin-bottom: 30px;
  position: relative;
  align-items: start;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s, transform 0.3s;
  max-width: 450px;
  /* Ajusta a largura máxima para acomodar a imagem maior */
  height: 160px;
  /* Mantém a altura */
}

.product:hover {
  box-shadow: 0 6px 12px rgba(30, 60, 90, 0.2);
  transform: scale(1.05);
}

.product-img {
  border-radius: 8px;
  overflow: hidden;
  height: 100%;
  width: 200px;
}

.product-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.view-text {
  margin-top: 5px;
  text-align: center;
  color: #007BFF;
  font-weight: bold;
}

.infos {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: -40px;
  background: none;
}

.price {
  color: #e80;
  font-weight: bold;
  margin: 0;
}

.title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: bold;
}

.infos p,
.infos h2 {
  margin-bottom: 10px;
}
</style>
