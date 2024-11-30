<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import config from '@/config'

const $q = useQuasar()

const emit = defineEmits(['update:save'])
const model = defineModel()

const form = ref({})
const loading = ref(false)

const handleSubmitForm = async () => {
  loading.value = true
  const response = await api.bot.createBot(form.value.username)
  loading.value = false
  if (response.status === config.RESPONSE_STATUS.SUCCESS) {
    emit('update:save')
    model.value = false
    resetForm()
  }
  $q.notify(response.message)
}

const resetForm = () => {
  form.value = {}
}
</script>

<template>
  <q-dialog v-model="model" :persistent="loading">
    <q-card style="min-width: 350px">
      <q-form @submit="handleSubmitForm">
        <q-card-section>
          <div class="text-h6">Username</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            dense
            v-model="form.username"
            autofocus
            :rules="[(val) => (val && val.length > 0) || 'Please type something']"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup :disable="loading" @click="resetForm" />
          <q-btn flat type="submit" label="Save" :loading="loading" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>
