
<template>
  <q-btn
    flat
    round
    dense
    :label="localeOptions[locale]"
    size="xl"
    text-color="white"
    class="t-body"
    @click="switchLocale"
  />
</template>

<script>
import { defineComponent } from '@vue/composition-api'
export default defineComponent({
  data () {
    console.log(this.$i18n.locale);
    return {
      locale: this.$i18n.locale,
      localeOptions: {
        'en-us': 'EN',
        'de': 'DE'
      }
    }
  },
  methods: {
    switchLocale() {
        if (this.locale === 'de') {
            this.$i18n.locale = 'en-us'
            this.locale = 'en-us'
        } else {
            this.$i18n.locale = 'de'
            this.locale = 'de'
        }
    }
  }
})
</script>