<template>
  <ul v-if="pagesTotal > 1">
    <router-link :to="{ query: query(1) }" class="first">Primeira</router-link>
    <li v-for="page in pages" :key="page">
      <router-link :to="{ query: query(page) }">{{ page }}</router-link>
    </li>
    <router-link :to="{ query: query(pagesTotal) }" class="last">Última</router-link>
  </ul>
</template>

<script>
export default {
  name: "ProductsPagination",
  props: {
    qntProducts: {
      type: Number,
      default: 1,
    },
    prodPerPage: {
      type: Number,
      default: 1,
    },
  },
  methods: {
    query(page) {
      return {
        ...this.$route.query,
        _page: page,
      };
    },
  },
  computed: {
    pages() {
      const currentPage = Number(this.$route.query._page)
      const range = 9
      const offset = Math.ceil(range / 2)
      const total = this.pagesTotal
      const pagesArray = []

      for(let i = 1; i <= total; i++) {
        pagesArray.push(i)
      }

      pagesArray.splice(0, currentPage - offset)
      pagesArray.splice(range, total)

      return pagesArray
    },

    pagesTotal() {
      const total = this.qntProducts / this.prodPerPage;
      return total !== Infinity ? Math.ceil(total) : 0;
    },
  },
};
</script>

<style scoped>
ul {
  grid-column: 1 / -1;
  margin-top: 30px;
  text-align: center;
}

li {
  display: inline-block;
}
li a {
  border-radius: 2px;
  margin: 4px;
  padding: 2px 8px;
}

li a.router-link-exact-active,
li a:hover {
  background: #87f;
  color: #fff;
}

.first, .last {
  color: #87f;
  text-decoration-line: underline;
  margin: 0 10px;
}
</style>
