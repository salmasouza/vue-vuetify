<template>
  <form class="add-product">
    <label for="name">Nome</label>
    <input type="text" name="name" id="name" v-model="product.nome" />
    <label for="price">Preço</label>
    <input type="number" name="price" id="price" v-model="product.preco" />
    <label for="photos">Fotos</label>
    <input type="file" name="photos" id="photos" multiple @change="handleFileUpload" />
    <label for="description">Descrição</label>
    <textarea name="description" id="description" v-model="product.descricao"></textarea>
    <input class="btn" type="button" value="Adicionar Produto" @click.prevent="addProduct" />
  </form>
</template>

<script>
import { api } from "@/services.js";

export default {
  name: "AddProduct",
  data() {
    return {
      product: {
        nome: "",
        preco: "",
        descricao: "",
        vendido: "false",
        fotos: []
      }
    };
  },
  methods: {
    productFormat() {
      this.product.usuario_id = this.$store.state.usuario.id;
    },
    handleFileUpload(event) {
      const files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.product.fotos.push(e.target.result);
        };
        reader.readAsDataURL(files[i]);
      }
    },
    async addProduct() {
      this.productFormat();
      console.log("Product Data:", this.product); 
      try {
        await api.post("/produto", this.product);
        await this.$store.dispatch('getUserProducts');
      } catch (error) {
        console.error("Error adding product:", error); 
      }
    }
  }
};
</script>

<style scoped>
.add-product {
  align-items: center;
  display: grid;
  grid-template-columns: 100px 1fr;
  margin-bottom: 60px;
}

.btn {
  grid-column: 2;
}
</style>
