<template>
  <form class="add-product">
    <label for="name">Nome</label>
    <input type="text" name="name" id="name" v-model="product.nome" />
    <label for="price">Preço</label>
    <input type="number" name="price" id="price" v-model="product.preco" />
    <label for="photos">Fotos</label>
    <input type="file" name="photos" id="photos" ref="product.fotos" />
    <label for="description">Descrição</label>
    <textarea name="description" id="description" v-model="product.descricao"></textarea>
    <input class="btn" type="button" value="Adicionar Produto" @click.prevent="addProduct" />
  </form>
</template>

<script>
import { api } from "@/services.js"

export default {
  name: "AddProduct",
  data () {
    return {
      product: {
        nome: "",
        preco: "",
        descricao: "",
        vendido: "false",
        fotos: null
      }
    }
  },
  methods: {
    productFormat () {
      this.product.usuario_id = this.$store.state.usuario.id
    },
    async addProduct () {
      this.productFormat()
      await api.post("/produto", this.product)
      await this.$store.dispatch('getUserProducts')
    }
  },
}
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
