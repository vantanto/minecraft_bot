<script setup>
import AppFooter from '@renderer/views/layouts/AppFooter.vue'
</script>

<template>
  <q-layout view="lHh Lpr lff" class="no-shadow">
    <q-page-container>
      <router-view />
    </q-page-container>
    <AppFooter />
  </q-layout>
</template>
