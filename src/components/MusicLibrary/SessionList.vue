<template>
  <q-overlay :no-scroll="true" v-model="blockSelection">
    <q-pull-to-refresh @refresh="refresh" class="full-width">
      <q-list separator>
        <q-item
          v-for="s in sessions"
          :key="`session-${s.id}`"
          clickable
          v-ripple
          :active="selectedSession && selectedSession.id === s.id"
          active-class="bg-grey-3 t-body q-py-sm"
          @click="
            () => {
              if (
                s.state === sessionStates.NotDownloaded ||
                s.state === sessionStates.UpdateAvailable
              ) {
                downloadSession(s.id);
              } else if (s.state === sessionStates.Idle) {
                selectSession(s.id);
              }
            }
          "
        >
          <q-item-section avatar class="q-py-sm">
            <q-avatar
                v-if="selectedSession && selectedSession.id === s.id && busy"
                rounded size="4rem">
                <q-spinner-oval
                    color="primary"
                    size="xl"
                  />
            </q-avatar>  
            <q-avatar
              v-else-if="s.state === sessionStates.Downloading && !s.image"
              rounded size="4rem"
              >
              <q-spinner-puff
                    color="primary"
                    size="xl"
                  />
            </q-avatar>

            <q-avatar
              v-else-if="
              s.state === sessionStates.Idle ||
                    s.state === sessionStates.Active ||
                    s.state === sessionStates.Downloading ||
                    s.state === sessionStates.Saving"
            rounded size="4rem">
              <img
                :src="`music-library-images/${s.image}`"
                :class="
                  s.state === sessionStates.Downloading ||
                  s.state === sessionStates.Saving
                    ? 'song-cover-gray'
                    : ''
                "
              />
            </q-avatar>
            <q-avatar
              v-else-if="s.state === sessionStates.NotDownloaded"
              rounded size="4rem">
              <q-icon
                name="svguse:btn-download.svg#download"
                size="3.5rem"
              />
            </q-avatar>
            <q-avatar
                v-else-if="s.state === sessionStates.UpdateAvailable"
                rounded size="4rem">
              <q-icon
                name="svguse:btn-new.svg#new"
                size="3.5rem"
              />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ s.title }}</q-item-label>
            <q-item-label
              v-if="s.state === sessionStates.Downloading"
              class="q-pt-sm"
            >
              <q-linear-progress
                :value="s.downloadProgress"
                size=".25rem"
                color="primary"
                track-color="grey-4"
              />
            </q-item-label>
            <q-item-label
              class="t-body text-grey-6"
              v-else-if="s.state === sessionStates.Saving"
              caption
              :class="
                selectedSession && selectedSession.id === s.id
                  ? 'text-grey-3'
                  : ''
              "
            >
              Saving
              <q-spinner-oval color="dark" />
            </q-item-label>
            <q-item-label
              class="t-body text-grey-6"
              v-else
              caption
              :class="
                selectedSession && selectedSession.id === s.id
                  ? 'text-grey-3'
                  : ''
              "
            >
              {{ s.songs.length }}
              {{ s.songs.length > 1 ? 'Songs' : 'Song' }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-pull-to-refresh>
  </q-overlay>
</template>

<script lang="ts">
import { QOverlay } from '@quasar/quasar-ui-qoverlay'
import { defineComponent } from '@vue/composition-api';
import { SessionState } from 'src/store/music-library/state';
import { mapState, mapActions, mapGetters } from 'vuex';

export default defineComponent({
  name: 'SessionList',
  components: {
    QOverlay
  },
  data() {
    return {
      sessionStates: SessionState
    };
  },
  computed: {
    ...mapState('musicLibrary', ['sessions', 'selectedSession', 'busy', 'nextSongLoading']),
    ...mapGetters('musicLibrary', ['loadingSession']),
    blockSelection () {
      return this.busy || this.nextSongLoading
    }
  },
  methods: {
    ...mapActions('musicLibrary', [
      'downloadSession',
      'selectSession',
      'updateSessions',
      'updateOnlineSessions'
    ]),
    refresh() {
      this.updateSessions();
    }
  },
  mounted() {
    this.updateSessions();
  }
});
</script>

<style lang="sass" scoped>
.song-cover-gray
  filter: grayscale(100%)
</style>
