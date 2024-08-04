<template>
  <v-container>
    <v-form @submit.prevent="addProduct">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="product.nome"
            label="Nome"
            dense
            color="secondary"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="product.preco"
            label="Preço"
            type="number"
            dense
            color="secondary"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="6">
          <v-file-input
            v-model="files"
            label="Fotos"
            multiple
            dense
            color="secondary"
          ></v-file-input>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-textarea
            v-model="product.descricao"
            label="Descrição"
            dense
            color="secondary"
          ></v-textarea>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-btn
            type="submit"
            color="secondary"
            class="mr-2"
            style="background-color: #002244; color: white;"
          >
            Adicionar Produto
          </v-btn>
          <v-btn
            @click.prevent="limpar"
            color="secondary"
            style="background-color: #002244; color: white;"
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
      },
      files: [] 
    };
  },
  watch: {
    files: "handleFileUpload"
  },
  methods: {
    productFormat() {
      this.product.usuario_id = this.$store.state.usuario.id;
    },
    handleFileUpload() {
      this.product.fotos = [];
      if (this.files && this.files.length) {
        Array.from(this.files).forEach(file => {
          const reader = new FileReader();
          reader.onload = (e) => {
            console.log("File content:", e.target.result); 
            this.product.fotos.push(e.target.result);
          };
          reader.readAsDataURL(file);
        });
      }
    },
    async addProduct() {
      this.productFormat();
      console.log("Product Data:", this.product);
      try {
        await api.post("/produto", this.product);
        await this.$store.dispatch('getUserProducts');
        this.limpar(); 
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
      this.files = []; 
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
