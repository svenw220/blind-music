<template>
  <div id="q-app" v-hotkey="keymap" class="disable-select">
    <router-view />
  </div>
</template>
<script>
import { defineComponent } from '@vue/composition-api';
import { invoke } from '@tauri-apps/api/tauri'
import { mapState, mapActions } from 'vuex'
import { LocalStorage } from 'quasar'
import { play, set_control_value } from 'tauri-plugin-jymmin-audio-core-api'

export default defineComponent({
  name: 'App',
  methods: {
    ...mapActions('cyclingSession', ['setConnectionState']),
    ...mapActions('musicLibrary', ['selectSession', 'updateSessions']),
    async startSession () {
      await play()
    },
    async setControlValue() {
      await set_control_value(0.5)
    }
  },
  computed: {
    ...mapState('musicLibrary', ['sessions']),
    keymap () {
      return {
        // 'esc+ctrl' is OK.
        'p': this.startSession,
        'c': this.setControlValue,
        'a': () => { this.setConnectionState('Connected') },
        'b': () => { this.setConnectionState('Searching') }
      }
    }
  },
  async mounted () {
    if (!process.env.DEV) {
      document.addEventListener('contextmenu', event => event.preventDefault());
    }
    // this await could cause trouble in situations without internet access
    await this.updateSessions()
    console.log(`Selecting Session: ${LocalStorage.getItem('last-session-loaded')}`)
    if (LocalStorage.has('last-session-loaded')) {
      this.selectSession(LocalStorage.getItem('last-session-loaded'))
    } else {
      if (this.sessions.length > 0) {
        this.selectSession(this.sessions[0].id)
      }
    }
    const state = await invoke('cycling_session_state');
    this.setConnectionState(state.connection_state)
  }
});
</script>

<style lang="sass">
.disable-select
  -webkit-touch-callout: none /* iOS Safari */
  -webkit-user-select: none /* Safari */
  -khtml-user-select: none /* Konqueror HTML */
  -moz-user-select: none /* Firefox */
  -ms-user-select: none /* Internet Explorer/Edge */
  user-select: none /* Non-prefixed version, currently supported by Chrome and Opera */

</style>