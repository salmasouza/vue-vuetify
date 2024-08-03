<template>
  <section class="product-view">
    <div v-if="product" class="product-container">
      <div class="product-image">
        <v-carousel
          cycle
          height="400px"
          hide-delimiter-background
          show-arrows-on-hover
          class="carousel"
        >
          <v-carousel-item
            v-for="(image, index) in slides"
            :key="index"
          >
            <v-sheet
              height="100%"
              :color="'transparent'"
            >
              <div class="d-flex fill-height justify-center align-center">
                <img :src="image" :alt="product.nome" class="carousel-image" />
              </div>
            </v-sheet>
          </v-carousel-item>
        </v-carousel>
      </div>

      <div class="product-details">
        <h1>{{ product.nome }}</h1>
        <p class="price">{{ product.preco | numberPrice }}</p>
        <p class="description">{{ product.descricao }}</p>
        <div class="product-info">
          <transition mode="out-in">
            <button class="btn" v-if="!finish && product.vendido === 'false'" @click="handleComprar">Comprar</button>
            <button class="null" v-else-if="product.vendido === 'false'" disabled></button>
          </transition>
        </div>
      </div>

      <div class="checkout-form" v-if="finish">
        <CheckoutComponent :produto="product" />
      </div>
    </div>
    <LoadingComponent v-else />
  </section>
</template>

<script>
import { api } from '@/services.js';
import CheckoutComponent from '@/components/CheckoutComponent';
import LoadingComponent from '@/components/LoadingComponent';

export default {
  name: "ProductView",
  components: { CheckoutComponent, LoadingComponent },
  props: ["id"],
  data() {
    return {
      product: null,
      finish: false,
      slides: [],
    };
  },
  methods: {
  getProduct() {
    if (!this.id) {
      console.error('ID do produto não fornecido');
      this.product = null;
      this.slides = [];
      return;
    }

    const url = `/produto/${this.id}`;

    api.get(url)
      .then((res) => {
        if (res.data && res.data.fotos && Array.isArray(res.data.fotos)) {
          this.product = res.data;
          this.slides = this.product.fotos;
        } else {
          console.error('Dados do produto inválidos:', res.data);
          this.product = null;
          this.slides = [];
        }
      })
      .catch((error) => {
        console.error('Erro ao obter produto:', error);
        this.product = null;
        this.slides = [];
      });
  },
  handleComprar() {
    if (!this.$store.state.login) {
      this.$store.commit('SET_REDIRECT_AFTER_LOGIN', this.$route.fullPath);
      this.$router.push({ name: 'login' });
    } else {
      this.finish = true;
    }
  }
},
created() {
  this.getProduct();
}
};
</script>

<style scoped>
.product-view {
  display: grid;
  grid-template-columns: 1.5fr 0.5fr 2fr; 
  grid-gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px;
}

.product-container {
  display: contents; 
}

.product-image {
  grid-column: 1; 
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  overflow: hidden;
  position: relative; 
}

.carousel {
  position: relative; 
}

.carousel .v-carousel__controls {
  position: absolute;
  top: 50%;
  width: 100%; 
  transform: translateY(-50%);
  display: flex; 
  justify-content: space-between; 
  z-index: 10; 
}

.carousel .v-carousel__controls .v-icon {
  font-size: 2rem;
  color: #87f; 
}

.product-details {
  grid-column: 2; 
  display: flex;
  flex-direction: column;
}

.checkout-form {
  grid-column: 3; 
  display: flex;
  flex-direction: column;
}

.carousel-image {
  width: 100%;
  height: 100%; 
  object-fit: cover;
  border-radius: 4px;
}

.price {
  color: #e80;
  font-weight: bold;
}
</style>
