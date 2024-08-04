<template>
  <v-container class="container" fluid>
    <v-row justify="center" align="center">
      <v-col cols="auto">
        <h1>Crie sua conta</h1>
        <v-row>
          <v-col>
            <UserForm ref="userForm" />
          </v-col>
        </v-row>
        <v-row>
          <v-col class="text-center">
            <v-btn
              class="custom-btn"
              @click.prevent="createUser"
            >
              Criar Usuário
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import UserForm from './UserForm.vue'

export default {
  name: 'CreateAcc',
  components: { UserForm },
  methods: {

    resetForm() {
      this.$refs.form.reset(); 
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
        this.$toast.success('Usuário criado com sucesso!'); 
        this.$router.push({ name: 'login' }); 
        
        if (this.$refs.userForm && typeof this.$refs.userForm.resetForm === 'function') {
          this.$refs.userForm.resetForm(); 
        }
      } catch (error) {
        this.$toast.error('Erro ao criar usuário.'); 
        console.error('Erro ao criar usuário:', error);
      }
    }
  }
}
</script>

<style scoped>
.container {
  min-height: 100vh; 
  padding: 0 16px; 
}

h1 {
  color: #002244;
  font-size: 2rem;
  margin-bottom: 20px;
  text-align: center;
}

.custom-btn {
  background-color: #002244 !important; 
  color: white !important;
}
</style>
