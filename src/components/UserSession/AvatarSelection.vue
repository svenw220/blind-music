<template>
  <q-avatar size="8rem" @click="changeAvatar">
    <q-img :src="generateAvatarPath(availableAvatars[current])" />
  </q-avatar>
</template>

<script lang="ts">
import { IAvatar } from 'src/store/db';
import { PropType, defineComponent } from '@vue/composition-api';

export function useGenerateAvatarPath() {
  function generateAvatarPath(id: string): string {
    return `avatars/${id}.png`;
  }

  return { generateAvatarPath };
}

export default defineComponent({
  name: 'AvatarSelection',
  props: {
    value: {
      type: (Object as unknown) as PropType<IAvatar>,
      required: true
    }
  },
  setup() {
    return { ...useGenerateAvatarPath() };
  },
  data() {
    return {
      availableAvatars: Array(12).fill(0).map((_, i) => `avatar-${i + 1 < 10 ? '0' : '' }${i + 1}`),
      current: 0
    };
  },
  methods: {
    changeAvatar() {
      this.current = (this.current + 1) % this.availableAvatars.length;
      this.$emit('input', {
        name: this.availableAvatars[this.current]
      });
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.current = this.availableAvatars.indexOf(this.value.name)
      if (this.current < 0) {
        this.current = 0
      }

      this.$emit('input', {
        name: this.availableAvatars[this.current]
      });
    })
  }
});
</script>
