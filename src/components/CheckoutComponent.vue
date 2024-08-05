<template>
  <v-stepper v-model="step">
    <v-stepper-header>
      <v-stepper-step :complete="step > 1" color="secondary" step="1">
        <v-icon color="secondary">mdi-home-outline</v-icon>
        Endereço para Envio
      </v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step color="secondary" :complete="step > 2" step="2">
        <v-icon color="secondary">mdi-credit-card-outline</v-icon>
        Pagamento
      </v-stepper-step>
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content step="1">
        <div class="user-form-section" color="secondary">
          <h2>Endereço para Envio</h2>
          <div class="user-form">
            <UserForm />
          </div>
        </div>

        <v-row justify="center">
          <v-col cols="auto">
            <v-btn color="secondary" class="btn-custom" @click="step = 2">
              Continuar
            </v-btn>
          </v-col>
        </v-row>
      </v-stepper-content>

      <v-stepper-content step="2">
        <h2>Pagamento</h2>
        <form class="payment" @submit.prevent="finishCheckout">
          <v-radio-group color="secondary" v-model="paymentMethod" mandatory class="ml-3">
            <v-radio color="secondary" label="Cartão de Crédito" value="cartao"></v-radio>
            <v-radio color="secondary" label="PIX" value="pix"></v-radio>
            <v-radio color="secondary" label="Boleto" value="boleto"></v-radio>
          </v-radio-group>

          <div>
            <v-text-field
              v-if="paymentMethod === 'cartao'"
              color="secondary"
              v-model="payment.numeroCartao"
              label="Número do Cartão"
              type="text"
              dense
              class="custom-text-field"
              @input="formatCardNumber"
              maxlength="19"
              required
            ></v-text-field>

            <div class="payment-details">
              <v-text-field
                v-if="paymentMethod === 'cartao'"
                v-model="payment.prazo"
                label="Prazo"
                type="text"
                dense
                class="payment-group"
                required
                color="secondary"
              ></v-text-field>

              <v-text-field
                v-if="paymentMethod === 'cartao'"
                v-model="payment.cvc"
                label="CVC"
                type="text"
                dense
                class="payment-group"
                required
                color="secondary"
              ></v-text-field>
            </div>

            <v-text-field
              v-if="paymentMethod === 'cartao'"
              v-model="payment.nomeCartao"
              label="Nome no Cartão"
              type="text"
              dense
              class="custom-text-field"
              required
              color="secondary"
            ></v-text-field>

            <v-text-field
              v-model="payment.cpf"
              label="CPF"
              type="text"
              @input="validateCPF"
              v-mask="'###.###.###-##'"
              placeholder="###.###.###-##"
              dense
              class="custom-text-field"
              :class="{ invalid: !validCpf && payment.cpf.length > 0 }"
              required
              color="secondary"
            ></v-text-field>
            <span v-if="!validCpf && payment.cpf.length > 0" class="error-message">CPF inválido</span>
          </div>

          <div class="buttons-container">
            <div v-if="paymentMethod === 'pix'">
              <v-btn color="secondary" class="btn-custom" @click="generatePaymentData">
                Gerar dados de pagamento
              </v-btn>
            </div>

            <div v-if="paymentMethod === 'boleto'">
              <v-btn color="secondary" class="btn-custom" @click="generatePaymentBoleto">
                Gerar código de barras
              </v-btn>
            </div>

            <v-btn color="secondary" class="btn-custom" type="submit" v-if="paymentMethod === 'cartao' && $store.state.login">
              Finalizar Compra
            </v-btn>

            <v-btn color="secondary" class="btn-custom" @click="step = 1" v-if="$store.state.login">
              Voltar
            </v-btn>
          </div>
        </form>
      </v-stepper-content>
    </v-stepper-items>

    <v-dialog v-model="dialog" max-width="600">
      <v-card>
        <v-card-title class="headline">{{ isQRCode ? 'QR Code' : 'Código de Barras' }}</v-card-title>
        <v-card-text>
          <div class="qr-code-container" v-if="isQRCode">
            <canvas ref="qrcode"></canvas>
          </div>
          <div class="barcode-container" v-if="!isQRCode">
            <canvas ref="barcode"></canvas>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" @click="dialog = false">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-stepper>
</template>

<script>
import { mapState } from 'vuex';
import UserForm from '@/components/UserForm';
import { api } from '@/services.js';
import QRious from 'qrious';
import BWIPJS from 'bwip-js';

export default {
  name: 'CheckoutComponent',
  components: { UserForm },
  props: ['produto'],
  data() {
    return {
      step: 1,
      paymentMethod: 'cartao',
      validCpf: true,
      dialog: false,
      isQRCode: true,
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

    async finishCheckout() {
      if (this.validCpf) {
        if (this.$store.state.login) {
          await this.createCheckout();
        } else {
          await this.createUser();
        }
      } else {
        alert("CPF inválido. Por favor, corrija o CPF antes de finalizar a compra.");
      }
    },

    async createUser() {
      try {
        const { nome, email, senha, cep, rua, numero, bairro, cidade, estado } = this.$store.state.usuario;
        const userPayload = {
          nome,
          email,
          senha,
          cep,
          rua,
          numero,
          bairro,
          cidade,
          estado
        };
        await this.$store.dispatch('createUser', userPayload);
        await this.$store.dispatch('getUser', email);
        await this.$router.push({ name: 'usuario' });
      } catch (error) {
        console.error('Erro ao criar usuário:', error);
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
    },

    formatCardNumber() {
      this.payment.numeroCartao = this.payment.numeroCartao.replace(/\D/g, '');
      this.payment.numeroCartao = this.payment.numeroCartao.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '$1 $2 $3 $4');
    },

    async generatePaymentData() {
      this.isQRCode = true;
      this.dialog = true;

      const qr = new QRious({
        value: 'Exemplo de QR Code', 
        size: 250
      });

      this.$nextTick(() => {
        const canvas = this.$refs.qrcode;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(qr.canvas, 0, 0);
      });
    },

    async generatePaymentBoleto() {
      this.isQRCode = false;
      this.dialog = true;

      const barcodeData = '12345678901234567890'; 
      BWIPJS.toCanvas(this.$refs.barcode, {
        bcid: 'code39',
        text: barcodeData,
        scale: 3,
        height: 10,
        includetext: true
      }, (err) => {
        if (err) {
          console.error(err);
        }
      });
    }
  }
}
</script>

<style>
.user-form-section,
.form-payment {
  display: flex;
  flex-direction: column;
}

h2 {
  margin: 20px 0;
}

.custom-text-field {
  margin-bottom: 20px;
  color: #002244;
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
  justify-content: center;
}

.btn-custom {
  background-color: #002244;
  color: white;
  border: none;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  cursor: pointer;
}

.error-message {
  color: red;
}
.qr-code-container {
  display: flex;
  justify-content: center;
}

.qr-code-container,
.barcode-container {
  text-align: center;
}

.barcode-container {
  display: flex;
  justify-content: center;
}
</style>