<template>
  <D3LineChart class="chart" :config="chart_config" :datum="chartData"></D3LineChart>
</template>

<script>
import { D3LineChart } from 'vue-d3-charts'
import { mapState } from 'vuex'

export default {
  name: 'SessionLineChart',
  components: {
    D3LineChart,
  },
  data () {
    return {
      chart_config: {
        date: {
          key: 'timestamp',
          inputFormat: '%M:%S.%L',
          outputFormat: '%M:%S min',
        },
        values: ['power'],
        axis: {
          yFormat: '.0s',
          xTicks: 5
        },
        curve: 'curveMonotoneX',
        points: {
          visibleSize: 3,
          hoverSize: 0,
        },
        color: {
          scheme: ['#5885ad', '#f29177', '#1ba77e'],
        }
      }
    }
  },
  computed: {
    ...mapState('cyclingSession', ['sessionResults']),
    chartData () {
      console.log(this.sessionResults.outputData)
      const useEveryNthSample = Math.floor(this.sessionResults.sessionData[this.sessionResults.sessionData.length - 1].timestamp / 60000) + 1
      return this.sessionResults.sessionData
        .map(v => {
          const total_millis = v.timestamp - this.sessionResults.sessionData[0].timestamp;
          const total_seconds = Math.floor(total_millis * 0.001)
          const ms = total_millis % 1000
          const secs = total_seconds % 60
          const mins = Math.floor(total_seconds / 60)
          
          return {
            ...v, 
            power: (v.power > 0 ? v.power : 0),
            timestamp: `${mins}:${secs}.${ms}`
          } 
        })
        .filter((v, i) => i % useEveryNthSample === 0)
    }
  }
}
</script>

<style lang="sass" scoped>
// Not working
.chart
  &--linechart
    font-size: 30px
  &__line--linechart
    stroke: green
    stroke-width: 100
  &__point--linechart
    stroke-width: 100
</style>