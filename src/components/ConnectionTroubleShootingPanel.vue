<template>
    <q-card class="bg-secondary text-primary disable-select" style="height: 42rem; min-width: 60rem; border-radius: 5px;">
        <q-bar class="bg-secondary q-pa-none items-center">
          <div class="row full-width justify-between">
            <div class="col">
              <q-btn color="accent" text-color="secondary" v-close-popup style="height: 3rem; width: 3rem;">
                  <q-icon name="close" style="height: 3rem;">  
                  </q-icon>
              </q-btn>
            </div>
            <div class="row items-end">
              <!-- <span class="q-pb-xs" style="padding-bottom: 5px; margin-right: -5px;">
                <q-img color="primary" :src="'jymmin-text-black.svg'" fit="fill" style="width: 132px;" /> 
              </span> -->
              <span class="text-capitalize t-h1 text-primary q-pr-lg">
                Connection Trouble Shooting
              </span>
            </div>
          </div>
        </q-bar>

        <q-card-section class="q-pt-xl">
          This Panel could show specific help for the situation when the Tigo does not connect to the app.
        </q-card-section>
      </q-card>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
export default defineComponent({
  name: 'ConnectionTroubleShootingPanel',
  data () {
    return {
      lorem: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid nisi eveniet voluptatibus voluptate rerum architecto voluptates praesentium excepturi, vero, quae laborum quas ipsum quasi. Itaque beatae expedita dolor necessitatibus eos.'
    }
  }
})
</script>
