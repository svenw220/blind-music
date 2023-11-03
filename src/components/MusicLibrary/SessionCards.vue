<template>
  <q-overlay :no-scroll="true" v-model="blockSelection">
    <q-scroll-area style="height: 28rem; max-width: 60rem; ">
        <div class="row no-wrap bg-grey-1">
            <div v-for="s in sessions" :key="`session-${s.id}`" style="max-width: 16rem; min-width: 16rem;" class="q-pa-sm">
                <q-card
                    clickable
                    class="my-card bg-secondary text-primary shadow-8 disable-select"
                    @click="() => {
                                if (
                                    s.state === sessionStates.NotDownloaded ||
                                    s.state === sessionStates.UpdateAvailable
                                ) {
                                    downloadSession(s.id);
                                } else if (s.state === sessionStates.Idle) {
                                    selectSession(s.id);
                                } }"
                    >
                    <q-avatar
                        v-if="selectedSession && selectedSession.id === s.id && busy"
                        rounded size="15rem">
                        <q-spinner-oval
                            color="primary"
                            size="xl"
                        />
                    </q-avatar>
                    <q-avatar
                        v-else-if="s.state === sessionStates.Downloading && !s.image"
                        rounded size="15rem"
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
                        rounded 
                        size="15rem"
                        >
                        <q-img
                            class="full-width"
                            :src="`music-library-images/${s.image}`"
                            :class="
                            s.state === sessionStates.Downloading ||
                            s.state === sessionStates.Saving
                                ? 'song-cover-gray'
                                : ''
                            "
                            rounded
                            style="max-height: 15rem; max-width: 15rem; border-radius: 5px;"
                            fit="contain"
                            >
                          
                        </q-img>
                        <div v-if="s.state === sessionStates.Downloading" class="absolute-bottom text-subtitle2 text-center">
                          <q-linear-progress :value="s.downloadProgress" size="1rem" color="accent" class="download-progress-indicator"/>
                        </div>
                    </q-avatar>
                    <q-avatar
                        v-else-if="s.state === sessionStates.NotDownloaded"
                        rounded size="15rem">
                        <q-icon
                            name="svguse:btn-download.svg#download"
                            size="3.5rem"
                        />
                    </q-avatar>
                    <q-avatar
                        v-else-if="s.state === sessionStates.UpdateAvailable"
                        rounded size="15rem">
                        <q-icon
                            name="svguse:btn-new.svg#new"
                            size="3.5rem"
                        />
                    </q-avatar>
                    
                    
                    <q-card-section style="height: 4rem">
                        <q-btn
                            v-if="(s.state === sessionStates.Idle || s.state === sessionStates.Active) && showRefresh"
                            round
                            color="warning"
                            size="md"
                            class="absolute shadow-6"
                            style="top: -12px; right: 12px; transform: translateY(-100%);"
                            @click="() => { downloadSession(s.id) }"
                          >
                          <q-icon name="refresh" size="sm" color="secondary"></q-icon>
                        
                        </q-btn>
                        <div class="t-h5">{{ getLocalizedSessionProp(s, 'title') }}</div>
                    </q-card-section>

                    <q-card-section>
                      <div class="t-small">
                        {{ getLocalizedSessionProp(s, 'description') }}
                      </div>
                    </q-card-section>
                </q-card>
            </div>
        </div>
    </q-scroll-area>
  </q-overlay>
</template>

<script>
import { QOverlay } from '@quasar/quasar-ui-qoverlay'
import { defineComponent } from '@vue/composition-api';
import { SessionState } from 'src/store/music-library/state';
import { mapState, mapActions, mapGetters } from 'vuex';

export default defineComponent({
  name: 'SessionList',
  props: {
    showRefresh: Boolean,
  },
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
    getLocalizedSessionProp(session, property) {
      console.log(session)
      if (session.i18n && session.i18n[this.$i18n.locale]) {
        const prop = session.i18n[this.$i18n.locale][property];
        return prop ? prop : session[property]
      } else {
        return session[property]
      }
    },
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

.download-progress-indicator
  border-radius: 5px

.my-card
  width: 100%
  max-width: 16rem
  min-height: 24rem

</style>
