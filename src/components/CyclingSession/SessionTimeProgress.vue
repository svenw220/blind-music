<template>
  <q-linear-progress :value="progress" style="height: 1em" color="secondary" />
</template>

<script>
import { mapState } from 'vuex'
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'SessionTime',
  computed: {
    ...mapState('cyclingSession', ['currentTime', 'totalTime']),
    progress: {
      get () {
        return this.totalTime > 0 ? this.currentTime / this.totalTime : 0
      }
    }
  }
})
</script>
