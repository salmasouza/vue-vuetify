<template>
  <section>
    <div v-if="product" class="product">
      
      <ul v-if="product.fotos && product.fotos.length" class="images">
        <li v-for="(image, index) in product.fotos" :key="index">
          <img :src="image.src" :alt="image.titulo" />
        </li>
      </ul>
      <div class="info">
        <h1>{{ product.nome }}</h1>
        <p class="price">{{ product.preco | numberPrice }}</p>
        <p class="description">{{ product.descricao }}</p>
        <transition mode="out-in">
          <button class="btn" v-if="!finish && product.vendido === 'false'" @click="finish = true">Comprar</button>
          <CheckoutComponent v-else-if="product.vendido === 'false'" :produto="product" />
          <button class="btn" v-else disabled>Produto Vendido</button>
        </transition>
      </div>
    </div>
    <LoadingComponent v-else />
  </section>
</template>

<script>
import { api } from '@/services.js'
import CheckoutComponent from '@/components/CheckoutComponent'
import LoadingComponent from '@/components/LoadingComponent'

export default {
  name: "ProductView",
  components: { CheckoutComponent, LoadingComponent },
  props: ["id"],
  data() {
    return {
      product: null,
      finish: false
    };
  },
  methods: {
    getProduct() {
      this.product = null;
      api.get(`/produto/${this.id}`)
         .then((res) => (this.product = res.data));
    },
  },
  created() {
    this.getProduct()
  },
};
</script>

<style scoped>
.product {
  display: grid;
  grid-gap: 30px;
  grid-template-columns: 1fr 1fr;
  margin: 0 auto;
  max-width: 900px;
  padding: 60px 20px;
}

.images {
  list-style: none;
  padding: 0;
}

.images li {
  margin-bottom: 20px;
}

.images img {
  width: 100%;
  height: auto;
  border-radius: 4px;
  object-fit: cover;
}

.price {
  color: #e80;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 40px;
}

.description {
  font-size: 1.2rem;
}

.btn {
  margin-top: 60px;
  width: 200px;
}
</style>
