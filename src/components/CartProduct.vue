<template>
    <div class="cart-container">
      <template v-if="cartItems.length > 0">
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
            <v-btn icon @click="removeFromCart(item.id)" class="remove-btn">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </template>
      <p v-else class="empty-message">Seu carrinho está vazio.</p>
    </div>
  </template>
  
  <script>
  import { api } from '@/services.js';
  
  export default {
    name: "CartProduct",
    data() {
      return {
        cartItems: [],
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
      removeFromCart(itemId) {
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
    flex-wrap: wrap;
    gap: 16px;
    justify-content: center;
    padding: 16px;
  }
  
  .cart-card {
    width: 300px; 
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
  </style>
  