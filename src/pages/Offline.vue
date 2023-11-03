<template>
  <q-page padding class="q-pt-xl">
    <div v-if="notAllowed">
      <div class="text-center text-h2 q-pt-lg">
        Please connect the tablet to the internet and restart the app.
      </div>
      <div class="text-center text-body2 q-pt-xl">
        This is necessary for the initial Setup.
      </div>
    </div>
    <div v-else-if="numberOfDaysLeft <= 0">
      <div class="text-center text-h2 q-pt-lg">
        Your offline time has expired.
      </div>
      <div class="text-center text-body2 q-pt-xl">
        Please connect to the internet and restart the app.
      </div>
    </div>
    <div v-else>
      <div class="text-center text-h2 q-pt-lg">
        You're running in offline mode.
      </div>
      <div class="text-center text-body2 q-pt-xl">
        You can use the app for {{ numberOfDaysLeft }} days. After that you have to connect
        the tablet to the internet again.
      </div>
    </div>
  </q-page>
</template>

<script>
import { LocalStorage } from 'quasar'
export default {
  name: 'PageName',
  data () {
    return {
      notAllowed: false,
      lastLogin: 0,
      now: 0
    }
  },
  computed: {
    numberOfDaysLeft() {
      console.log(this.daysBetween(this.lastLogin, this.now))
      return 30 - Math.round(this.daysBetween(this.lastLogin, this.now))
    }
  },
  methods: {
    // source: https://stackoverflow.com/questions/542938/how-do-i-get-the-number-of-days-between-two-dates-in-javascript
    treatAsUTC(date) {
      var result = new Date(date);
      result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
      return result;
    },
    daysBetween(startDate, endDate) {
      var millisecondsPerDay = 24 * 60 * 60 * 1000;
      return (endDate - startDate) / millisecondsPerDay;
    }
  },
  mounted() {
    if (LocalStorage.has('last-online-login')) {
      this.lastLogin = LocalStorage.getItem('last-online-login')
      this.now = Date.now()
      this.$nextTick(() => {
        console.log('number of days left')
        console.log(this.numberOfDaysLeft)
        if (this.numberOfDaysLeft > 0) {
          setTimeout(() => {
            this.$router.replace('/')
          }, 3000)
        }
      })
    } else {
      this.notAllowed = true
    }
  }
}
</script>
