<template>
  <section>
    <h2>Adicionar Produto</h2>
    <AddProduct />
    <h2>Seus Produtos</h2>
    <transition-group v-if="usuario_produtos" name="list" tag="ul" class="product-list">
      <li v-for="produto in usuario_produtos" :key="produto.id" class="product-item">
        <ProductItem :product="produto">
          <p>{{ produto.descricao }}</p>
          <button class="remove-btn" @click="openDialog(produto.id)">
            <v-icon color="red" class="delete">mdi-delete</v-icon>
          </button>
        </ProductItem>
        <hr class="solid" />
      </li>
    </transition-group>

    <v-dialog v-model="dialog.visible" max-width="500px">
      <v-card>
        <v-card-title class="headline">Confirmar Remoção</v-card-title>
        <v-card-text>
          Você tem certeza que deseja remover este produto?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" @click="confirmRemove">Sim</v-btn>
          <v-btn text @click="dialog.visible = false">Não</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </section>
</template>



<script>
import { mapState, mapActions } from "vuex";
import AddProduct from "@/components/AddProduct.vue";
import ProductItem from "@/components/ProductItem.vue";

import { api } from '@/services';

export default {
  name: "UserProducts",
  components: { AddProduct, ProductItem },
  data() {
    return {
      dialog: {
        visible: false,
        itemId: null
      }
    };
  },
  computed: {
    ...mapState(["login", "usuario", "usuario_produtos"])
  },
  methods: {
    ...mapActions(["getUserProducts"]),
    openDialog(id) {
      console.log('ID do produto recebido em openDialog:', id);
      this.dialog.visible = true;
      this.dialog.itemId = id;
    },
    async confirmRemove() {
  console.log('ID do produto a ser removido:', this.dialog.itemId);
  if (this.dialog.itemId !== null) {
    try {
      await api.delete(`/produto/${this.dialog.itemId}`);
      await this.getUserProducts();
    } catch (error) {
      console.error('Erro ao remover produto:', error);
    }
    this.dialog.visible = false; 
  }
}

  },
  watch: {
    login() {
      if (this.login) {
        this.getUserProducts();
      }
    }
  },
  created() {
    if (this.login) {
      this.getUserProducts();
    }
  }
}
</script>


<style scoped>
h2 {
  margin-bottom: 20px;
}

.product-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.product-item {
  position: relative;
  margin-bottom: 20px;
}

.list-enter,
.list-leave-to {
  opacity: 0;
  transform: translate3d(20px, 0, 0);
}

.list-enter-active,
.list-leave-active {
  transition: all .3s;
}

.delete {
  background: none;
  border: none;
  cursor: pointer;
  height: 24px;
  position: absolute;
  right: 0;
  text-indent: -140px;
  top: 0;
  overflow: hidden;
  width: 24px;
}

hr.solid {
  border-top: 1px solid #f4f7fc;
}

.remove-btn {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>

