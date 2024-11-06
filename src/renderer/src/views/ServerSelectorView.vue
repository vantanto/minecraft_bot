<script setup>
import { onMounted, ref } from 'vue'
import router from '@renderer/plugins/router'

const form = ref({})
const loading = ref(false)

const handleSubmitForm = async () => {
  loading.value = true
  await api.storage.setServer({
    host: form.value.host,
    port: form.value.port,
    version: form.value.version
  })
  router.push({ name: 'usernames' })
}

const resetForm = () => {
  form.value = {
    port: 25565,
    version: '1.20.1'
  }
}

onMounted(() => {
  resetForm()
})
</script>

<template>
  <q-page class="q-pa-0 row justify-center items-center">
    <div class="col-6">
      <q-card square bordered class="q-pa-lg shadow-1">
        <q-form @submit="handleSubmitForm">
          <q-card-section class="q-pt-none">
            <q-input
              dense
              v-model="form.host"
              label="Host"
              :rules="[(val) => (val && val.length > 0) || 'Please type something']"
            />
            <q-input
              dense
              v-model="form.port"
              label="Port"
              :rules="[(val) => (val !== '' && val !== null) || 'Please type something']"
            />
            <q-input
              dense
              v-model="form.version"
              label="Minecraft Version"
              :rules="[(val) => (val && val.length > 0) || 'Please type something']"
            />
          </q-card-section>

          <q-card-actions>
            <q-btn
              type="submit"
              label="Continue"
              color="primary"
              class="full-width"
              :loading="loading"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </div>
  </q-page>
</template>
