<template>
  <form>
    <div v-if="showLoginLabels">
      <v-text-field
        v-model="nome"
        label="Nome"
        dense
        class="custom-text-field"
        color="secondary"
        name="nome"
      ></v-text-field>

      <v-text-field
        v-model="email"
        label="E-mail"
        type="email"
        dense
        class="custom-text-field"
        color="secondary"
        naome="email"
      ></v-text-field>

      <v-text-field
        v-model="senha"
        label="Senha"
        type="password"
        dense
        class="custom-text-field"
        color="secondary"
        name="senha"
      ></v-text-field>
    </div>

    <v-text-field
      v-model="cep"
      label="CEP"
      @keyup="fillCep"
      dense
      class="custom-text-field"
      color="secondary"
      name="cep"
    ></v-text-field>

    <div class="address-group">
      <v-text-field
        v-model="rua"
        label="Rua"
        dense
        class="address-field"
        color="secondary"
        name="rua"
      ></v-text-field>

      <v-text-field
        v-model="numero"
        label="Número"
        dense
        class="address-field"
        color="secondary"
        name="numero"
      ></v-text-field>
    </div>

    <v-text-field
      v-model="bairro"
      label="Bairro"
      dense
      class="custom-text-field"
      color="secondary"
      name="bairro"
    ></v-text-field>

    <v-text-field
      v-model="cidade"
      label="Cidade"
      dense
      class="custom-text-field"
      color="secondary"
      name="cidade"
    ></v-text-field>

    <v-text-field
      v-model="estado"
      label="Estado"
      dense
      class="custom-text-field"
      color="secondary"
      name="estado"
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
        "estado"
      ],
      base: "usuario",
      mutation: "UPDATE_USER"
    }),
    showLoginLabels() {
      return (!this.$store.state.login || this.$route.name === 'usuario-editar');
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
          })
          .catch((error) => {
            console.error("Erro ao buscar CEP:", error);
          });
      }
    }
  }
}
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

.v-text-field {
  color: #002244 !important;
}
</style>
