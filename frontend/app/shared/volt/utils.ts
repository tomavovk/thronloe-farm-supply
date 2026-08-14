import { twMerge } from 'tailwind-merge';
import { mergeProps } from 'vue';

export const ptViewMerge = (globalPTProps = {} as any, selfPTProps = {} as any, datasets: any) => {
    const { class: globalClass, ...globalRest } = globalPTProps;
    const { class: selfClass, ...selfRest } = selfPTProps;

    return mergeProps({ class: twMerge(globalClass, selfClass) }, globalRest, selfRest, datasets);
};

// Brand fill used by Badge/Stepper (light-only storefront).
export const brandClass = 'bg-brand-500 text-white hover:bg-brand-600';
export const brandBtnClass = brandClass;
