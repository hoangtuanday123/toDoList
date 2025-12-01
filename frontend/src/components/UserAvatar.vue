<template>
    <q-avatar v-if="typeof user === 'undefined' || !user" icon="person" :size="size || '24px'" color="grey-4"
        title="Unassigned" text-color="white">
    </q-avatar>

    <q-avatar v-else-if="user.profile_img" :title="user?.full_name || user?.username" text-color="white"
        :size="size || '24px'">
        <img :src="user.profile_img" :title="user?.full_name || user?.username" />
    </q-avatar>

    <q-avatar v-else color="green" :title="user?.full_name || user?.username" text-color="white" :size="size || '24px'">
        {{ user?.username[0].toUpperCase() }}
    </q-avatar>
    <span style="font-weight: 500; margin-left: 4px;" v-if="showUsername === true"> {{ user?.username || 'Unassigned'
        }}</span>
</template>
<script setup lang="ts">
// const colors = ['red', 'pink', 'purple', 'deep-purple', 'indigo', 'blue', 'teal', 'green', 'brown'];
defineProps<{
    user: {
        username: string,
        full_name?: string,
        profile_img?: string
    } | undefined,
    size?: string,
    showUsername?: boolean
}>()

// function getColor(username: string) : string {
//     return username ? colors[username.charCodeAt(0) % colors.length] : 'grey-4';
// }
</script>