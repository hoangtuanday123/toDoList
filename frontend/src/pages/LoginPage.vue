<template>
    <q-page class="row items-center justify-evenly">

        <q-card>
            <q-card-section>
                <div class="text-h6">Login</div>

            </q-card-section>
            <q-card-section>
                <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
                    <q-input filled v-model="username" label=Username hint=username
                        lazy-rules :rules="[val => val && val.length > 0 || 'Username cannot be empty.']" />

                    <q-input filled v-model="password" label="Password" hint="password"
                        lazy-rules :rules="[val => val && val.length > 0 || 'Password cannot be empty.']" />
                    <div>
                        <q-btn label="login" type="submit" :loading="loading" color="primary" />
                        <q-btn label="reset" type="reset" color="primary" flat class="q-ml-sm" />
                    </div>
                </q-form>
            </q-card-section>

        </q-card>
    </q-page>
</template>
<script setup lang="ts">
import api from '../services/api';
import { ref } from 'vue'

import { userStore } from '../stores/user'
import pinia from '../stores'
import router from '../router/index'
import * as ui from '../utils/ui'
const username = ref('')
const password = ref('')
// const accept = ref(false)

const loading = ref(false)

const _userStore = userStore(pinia())


async function onSubmit() {
    loading.value = true
    try {
        const loginreq = {
            username: username.value,
            password: password.value,
            grant_type: 'password'

        }
        const token = await api.api.auth.login(loginreq);

        if (token) {
            _userStore.saveToken(token)
            const user = await api.api.user.getCurrentUser()

            _userStore.saveUserInfo({ id: user['id'], username: user['username'], permissions: user['permissions']})
            router.push({ path: '/home' })

        }
    }
    catch {
        ui.error('Unknown')
    }
    finally {

        loading.value = false
    }

}

async function onReset() {
    username.value = ''
    password.value = ''
    // accept.value = false
}

</script>