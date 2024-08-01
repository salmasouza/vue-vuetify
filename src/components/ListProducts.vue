<template>
  <section class="container-products">
    <transition mode="out-in">
      <div v-if="products && products.length" class="products" key="products">
        <div v-for="product in products" :key="product.id" class="product">
          <router-link :to="{name: 'produto', params: { id: product.id }}">
            <img
              v-if="product.fotos"
              :src="product.fotos[0].src"
              :alt="product.fotos[0].titulo"
            />
            <p class="price">{{ product.preco | numberPrice }}</p>
            <h2 class="name">{{ product.nome }}</h2>
            <p class="description">{{ product.descricao }}</p>
          </router-link>
        </div>
        <ProductsPagination
          :qntProducts="qntProducts"
          :prodPerPage="prodPerPage"
        />
      </div>
      <div v-else-if="products && products.length === 0" key="empty-search">
        <p class="empty-search">
          Busca sem resultados. Tente buscar outro termo.
        </p>
      </div>
      <LoadingComponent v-else key="loading" />
    </transition>
  </section>
</template>

<script>
import LoadingComponent from "./LoadingComponent.vue";
import ProductsPagination from "./ProductsPagination.vue";
import { api } from "@/services.js";
import { serialize } from "@/helpers.js";

export default {
  name: "ListProducts",
  components: { ProductsPagination, LoadingComponent },
  data() {
    return {
      products: [],
      prodPerPage: 9,
      qntProducts: 0,
    };
  },
  computed: {
    url() {
      const query = serialize(this.$route.query);
      return `/produto?_limit=${this.prodPerPage}${query}`;
    },
  },
  methods: {
    getProducts() {
      this.products = null;
      setTimeout(() => {
        api.get(this.url).then((res) => {
          this.qntProducts = Number(res.headers["x-total-count"]);
          this.products = res.data;
        });
      }, 1500);
    },
  },
  watch: {
    url() {
      this.getProducts();
    },
  },
  created() {
    this.getProducts();
  },
};
</script>

<style scoped>
.container-products {
  margin: 0 auto;
  max-width: 1000px;
}

.products {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 30px;
  margin: 30px;
}

.product {
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(30, 60, 90, 0.1);
  padding: 10px;
  transition: all 0.2s;
}

.product:hover {
  box-shadow: 0 6px 12px rgba(30, 60, 90, 0.2);
  position: relative;
  transform: scale(1.1);
  z-index: 1;
}

.product img {
  border-radius: 4px;
  margin-bottom: 20px;
}

.name {
  margin-bottom: 10px;
}

.price {
  color: #e80;
  font-weight: bold;
}

.empty-search {
  text-align: center;
}
</style>
