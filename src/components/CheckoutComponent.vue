<template>
  <section>
    <h2>Endereço para Envio</h2>
    <UserForm />
    <form @submit.prevent="finishCheckout">
      <div>
        <label for="numeroCartao">Número do Cartão:</label>
        <input type="text" id="numeroCartao" v-model="payment.numeroCartao" required>
      </div>
      <div>
        <label for="prazo">Prazo:</label>
        <input type="text" id="prazo" v-model="payment.prazo" required>
      </div>
      <div>
        <label for="cvc">CVC:</label>
        <input type="text" id="cvc" v-model="payment.cvc" required>
      </div>
      <div>
        <label for="nomeCartao">Nome no Cartão:</label>
        <input type="text" id="nomeCartao" v-model="payment.nomeCartao" required>
      </div>
      <div>
        <label for="cpf">CPF:</label>
        <input type="text" id="cpf" v-model="payment.cpf" required>
      </div>
      <button class="btn" type="submit">Finalizar Compra</button>
    </form>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import UserForm from '@/components/UserForm'
import { api } from '@/services.js'

export default {
  name: 'CheckoutComponent',
  components: { UserForm },
  props: ["produto"],
  data() {
    return {
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
      await api.post('/transacao', this.compra)
      await this.$router.push({ name: 'compras' })
    },

    async createUser() {
      await this.$store.dispatch('createUser', this.$store.state.usuario)
      await this.$store.dispatch('getUser', this.$store.state.usuario.email)
      await this.createCheckout()
    },

    finishCheckout() {
      this.$store.state.login
        ? this.createCheckout()
        : this.createUser()
    }
  }
}
</script>

<style scoped>
h2 {
  margin: 40px 0 20px;
}

.btn {
  background: #e80;
}
</style>
