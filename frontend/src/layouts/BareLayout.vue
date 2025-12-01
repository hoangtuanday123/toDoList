<template>
    <q-layout view="hHh lpR fFf">

  <q-header shadow-1 class="shadow-1 bg-primary text-white">
    <div class="container">
        <header-toolbar @toggleDrawer="toggleLeftDrawer"></header-toolbar>
    </div>
  </q-header>

  <q-drawer v-model="leftDrawerOpen" behavior="mobile" side="left" bordered>
    <q-scroll-area class="fit">
      <left-menu  @toggleDrawer="toggleLeftDrawer"></left-menu>
    </q-scroll-area>
  </q-drawer>

  <q-page-container  class="container">
    <router-view />
  </q-page-container>

</q-layout>

</template>

<script setup lang="ts">
  import HeaderToolbar from './menus/header-toolbar.vue'
  import LeftMenu from './menus/left-menu.vue'
  import { ref } from 'vue'

  const leftDrawerOpen = ref(false)

  function toggleLeftDrawer() {
    leftDrawerOpen.value = !leftDrawerOpen.value
  }
</script>