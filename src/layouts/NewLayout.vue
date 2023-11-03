<template>
  <q-layout view="hHh lpR fFf" class="disable-select">
    <q-header class="bg-primary text-secondary">
       <q-toolbar class="bg-primary" style="height: 5rem">
        <q-toolbar-title class="t-h1 text-secondary">
          <span class="q-pl-sm">
            {{ $t('topBar.title') }}
          </span>
          <!-- <span style="max-width: 8rem; height: 1rem;">
            <q-img src="Thera-music-flat-design-logo.svg#Artboard1" fit="fill" style="width: 40%;"/>
          </span> -->
        </q-toolbar-title>
        <span v-if="showUserMenuButton" class="q-pr-lg">
          <q-btn flat dense size="xl" color="primary" text-color="secondary" class="q-px-xs" @click="toggleUserLibrary" no-caps>
            <q-icon name="person" />
            <span v-if="!getSelectedUser" class="q-pl-sm" :class="isConnected ? 'text-secondary' : 'text-grey-5'">{{ $t('topBar.userSelectionHint') }}</span>
            <span v-else class="text-secondary q-pl-sm">{{ getSelectedUser.name }}</span>
          </q-btn>
        </span>
        <span class="q-px-md">
          <language-switcher />
        </span>
        <span class="q-px-md">
          <q-btn round flat dense size="xl" color="primary" text-color="secondary" @click="() => { dispatchShowHelp(!showHelp) }">
            <q-icon name="help" />
          </q-btn>
        </span>
        <q-icon v-if="isConnected" name="svguse:tsoft-icons/wifi_grau-96.svg#Capa_1" color="wite" size="xl" class="q-px-md"/>
        <q-btn v-else class="q-px-md" round flat dense size="xl" color="primary" text-color="grey" @click="() => { dispatchShowHelp(true) }">
          <q-icon name="svguse:tsoft-icons/wifi_grau-95.svg#Capa_1" size="xl" class="q-px-sm" />
        </q-btn>
         <span class="q-pl-lg">
          <q-btn flat round color="accent" size="xl" text-color="primary" dense @click="shutdownApp" >
            <q-icon name="img:tsoft-icons/power-on.png" color="secondary" />
          </q-btn>
        </span>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="sliderHelpDrawer"
      side="right"
      overlay
      bordered
      behavior="mobile"
      class="bg-transparent"
      content-class="bg-grey-2 shadow-5"
      :width="235"
    >
      <q-bar class="bg-grey-2 q-pa-none items-center" style="height: 3rem;">
        <div class="row full-width justify-between">
          <q-btn color="accent" text-color="secondary" @click="sliderHelpDrawer = false" style="height: 3rem;">
            <q-icon name="close" />
          </q-btn>
        </div>
      </q-bar>
      <div class="row justify-center">
        <div class="text-primary text-center q-pt-md text-weight-bold">
          {{ $t('mainScreen.activityRange') }}
        </div>
      </div>
      <div class="row text-center t-body text-primary">
        <div class="q-pa-md t-small t-block">
          {{ $t('mainScreen.activityExplanation') }}
        </div>
      </div>
      <!-- <div class="row text-primary q-pa-md full-width justify-center">
        <div class="column text-center items-center justify-center">
          <div>
            Power:  {{Math.floor(minPower)}} - {{Math.floor(maxPower)}} W
          </div>
          <div>
            RPM:   {{Math.floor(minRPM)}} - {{Math.floor(maxRPM)}}
          </div>
        </div>
      </div> -->
      <div class="row justify-center q-pt-md items-start">
        <div>
          <thera-v-slider
            v-model="difficulty"
            :show-label="isConnected"
            :active="isConnected"
            :slider-height="`${activityHeight * 0.8}px`"
            />
        </div>  
      </div>
    </q-drawer>

    
    <!--- DIALOGS ---->
    <q-dialog v-model="musicLibDrawer" transition-show="slide-up" transition-hide="slide-down">
      <music-library-panel />
    </q-dialog>

    <q-dialog v-model="userLibDrawer" transition-show="slide-up" transition-hide="slide-down">
      <user-panel @delete-user="(payload) => { confirmDelete(payload.id, payload.reset) }"/>
    </q-dialog>

    <q-dialog v-model="helpPanelState" transition-show="slide-up" transition-hide="slide-down">
      <help-panel />
    </q-dialog>

    <q-dialog v-model="sessionFinished" transition-show="slide-up" transition-hide="slide-down">
      <session-finished />
    </q-dialog>

    <q-dialog v-model="showConnectionPanel" transition-show="slide-up" transition-hide="slide-down">
      <connection-trouble-shooting-panel />
    </q-dialog>

    <q-dialog v-model="showConfirmDeleteDialog">
      <q-card>
        <q-card-section
          class="row items-center"
          style="min-width: 20rem; min-height: 6rem;"
        >
          <q-avatar icon="delete_forever" color="negative" text-color="white" />
          <span class="q-ml-md t-h1">
            Delete User forever?
          </span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancel"
            color="grey-8"
            class="t-body"
            v-close-popup
            @click="cancelUserDelete"
          />
          <q-btn
            icon="delete_forever"
            flat
            label="Delete"
            color="negative"
            class="t-body"
            @click="dispatchDeleteUser"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>  

    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- <q-footer bordered class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer> -->

  </q-layout>
</template>

<script>
import { ref } from '@vue/composition-api'
import { mapState, mapActions, mapGetters } from 'vuex';
// import UserCreateSideBar from 'components/UserCreateSideBar';
import { useGenerateAvatarPath } from 'components/UserSession/AvatarSelection';
import MusicLibraryPanel from 'components/MusicLibrary/MusicLibraryPanel';
import UserPanel from 'components/UserSession/UserPanel';
import ConnectionTroubleShootingPanel from 'components/ConnectionTroubleShootingPanel';
import HelpPanel from 'components/HelpPanel';
import { appWindow } from '@tauri-apps/api/window'
import SessionFinished from 'components/CyclingSession/SessionFinished';
import TheraVSlider from 'components/UI/TheraVSlider';
import LanguageSwitcher from 'components/LanguageSwitcher';


export default {
  components: {
    MusicLibraryPanel,
    UserPanel,
    ConnectionTroubleShootingPanel,
    HelpPanel,
    SessionFinished,
    TheraVSlider,
    LanguageSwitcher
  },
  setup () {
    return {
      ...useGenerateAvatarPath()
    }
  },
  data () {
    return {
      showUserMenuButton: false,
      showUserCreate: false,
      editThisUser: ref(null),
      showConfirmDeleteDialog: false,
      pendingDeleteRequest: {
        id: '',
        reset: () => { 'Nothing to reset' }
      }
    }
  },
  computed: {
    ...mapState('panels', ['showHelp', 'showSliderHelp', 'showConnectionTroubleShooting']),
    ...mapState('userLibrary', {
      right: state => state.show,
      users: state => state.users
    }),
    ...mapState('userLibrary', ['globalDifficulty', 'outputRange']),
    ...mapState('cyclingSession', {
      isConnected: state => state.connection === 'Connected'
    }),
    ...mapState('cyclingSession', ['showSessionFinished', 'minRPM', 'maxRPM', 'minPower', 'maxPower']),
    ...mapState('musicLibrary', {
      left: state => state.show,
      isAuthenticated: state => state.isAuthenticated
    }),
    ...mapGetters('userLibrary', ['getSelectedUser']),
    screenHeight() {
      return this.$q.screen.height;
    },
    activityHeight() {
      return this.screenHeight * 0.33;
    },
    sliderHelpDrawer: {
      get () {
        return this.showSliderHelp
      },
      set(value) {
        this.dispatchShowSliderHelp(value)
      }
    },
    difficulty: {
      get() {
        // TODO: Create a field on the user db object, that can hold the min, max output range values
        return this.getSelectedUser
          ? this.getSelectedUser.difficulty
          : this.globalDifficulty;
        // return { min: Math.floor(this.outputRange.min * 10), max: Math.floor(this.outputRange.max * 10) };
      },
      set(value) {
        // this.setOutputRange([value.min / 10.0, value.max / 10.0]);
        this.setDifficulty(value);
      }
    },
    helpPanelState: {
      get () {
        return this.showHelp
      },
      set(value) {
        this.dispatchShowHelp(value)
      }
    },
    otherUsers() {
      if (this.getSelectedUser) {
        return this.users.filter(u => u.id !== this.getSelectedUser.id);
      } else {
        return this.users;
      }
    },
    showConnectionPanel: {
      get () {
        return this.showConnectionTroubleShooting
      },
      set (value) {
        this.dispatchShowConnectionHelp(value)
      }
    },
    sessionFinished: {
      get () {
        return this.showSessionFinished
      },
      set (value) {
        this.showSessionFinishedScreen(value)
      }
    },
    musicLibDrawer: {
      get() {
        return this.left;
      },
      async set() {
        this.hideMusicLibrary();
      }
    },
    userLibDrawer: {
      get() {
        return this.right;
      },
      set() {
        this.hideUserLibrary();
      }
    },
  },
  methods: {
    ...mapActions('panels', {
      dispatchShowHelp: 'showHelp',
      dispatchShowSliderHelp: 'showSliderHelp',
      dispatchShowConnectionHelp: 'showConnectionTroubleShooting',
    }),
    ...mapActions('userLibrary', [
      'hideUserLibrary',
      'toggleUserLibrary',
      'selectUser',
      'updateUserList',
      'deleteUser',
      'setDifficulty'
    ]),
    ...mapActions('musicLibrary', ['hideMusicLibrary']),
    ...mapActions('cyclingSession', ['showSessionFinishedScreen', 'toggleConnectionPanel']),
    ...mapActions('userLibrary', ['saveChangesToSelectedUser']),
    async shutdownApp () {
      await this.saveChangesToSelectedUser()
      appWindow.close();
    },
    editUser() {
      this.editThisUser = this.getSelectedUser;
      console.log(this.editThisUser)
      this.showUserCreate = true;
    },
    selectUserWithId(id) {
      this.selectUser(id);
      this.hideUserLibrary();
    },
    cancelUserDelete() {
      this.pendingDeleteRequest.reset();
      this.pendingDeleteRequest = {
        id: '',
        reset: () => { 'Nothing to reset' }
      };
      this.showConfirmDeleteDialog = false;
    },
    confirmDelete(id, reset) {
      this.pendingDeleteRequest = {
        id,
        reset
      };
      this.showConfirmDeleteDialog = true;
    },
    dispatchDeleteUser() {
      const id = this.pendingDeleteRequest.id;
      console.log(`Delete ${id}`);
      this.deleteUser(id);
      this.resetDeleteRequest;
    },
    resetDeleteRequest() {
      this.pendingDeleteRequest.reset();
      this.pendingDeleteRequest = {
        id: '',
        reset: () => { 'Nothing to reset' }
      };
    }
  },
  async mounted() {
    this.updateUserList();
  }
}
</script>

<style lang="sass" scoped>
.bg-transparent
  opacity: 1.0
</style>