
import { ref } from 'vue';
export const taskCreatedEvent = ref(0);

export function emitTaskCreated() {
    taskCreatedEvent.value++;
}