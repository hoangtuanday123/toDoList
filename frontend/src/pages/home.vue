<template>
    <q-page class="row items-center justify-evenly">
     <div class="row rounded-borders" style="border: 1px solid black; overflow: hidden;">
      <div class="col ">
        <create-task/>
      </div>
      <q-separator vertical inset style="width: 1px; background-color: #000;"/>
      <div class="col-7">
        <list-task/>
      </div>
    </div>
    </q-page>
  </template>
  
  <script setup lang="ts">
  import CreateTask from '../components/task-create.vue';
  import ListTask from 'src/components/task-list.vue';
  </script>
  
