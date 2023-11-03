<template>
  <q-card class="bg-secondary text-primary disable-select" style="height: 46rem; min-width: 60rem; border-radius: 5px;">
    <q-bar class="bg-secondary q-pa-none items-center">
      <div class="row full-width justify-between">
        <div class="col">
          <q-btn color="accent" text-color="secondary" v-close-popup style="height: 3rem; width: 3rem;">
            <q-icon name="close" style="height: 3rem;"></q-icon>
          </q-btn>
        </div>
        <div class="row items-end">
          <!-- <span class="q-pb-xs" style="padding-bottom: 5px; margin-right: -5px;">
                <q-img color="primary" :src="'jymmin-text-black.svg'" fit="fill" style="width: 132px;" /> 
              </span> -->
          <span class="text-capitalize t-h1 text-primary q-pr-lg">
            {{ $t('helpPanel.title') }}
          </span>
        </div>
      </div>
    </q-bar>
    <q-card-section>
      <q-scroll-area style="height: 35rem; max-width: 60rem;">
        <div v-for="(block, i) in sections" :key="`help-section-${i}`" class="q-pt-md">
          <div class="text-h5 q-pa-md">
            {{ block.q }}
          </div>

          <q-list padding class="rounded-borders text-primary">
            <q-item v-for="(answer, j) in block.a" :key="`help-section-${i}-answer-${j}`" class="text-body">
              <q-item-section avatar>
                <q-icon name="noise_control_off" />
              </q-item-section>

              <q-item-section v-if="i === 0 && j === 3">
                <div>
                  {{ answer }}

                  <span class="q-pl-md">
                    <q-btn :label="$t('helpPanel.rebootBluetooth')" color="accent" class="q-px-md t-body"
                      :loading="rebootingBluetooth" @click="rebootBluetooth" v-close-popup/>
                  </span>
                </div>
              </q-item-section>
              <q-item-section v-else>{{ answer }}</q-item-section>
            </q-item>
          </q-list>

          <div class="q-pt-md">
            <q-separator />
          </div>
        </div>
      </q-scroll-area>
    </q-card-section>
    <q-card-actions>
      <div class="text-body q-pl-md q-pt-sm">
        <q-btn :label="$t('helpPanel.moreSupport')" color="accent" size="lg" class="q-px-xl"
          @click="openSupportWebsite" />
      </div>
    </q-card-actions>
  </q-card>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
import { invoke } from '@tauri-apps/api/tauri'

export default defineComponent({
  name: 'HelpPanel',
  data() {
    return {
      rebootingBluetooth: false
    }
  },
  computed: {
    sections() { return this.$t('helpPanel.body.questions') }
  },
  methods: {
    openSupportWebsite() {
      console.log('TODO: Implement Support Page Opener')
      invoke('open_link_in_external_browser', { link: 'https://thera-music.com/support' })
    },
    async rebootBluetooth() {
      this.rebootingBluetooth = true
      await invoke('restart_thera_client')
      setTimeout(() => {
        this.rebootingBluetooth = false
      }, 2000);
    }
  }
})
</script>

<style lang="sass" scoped>
.external-link
  color: $accent
  text-decoration: underline

.external-link:hover
  cursor: pointer
</style>