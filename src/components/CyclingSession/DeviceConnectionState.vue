<template>
  <q-chip class="bg-grey-2 text-grey-8" style="min-width: 11rem">
    <q-avatar id="stateColorIndicator" class="centered" size="sm" :color="connected ? connectionStateColor : 'grey-4'" text-color="white" >
      <q-spinner-puff v-if="searching" color="dark" />
      <q-spinner-oval v-else-if="!connected" color="dark" />
      <q-icon v-else name="check" />
    </q-avatar>
    <div class="row justify-center full-width">
      <div>
        {{ this.connectionStateLabel }}
      </div>
    </div>
  </q-chip>
</template>

<script language="ts">
import { mapState } from 'vuex'
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'DeviceConnectionState',
  data () {
    return {
      labels: {
        searching: 'Searching for Device',
        connecting: 'Connecting',
        connected: 'Device Connected'
      },
      stateColors: {
        searching:  'secondary',
        connecting: 'primary',
        connected:  'positive'
      }
    }
  },
  computed: {
    ...mapState('cyclingSession', ['connection']),
    connectionStateLabel () {
      return this.labels[this.connection.toLowerCase()]
    },
    connectionStateColor () {
      return this.stateColors[this.connection.toLowerCase()]
    },
    connected () {
      return this.connection === 'Connected'
    },
    searching () {
      return this.connection === 'Searching'
    }
  }
})
</script>
