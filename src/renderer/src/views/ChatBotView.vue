<script setup>
import { ref } from 'vue'

const props = defineProps({ index: [Number, String], username: String })

const input = ref()
const messages = ref([])

function sendMessage() {
  if (!input.value) return

  api.bot.sendChatBot(props.index, input.value)
  messages.value.push(`${props.username} : ${input.value}`)
  onReset()
}

function onReset() {
  input.value = ''
}
</script>

<template>
  <q-page class="window-height column q-pa-sm">
    <!-- Header -->
    <q-toolbar class="bg-primary text-white rounded-borders">
      <q-toolbar-title>{{ username }}</q-toolbar-title>
    </q-toolbar>

    <!-- Chat Messages -->
    <q-scroll-area class="col-grow q-my-sm">
      <div v-for="message in messages" :key="n" class="q-mr-xs">{{ message }}</div>
    </q-scroll-area>

    <!-- Input -->
    <div class="row items-center q-pa-sm">
      <q-input
        v-model="input"
        autofocus
        dense
        outlined
        class="col-grow"
        placeholder="Type a message..."
        @keyup.enter="sendMessage"
      />
      <q-btn round dense flat icon="send" class="q-ml-sm" @click="sendMessage" />
    </div>
  </q-page>
</template>
