<template>
  <div class="j-btn-txt-l" @click="$emit('click')">
    <slot />
  </div>
</template>

<style lang="sass">
.j-btn-txt-l
  border: .1875rem solid $primary
  border-radius: .25rem
  padding: .5rem 2rem
  font-size: 1.5rem
  letter-spacing: .15rem
  text-transform: uppercase
  text-align: center
  color: $primary
  transition: 200ms linear all
  &:hover
    cursor: pointer
  &:active
    border-color: $secondary
    color: $secondary
  &:disabled
    color: #ccc
  &.minor
    border-color: #ccc
    color: #ccc
</style>
