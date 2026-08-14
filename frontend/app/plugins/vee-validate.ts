import { configure } from 'vee-validate'

export default defineNuxtPlugin(() => {
  // Lazy validation: errors only appear after submit (CLAUDE.md → Forms).
  configure({
    validateOnBlur: false,
    validateOnChange: false,
    validateOnInput: false,
    validateOnModelUpdate: false,
  })
})
