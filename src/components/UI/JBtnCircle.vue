<template>
  <div
    :style="{ borderColor: color }"
    class="j-btn-circle"
    @click="$emit('click')"
  >
    <div :style="{ borderColor: color }" class="outer-ring" />
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    color: String
  }
};
</script>

<style lang="sass">
.j-btn-circle
  position: relative
  width: 4rem
  height: 4rem
  margin: 2rem
  border: .1875rem solid $primary
  border-radius: 100%
  color: $primary
  transition: 200ms linear all
  &:hover
    cursor: pointer
  &:active
    & div.outer-ring
      opacity: 100%
  *
    width: 100%
    height: 100%
  & div.outer-ring
    position: absolute
    height: 6.5rem
    width: 6.5rem
    top: 50%
    left: 50%
    border: .1875rem solid $primary
    border-radius: 100%
    transform: translate(-50%, -50%)
    transition: 200ms linear opacity
    opacity: 0%
  &:disabled
    color: #ccc
</style>
