<template>
    <q-page>
        <div class="q-pa-md  bg-white" style="width: 100%; max-width: 500px;">

            <div class="text-center q-pb-md">
                <div class="text-h5 text-weight-bold">To Do List</div>
            </div>
            <div class="q-pt-sm">
                <q-input outlined v-model="searchQuery" @update:model-value="SearchTasks" placeholder="Search..." class="q-mb-md" dense>
                    <template v-slot:prepend>
                        <q-icon name="search" />
                    </template>
                </q-input>

                <template v-for="(task, index) in tasks" :key="task.id">

                    <q-item  v-ripple :class="{ 'bg-grey-2': task.showDetail }" class="q-mb-md rounded-borders"
                        style="border: 1px solid black; overflow: hidden;" >
                        <q-item-section avatar >
                            <q-checkbox v-model="task.is_checked" color="black" @update:model-value="checkBoxChange(task.id)" :disable="task.is_completed"/>
                        </q-item-section>

                        <q-item-section>
                            <q-item-label class="text-weight-bold" >{{ task.title }}</q-item-label>
                        </q-item-section>

                        <q-item-section side>
                            <div class="row q-gutter-xs">
                                <q-btn label="Detail" color="cyan-6" size="sm"
                                    @click="task.showDetail = !task.showDetail" no-caps />
                                <q-btn label="Remove" @click="deleteTask(task.id)" color="red-7" size="sm" no-caps :disable="task.is_completed"/>
                            </div>
                        </q-item-section>
                    </q-item>

                    <q-slide-transition>
                        <div v-show="task.showDetail">
                            <div class="q-pt-sm">
                                <q-input v-model="task.title" outlined dense class="q-mb-sm" hide-bottom-space :disable="task.is_completed" lazy-rules
        :rules="[ val => val && val.length > 0 || 'Please type something']"/>

                                <div class="text-caption text-black q-mb-xs text-weight-bold">Description</div>
                                <q-input style="border: 1px solid black; overflow: hidden;" v-model="task.description" outlined type="textarea" rows="3" class="q-mb-md rounded-borders" :disable="task.is_completed"/>

                                <div class="row q-col-gutter-md q-mb-lg">
                                    <div class="col-6">
                                        <div class="text-caption text-black q-mb-xs text-weight-bold">Due Date</div>
                                        <date-input required  v-model="task.due_date" :disable="task.is_completed"></date-input>
                                    </div>

                                    <div class="col-6">
                                        <div class="text-caption text-black q-mb-xs text-weight-bold">Priority</div>
                                        <q-select style="border: 1px solid black; overflow: hidden;" class="rounded-borders" outlined v-model="task.priority" :options="priorityOptions" dense :disable="task.is_completed"/>
                                    </div>
                                </div>
                                <q-btn label="Update" @click="updateTask(task)" color="green-7" class="full-width" size="md" no-caps :disable="task.is_completed"/>
                            </div>

                        </div>
                    </q-slide-transition>

                    <q-separator v-if="index < tasks.length - 1" />
                </template>

                <div v-show="openBulkActions"
                    class="bg-grey-3 q-py-md q-px-lg row justify-between items-center rounded-borders" style="border: 1px solid black; overflow: hidden;">
                    <div class="text-weight-medium">Bulk Action:</div>
                    <div class="row q-gutter-sm">
                        <q-btn label="Done" @click="UpdateBulkTask()" color="blue-6" size="md" no-caps />
                        <q-btn label="Remove" @click="RemoveBulkTasks()" color="red-7" size="md" no-caps />
                    </div>
                </div>
            </div>
        </div>
    </q-page>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { date } from 'quasar';
import { api } from '../services/client';
import * as ui from '../utils/ui'
import { Task, Priority } from '../services/api';
import dateInput from './components/date-input.vue';
const searchQuery = ref('');
const openBulkActions = ref(false);
const tasks = ref([]);
const priorityOptions = ref([])
const checkBoxTask=ref<string[]>([])
async function fetchTasks() {
    try {
        const response = await api.tasks.listTasksApiTasksGet().then(res => res.data)
        tasks.value = response.map((task: Task) => ({
            id: task._id,
            title: task.title,
            description: task.description,
            due_date: task.due_date ,
            priority: task.priority,
            is_completed: task.is_completed,
            showDetail: false,
            is_checked: false,
        }));
    } catch (error) {
        ui.error('Failed to fetch tasks: ' + error)
    }
}
async function updateTask(task) {
    try {
        if (task.due_date==null || task.due_date=='') {
            ui.error('Due date cannot be empty')
            return
        }
        const taskIn:Task = {
            _id: task.id,
            title: task.title,
            description: task.description,
            due_date: task.due_date ,
            priority: task.priority.value,
            is_completed: task.is_completed,
        }
        await api.tasks.updateTaskApiTasksPatch(taskIn).then(res=>res.data)
        ui.success('Update task successfully')
        await fetchTasks();
    } catch (error) {
        ui.error('Failed to update task: ' + error)
    }

}
    
async function deleteTask(TaskId:string) {
    try {
        await api.tasks.deleteTaskApiTasksTaskIdDelete(TaskId).then(res=>res.data)
        ui.success('Delete task successfully')
        await fetchTasks();
    } catch (error) {
        ui.error('Failed to delete task: ' + error)
    }
}

async function checkBoxChange(taskId:string) {
    if (checkBoxTask.value.includes(taskId)) {
        checkBoxTask.value = checkBoxTask.value.filter(id => id !== taskId);
    } else {
        checkBoxTask.value.push(taskId);
    }
    openBulkActions.value = checkBoxTask.value.length > 0;
    console.log(checkBoxTask.value)
}

async function UpdateBulkTask() {
    try {
        for (const taskId of checkBoxTask.value) {
            const task = tasks.value.find(t => t.id === taskId);
            if (task) {
                if (task.due_date==null || task.due_date=='') {
                    ui.error('Due date of ' + task.title + ' cannot be empty')
                
                }
                else {
                    const taskIn:Task = {
                    _id: task.id,
                    title: task.title,
                    description: task.description,
                    due_date: task.due_date ,
                    priority: task.priority.value,
                    is_completed: true,
                    }
                    await api.tasks.updateTaskApiTasksPatch(taskIn).then(res=>res.data)
                }
                
                
            }
        }
        ui.success('Bulk update tasks successfully')
        checkBoxTask.value = [];
        openBulkActions.value = false;
        await fetchTasks();
    } catch (error) {
        ui.error('Failed to bulk update tasks: ' + error)
    }
}

async function RemoveBulkTasks() {
    try {
        for (const taskId of checkBoxTask.value) {
            await api.tasks.deleteTaskApiTasksTaskIdDelete(taskId).then(res=>res.data)
        }
        ui.success('Bulk delete tasks successfully')
        checkBoxTask.value = [];
        openBulkActions.value = false;
        await fetchTasks();
    } catch (error) {
        ui.error('Failed to bulk delete tasks: ' + error)
    }
    
}
async function SearchTasks() {
    try {
        const query = searchQuery.value.toLowerCase().trim();
        const response = await api.tasks.searchTasksApiTasksSearchGet({q: query}).then(res => res.data)
        tasks.value = response.map((task: Task) => ({
            id: task._id,
            title: task.title,
            description: task.description,
            due_date: task.due_date ,
            priority: task.priority,
            is_completed: task.is_completed,
            showDetail: false,
            is_checked: false,
        }));
    } catch (error) {
        ui.error('Failed to search tasks: ' + error)
    }
    
}
onMounted(async () => {
    await fetchTasks();
    priorityOptions.value = [
        { label: 'Low', value: Priority.Low },
        { label: 'Normal', value: Priority.Normal },
        { label: 'High', value: Priority.High },
    ];
})
</script>
