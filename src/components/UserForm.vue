<template>
  <form>
    <div class="user" v-if="showLoginLabels">
      <label for="name">Nome</label>
      <input type="text" name="name" id="name" v-model="nome" />

      <label for="email">E-mail</label>
      <input type="email" name="email" id="email" v-model="email" />

      <label for="password">Senha</label>
      <input type="password" name="password" id="password" v-model="senha" />
    </div>

    <label for="cep">CEP</label>
    <input type="text" name="cep" id="cep" v-model="cep" @keyup="fillCep" />

    <label for="road">Rua</label>
    <input type="text" name="road" id="road" v-model="rua" />

    <label for="number">Numero</label>
    <input type="text" name="number" id="number" v-model="numero" />

    <label for="district">Bairro</label>
    <input type="text" name="district" id="district" v-model="bairro" />

    <label for="city">Cidade</label>
    <input type="text" name="city" id="city" v-model="cidade" />

    <label for="state">Estado</label>
    <input type="text" name="state" id="state" v-model="estado" />

    <!-- <label for="numeroCartao">Número do Cartão</label>
    <input type="text" name="numeroCartao" id="numeroCartao" v-model="numeroCartao" />
    <label for="prazo">Prazo</label>
    <input type="text" name="prazo" id="prazo" v-model="prazo" />
    <label for="cvc">CVC/CW</label>
    <input type="text" name="cvc" id="cvc" v-model="cvc" />
    <label for="nomeCartao">Nome no Cartão</label>
    <input type="text" name="nomeCartao" id="nomeCartao" v-model="nomeCartao" />
    <label for="cpf">CPF</label>
    <input type="text" name="cpf" id="cpf" v-model="cpf" /> -->

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
        "numeroCartao",
        "prazo",
        "cvc",
        "nomeCartao",
        "cpf",

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
        getCep(cep).then((res) => {
          this.rua = res.data.logradouro;
          this.bairro = res.data.bairro;
          this.cidade = res.data.localidade;
          this.estado = res.data.uf;
        });
      }
    },
  },
};
</script>

<style scoped>
form,
.user {
  display: flex;
  flex-direction: column;
}

.button {
  grid-column: 2;
  margin-top: 10px;
}
</style>