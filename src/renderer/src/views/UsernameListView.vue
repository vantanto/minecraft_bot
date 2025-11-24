<script setup>
import BotCreateDialog from '@components/bot/BotCreateDialog.vue'
import BotItem from '@components/bot/BotItem.vue'
import ServerInfo from '@components/ServerInfo.vue'
import { VIEW_MODE } from '@renderer/constant'
import { onMounted, ref } from 'vue'

const bots = ref([])
const createDialog = ref(false)
const viewMode = ref()

async function getBots() {
  const response = await api.bot.getBots()
  bots.value = response.data
}

async function getViewMode() {
  viewMode.value = await api.store.getStore('viewMode', VIEW_MODE.LIST)
}

async function setViewMode() {
  await api.store.setStore('viewMode', viewMode.value)
}

function handleCreate() {
  createDialog.value = true
}

onMounted(async () => {
  getBots()
  getViewMode()
})
</script>

<template>
  <q-page class="q-pa-md">
    <ServerInfo class="q-mb-md" />
    <div class="flex justify-between">
      <div />
      <q-btn
        push
        no-caps
        label="Add New Bot"
        color="positive"
        @click="handleCreate"
      />
      <div>
        <q-btn-toggle
          v-model="viewMode"
          unelevated
          color="white"
          padding="sm"
          size="sm"
          text-color="primary"
          toggle-color="primary"
          :options="[
            { value: VIEW_MODE.LIST, icon: 'format_list_bulleted' },
            { value: VIEW_MODE.GRID, icon: 'grid_view' },
          ]"
          @update:model-value="setViewMode"
        />
      </div>
    </div>

    <q-list v-if="bots.length > 0" class="row q-col-gutter-sm q-my-md">
      <template
        v-for="(bot, index) in bots"
        :key="bot.username"
      >
        <div :class="viewMode === VIEW_MODE.LIST ? 'col-12' : 'col-xs-6 col-sm-4 col-md-3 col-lg-2'">
          <BotItem
            v-model="bots[index]"
            bordered
            class="rounded-borders"
            :view-mode="viewMode"
            :show-open-chat="true"
            :show-delete="true"
            @update:save="getBots"
          />
        </div>
      </template>
    </q-list>

    <BotCreateDialog v-model="createDialog" @update:save="getBots" />
  </q-page>
</template>
