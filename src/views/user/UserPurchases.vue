<template>
  <section>
    <div v-if="purchases.length > 0">
      <h2>Compras</h2>
      <div class="product-wrapper" v-for="(purchase, index) in purchases" :key="index">
        <ProductItem v-if="purchase.produto" :product="purchase.produto">
          <p class="seller"><span>Vendedor:</span> {{ purchase.vendedor_id }}</p>
        </ProductItem>
        <hr class="solid" />
      </div>
    </div>
    <h2 v-else>Poxa! Você ainda não realizou nenhuma compra. 💔</h2>
  </section>
</template>

<script>
import ProductItem from '@/components/ProductItem'
import { api } from '@/services.js'
import { mapState } from 'vuex'

export default {
  components: { ProductItem },
  data() {
    return {
      purchases: []
    }
  },
  computed: {
    ...mapState(["usuario", "login"])
  },
  methods: {
    async getPurchases() {
      try {
        const resp = await api.get(`/transacao?comprador_id=${this.usuario.email}`); 
        this.purchases = resp.data;
      } catch (error) {
        console.error('Erro ao buscar compras:', error);
      }
    }
  },
  watch: {
    login() {
      if (this.login) {
        this.getPurchases();
      }
    }
  },
  created() {
    if (this.login) {
      this.getPurchases();
    }
  }
}
</script>

<style scoped>
h2 {
  margin-bottom: 20px;
}

.product-wrapper {
  margin-bottom: 40px;
}

.seller span {
  color: #e80;
}

hr.solid {
  border-top: 1px solid #f4f7fc;
}
</style>
