import { z } from 'zod'

// The design marks only Subject and the consent checkbox as required; name, email
// and message are optional (people call in half the time anyway).
//
// `required_error` matters: an untouched field is `undefined`, and Zod would
// otherwise report a bare "Required" instead of the design's wording.
export const contactSchema = z.object({
  name: z.string().optional(),
  email: z.string().email('Enter a valid email address').optional().or(z.literal('')),
  subject: z
    .string({ required_error: 'Tell us what this is about' })
    .min(1, 'Tell us what this is about'),
  message: z.string().optional(),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'Please consent so we can reply' }),
  }),
})

export type ContactForm = z.infer<typeof contactSchema>
