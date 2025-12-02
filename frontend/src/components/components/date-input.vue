<template>
    <q-input outlined :model-value="dateToString(modelValue)" dense style="border: 1px solid black; overflow: hidden;" class="rounded-borders">
        <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale" behavior="menu" ref="qDateProxy">
                    <q-date :minimal="true" :today-btn="true" first-day-of-week="1" 
                        :model-value="dateToString(modelValue)" mask="DD MMM YYYY" 
                        @update:model-value="(val, reason, details) => { updateValue(val); ($refs.qDateProxy as any).hide(); }">
                    </q-date>
                </q-popup-proxy>

            </q-icon>
        </template>
    </q-input>
</template>

<script setup lang="ts">
import * as ui from '../../utils/ui';
import {  date } from 'quasar'


const props = defineProps<{
    modelValue: string | Date | undefined,
    
}>()


function dateToString(val: Date | string): string {
    console.log('dateToString input value: ' + val)
    if (!val) return ''
    var out = date.formatDate(val, 'DD MMM YYYY')
    return out
}



const emit = defineEmits(['update:modelValue'])
function dateFromString(val: string): Date {
    if (!val) return null
    var out = date.extractDate(val, 'DD MMM YYYY')
   
    return out
}

const updateValue = (val) => {
    try 
    {
        if (!val)
        {
            emit('update:modelValue', null)
        }
        else if (val.length >= 'DD MMM YYYY'.length)
        {
            const date = dateFromString(val)
            emit('update:modelValue', date)
        }
    }
    catch 
    {
    }
}


</script>