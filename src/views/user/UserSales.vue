<template>
  <section>
    <div v-if="sales.length > 0">
      <h2>Vendas</h2>
      <div class="product-wrapper" v-for="sale, index in sales" :key="index">
        <ProductItem v-if="sale.produto" :product="sale.produto">
          <p class="buyer"><span>Comprador:</span> {{ sale.comprador_id }}</p>
        </ProductItem>
        <div  v-if="sale.endereco">
          <h3>Entrega:</h3>
          <v-simple-table >
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">
                  CEP
                </th>
                <th class="text-left">
                  Rua
                </th>
                <th class="text-left">
                  Bairro
                </th>
                <th class="text-left">
                  Cidade
                </th>
                <th class="text-left">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td v-for="value, key in sale.endereco" :key="key">{{ value }}</td>

              </tr>
            </tbody>
          </template>
        </v-simple-table>
        </div>

        <h2 v-else>Poxa! Você ainda não realizou nenhuma venda. 💔</h2>
        
        <!-- <div class="delivery-address">
          <h3>Entrega:</h3>
          <ul v-if="sale.endereco">
            <li v-for="value, key in sale.endereco" :key="key">
              {{ key }} : {{ value }}
            </li>
          </ul>
        </div> -->
        <!-- <hr class="solid" /> -->
      </div>
    </div>
    <!-- <h2 v-else>Poxa! Você ainda não realizou nenhuma venda. 💔</h2> -->
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
      sales: [],
      desserts: [
        {
          name: 'Frozen Yogurt',
          calories: 159,
        },
        {
          name: 'Ice cream sandwich',
          calories: 237,
        },
        {
          name: 'Eclair',
          calories: 262,
        },
        {
          name: 'Cupcake',
          calories: 305,
        },
        {
          name: 'Gingerbread',
          calories: 356,
        },
        {
          name: 'Jelly bean',
          calories: 375,
        },
        {
          name: 'Lollipop',
          calories: 392,
        },
        {
          name: 'Honeycomb',
          calories: 408,
        },
        {
          name: 'Donut',
          calories: 452,
        },
        {
          name: 'KitKat',
          calories: 518,
        },
      ],
    }
  },
  computed: {
    ...mapState(["usuario", "login"])
  },
  methods: {
    async getSales() {
      await api.get(`/transacao?vendedor_id=${this.usuario.id}`)
        .then(resp => this.sales = resp.data)
    }
  },
  watch: {
    login() {
      this.getSales()
    }
  },
  created() {
    if (this.login) this.getSales()
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

.buyer span {
  color: #e80;
}

.delivery-address {
  display: grid;
  gap: 20px;
  grid-template-columns: minmax(100px, 200px) 1fr;
  margin-bottom: 60px;
}

h3 {
  justify-self: end;
  margin: 0;
}

hr.solid {
  border-top: 1px solid #f4f7fc;
}
</style>