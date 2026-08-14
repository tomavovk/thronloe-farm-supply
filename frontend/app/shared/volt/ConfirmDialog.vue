<template>
    <ConfirmDialog
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    >
        <template #container="{ message, acceptCallback, rejectCallback }">
            <div class="flex items-center justify-between shrink-0 p-5">
                <span class="font-semibold text-xl">{{ message.header }}</span>
                <SecondaryButton variant="text" rounded autofocus @click="rejectCallback">
                    <template #icon>
                        <Icon name="ri:close-line" class="w-4 h-4" />
                    </template>
                </SecondaryButton>
            </div>
            <div class="overflow-y-auto pt-0 px-5 pb-5 flex items-center gap-4">
                <Icon name="ri:error-warning-line" class="w-6 h-6 text-amber-500 shrink-0" />
                {{ message.message }}
            </div>
            <div class="pt-0 px-5 pb-5 flex justify-end gap-2">
                <SecondaryButton :label="message.rejectProps.label" size="sm" @click="rejectCallback" />
                <Button :label="message.acceptProps.label" size="sm" @click="acceptCallback" />
            </div>
        </template>
    </ConfirmDialog>
</template>

<script setup lang="ts">
import ConfirmDialog, { type ConfirmDialogPassThroughOptions, type ConfirmDialogProps } from 'primevue/confirmdialog';
import { ref } from 'vue';
import Button from './Button.vue';
import SecondaryButton from './SecondaryButton.vue';
import { ptViewMerge } from './utils';

interface Props extends /* @vue-ignore */ ConfirmDialogProps {}
defineProps<Props>();

const theme = ref<ConfirmDialogPassThroughOptions>({
    root: `max-h-[90%] max-w-screen rounded-xl
        border border-stone-200
        bg-white
        text-stone-900 shadow-xl`,
    mask: `bg-black/40 backdrop-blur-sm fixed top-0 start-0 w-full h-full`,
    transition: {
        enterFromClass: 'opacity-0 scale-75',
        enterActiveClass: 'transition-all duration-150 ease-[cubic-bezier(0,0,0.2,1)]',
        leaveActiveClass: 'transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)]',
        leaveToClass: 'opacity-0 scale-75'
    }
});
</script>
