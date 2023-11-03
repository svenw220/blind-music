<template>
  <div>
    <input
      type="range"
      id="difficulty"
      name="difficulty"
      min="0"
      max="100"
      class="j-slider"
    />
  </div>
</template>

<style scoped lang="sass">
.j-slider
  background: none
  width: 100%
  &::-moz-range-track
    width: 100%
    height: 0rem
    border-top: .25rem solid #CCC
    border-bottom: .25rem solid #f2f2f2
  &::-moz-range-thumb
    width: 4rem
    height: 4rem
    color: $primary
    outline: .25rem solid $primary
    -moz-outline-radius: 100%
    outline-offset: -1rem
    border: .25rem solid transparent
    border-radius: 100%
    background: linear-gradient(#e5e5e5, #e5e5e5),linear-gradient(-45deg, #bfbfbf 0%, #fff 100%)
    background-origin: border-box
    background-clip: content-box, border-box
    box-shadow: .25rem .25rem 1rem rgba(0, 0, 0, .25)
    transition: 160ms linear outline-offset
  &:active
    &::-moz-range-thumb
      outline-offset: 2rem
      -moz-outline-radius: 100%
</style>
