<template>
  <section class="container-products">
    <transition mode="out-in">
      <div v-if="!loading && products.length" class="products" key="products">
        <v-card v-for="product in products" :key="product.id" class="product" flat
          @click="redirectToProductPage(product)">
          <v-img v-if="product.fotos && product.fotos.length" :src="product.fotos[0]" :alt="product.nome" height="200px"
            contain></v-img>

          <v-card-title>
            <div class="title-container">
              <h2 class="name">{{ product.nome }}</h2>
              <v-btn icon @click.stop="toggleFavorite(product)" class="favorite-btn">
                <v-icon :color="product.favorito ? 'secondary' : ''">{{ product.favorito ? 'mdi-heart' :
                  'mdi-heart-outline' }}</v-icon>
              </v-btn>

            </div>
          </v-card-title>
          <v-card-subtitle class="price">{{ product.preco | numberPrice }}</v-card-subtitle>
          <v-card-text color="primary">
            <p class="description">{{ product.descricao }}</p>
            <div class="rating">
              <v-icon color="yellow">mdi-star</v-icon>
              <v-icon color="yellow">mdi-star</v-icon>
              <v-icon color="yellow">mdi-star</v-icon>
              <v-icon color="yellow">mdi-star</v-icon>
              <v-icon color="yellow">mdi-star-outline</v-icon>
            </div>
          </v-card-text>
          <v-btn icon @click.stop="handleAddToCart(product)" class="cart-btn">
            <v-icon color="#002244">mdi-cart</v-icon>
          </v-btn>
        </v-card>
      </div>
      <div v-else-if="!loading && products.length === 0" key="empty-search">
        <p class="empty-search">Busca sem resultados. Tente buscar outro termo.</p>
      </div>
      <LoadingComponent v-if="loading" key="loading" />
    </transition>
    <div v-if="!loading && products.length" class="pagination-container">
      <v-pagination v-model="page" :length="totalPages" circle @input="getProducts"></v-pagination>
    </div>
    <v-alert v-if="showAlert" dense text type="success" @click="showAlert = false"
      class="success-alert success-alert-green">
      Produto adicionado ao carrinho com sucesso!
    </v-alert>
  </section>
</template>

<script>
import LoadingComponent from "./LoadingComponent.vue";
import { api } from "@/services.js";
import { serialize } from "@/helpers.js";

export default {
  name: "ListProducts",
  components: { LoadingComponent },
  data() {
    return {
      products: [],
      prodPerPage: 3,
      qntProducts: 0,
      showAlert: false,
      loading: true,
      page: 1,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.qntProducts / this.prodPerPage);
    },
    url() {
      const query = serialize(this.$route.query);
      return `/produto?_limit=${this.prodPerPage}&_page=${this.page}${query}`;
    }
  },
  methods: {
    getProducts() {
      this.loading = true;
      api.get(this.url).then((res) => {
        this.qntProducts = Number(res.headers["x-total-count"]);
        this.products = res.data || [];
        this.loading = false;
      }).catch(error => {
        console.error('Erro ao obter produtos:', error);
        this.loading = false;
      });
    },
    toggleFavorite(product) {
      product.favorito = !product.favorito;
    },
    handleAddToCart(product) {
      if (this.$store.state.login) {
        this.addToCart(product);
      } else {
        this.$store.commit('SET_REDIRECT_AFTER_LOGIN', this.$route.fullPath);
        this.$router.push('/login');
      }
    },
    addToCart(product) {
      this.$store.dispatch('addToCart', product).then(() => {
        this.showAlert = true;
        setTimeout(() => {
          this.showAlert = false;
        }, 3000);
      }).catch(error => {
        console.error('Erro ao adicionar produto ao carrinho:', error);
      });
    },
    redirectToProductPage(product) {
      this.$router.push(`/produto/${product.id}`);
    }
  },
  watch: {
    url() {
      this.getProducts();
    },
    page() {
      this.getProducts();
    }
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
  padding: 30px;
}

.products {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 30px;
  margin-bottom: 60px;
}

.product {
  position: relative;
  overflow: hidden;
  transition: all 0.2s;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.product:hover {
  box-shadow: 0 6px 12px rgba(30, 60, 90, 0.2);
  transform: scale(1.05);
  z-index: 1;
}

.title-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.name {
  margin: 0;
}

.price {
  color: #e80;
  font-weight: bold;
}

.description {
  margin-bottom: 10px;
}

.rating {
  display: flex;
  gap: 5px;
  margin-bottom: 10px;

}

.favorite-btn,
.cart-btn {
  position: absolute;
  top: 10px;
}

.favorite-btn {
  right: 50px;
}

.cart-btn {
  right: 10px;
}

.empty-search {
  text-align: center;
  font-size: 1.5rem;
  color: #666;
}

.success-alert {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
}

.success-alert-green .v-alert__content {
  background-color: #4caf50;
  color: white;
}

.pagination-container {
  text-align: center;
  padding: 10px 0;
}

.rating .v-icon {
  color: yellow;
}

.v-img {
  object-fit: cover;
}
</style>
