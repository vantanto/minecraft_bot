<script setup>
import BotStatus from '@components/bot/BotStatus.vue'
import { VIEW_MODE } from '@renderer/constant'
import { useQuasar } from 'quasar'
import { ref } from 'vue'
import config from '@/config'

defineProps({
  bordered: { type: Boolean, default: false },
  viewMode: { type: String, default: VIEW_MODE.LIST },
  showConnect: { type: Boolean, default: true },
  showOpenChat: { type: Boolean, default: false },
  showDelete: { type: Boolean, default: false },
})

const emit = defineEmits(['update:save'])

const model = defineModel()

const $q = useQuasar()

const loading = ref({})

// async function getBot() {
//   const response = await api.bot.getBot(model.value.username)
//   model.value = response.data
// }

async function connectBot() {
  loading.value.connect = true
  const response = await api.bot.connectBot(model.value.username)
  loading.value.connect = false
  if (response.status === config.RESPONSE_STATUS.ERROR)
    $q.notify(response.message)
}

async function disconnectBot() {
  loading.value.connect = true
  await api.bot.disconnectBot(model.value.username)
  loading.value.connect = false
}

function openChatBot() {
  api.bot.openChatBot(model.value.username)
}

async function deleteBot() {
  loading.value.delete = true
  const response = await api.bot.deleteBot(model.value.username)
  loading.value.delete = false
  emit('update:save')
  $q.notify(response.message)
}

api.bot.onStatusBotUpdated(model.value.username, (status) => {
  model.value.status = status
})
</script>

<template>
  <q-item
    v-if="model.username"
    style="flex-wrap: wrap;"
    :class="{
      row: viewMode === VIEW_MODE.LIST,
      column: viewMode === VIEW_MODE.GRID,
      border: bordered,
    }"
  >
    <div class="flex col-grow">
      <q-item-section v-if="true" side>
        <q-avatar rounded size="48px">
          <img :src="config.getMcAvatar(model.username)">
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ model.username }}</q-item-label>
        <BotStatus :status="model.status" />
      </q-item-section>
    </div>
    <q-item-section :side="viewMode === VIEW_MODE.LIST" :class="viewMode === VIEW_MODE.LIST ? 'text-right' : 'text-center q-mt-sm'">
      <div class="q-gutter-xs no-wrap">
        <template v-if="showConnect">
          <!-- CONNECT -->
          <q-btn
            v-if="model.status !== config.BOT_STATUS.CONNECTED"
            dense
            flat
            color="positive"
            icon="play_arrow"
            :loading="loading.connect"
            @click="connectBot"
          >
            <q-tooltip>Connect</q-tooltip>
          </q-btn>

          <!-- DISCONNECT -->
          <q-btn
            v-else
            dense
            flat
            color="negative"
            icon="stop"
            :loading="loading.connect"
            @click="disconnectBot"
          >
            <q-tooltip>Disconnect</q-tooltip>
          </q-btn>
        </template>

        <template v-if="showOpenChat">
          <!-- CHAT -->
          <q-btn
            dense
            flat
            color="primary"
            icon="chat_bubble"
            @click="openChatBot"
          >
            <q-tooltip>Chat</q-tooltip>
          </q-btn>
        </template>

        <template v-if="showDelete">
          <!-- DELETE -->
          <q-btn
            dense
            flat
            color="negative"
            icon="delete"
            :loading="loading.delete"
            @click="deleteBot"
          >
            <q-tooltip>Delete</q-tooltip>
          </q-btn>
        </template>
      </div>
    </q-item-section>
  </q-item>
</template>
