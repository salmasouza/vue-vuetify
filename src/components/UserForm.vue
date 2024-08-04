<template>
  <form>
    <div v-if="showLoginLabels">
      <v-text-field
        v-model="nome"
        label="Nome"
        outlined
        dense
        class="custom-text-field"
      ></v-text-field>

      <v-text-field
        v-model="email"
        label="E-mail"
        type="email"
        outlined
        dense
        class="custom-text-field"
      ></v-text-field>

      <v-text-field
        v-model="senha"
        label="Senha"
        type="password"
        outlined
        dense
        class="custom-text-field"
      ></v-text-field>
    </div>

    <v-text-field
      v-model="cep"
      label="CEP"
      @keyup="fillCep"
      outlined
      dense
      class="custom-text-field"
    ></v-text-field>

    <div class="address-group">
      <v-text-field
        v-model="rua"
        label="Rua"
        outlined
        dense
        class="address-field"
      ></v-text-field>

      <v-text-field
        v-model="numero"
        label="Número"
        outlined
        dense
        class="address-field"
      ></v-text-field>
    </div>

    <v-text-field
      v-model="bairro"
      label="Bairro"
      outlined
      dense
      class="custom-text-field"
    ></v-text-field>

    <v-text-field
      v-model="cidade"
      label="Cidade"
      outlined
      dense
      class="custom-text-field"
    ></v-text-field>

    <v-text-field
      v-model="estado"
      label="Estado"
      outlined
      dense
      class="custom-text-field"
    ></v-text-field>

    <div class="button">
      <slot></slot>
    </div>
  </form>
</template>

<script>
import { mapFields } from "@/helpers.js";
import { getCep } from "@/services.js";

export default {
  name: "UserForm",
  computed: {
    ...mapFields({
      fields: [
        "nome",
        "email",
        "senha",
        "cep",
        "rua",
        "numero",
        "bairro",
        "cidade",
        "estado",
      ],
      base: "usuario",
      mutation: "UPDATE_USER",
    }),
    showLoginLabels () {
      return (!this.$store.state.login || this.$route.name === 'usuario-editar')
    }
  },
  methods: {
    fillCep() {
      const cep = this.cep.replace(/\D/g, "");

      if (cep.length === 8) {
        getCep(cep)
          .then((res) => {
            this.rua = res.data.logradouro;
            this.bairro = res.data.bairro;
            this.cidade = res.data.localidade;
            this.estado = res.data.uf;

            this.$nextTick(() => {
              console.log("DOM atualizada com:", this.rua, this.bairro, this.cidade, this.estado);
            });
          })
          .catch((error) => {
            console.error("Erro ao buscar CEP:", error);
          });
      }
    }
  },
};
</script>

<style scoped>
.custom-text-field {
  margin-bottom: 20px; 
}

.address-group {
  display: flex;
  gap: 10px; 
}

.address-field {
  flex: 1;
}
</style>
