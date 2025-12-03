<template>
  <q-toolbar>
    <q-btn
      v-if="$q.screen.lt.md"
      flat
      round
      icon="menu"
      @click="$emit('toggleDrawer')"
    />

    <q-toolbar-title :shrink="true" class="row no-wrap items-center">
      <a
        href="/home"
        style="display: flex; align-items: center"
        v-if="currentUser.hasloggedIn()"
      >
        <img
          alt="Logo"
          src="../../assets/image.png"
          style="height: 60px; width: auto; margin-right: 12px"
        />
      </a>
      <a href="/" style="display: flex; align-items: center" v-else>
        <img
          alt="Logo"
          src="../../assets/image.png"
          style="height: 60px; width: auto; margin-right: 12px"
        />
      </a>
    </q-toolbar-title>
    <!-- desktop -->
    <template v-if="$q.screen.gt.sm">
      <template>
        <q-btn stretch flat label="home" to="/" />
      </template>
      <q-space />
      <!-- right side -->

      <template v-if="currentUser.hasloggedIn()">
        <q-btn round flat>
          <avatar
            :user="{
              username: userInfo.username,
              full_name: '',
              profile_img: '',
            }"
            size="28px"
          >
          </avatar>
          <q-menu>
            <q-list style="min-width: 180px">
              <q-item clickable v-close-popup @click="logout">
                <q-item-section avatar>
                  <q-icon color="grey" name="logout" />
                </q-item-section>
                <q-item-section>logout</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </template>
      <template v-else>
        <q-btn rounded outline to="/login">login</q-btn>
      </template>
    </template>
    <!-- mobile -->
    <template v-else>
      <q-space />
    </template>
  </q-toolbar>
</template>

<script setup lang="ts">
import { useCurrentuser } from '../../share/current-user';
import Avatar from '../../components/user-avatar.vue';

const currentUser = useCurrentuser();
const userInfo = currentUser.info;

function logout() {
  currentUser.logout();
}
</script>
