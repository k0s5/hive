import { createApp } from 'vue'
import 'primeicons/primeicons.css'
import '@shared/styles/index.scss'
import router from './providers/router'
import pinia from './providers/store'
import PrimeVue from 'primevue/config'
import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'
import App from './App.vue'

const app = createApp(App)

app.use(pinia).use(router)

const customPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{yellow.50}',
      100: '{yellow.100}',
      200: '{yellow.200}',
      300: '{yellow.300}',
      400: '{yellow.400}',
      500: '{yellow.500}',
      600: '{yellow.600}',
      700: '{yellow.700}',
      800: '{yellow.800}',
      900: '{yellow.900}',
      950: '{yellow.950}',
    },
  },
})

app.use(PrimeVue, {
  theme: {
    preset: customPreset,
    options: {
      prefix: 'p',
      darkModeSelector: '.dark',
      cssLayer: {
        name: 'hive',
        order: 'app-styles, primevue',
      },
    },
  },
})

app.mount('#app')
