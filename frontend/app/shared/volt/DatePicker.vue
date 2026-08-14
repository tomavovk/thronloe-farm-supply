<template>
    <DatePicker
        unstyled
        showIcon
        iconDisplay="input"
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    >
        <template #prevbutton="{ actionCallback, keydownCallback }">
            <SecondaryButton variant="text" rounded @click="actionCallback" @keydown="keydownCallback">
                <template #icon>
                    <Icon name="ri:arrow-left-s-line" class="w-4 h-4" />
                </template>
            </SecondaryButton>
        </template>
        <template #nextbutton="{ actionCallback, keydownCallback }">
            <SecondaryButton variant="text" rounded @click="actionCallback" @keydown="keydownCallback">
                <template #icon>
                    <Icon name="ri:arrow-right-s-line" class="w-4 h-4" />
                </template>
            </SecondaryButton>
        </template>
        <template #todaybutton="{ actionCallback, keydownCallback }">
            <SecondaryButton variant="text" label="Today" size="small" @click="actionCallback" @keydown="keydownCallback" />
        </template>
        <template #clearbutton="{ actionCallback, keydownCallback }">
            <SecondaryButton variant="text" label="Clear" size="small" @click="actionCallback" @keydown="keydownCallback" />
        </template>
        <template #dropdownicon>
            <Icon name="ri:arrow-down-s-line" class="w-4 h-4" />
        </template>
        <template #inputicon>
            <Icon name="ri:calendar-line" class="w-4 h-4" />
        </template>
        <template #hourincrementbutton="{ callbacks }">
            <SecondaryButton variant="text" rounded v-on="callbacks">
                <template #icon><Icon name="ri:arrow-up-s-line" class="w-4 h-4" /></template>
            </SecondaryButton>
        </template>
        <template #hourdecrementbutton="{ callbacks }">
            <SecondaryButton variant="text" rounded v-on="callbacks">
                <template #icon><Icon name="ri:arrow-down-s-line" class="w-4 h-4" /></template>
            </SecondaryButton>
        </template>
        <template #minuteincrementbutton="{ callbacks }">
            <SecondaryButton variant="text" rounded v-on="callbacks">
                <template #icon><Icon name="ri:arrow-up-s-line" class="w-4 h-4" /></template>
            </SecondaryButton>
        </template>
        <template #minutedecrementbutton="{ callbacks }">
            <SecondaryButton variant="text" rounded v-on="callbacks">
                <template #icon><Icon name="ri:arrow-down-s-line" class="w-4 h-4" /></template>
            </SecondaryButton>
        </template>
        <template #secondincrementbutton="{ callbacks }">
            <SecondaryButton variant="text" rounded v-on="callbacks">
                <template #icon><Icon name="ri:arrow-up-s-line" class="w-4 h-4" /></template>
            </SecondaryButton>
        </template>
        <template #seconddecrementbutton="{ callbacks }">
            <SecondaryButton variant="text" rounded v-on="callbacks">
                <template #icon><Icon name="ri:arrow-down-s-line" class="w-4 h-4" /></template>
            </SecondaryButton>
        </template>
        <template #ampmincrementbutton="{ toggleCallback, keydownCallback }">
            <SecondaryButton variant="text" rounded @click="toggleCallback" @keydown="keydownCallback">
                <template #icon><Icon name="ri:arrow-up-s-line" class="w-4 h-4" /></template>
            </SecondaryButton>
        </template>
        <template #ampmdecrementbutton="{ toggleCallback, keydownCallback }">
            <SecondaryButton variant="text" rounded @click="toggleCallback" @keydown="keydownCallback">
                <template #icon><Icon name="ri:arrow-down-s-line" class="w-4 h-4" /></template>
            </SecondaryButton>
        </template>
        <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
            <slot :name="slotName" v-bind="slotProps ?? {}" />
        </template>
    </DatePicker>
</template>

<script setup>
import DatePicker from 'primevue/datepicker';
import { ref } from 'vue';
import SecondaryButton from './SecondaryButton.vue';
import { ptViewMerge } from './utils';

const theme = ref({
    root: `inline-flex max-w-full relative p-fluid:flex
        rounded-full
        bg-stone-100
        border border-transparent
        hover:border-stone-300
        focus-within:border-stone-400
        focus-within:ring-2 focus-within:ring-stone-900/20
        transition-[border-color,box-shadow] duration-150`,
    pcInputText: {
        root: `flex-auto w-[1%] appearance-none rounded-full outline-none
        border-0 bg-transparent
        p-has-dropdown:rounded-e-none p-has-e-icon:pe-10
        h-9 px-4
        text-sm text-stone-900
        placeholder:text-stone-400
        disabled:pointer-events-none disabled:opacity-50
        p-fluid:w-full`
    },
    dropdown: `cursor-pointer inline-flex items-center justify-center select-none overflow-hidden relative w-10 shrink-0 rounded-e-full
        border-0
        bg-transparent enabled:hover:bg-stone-200 enabled:active:bg-stone-300
        text-stone-500 enabled:hover:text-stone-700 enabled:hover:active:text-stone-800
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900/20
        transition-colors duration-150`,
    inputIconContainer: `cursor-pointer absolute top-1/2 end-3 -mt-2 text-stone-400 leading-none p-small:*:size-3.5 p-large:*:size-4.5`,
    panel: `p-portal-self:min-w-full w-auto z-50 p-3 rounded-3xl
        p-inline:inline-block p-inline:overflow-x-auto p-inline:shadow-none
        border border-stone-200
        bg-white
        text-stone-900
        shadow-md`,
    calendarContainer: `flex w-full`,
    calendar: `flex-auto w-full border-s border-stone-200 gap-3 px-3
        first:ps-0 first:border-s-0 last:pe-0`,
    header: `flex items-center justify-between pt-0 px-0 pb-2 font-medium gap-2
        bg-white
        text-stone-900
        border-b border-stone-200 `,
    title: `flex items-center justify-between gap-2 font-medium`,
    selectMonth: `border-none bg-transparent m-0 cursor-pointer font-medium transition-colors duration-200
        py-1 px-2 rounded-xl text-stone-900
        enabled:hover:bg-stone-100
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2
        `,
    selectYear: `border-none bg-transparent m-0 cursor-pointer font-medium transition-colors duration-200
        py-1 px-2 rounded-xl text-stone-900
        enabled:hover:bg-stone-100
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2
        `,
    decade: `white-space-nowrap`,
    dayView: `w-full border-collapse text-base mt-2 mx-0 mb-0`,
    tableHeader: ``,
    tableHeaderRow: ``,
    weekHeader: `p-1`,
    weekHeaderLabel: `font-medium text-stone-900 opacity-60`,
    tableHeaderCell: ``,
    weekDayCell: `p-1`,
    weekDay: `font-medium text-stone-900 `,
    tableBody: ``,
    weekNumber: ``,
    weekLabelContainer: `opacity-60 flex w-8 h-8 p-1 justify-center`,
    weekLabel: ``,
    dayCell: `p-1`,
    day: `flex items-center justify-center cursor-pointer my-0 mx-auto overflow-hidden relative w-8 h-8
        rounded-full p-1 transition-colors duration-200 border border-transparent text-stone-900
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2
        p-disabled:opacity-50 p-disabled:pointer-events-none
        hover:bg-stone-100
        p-selected:bg-stone-900 p-selected:text-stone-50
        p-today:bg-stone-100 p-today:text-stone-900
        p-today:hover:bg-stone-200
        p-today:p-selected:bg-stone-900 p-today:p-selected:text-stone-50 `,
    monthView: `mt-2 mb-0 mx-0 w-full grid grid-cols-3 gap-1`,
    month: `w-full inline-flex items-center justify-center cursor-pointer overflow-hidden relative
        p-1.5 transition-colors duration-200 rounded-xl text-stone-900
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2
        hover:bg-stone-100
        p-selected:bg-stone-900 p-selected:text-stone-50 `,
    yearView: `mt-2 mb-0 mx-0`,
    year: `w-1/2 inline-flex items-center justify-center cursor-pointer overflow-hidden relative
        p-1.5 transition-colors duration-200 rounded-xl text-stone-900
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2
        hover:bg-stone-100
        p-selected:bg-stone-900 p-selected:text-stone-50 `,
    timePicker: `flex items-center justify-center p-0 gap-2
        not-p-time-only:border-t not-p-time-only:border-stone-200
        not-p-time-only:pt-2 not-p-time-only:pb-0 not-p-time-only:px-0`,
    hourPicker: `flex items-center flex-col gap-1`,
    hour: `text-base`,
    separatorContainer: `flex items-center flex-col gap-1`,
    separator: `text-base`,
    minutePicker: `flex items-center flex-col gap-1`,
    minute: `text-base`,
    secondPicker: `flex items-center flex-col gap-1`,
    second: `text-base`,
    ampmPicker: `flex items-center flex-col gap-1`,
    ampm: `text-base`,
    buttonbar: `flex justify-between items-center pt-2 pb-0 px-0 border-t border-stone-200 `,
    transition: {
        enterFromClass: 'opacity-0 scale-y-75',
        enterActiveClass: 'transition duration-120 ease-[cubic-bezier(0,0,0.2,1)]',
        leaveActiveClass: 'transition-opacity duration-100 ease-linear',
        leaveToClass: 'opacity-0'
    }
});
</script>
