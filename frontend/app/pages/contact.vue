<template>
  <div>
    <section class="bg-surface">
      <div class="container-page grid items-stretch gap-8 pb-12 lg:grid-cols-12 lg:gap-12 lg:pb-16">
        <div class="relative h-[320px] overflow-hidden lg:col-span-6 lg:h-auto lg:min-h-[600px]">
          <NuxtImg
            src="/images/home-hero-image.jpg"
            format="webp"
            alt="The yard at Thornloe Farm Supply"
            width="900"
            height="620"
            class="absolute inset-0 h-full w-full object-cover"
          />
        </div>

        <div class="flex flex-col pt-10 lg:col-span-6">
          <p
            class="border-line text-muted mb-6 inline-flex items-center gap-[7px] self-start border bg-panel px-3 py-[5px] text-xs leading-[1.4] font-medium"
          >
            <SlIcon
              name="help-chat-2"
              class="text-[13px]"
            />
            Contact Us
          </p>
          <h1 class="mb-4 text-3xl font-semibold">Ask us anything</h1>
          <p class="text-muted mb-8 max-w-[52ch]">
            Got a question or want to know more? Fill out the form or call us at
            <a
              :href="site.phoneHref"
              class="text-brand font-semibold"
              >{{ site.phone }}</a
            >.
          </p>

          <form
            class="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2"
            novalidate
            @submit="onSubmit"
          >
            <UiFormField
              label="Your Name"
              input-id="ct-name"
              :error="errors.name"
            >
              <VoltInputText
                id="ct-name"
                v-model="name"
                v-bind="nameAttrs"
                type="text"
                autocomplete="name"
                placeholder="First and last name"
              />
            </UiFormField>

            <UiFormField
              label="Your Email"
              input-id="ct-email"
              :error="errors.email"
            >
              <VoltInputText
                id="ct-email"
                v-model="email"
                v-bind="emailAttrs"
                type="email"
                autocomplete="email"
                placeholder="you@email.com"
                :class="{ 'p-invalid': errors.email }"
              />
            </UiFormField>

            <UiFormField
              label="Subject"
              input-id="ct-subject"
              required
              full
              :error="errors.subject"
            >
              <VoltInputText
                id="ct-subject"
                v-model="subject"
                v-bind="subjectAttrs"
                type="text"
                placeholder="What is this about?"
                :class="{ 'p-invalid': errors.subject }"
              />
            </UiFormField>

            <UiFormField
              label="Message"
              input-id="ct-message"
              full
              :error="errors.message"
            >
              <VoltTextarea
                id="ct-message"
                v-model="message"
                v-bind="messageAttrs"
                rows="4"
                class="min-h-[120px]"
                placeholder="Tell us what you need — product, quantity, machine model, anything helpful."
              />
            </UiFormField>

            <div class="sm:col-span-2">
              <label class="flex cursor-pointer items-center gap-2.5 text-sm font-medium">
                <VoltCheckbox
                  v-model="consent"
                  v-bind="consentAttrs"
                  binary
                  class="[&_[data-pc-section=box]]:h-[17px] [&_[data-pc-section=box]]:w-[17px]"
                />
                I consent to my submitted data being collected and stored
                <span class="text-badge">*</span>
              </label>
              <small
                v-if="errors.consent"
                class="text-badge mt-1.5 block text-xs font-medium"
              >
                {{ errors.consent }}
              </small>
            </div>

            <p
              v-if="failure"
              class="text-badge text-xs font-medium sm:col-span-2"
            >
              {{ failure }}
            </p>

            <div class="mt-6 flex flex-wrap items-center gap-4 sm:col-span-2">
              <VoltButton
                type="submit"
                :loading="sending"
              >
                Send Message
                <UiGlyph
                  name="arrow-right"
                  class="text-[16px]"
                />
              </VoltButton>
              <VoltButton
                :href="site.phoneHref"
                severity="secondary"
              >
                Call the Counter
              </VoltButton>
            </div>
          </form>

          <div
            v-if="sent"
            class="border-line mt-6 flex items-center gap-3 border bg-panel px-6 py-4 text-sm font-medium"
          >
            <span
              class="sl-icon text-brand text-[20px]"
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="square"
                stroke-linejoin="miter"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                />
                <polyline points="8 12.5 11 15.5 16 9.5" />
              </svg>
            </span>
            Thanks — your message is on its way. We’ll get back to you within one business day.
          </div>
        </div>
      </div>
    </section>

    <FaqSection
      tight
      scope="contact"
      kicker="Before you call"
      title="Quick answers"
      subtitle="The questions we get most at the counter."
    />

    <section class="pt-16 pb-24">
      <div class="container-page">
        <div class="mb-8 flex flex-wrap items-baseline justify-between gap-4">
          <h2 class="text-xl font-semibold">Find the Yard</h2>
          <a
            :href="MAPS_URL"
            target="_blank"
            rel="noopener"
            class="hover:text-ink inline-flex items-center gap-1.5 text-sm font-semibold transition-colors duration-[350ms] hover:underline hover:underline-offset-4"
          >
            Open in Google Maps
            <UiGlyph
              name="arrow-right"
              class="text-[14px]"
            />
          </a>
        </div>

        <div class="border-line h-[420px] overflow-hidden border bg-panel">
          <iframe
            src="https://www.google.com/maps?q=Thornloe%20Farm%20Supply%2C%20Thornloe%2C%20ON&output=embed"
            title="Map to Thornloe Farm Supply"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            allowfullscreen
            class="block h-full w-full border-0 grayscale-[0.25]"
          />
        </div>

        <div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div :class="CARD">
            <h3 :class="CARD_TITLE">Address</h3>
            <p :class="CARD_TEXT">
              <template
                v-for="(line, i) in site.addressLines"
                :key="line"
              >
                <br v-if="i" />
                {{ line }}
              </template>
            </p>
            <p :class="SUBLABEL">Finding the yard</p>
            <p class="text-muted text-sm">
              Pull in past the store — we’ll meet you at the loading door.
            </p>
            <a
              :href="MAPS_URL"
              target="_blank"
              rel="noopener"
              class="text-brand mt-4 inline-block text-sm font-semibold"
            >
              Get directions →
            </a>
          </div>

          <div :class="CARD">
            <h3 :class="CARD_TITLE">Phone</h3>
            <a
              :href="site.phoneHref"
              :class="CARD_TEXT"
            >
              {{ site.phone }}
            </a>
            <p :class="SUBLABEL">Direct extensions</p>
            <ul class="m-0 flex list-none flex-col gap-1 p-0">
              <li
                v-for="ext in site.extensions"
                :key="ext.ext"
              >
                <a
                  :href="`${site.phoneHref},${ext.ext}`"
                  :class="[ROW, 'group']"
                >
                  {{ ext.name }}
                  <span class="text-muted group-hover:text-brand tabular-nums whitespace-nowrap">
                    ext. {{ ext.ext }}
                  </span>
                </a>
              </li>
            </ul>
          </div>

          <div :class="CARD">
            <h3 :class="CARD_TITLE">Hours</h3>
            <template
              v-for="season in site.hours"
              :key="season.title"
            >
              <p :class="SUBLABEL">
                {{ season.title.replace(' Hours', '') }} · {{ season.season }}
              </p>
              <ul class="m-0 flex list-none flex-col gap-1 p-0">
                <li
                  v-for="row in season.rows"
                  :key="row.days"
                  :class="ROW"
                >
                  <span>{{ row.days }}</span>
                  <span class="text-muted tabular-nums whitespace-nowrap">{{ row.time }}</span>
                </li>
              </ul>
            </template>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { contactSchema } from '~/features/contact/schemas/contact'
const { site } = useSite()

const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=Thornloe+Farm+Supply%2C+Thornloe%2C+ON'

const CARD = 'border-line border bg-surface px-6 py-4'
const CARD_TITLE = 'text-muted mb-2 text-xs font-semibold tracking-[0.12em] uppercase'
const CARD_TEXT = 'text-ink text-sm font-medium'
const SUBLABEL = 'text-muted mt-4 mb-2 text-xs font-bold'
const ROW = 'flex items-baseline justify-between gap-4 text-sm'

const api = useApi()

const { handleSubmit, errors, defineField, resetForm, setErrors } = useForm({
  validationSchema: toTypedSchema(contactSchema),
})

const [name, nameAttrs] = defineField('name')
const [email, emailAttrs] = defineField('email')
const [subject, subjectAttrs] = defineField('subject')
const [message, messageAttrs] = defineField('message')
const [consent, consentAttrs] = defineField('consent')

const sending = ref(false)
const sent = ref(false)
const failure = ref('')

// POST /contact. The API re-checks subject and consent, so a 422 comes back with
// per-field messages — surface those on the fields rather than as a banner.
const onSubmit = handleSubmit(async (values) => {
  sending.value = true
  failure.value = ''

  try {
    await api('/contact', { method: 'POST', body: values })
    sent.value = true
    resetForm()
  } catch (error) {
    const fields = apiFieldErrors(error)

    if (Object.keys(fields).length) {
      setErrors(fields)
    } else {
      failure.value = apiMessage(error, 'Could not send your message. Please try again.')
    }
  } finally {
    sending.value = false
  }
})

useHead({ title: 'Contact' })
useSeoMeta({
  description:
    'Contact Thornloe Farm Supply — 31 Main St, Thornloe, ON. Call (705) 563-2555 or send us a message and we’ll reply within one business day.',
})
</script>
