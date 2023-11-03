<template>    
  <div class="column justify-center items-center disable-select">
    <div class="text-h4 text-primary text-center q-pa-md q-pb-xl">
      {{ $t('mainScreen.waitingForDevice' )}}
    </div>
    <div class="q-pb-xl">
      <q-spinner-oval color="accent" size="3em" indeterminate />
    </div>
    <div class="">
      <q-btn size="lg" round color="accent" text-color="white" class="shadow-8" @click="() => { showHelp(true) }">
        <q-icon
            name="svguse:tsoft-icons/help_new.svg#questionmark"
            size="lg"
        />
      </q-btn>
    </div>
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
import { mapActions } from 'vuex'

export default defineComponent({
  name: 'PendingConnectionPanel',
  methods: {
    ...mapActions('panels', ['showHelp']),
  }
})
</script>
