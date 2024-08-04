<template>
  <div class="container-products">
    <div class="header mt-1">
      <v-icon color="secondary">mdi-cart</v-icon>
      <span class="cart-title text-center">Seu carrinho</span>
    </div>
    <div v-if="!loading && cartItems.length" class="products">
      <v-card v-for="item in cartItems" :key="item.id" class="product" flat>
        <v-img v-if="item.produto.fotos && item.produto.fotos.length" :src="item.produto.fotos[0]"
          :alt="item.produto.nome" height="200px" contain></v-img>

        <v-card-title>
          <div class="title-container">
            <h2 class="name">{{ item.produto.nome }}</h2>
            <v-btn icon @click="openDialog(item.id)" class="favorite-btn">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </div>
        </v-card-title>
        <v-card-subtitle class="price">{{ item.produto.preco | numberPrice }}</v-card-subtitle>
        <v-card-text>
          <p class="description">{{ item.produto.descricao }}</p>
        </v-card-text>
      </v-card>
    </div>
    <p v-else-if="!loading && cartItems.length === 0" class="empty-search">Seu carrinho está vazio.</p>

    <div v-if="!loading && cartItems.length" class="pagination-container">
      <v-pagination v-model="page" :length="totalPages" circle @input="fetchCartItems"></v-pagination>
    </div>

    <v-dialog v-model="dialog.visible" max-width="500px">
      <v-card>
        <v-card-title class="headline">Confirmar Remoção</v-card-title>
        <v-card-text>
          Você tem certeza que deseja remover este item do carrinho?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" @click="confirmRemove">Sim</v-btn>
          <v-btn text @click="dialog.visible = false">Não</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { api } from '@/services.js';
import { VDialog, VCard, VCardTitle, VCardText, VCardActions, VBtn, VIcon, VImg, VCardSubtitle, VSpacer, VPagination } from 'vuetify/lib';

export default {
  name: "CartProduct",
  components: {
    VDialog,
    VCard,
    VCardTitle,
    VCardText,
    VCardActions,
    VBtn,
    VIcon,
    VImg,
    VCardSubtitle,
    VSpacer,
    VPagination
  },
  data() {
    return {
      cartItems: [],
      dialog: {
        visible: false,
        itemId: null
      },
      loading: true,
      page: 1,
      itemsPerPage: 3,
      totalItems: 0,
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalItems / this.itemsPerPage);
    },
  },
  created() {
    this.fetchCartItems();
  },
  methods: {
    fetchCartItems() {
      const userId = this.$store.state.usuario.id;
      api.get(`/carrinho?usuario_id=${userId}&_page=${this.page}&_limit=${this.itemsPerPage}`).then(response => {
        this.totalItems = Number(response.headers['x-total-count']);
        this.cartItems = response.data;
        this.loading = false;
      }).catch(error => {
        console.error('Erro ao buscar carrinho:', error);
        this.loading = false;
      });
    },
    openDialog(itemId) {
      this.dialog.visible = true;
      this.dialog.itemId = itemId;
    },
    confirmRemove() {
      if (this.dialog.itemId !== null) {
        this.removeFromCart(this.dialog.itemId);
        this.dialog.visible = false;
      }
    },
    removeFromCart(itemId) {
      this.$store.dispatch('removeFromCart', itemId).then(() => {
        this.fetchCartItems();
      }).catch(error => {
        console.error('Erro ao remover produto do carrinho:', error);
      });
    }
  },
  watch: {
    page() {
      this.fetchCartItems();
    }
  },
  filters: {
    numberPrice(value) {
      return `R$ ${(value / 100).toFixed(2).replace('.', ',')}`;
    }
  }
}
</script>

<style scoped>
.container-products {
  margin: 0 auto;
  max-width: 1000px;
  padding: 30px;
}

.header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  text-align: center;
}

.cart-title {
  color: #002244;
  /* Cor secundária */
  font-size: 28px;
  /* Aumentar a fonte */
  font-weight: bold;
  /* Negrito */
  margin-left: 10px;
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

.favorite-btn {
  position: absolute;
  top: 10px;
  right: 10px;
}

.empty-search {
  text-align: center;
  font-size: 1.5rem;
  color: #666;
}

.pagination-container {
  text-align: center;
  padding: 10px 0;
}

.v-img {
  object-fit: cover;
}
</style>
