<template>
  <div
    class="j-btn"
    :class="{ 'no-circle': noCircle, 'full-size': fullSize }"
    @click="$emit('click')"
  >
    <div class="j-btn-l-border"></div>
    <div class="j-btn-l-bgd"></div>
    <div class="j-btn-l">
      <slot />
    </div>
    <div class="j-btn-l-lib" v-if="libCover"></div>
  </div>
</template>

<script>
export default {
  props: { noCircle: Boolean, fullSize: Boolean, libCover: Boolean }
};
</script>

<style scoped lang="sass">
.j-btn
  position: relative
  .j-btn-l
    position: relative
    width: 6.5rem
    height: 6.5rem
    margin: 2rem
    border: .1875rem solid $primary
    border-radius: 100%
    color: $primary
    transition: 200ms linear all
    &:hover
      cursor: pointer
    &:active
      &::before
        opacity: 100%
    > *
      width: 100%
      height: 100%
    &::before
      content: " "
      position: absolute
      width: 10rem
      height: 10rem
      top: 50%
      left: 50%
      border: .1875rem solid $primary
      border-radius: 100%
      transform: translate(-50%, -50%)
      transition: 200ms linear opacity
      opacity: 0%
  &.no-circle
    .j-btn-l
      border: 0rem
  &.small-circle
    .j-btn-l
      width: 5rem
      height: 5rem
      > *
        position: absolute
        width: 6.5rem
        height: 6.5rem
        top: 50%
        left: 50%
        transform: translate(-50%, -50%)
  &.full-size
    .j-btn-l
      > *
        background-image: -webkit-linear-gradient(135deg, #ccc 0%, #e0e0e0 100%)
        position: relative
        width: 7.8rem
        height: 7.8rem
        top: 50%
        left: 50%
        transform: translate(-50%, -50%)
  .j-btn-l-bgd
    position: absolute
    width: 8rem
    height: 8rem
    top: 50%
    left: 50%
    border-radius: 100%
    background-image: -webkit-linear-gradient(135deg, #ccc 0%, #e0e0e0 100%)
    transform: translate(-50%, -50%)
  .j-btn-l-border
    position: absolute
    width: 10rem
    height: 10rem
    top: 50%
    left: 50%
    border-radius: 100%
    background-image: -webkit-linear-gradient(-45deg, #ccc 0%, #e0e0e0 100%)
    transform: translate(-50%, -50%)
  .j-btn-l-lib
    position: absolute
    width: 6.5rem
    height: 6.5rem
    top: 50%
    left: 50%
    border-radius: 100%
    transform: translate(-50%, -50%)
    border: .1875rem solid $grey-4
</style>
