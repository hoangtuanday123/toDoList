<template>
  <q-list padding>
    <q-item v-ripple clickable>
      <q-item-section>
        <router-link to="/" exact>home</router-link>
      </q-item-section>
      <q-item-section side>
        <q-btn
          dense
          style="height: 24px"
          icon="close"
          @click="$emit('toggleDrawer')"
        ></q-btn>
      </q-item-section>
    </q-item>


    <template v-if="currentUser.hasloggedIn()">
      <q-separator />
      <q-item clickable @click="logout">
        <q-item-section>logout</q-item-section>
      </q-item>
    </template>
    <template v-else>
      <q-separator />
      <q-item to="/login">
        <q-item-section>login</q-item-section>
      </q-item>
    </template>
  </q-list>
</template>
<script setup lang="ts">

import { useCurrentuser } from '../../share/current-user';

const currentUser = useCurrentuser();

function logout() {
  // ui.confirm('Are you sure', 'Logout', () => currentUser.logout(), null)
  currentUser.logout();
}
</script>
