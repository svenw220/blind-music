<template>
  <q-card
    class="bg-grey-1 text-primary"
    style="height: 42rem; min-width: 60rem; border-radius: 5px;"
  >
    <q-bar class="bg-grey-1 q-pa-none items-center">
      <div class="row full-width justify-center items-end">
        <div style="width: 10rem;">
          <q-btn
            color="accent"
            text-color="secondary"
            v-close-popup
            style="height: 3rem; width: 3rem;"
          >
            <q-icon name="close" style="height: 3rem;" />
          </q-btn>
        </div>
        <q-space />
        <div class="t-h1 text-primary text-center">
          <span>
            {{ $t('playlistsPanel.title') }}
          </span>
        </div>
        <q-space />
        <div style="width: 10rem; margin" class="row justify-end q-pr-xs">
          <q-btn
            v-if="isOnline"
            flat
            color="primary"
            size="md"
            text-color="primary"
            :icon="isAuthenticated ? 'logout' : 'login'"
            :label="isAuthenticated ? $t('playlistsPanel.logout') : $t('playlistsPanel.login')"
            @click="() => { isAuthenticated ? logout() : goToLoginUrl() }"
          />
        </div>
      </div>
    </q-bar>

    <q-card-section class="q-pt-md">
      <div>
        <session-cards :showRefresh="isAuthenticated"/>
      </div>
    </q-card-section>
    <q-card-section> </q-card-section>
    <q-card-section>
      <div
        class="column full-width justify-end items-center q-pt-md q-pb-none text-center"
      >
        <!-- <div class="row justify-center text-center full-width q-pb-xs t-body">
              {{ $t('playlistsPanel.jymminExplanation') }}
            </div> -->
        <div class="">
          <q-img
            color="primary"
            src="jymmin-text-powered-by.png"
            fit="fill"
            style="width: 20rem;"
          />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { defineComponent } from '@vue/composition-api';
import SessionCards from 'src/components/MusicLibrary/SessionCards';
// import { appWindow, WebviewWindow } from '@tauri-apps/api/window';
import { mapState, mapActions } from 'vuex';
import { once } from '@tauri-apps/api/event'
import { is_online } from 'tauri-plugin-jymmin-music-lib-api'
import { initiate_login, logout } from 'tauri-plugin-jymmin-auth-api'

export default defineComponent({
  components: {
    SessionCards
  },
  data() {
    return {
      loginWindow: null,
      authEventListener: null,
      checkingOnlineState: true,
      isOffline: false
    };
  },
  computed: {
    ...mapState('musicLibrary', {
      musicLibIsAuthenticated: state => state.isAuthenticated
    }),
    isOnline() {
      return !this.isOffline;
    },
    isAuthenticated: {
      get() {
        return this.musicLibIsAuthenticated
      },
      set(value) {
        this.setAuthState(value)
      }
    }
  },
  methods: {
    ...mapActions('musicLibrary', ['showMusicLibrary', 'setAuthState', 'updateSessions']),
    async goToLoginUrl() {
      if (this.authEventListener === null) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this.authEventListener = await once('is_authenticated', (e) => {
          this.isAuthenticated = true;
          this.updateSessions();
        });
      }
      
      try {
        this.isAuthenticated = await initiate_login(true);
      } catch (e) {
        console.log(e);
      }
    },
    async logout() {
      await logout();
      if (this.authEventListener !== null) {
        // this.authEventListener();
        this.authEventListener = null
      }
      this.showMusicLibrary();
    }
  },
  async mounted() {
    if (
      !navigator.onLine ||
      !(await is_online())
    ) {
      this.isOffline = true;
    }
    this.checkingOnlineState = false;
  }
});
</script>
