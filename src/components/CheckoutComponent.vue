<template>
  <v-stepper v-model="step">
    <v-stepper-header>
      <v-stepper-step :complete="step > 1" step="1">
        <v-icon>mdi-home-outline</v-icon>
        Endereço para Envio
      </v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step :complete="step > 2" step="2">
        <v-icon>mdi-credit-card-outline</v-icon>
        Pagamento
      </v-stepper-step>
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content step="1">
        <div class="user-form-section">
          <h2>Endereço para Envio</h2>
          <div class="user-form">
            <UserForm />
          </div>
        </div>

        <v-btn class="btn-custom" @click="step = 2">
          Continuar
        </v-btn>
      </v-stepper-content>

      <v-stepper-content step="2">
        <h2>Pagamento</h2>
        <form class="payment" @submit.prevent="finishCheckout">
          <v-radio-group v-model="paymentMethod" mandatory>
            <v-radio label="Cartão de Crédito" value="cartao"></v-radio>
            <v-radio label="PIX" value="pix"></v-radio>
            <v-radio label="Boleto" value="boleto"></v-radio>
          </v-radio-group>

          <div v-if="paymentMethod === 'cartao'">
            <label for="numeroCartao">Número do Cartão:</label>
            <input type="text" id="numeroCartao" v-model="payment.numeroCartao" required>

            <div class="payment-details">
              <div class="payment-group">
                <label for="prazo">Prazo:</label>
                <input type="text" id="prazo" v-model="payment.prazo" required>
              </div>

              <div class="payment-group">
                <label for="cvc">CVC:</label>
                <input type="text" id="cvc" v-model="payment.cvc" required>
              </div>
            </div>

            <label for="nomeCartao">Nome no Cartão:</label>
            <input type="text" id="nomeCartao" v-model="payment.nomeCartao" required>
          </div>

          <div>
            <label for="cpf">CPF:</label>
            <input
              type="text"
              id="cpf"
              v-model="payment.cpf"
              @input="validateCPF"
              v-mask="'###.###.###-##'"
              placeholder="###.###.###-##"
              :class="{ invalid: !validCpf && payment.cpf.length > 0 }"
              required
            >
            <span v-if="!validCpf && payment.cpf.length > 0" class="error-message">CPF inválido</span>
          </div>

          <div class="buttons-container">
            <v-btn class="btn-custom" type="submit" v-if="$store.state.login">
              Finalizar Compra
            </v-btn>

            <v-btn class="btn-custom" @click="step = 1" v-if="$store.state.login">
              Voltar
            </v-btn>
          </div>
        </form>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
import { mapState } from 'vuex';
import UserForm from '@/components/UserForm';
import { api } from '@/services.js';

export default {
  name: 'CheckoutComponent',
  components: { UserForm },
  props: ['produto'],
  data() {
    return {
      step: 1,
      paymentMethod: 'cartao',
      validCpf: true,
      payment: {
        numeroCartao: "",
        prazo: "",
        cvc: "",
        nomeCartao: "",
        cpf: ""
      }
    }
  },
  computed: {
    ...mapState(['usuario']),
    compra() {
      return {
        comprador_id: this.usuario.email,
        vendedor_id: this.produto.usuario_id,
        produto: this.produto,
        endereco: {
          cep: this.usuario.cep,
          rua: this.usuario.rua,
          bairro: this.usuario.bairro,
          cidade: this.usuario.cidade,
          estado: this.usuario.estado,
        },
        pagamento: this.payment
      }
    }
  },
  methods: {
    async createCheckout() {
      await api.post('/transacao', this.compra);
      await this.$router.push({ name: 'compras' });
    },

    async createUser() {
      await this.$store.dispatch('createUser', this.$store.state.usuario);
      await this.$store.dispatch('getUser', this.$store.state.usuario.email);
      await this.createCheckout();
    },

    finishCheckout() {
      if (this.validCpf) {
        this.$store.state.login
          ? this.createCheckout()
          : this.createUser();
      } else {
        alert("CPF inválido. Por favor, corrija o CPF antes de finalizar a compra.");
      }
    },

    validateCPF() {
      const cpf = this.payment.cpf.replace(/\D/g, '');

      if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
        this.validCpf = false;
        return;
      }

      let soma = 0;
      let resto;

      for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
      }

      resto = (soma * 10) % 11;

      if (resto === 10 || resto === 11) {
        resto = 0;
      }

      if (resto !== parseInt(cpf.substring(9, 10))) {
        this.validCpf = false;
        return;
      }

      soma = 0;

      for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
      }

      resto = (soma * 10) % 11;

      if (resto === 10 || resto === 11) {
        resto = 0;
      }

      if (resto !== parseInt(cpf.substring(10, 11))) {
        this.validCpf = false;
        return;
      }

      this.validCpf = true;
    }
  }
}
</script>

<style scoped>
.user-form-section,
.form-payment {
  display: flex;
  flex-direction: column;
}

h2 {
  margin: 20px 0;
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

.payment-details {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.payment-group {
  flex: 1;
}

.buttons-container {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  justify-content: center; /* Centraliza os botões */
}

.btn-custom {
  background-color: #87f;
  color: white;
  border: none;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 4px;
  transition-duration: 0.4s;
}

.btn-custom:hover {
  background-color: #0056b3;
  color: white;
}

.invalid {
  border-color: red;
}

.error-message {
  color: red;
  font-size: 12px;
  margin-top: 3px;
}
</style>
