import { z } from 'zod'

// Validation for the four auth screens. The design validates on submit only
// (empty field → "Enter your email"), which is also this project's global
// VeeValidate setting.
//
// Every string carries `required_error` as well as a `min(1)` message: an untouched
// field arrives as `undefined`, and Zod then reports its required_error — without it
// the user sees a bare "Required".
const required = (message: string) => z.string({ required_error: message }).min(1, message)

export const loginSchema = z.object({
  email: required('Enter your email').email('Enter a valid email address'),
  password: required('Enter your password'),
})

export const forgotSchema = z.object({
  email: required('Enter the email on your account').email('Enter a valid email address'),
})

const PASSWORD = required('Enter a password').min(8, 'Use at least 8 characters')

export const registerSchema = z
  .object({
    name: required('Enter your full name'),
    email: required('Enter your email').email('Enter a valid email address'),
    password: PASSWORD,
    passwordRepeat: required('Repeat the password'),
    // Optional block — the design lets people finish these later in Account.
    phone: z.string().optional(),
    farm: z.string().optional(),
    address1: z.string().optional(),
    address2: z.string().optional(),
    city: z.string().optional(),
    province: z.string().optional(),
    postal: z.string().optional(),
    preferredRun: z.string().optional(),
  })
  .refine((values) => values.password === values.passwordRepeat, {
    message: 'The passwords don’t match',
    path: ['passwordRepeat'],
  })

export const resetSchema = z
  .object({
    password: PASSWORD,
    passwordRepeat: required('Repeat the password'),
  })
  .refine((values) => values.password === values.passwordRepeat, {
    message: 'The passwords don’t match',
    path: ['passwordRepeat'],
  })

export type LoginForm = z.infer<typeof loginSchema>
export type RegisterForm = z.infer<typeof registerSchema>
export type ResetForm = z.infer<typeof resetSchema>

/** Delivery-run options, shared by registration and the account profile. */
export const PREFERRED_RUNS = [
  'Local run — 2nd & 4th Friday',
  'Matheson run — 1st & 3rd Friday',
  'Pick up at the yard',
  'Call me to schedule',
] as const
