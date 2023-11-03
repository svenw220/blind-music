<template>
  <q-page class="">
    <div class="row">
      <div class="col-2 items-center">
        <div
          class="text-center t-h1 q-py-sm text-grey-7 text-capitalize"
        >
          {{ $t('mainScreen.playlist') }}
        </div>
        <div class="row justify-center q-pb-md">
          <q-btn
            round
            color="white"
            text-color="primary"
            style="height: 6.5rem; width: 6.5rem;"
            :class="!isConnected ? 'song-cover-gray' : 'shadow-8'"
            @click="showMusicLibrary"
            :loading="loadingSong"
          >
           <template slot="loading">
            <q-spinner-oval color="accent" size="xl"></q-spinner-oval>
           </template>
            <img
              v-if="selectedSession"
              class="circle-image-clip"
              style="height: 6.5rem; width: 6.5rem; mix-blend-mode: multiply;"
              :src="`music-library-images/${selectedSession.image}`"
            />
            <q-icon v-else name="add" size="4rem" />
          </q-btn>
        </div>
        <div v-if="selectedSession" class="t-h1-plus text-primary text-center">
          {{ getLocalizedSessionProp(selectedSession, 'title') }}
        </div>
      </div>
      <div class="col-8">
        <div class="row justify-center q-pt-xl">
          <music-control-panel />
        </div>
      </div>
      <div class="col-2 justify-end">
        <div style="height: 6rem; padding-top: 1rem; padding-right: 1rem; margin-left: -3rem;">
          <q-img src="TT_Logo_JYMMiN_Logo.png" fit="fit" style="min-width: 12rem;" />
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-2">
        
      </div>
      <div class="col-8">
        <div class="row justify-center">
          <div
            v-if="showPendingConnectionPanel"
            class="j-border-gradient full-width"
            :style="{ minHeight: `${activityHeight}px` }"
          >
            <div class="row justify-center q-mt-xl full-width">
              <div
                class="t-body-plus text-grey-6 text-center"
                style="min-height: 2rem"
              >
                <div>
                  &nbsp;
                </div>
              </div>
            </div>
            <div class="row justify-center q-pb-xl">
              <pending-connection-panel
                class="q-mb-xl"
                :style="{ minHeight: `${activityHeight}px` }"
              />
            </div>
          </div>
          <div v-else class="j-border-gradient q-mb-lg full-width">
            <div class="row justify-center q-mt-xl full-width">
              <div v-if="isConnected" class="t-body-plus text-grey-6 text-center">
                {{ $t('mainScreen.activity') }}
              </div>
              <div
                v-else
                class="t-body-plus text-grey-6 text-center"
                style="min-height: 2rem"
              >
                <div>
                  &nbsp;
                </div>
              </div>
            </div>

            <div class="row justify-center q-mt-xl q-mb-xl">
              <div v-if="isConnected">
                <line-graph :height="activityHeight" :width="screenWidth * 0.6" />
                <div
                  v-if="isConnected && !isPlaying && selectedSession"
                  class="overlay-text t-body-plus text-grey-9 text-h6"
                  style="margin-top: -18px"
                >
                  <span class="q-pr-sm">
                    {{ $t('mainScreen.press') }}
                  </span>
                  <span class="">
                    <q-img src="tsoft-icons/thera-start-button.png" style="height: 6.5rem; width: 6.5rem;" fit="contain"/>
                  </span>
                  <span class="q-pl-sm">
                    {{ $t('mainScreen.onTheTigo') }}
                  </span>
                </div>
              </div>
              <div
                v-else
                :style="{ minHeight: `${activityHeight}px` }"
                class="column justify-center"
              >
                <div class="q-pb-xl">
                  &nbsp;
                </div>
              </div>
              <div
                v-if="isConnected && !isPlaying && !selectedSession"
                class="overlay-text t-body-plus text-grey-9 text-h6"
              >
                <span class="q-pl-sm">Select Music from the Music Library</span>
              </div>
              
            </div>
          </div>
        </div>
      </div>
      <div class="col-2">
        <div class="row justify-center" >
          <div class="text-grey-7 text-center t-h1">
            {{ $t('mainScreen.activityRange') }}
          </div>
          <div class="q-pl-sm" style="margin-top: -0.5rem;">
            <q-btn :disable="!isConnected" round color="primary" size="sm" @click="() => { showSliderHelp(true) }">
              <q-icon name="keyboard_arrow_left" color="secondary" size="md"/>
            </q-btn>
          </div>
        </div>
        <div class="row justify-center">
            <thera-v-slider
              style="padding-top: 0.0rem;"
              v-model="difficulty"
              :show-label="isConnected"
              :active="isConnected"
              :slider-height="`${activityHeight}px`"
              />
        </div>
      </div>
    </div>
    <div class="row justify-center full-width q-pt-md">
        
    </div>
  </q-page>
</template>

<script>
import MusicControlPanel from 'components/MusicSession/MusicControlPanel';
import TheraVSlider from 'components/UI/TheraVSlider';
import LineGraph from 'components/MusicSession/LineGraph';
import { defineComponent } from '@vue/composition-api';
import { mapActions, mapGetters } from 'vuex';
import { useGenerateAvatarPath } from 'components/UserSession/AvatarSelection';
import { mapState } from 'vuex';
import JBtnL from 'components/UI/JBtnL';
import { LocalStorage } from 'quasar';
import { TransportState } from 'src/store/music-library/state';
import PendingConnectionPanel from 'components/PendingConnectionPanel';

export default defineComponent({
  name: 'PageIndex',
  components: {
    MusicControlPanel,
    LineGraph,
    JBtnL,
    TheraVSlider,
    PendingConnectionPanel
  },
  setup() {
    return {
      ...useGenerateAvatarPath()
    };
  },
  computed: {
    ...mapState('cyclingSession', [
      'showSessionFinished',
      'connection',
      'sessionState'
    ]),
    ...mapState('musicLibrary', ['selectedSession', 'transportState', 'loadingSong']),
    ...mapState('userLibrary', ['globalDifficulty', 'outputRange']),
    ...mapGetters('userLibrary', ['getSelectedUser']),
    showPendingConnectionPanel() {
      return this.connection === 'Searching';
    },
    isPlaying() {
      return this.transportState === TransportState.Playing;
    },
    showNextSteps() {
      return !this.isPlaying;
    },
    isConnected() {
      return this.connection !== 'Searching';
    },
    screenWidth() {
      console.log(this.$q.screen.width);
      return this.$q.screen.width;
    },
    screenHeight() {
      return this.$q.screen.height;
    },
    activityHeight() {
      return this.screenHeight * 0.33;
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
    }
  },
  methods: {
    ...mapActions('userLibrary', ['showUserLibrary', 'setDifficulty']),
    ...mapActions('musicLibrary', ['showMusicLibrary']),
    ...mapActions('cyclingSession', ['toggleConnectionPanel']),
    ...mapActions('panels', ['showSliderHelp']),
    getLocalizedSessionProp(session, property) {
      console.log(session)
      if (session.i18n && session.i18n[this.$i18n.locale]) {
        const prop = session.i18n[this.$i18n.locale][property];
        return prop ? prop : session[property]
      } else {
        return session[property]
      }
    },
  },
  mounted() {
    LocalStorage.set('last-online-login', Date.now());
  }
});
</script>

<style lang="sass" scoped>
.song-cover-gray
  filter: grayscale(100%)

.circle-image-clip
  clip-path: circle(3.25rem at center)

.overlay-text
  position: absolute
  top: 28rem
  left: 0
  right: 0
  margin-left: auto
  margin-right: auto
  width: 30rem
  text-align: center
</style>
