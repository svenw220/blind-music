<template>
  <div class="column full-width items-center">
    <div class="row justify-center full-width">
      <div class="q-pr-xl">
        <div class="row justify-center q-pt-md">
          <avatar-selection v-model="avatar" />
        </div>
        <div class="row justify-center q-pt-md">
          <q-input style="width: 16rem" v-model="name" :label="$t('userPanel.name')" class="text-capitalize" />
        </div>
        <div class="row justify-center q-pt-sm q-pb-xl">
          <q-input style="width: 16rem" v-model="username" :label="$t('userPanel.pseudonym')" class="text-capitalize"/>
        </div>
      </div>
      <div class="column items-center justify-center q-pl-xl">
        <div class="q-pb-md">
          <q-slider v-model="difficulty" :step="1" :min="0" :max="10" vertical color="accent" label reverse label-always />
        </div>
        <div class="t-body-plus text-center text-grey-6 q-pb-md">
          {{ $t('mainScreen.activityRange') }}
        </div>
      </div>
    </div>
      <div class="row full-width justify-center q-pt-lg q-px-sm">
        <div class="q-pr-xs">
          <q-btn color="primary" text-color="white" :label="$t('cancel')" @click="cancel" />
          <!-- <j-btn-txt @click="cancel" class="minor">
            cancel
          </j-btn-txt> -->
        </div>
        <div v-if="user" class="q-pl-xs">
          <q-btn color="accent" text-color="secondary" :label="$t('save')" @click="save" />
          <!-- <j-btn-txt @click="save">
            save
          </j-btn-txt> -->
        </div>
        <div v-else class="q-pl-xs">
          <q-btn color="accent" text-color="secondary" label="create" @click="create" />
          <!-- <j-btn-txt @click="create">
            create
          </j-btn-txt> -->
        </div>
      </div>
  </div>
</template>

<script>
import AvatarSelection from 'components/UserSession/AvatarSelection';
import { mapState, mapGetters, mapActions } from 'vuex';
import { defineComponent } from '@vue/composition-api';
// import { IStoreUser } from 'src/store/user-library/state';
import JBtnTxt from 'components/UI/JBtnTxt';

export default defineComponent({
  name: 'UserCreateSideBar',
  props: {
    user: {
      required: false
    }
  },
  components: {
    AvatarSelection,
    JBtnTxt
  },
  data() {
    return {
      cachedAvatar: {
        name: ''
      },
      name: '',
      username: '',
      difficulty: 5,
      localOutputRange: { min: 0, max: 1.0 }
    };
  },
  computed: {
    ...mapState('userLibrary', {
      globalOutputRange: state => state.outputRange
    }),
    ...mapGetters('userLibrary', ['getSelectedUser']),
    outputRange: {
      get() {
        // TODO: Create a field on the user db object, that can hold the min, max output range values
        // return this.getSelectedUser ? this.getSelectedUser.difficulty : this.globalDifficulty;
        return { min: Math.floor(this.localOutputRange.min * 10), max: Math.floor(this.localOutputRange.max * 10) };
      },
      set(value) {
        this.localOutputRange = {min: value.min / 10.0, max: value.max / 10.0 };
      }
    },
    avatar: {
      get () {
        return this.cachedAvatar
      },
      set (value) {
        this.cachedAvatar = value
      }
    }
  },
  mounted() {
    if (this.user) {
      let userCopy = { ...this.user };
      this.id = userCopy.id;
      this.cachedAvatar = userCopy.avatar;
      this.name = userCopy.name;
      this.username = userCopy.username;
      this.difficulty = userCopy.difficulty;
      // TODO: remove this little workaround, for demonstration purpose
      console.log(this.globalOutputRange);
      this.localOutputRange = userCopy.outputRange ? userCopy.outputRange : this.globalOutputRange;
    }
  },
  methods: {
    ...mapActions('userLibrary', ['selectUser', 'createUser', 'updateUser', 'updateUserList']),
    cancel() {
      this.$emit('close');
    },
    async create() {
      const id = await this.createUser({
        name: this.name,
        username: this.username,
        avatar: this.avatar,
        difficultyLevel: this.difficulty
      });
      this.selectUser(id);
      this.updateUserList();
      this.$emit('close');
      console.log('User Created');
    },
    async save() {
      const id = await this.updateUser({
        id: this.id,
        name: this.name,
        username: this.username,
        avatar: this.avatar,
        difficultyLevel: this.difficulty
      });
      this.selectUser(id);
      this.$emit('close');
    }
  }
});
</script>
