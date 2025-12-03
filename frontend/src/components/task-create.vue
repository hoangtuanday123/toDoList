<template>
  <q-page >
      <div class="q-pa-md  bg-white" style="width: 100%; max-width: 500px;">
      
      <div class="text-center q-pb-md">
        <div class="text-h5 text-weight-bold">New Task</div>
      </div>

      <div class="q-pt-sm">
        <q-input
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Please type something']"
          outlined
          v-model="task.title"
          placeholder="Add new task ..."
          class="q-mb-md"
          dense
        />

        <div class="text-subtitle1 q-mb-sm text-weight-bold text-caption">Description</div>
        <q-input
          outlined
          v-model="task.description"
          type="textarea"
          rows="5"
          class="q-mb-md rounded-borders"
          style="border: 1px solid black; overflow: hidden;"
        />

        <div class="row q-col-gutter-md q-mb-xl">
          <div class="col-6">
            <div class="text-subtitle1 q-mb-sm text-weight-bold text-caption">Due Date</div>
            <date-input required  v-model="dueDateString"></date-input>
          </div>

          <div class="col-6">
            <div class="text-subtitle1 q-mb-sm text-weight-bold text-caption">Priority</div>
            <q-select
              outlined
              v-model="priorityModel"
              :options="priorityOptions" dense
              style="border: 1px solid black; overflow: hidden;" class="rounded-borders"
            />
          </div>
        </div>
      </div>

      <div class="q-pt-sm">
        <q-btn
          unelevated
          color="green"
          text-color="white"
          label="Add"
          class="full-width"
          size="md"
          @click="addTask"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import {  emitTaskCreated } from '../utils/eventBus';
import {  ref, onMounted } from 'vue';
import { api } from '../services/client';
import * as ui from '../utils/ui'
import {Task,Priority} from '../services/api';
import dateInput from './components/date-input.vue';
const task=ref<Task>({
    title: '',
    description: '',
    due_date: null,
    priority: Priority.Normal,
    is_completed: false,
})
const dueDateString = ref<Date | null>(null);
const priorityOptions = ref([])
const priorityModel = ref<Priority>(Priority.Normal);
async function addTask() {
    try {
      const due = new Date(dueDateString.value);
      const now = new Date();
      due.setHours(0, 0, 0, 0);
      now.setHours(0, 0, 0, 0);
      if (dueDateString.value==null) {
            ui.error('Due date cannot be empty')
            return
        }
      if (due < now) {
            ui.error('Due date cannot be in the past')
            return
        }
      task.value.due_date = dueDateString.value;
      task.value.priority = priorityModel.value['value'];
      await api.tasks.createTaskApiTasksPost(task.value).then(res=>res.data)
      emitTaskCreated();
      ui.success('Create task successfully')
        
    } catch (error) {
        ui.error('Failed to create task: ' + error)
    }
}
onMounted(async () => {
    priorityOptions.value = [
        { label: 'Low', value: Priority.Low },
        { label: 'Normal', value: Priority.Normal },
        { label: 'High', value: Priority.High },
    ];
    const today = new Date();
    dueDateString.value = today
})
</script>
