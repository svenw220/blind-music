<template>
  <div v-if="totalTime > 0" id="sessionTime" class="q-pl-sm">
   {{ currentTimeMinutes }} / {{ totalTimeMinutes }}
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'SessionTime',
  computed: {
    ...mapState('cyclingSession', ['currentTime', 'totalTime']),
    currentTimeMinutes: {
      get () {
        const zeroPadSeconds = (`00${this.currentTime % 60}`).slice(-2)
        return `${Math.floor(this.currentTime / 60)}:${zeroPadSeconds}`
      }
    },
    totalTimeMinutes: {
      get () {
        const zeroPadSeconds = (`00${this.totalTime % 60}`).slice(-2)
        return `${Math.floor(this.totalTime / 60)}:${zeroPadSeconds}`
      }
    }
  }
})
</script>
