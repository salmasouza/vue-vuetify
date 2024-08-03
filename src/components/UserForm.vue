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

    <div class="address-group">
      <div class="address-field">
        <label for="road">Rua</label>
        <input type="text" name="road" id="road" v-model="rua" />
      </div>

      <div class="address-field">
        <label for="number">Número</label>
        <input type="text" name="number" id="number" v-model="numero" />
      </div>
    </div>

    <label for="district">Bairro</label>
    <input type="text" name="district" id="district" v-model="bairro" />

    <label for="city">Cidade</label>
    <input type="text" name="city" id="city" v-model="cidade" />

    <label for="state">Estado</label>
    <input type="text" name="state" id="state" v-model="estado" />

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
form,
.user {
  display: flex;
  flex-direction: column;
}

.address-group {
  display: flex;
  gap: 10px; 
}

.address-field {
  flex: 1;
}

.button {
  margin-top: 10px;
}
label {
  display: block; 
  margin-bottom: 5px; 

}

input[type="text"],
input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 10px;
  margin-top: 3px; 
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

input[type="text"]:focus,
input[type="email"]:focus,
input[type="password"]:focus {
  border-color: #87f;
  outline: none;
}

</style>
