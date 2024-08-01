<template>
  <section>
    <h2>Detalhes do Pagamento</h2>
    <div class="payment-details">
     <label for="numeroCartao">Número do Cartão</label>
    <input type="text" name="numeroCartao" id="numeroCartao" v-model="numeroCartao" />
    <label for="prazo">Prazo</label>
    <input type="text" name="prazo" id="prazo" v-model="prazo" />
    <label for="cvc">CVC/CW</label>
    <input type="text" name="cvc" id="cvc" v-model="cvc" />
    <label for="nomeCartao">Nome no Cartão</label>
    <input type="text" name="nomeCartao" id="nomeCartao" v-model="nomeCartao" />
    <label for="cpf">CPF</label>
    <input type="text" name="cpf" id="cpf" v-model="cpf" />
    </div>
  </section>
</template>

<script>
export default {
  name: 'PaymentDetails',
  props: {
    payment: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.payment-details {
  margin: 20px 0;
}

.payment-details p {
  margin: 5px 0;
}
</style>
