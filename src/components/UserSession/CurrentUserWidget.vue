<template>
    <div class="column full-width">
        <div class="row justify-center items-center q-pb-md q-pt-lg">
            <div>
                <q-avatar round size="6rem">
                    <img :src="getSelectedUser ? generateAvatarPath(getSelectedUser.avatar.name) : ''" />
                </q-avatar>
            </div>
        </div>
        <div class="row justify-center items-center q-pb-md">
            <div class="t-h1-plus text-center text-primary">
                {{ getSelectedUser.name }}
            </div>
        </div>
        <div class="row justify-center items-center q-pb-md">
            <div class="t-h1-plus text-center">
                <span>
                    <q-btn
                    flat
                    round
                    size="md"
                    icon="edit"
                    color="primary"
                    @click="editUser"
                    />
                    |
                    <q-btn flat round size="md" icon="bar_chart" color="primary" />
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { defineComponent } from '@vue/composition-api';
import { useGenerateAvatarPath } from 'src/components/UserSession/AvatarSelection';


export default defineComponent({
  setup () {
    return {
      ...useGenerateAvatarPath()
    }
  },
  computed: {
      ...mapGetters('userLibrary', ['getSelectedUser']),
  },
  methods: {
      editUser () {
          this.$emit('edit-user')
      }
  }
})
</script>