<template>
  <div class="column disable-select">
    <div v-if="title" class="row justify-center">
      <div class="text-primary text-center q-pt-md text-weight-bold">
        {{ title }}
      </div>
    </div>
    <div class="row justify-center q-pt-lg q-pb-lg">
      <q-btn :disable="!active" @click="increment" :color="active ? 'white' : 'grey-4'" text-color="primary" class="thera-button" :class="active ? 'shadow-8' : 'shadow-1'">
        <q-icon name="add" class="text-weight-bold" size="md" />
      </q-btn>
    </div>
    <div class="row justify-center q-pl-lg q-py-xs">
      <q-slider 
        v-model="sliderValue"
        :step="1"
        :min="0"
        :max="10"
        vertical
        :color="active ? 'accent' : 'dark'"
        reverse :style="{ height: `${sliderHeight}` }" 
        :marker-labels="fnMarkerLabel"
        thumb-size="45px"
        :disable="!active"
        >
        <template v-slot:marker-label-group="{ markerMap, markerList }">
            <div
              v-for="marker in markerList"
              :key="marker.index"
              :class="[ marker.value === sliderValue && active ? 'text-accent' : 'text-primary', marker.value === sliderValue ? 'text-weight-bold' : '', marker.classes, 'q-pl-md' ]"
              :style="marker.style"
              @click="model = marker.value"
            >{{ marker.value === 10 || marker.value === 0 || marker.value === sliderValue ? marker.value : '' }}</div>
           
        </template>
      </q-slider>
    </div>
    <div class="row justify-center q-pt-lg q-pb-md" >
      <q-btn :disable="!active" @click="decrement" :color="active ? 'white' : 'grey-4'" text-color="primary" class="thera-button" :class="active ? 'shadow-8' : 'shadow-1'" >
        <q-icon name="remove" class="text-weight-bold" size="md"/>
      </q-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TheraVSlider',
  props: ['value', 'showLabel', 'active', 'sliderHeight', 'title'],
  data () {
    return {
      innerValue: 0,
      objMarkerLabel: { 0: {label: '0'},  10: '10' },
    }
  },
  computed: {
    sliderValue: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    }
  },
  methods: {
    decrement () {
      this.$emit('input', this.value - 1)
    },
    increment () {
      this.$emit('input', this.value + 1)
    },
    fnMarkerLabel: val => { return (val === 0 || val === 10) ? `${val}` : '' },
  }
}
</script>

<style lang="sass" scoped>
.thera-button
  min-height: 3rem
  min-width: 5rem
</style>