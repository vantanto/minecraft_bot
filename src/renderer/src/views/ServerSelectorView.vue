<script setup>
import { onMounted, ref } from 'vue'
import router from '@renderer/plugins/router'

const form = ref({})
const loading = ref(false)
const servers = ref([])
const hosts = ref([])

const filterFn = (val, update, abort) => {
  update(() => {
    const needle = val.toLowerCase()
    hosts.value = Object.keys(servers.value).filter((v) => v.toLowerCase().indexOf(needle) > -1)
  })
}

const onChangeHost = (val) => {
  form.value.host = val
  const server = servers.value[val]
  if (server) {
    form.value.port = server.port
    form.value.version = server.version
  }
}

const getServers = async () => {
  const response = await api.storage.getServers()
  servers.value = response.data
}

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
  form.value = { port: 25565, version: '1.20.1' }
}

onMounted(() => {
  getServers()
  resetForm()
})
</script>

<template>
  <q-page class="q-pa-0 row justify-center items-center">
    <div class="col-6">
      <q-card square bordered class="q-pa-lg shadow-1">
        <q-form @submit="handleSubmitForm">
          <q-card-section class="q-pt-none">
            <q-select
              dense
              use-input
              hide-selected
              fill-input
              input-debounce="0"
              label="Host"
              :model-value="form.host"
              :options="hosts"
              :rules="[(val) => (val && val.length > 0) || 'Please type something']"
              @input-value="onChangeHost"
              @filter="filterFn"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey"> No results </q-item-section>
                </q-item>
              </template>
            </q-select>
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
