<template>
  
  <div class="cart-container">
    <div class="header">
      <h2 class="cart-title">Seu Carrinho de Compras</h2>
    </div>

    <template v-if="cartItems.length > 0">
      <div class="cards-wrapper">
        <v-card v-for="item in cartItems" :key="item.id" class="cart-card">
          <v-img
            v-if="item.produto.fotos && item.produto.fotos.length"
            :src="item.produto.fotos[0]"
            :alt="item.produto.nome"
            height="150px"
          ></v-img>
          <v-card-title>
            <div class="title-container">
              <h2 class="name">{{ item.produto.nome }}</h2>
            </div>
          </v-card-title>
          <v-card-subtitle class="price">{{ item.produto.preco | numberPrice }}</v-card-subtitle>
          <v-card-text>
            <p class="description">{{ item.produto.descricao }}</p>
          </v-card-text>
          <v-card-actions>
            <v-btn icon @click="openDialog(item.id)" class="remove-btn">
              <v-icon class="delete-icon">mdi-delete</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </template>
    <p v-else class="empty-message">Seu carrinho está vazio.</p>


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
import { VDialog, VCard, VCardTitle, VCardText, VCardActions, VBtn, VIcon, VImg, VCardSubtitle, VSpacer } from 'vuetify/lib';

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
    VSpacer
  },
  data() {
    return {
      cartItems: [],
      dialog: {
        visible: false,
        itemId: null
      }
    }
  },
  created() {
    this.fetchCartItems();
  },
  methods: {
    fetchCartItems() {
      const userId = this.$store.state.usuario.id;
      api.get(`/carrinho?usuario_id=${userId}`).then(response => {
        this.cartItems = response.data;
      }).catch(error => {
        console.error('Erro ao buscar carrinho:', error);
      });
    },
    openDialog(itemId) {
      console.log("teste")
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
      console.log("teste")
      this.$store.dispatch('removeFromCart', itemId).then(() => {
        this.fetchCartItems();
      }).catch(error => {
        console.error('Erro ao remover produto do carrinho:', error);
      });
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
.cart-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
}

.header {
  margin-bottom: 16px;
  text-align: center;
}

.cart-title {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.cards-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
}

.cart-card {
  width: 200px; 
  max-width: 100%;
  border: 1px solid #ccc; 
  border-radius: 4px; 
  transition: all 0.2s;
}

.cart-card:hover {
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

.remove-btn {
  position: absolute;
  top: 10px;
  right: 10px;
}

.empty-message {
  text-align: center;
  font-size: 1.5rem;
  color: #666;
}

h2 {
  color: #002244 !important;
}

.delete-icon {
  color: #002244 !important;
}
</style>
