<template>
  <v-stepper class="mr-8" v-model="step">
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

        <v-row justify="end">
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
            <v-text-field v-if="paymentMethod === 'cartao'" color="secondary" v-model="payment.numeroCartao"
              name="numeroCartao" label="Número do Cartão" type="text" dense class="custom-text-field"
              @input="formatCardNumber" maxlength="19" required></v-text-field>

            <div class="payment-details">
              <v-text-field name="prazo" v-if="paymentMethod === 'cartao'" v-model="payment.prazo" label="Prazo"
                type="text" dense class="payment-group" required color="secondary"></v-text-field>

              <v-text-field name="cvc" v-if="paymentMethod === 'cartao'" v-model="payment.cvc" label="CVC" type="text"
                dense class="payment-group" required color="secondary"></v-text-field>
            </div>

            <v-text-field name="nomeCartao" v-if="paymentMethod === 'cartao'" v-model="payment.nomeCartao"
              label="Nome no Cartão" type="text" dense class="custom-text-field" required
              color="secondary"></v-text-field>

            <v-text-field name="cpf" v-model="payment.cpf" label="CPF" type="text" @input="validateCPF"
              v-mask="'###.###.###-##'" placeholder="###.###.###-##" dense class="custom-text-field"
              :class="{ invalid: !validCpf && payment.cpf.length > 0 || payment.cpf.length === 0 }" required
              color="secondary"></v-text-field>
            <span v-if="!validCpf && payment.cpf.length > 0" class="error-message">CPF inválido</span>
            <span v-if="payment.cpf.length === 0" class="error-message">CPF é obrigatório</span>

          </div>

          <div class="buttons-container">
            <v-btn color="secondary" class="btn-custom float-right" @click="step = 1" v-if="$store.state.login">
              Voltar
            </v-btn>
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


            <v-btn color="secondary" class="btn-custom " type="submit" id="finalizar-pedido" @click="finishCheckout"
              v-if="paymentMethod === 'cartao' && $store.state.login">
              Finalizar Compra
            </v-btn>


          </div>
        </form>
      </v-stepper-content>
    </v-stepper-items>

    <v-dialog v-model="dialog" max-width="800" @input="dialog ? null : resetPaymentData">
      <v-card>
        <v-card-title class="headline">{{ isQRCode ? 'QR Code' : 'Código de Barras' }}</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="6">
              <div class="info-column">
                <p><strong>Comprador:</strong> {{ compra.comprador_id }}</p>
                <p><strong>CPF:</strong> {{ payment.cpf }}</p>
                <p><strong>Nome do Produto:</strong> {{ produto.nome }}</p>
                <p><strong>Preço:</strong> {{ formatPrice(produto.preco) }}</p>
              </div>
            </v-col>
            <v-col cols="6">
              <div class="barcode-container" v-if="!isQRCode">
                <canvas ref="barcode" class="barcode-canvas"></canvas>
              </div>
              <div class="qr-code-container" v-if="isQRCode">
                <canvas ref="qrcode"></canvas>
              </div>
            </v-col>
          </v-row>
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
      if (this.payment.cpf.length === 0) {
        this.$toast.error("CPF é obrigatório."); 
        return;
      }

      if (this.validCpf) {
        if (this.$store.state.login) {
          await this.createCheckout();
          this.$toast.success('Compra finalizada com sucesso!');
        } else {
          await this.createUser();
        }
      } else {
        this.$toast.error("CPF inválido.");
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
          estado,
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

    formatPrice(price) {
      const numberPrice = parseFloat(price);
      if (isNaN(numberPrice)) {
        return 'R$ 0,00';
      }
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(numberPrice);
    },


    formatCardNumber() {
      this.payment.numeroCartao = this.payment.numeroCartao.replace(/\D/g, '');
      this.payment.numeroCartao = this.payment.numeroCartao.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '$1 $2 $3 $4');
    },

    resetPaymentData() {
      if (this.paymentMethod === 'pix' || this.paymentMethod === 'boleto') {
        this.payment.cpf = '';
        this.clearCanvas();
      }
    },

    clearCanvas() {
      const qrCanvas = this.$refs.qrcode;
      const barcodeCanvas = this.$refs.barcode;

      if (qrCanvas) {
        const qrCtx = qrCanvas.getContext('2d');
        qrCtx.clearRect(0, 0, qrCanvas.width, qrCanvas.height);
      }

      if (barcodeCanvas) {
        const barcodeCtx = barcodeCanvas.getContext('2d');
        barcodeCtx.clearRect(0, 0, barcodeCanvas.width, barcodeCanvas.height);
      }
    },

    async generatePaymentData() {
      this.isQRCode = true;
      this.dialog = true;
      this.clearCanvas();
      this.$nextTick(() => {
        const qr = new QRious({
          value: `Pagamento de ${this.formatPrice(this.produto.preco)}`,
          size: 150
        });

        const canvas = this.$refs.qrcode;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(qr.canvas, 0, 0);
      });
    },

    async generatePaymentBoleto() {
      this.isQRCode = false;
      this.dialog = true;
      this.clearCanvas();
      this.$nextTick(() => {
        const sanitizedValue = this.produto.preco
          .replace(/[^0-9.-]/g, '');

        const barcodeData = `12345678901${sanitizedValue}`;

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


.qr-code-container,
.barcode-container {
  text-align: center;
}

.barcode-container,
.qr-code-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.barcode-canvas {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
}

.float-left {
  margin-left: auto;
}

.float-right {
  margin-right: auto;
}

.custom-dialog .v-card {
  height: 100vh;
}

.error-message {
  color: red;
  font-size: 12px;
}

.custom-text-field.invalid input {
  border: none;
}
</style>