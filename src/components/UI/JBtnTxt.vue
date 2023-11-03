<template>
  <div class="j-btn-txt" @click="$emit('click')">
    <slot />
  </div>
</template>

<style lang="sass">
.j-btn-txt
  border: .125rem solid $primary
  border-radius: .25rem
  padding: .25rem 1rem
  font-size: 1.25rem
  letter-spacing: .125rem
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
    color: $grey-5
  &.minor
    border-color: $grey-6
    color: $grey-6
</style>
