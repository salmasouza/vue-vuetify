<template>
  <v-container fluid>
    <template v-if="product">
      <v-row>
        <v-col cols="12" md="4" lg="5">
          <v-carousel cycle height="400px" class="carousel" :show-arrows="true">
            <v-carousel-item v-for="(image, index) in slides" :key="index">
              <v-sheet height="100%" color="transparent">
                <div class="d-flex fill-height justify-center align-center">
                  <img :src="image" :alt="product.nome" class="carousel-image" />
                </div>
              </v-sheet>
            </v-carousel-item>
          </v-carousel>
        </v-col>

        <v-col cols="12" md="2" lg="2">
          <div class="product-details">
            <h1>{{ product.nome }}</h1>
            <p class="price">{{ formatPrice(product.preco) }}</p>
            <p class="description">{{ product.descricao }}</p>
            <div class="product-infos">
              <transition mode="out-in">
                <v-btn v-if="!finish && product.vendido === 'false'" @click="handleComprar" class="btn-buy primary-btn">
                  Comprar
                </v-btn>
              </transition>
            </div>
          </div>
        </v-col>

        <v-col cols="12" md="6" lg="5" v-if="finish">
          <CheckoutComponent :produto="product" @generate-payment-data="generatePaymentData" />
        </v-col>
      </v-row>
    </template>

    <template v-else>
      <LoadingComponent />
    </template>

    
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          Dados de Pagamento
        </v-card-title>
        <v-card-subtitle>
          QR Code:
        </v-card-subtitle>
        <v-card-text>
          <canvas ref="qrCanvas"></canvas>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="finalizePayment">Finalizar Pagamento</v-btn>
          <v-btn color="secondary" @click="dialog = false">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { api } from '@/services.js';
import CheckoutComponent from '@/components/CheckoutComponent';
import LoadingComponent from '@/components/LoadingComponent';
import QRious from 'qrious'; // Importa a biblioteca QRious

export default {
  name: "ProductView",
  components: { CheckoutComponent, LoadingComponent },
  props: ["id"],
  data() {
    return {
      product: null,
      finish: false,
      slides: [],
      dialog: false, // Controle do diálogo
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
    },

    generatePaymentData() {
      const qrCanvas = this.$refs.qrCanvas;
      new QRious({
        element: qrCanvas,
        value: `Preço: ${this.product.preco}`, // Utiliza o preço real
        size: 200
      });
      this.dialog = true; // Abre o diálogo com o QR Code
    },

    finalizePayment() {
      // Lógica para finalizar o pagamento
      this.dialog = false; // Fecha o diálogo
    },

    formatPrice(price) {
      const numericPrice = parseFloat(price);
      if (isNaN(numericPrice)) {
        return 'Preço inválido';
      }
      return `R$ ${numericPrice.toFixed(2).replace('.', ',')}`;
    }
  },
  created() {
    this.getProduct();
  }
};
</script>


<style scoped>
.carousel {
  position: relative;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 4px;
}

.price {
  color: #e80;
  font-weight: bold;
}

.btn-buy {
  border-radius: 4px;
  font-size: 1rem;
  text-transform: none;
  font-family: sans-serif;
  background-color: #002244 !important;
  color: white !important;
}

.primary-btn {
  border: 2px solid #002244;
}

.secondary-btn {
  background-color: #fff !important;
  color: #002244 !important;
  border: 2px solid #002244;
}

.v-carousel__controls {
  top: 50%;
  width: 100%;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  z-index: 10;
}

.v-carousel__controls .v-icon {
  font-size: 2rem;
  color: #87f;
  cursor: pointer;
}
</style>
