<template>
  <v-container>
    <v-form @submit.prevent="addProduct">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="product.nome"
            label="Nome"
            outlined
            dense
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="product.preco"
            label="Preço"
            type="number"
            outlined
            dense
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-file-input
            v-model="product.fotos"
            label="Fotos"
            multiple
            @change="handleFileUpload"
            outlined
            dense
          ></v-file-input>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-textarea
            v-model="product.descricao"
            label="Descrição"
            outlined
            dense
          ></v-textarea>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-btn
            type="submit"
            color="primary"
            class="mr-2"
          >
            Adicionar Produto
          </v-btn>
          <v-btn
            @click.prevent="limpar"
            color="secondary"
          >
            Limpar Produto
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
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
    },
    limpar() {
      this.product = {
        nome: "",
        preco: "",
        descricao: "",
        vendido: "false",
        fotos: []
      };
    }
  }
};
</script>

<style scoped>
.v-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.v-row {
  margin-bottom: 20px;
}

.v-btn {
  margin-right: 10px;
}
</style>
