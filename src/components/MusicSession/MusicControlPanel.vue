<template>
  <div class="row items-center justify-center no-wrap" style="width: 100%">
    <div style="width: 6rem; padding-left: 6.5rem;">
    </div>
    <div class="q-pr-lg">
      <q-btn
        :color="!loadingSong && isConnected ? 'accent' : 'dark'"
        text-color="white"
        round
        :class="isConnected ? 'shadow-8' : ''"
        @click="previousSong"
        :disable="loadingSong || !isConnected"
        style="height: 6.5rem; width: 6.5rem;"
        >
        <q-icon name="skip_previous" size="4rem" />
      </q-btn>
      <!-- <j-btn-circle @click="() => { if (currentSong && !loadingSong) { togglePlay() } }" :disabled="!currentSong || loadingSong">
        <q-icon v-if="isPlaying" name="svguse:btn-pause.svg#pause" />
        <q-icon v-else name="svguse:btn-play.svg#play" />
      </j-btn-circle> -->
    </div>
    <transition mode="out-in" appear name="fade">
      <div v-if="loadingSong" class="q-pl-xs row justify-center items-center no-wrap" :key="'session-loading'" style="min-width: 15rem;">
        <div class="t-h1 text-grey-6 q-pr-md text-capitalize" style="min-width: 10rem;">
          {{ $t('musicControl.loadingSong') }}
        </div>
        <div>
          <q-spinner-oval size="md" color="accent" />
        </div>
      </div>
      <div v-else class="q-pl-xs column items-center justify-center" :key="'current-song'" style="min-width: 15rem; max-width: 15rem;">
        <div class="text-h4 text-primary text-center q-px-sm q-pt-sm" :class="!previewSong ? 'text-capitalize' : ''" style="max-width: 300px;">
          {{ previewSong ? previewSong.title : $t('musicControl.noTitleSelected') }}
        </div>
        <!-- <div class="t-small text-grey-7 q-pt-xs text-center" >
          {{ previewSong ? previewSong.author : $t('musicControl.hint') }}
        </div> -->
      </div>
    </transition>
    <div class="q-pl-lg q-pr-lg">
      <q-btn
        :color="!loadingSong && isConnected ? 'accent' : 'dark'"
        text-color="white"
        round
        :class="isConnected ? 'shadow-8' : ''"
        @click="nextSong"
        :disable="loadingSong || !isConnected"
        style="height: 6.5rem; width: 6.5rem;"
        >
        <q-icon name="skip_next" size="4rem" />
      </q-btn>
    </div>
    <div class="">
      <q-btn
        :color="muted ? 'negative' : 'secondary'"
        :text-color="muted ? 'white' : 'dark'"
        round
        :class="isConnected ? 'shadow-8' : ''"
        size="xl"
        @click="() => { toggleMute() }"
        :disable="!isConnected"
        style="height: 6.5rem; width: 6.5rem;"
        >
        <q-icon name="volume_off" size="4rem" />
      </q-btn>
    </div>
  </div>
</template>

<script lang="js">
import { debounce } from 'quasar';
import { mapState, mapActions, mapGetters } from 'vuex';
import { SessionState, TransportState } from 'src/store/music-library/state';
import { listen } from '@tauri-apps/api/event';
// import JSlider from 'components/UI/JSlider';
import { play_next_song, set_next_song_index, subscribe_for_session_player_state } from 'tauri-plugin-jymmin-audio-core-api';

export default {
  components: { /* JBtnCircle, JSlider */ },
  data() {
    return {
      currentSessionTitle: 'Klassik',
      showVolumeControl: false,
      volumeValueCached: 0,
      transportControlState: 'paused',
      songIsFadingOut: false,
      prevSongId: null,
      previewSongTimeout: null
    };
  },
  computed: {
    ...mapState('cyclingSession', ['connection']),
    ...mapState('musicLibrary', ['muted', 'currentSong', 'previewSong', 'selectedSession', 'transportState', 'masterVolume', 'loadingSong']),
    ...mapGetters('musicLibrary', ['numSongsInSelectedSession', 'previewSongIndex']),
    cannotSkip () { return !this.nextSongIsReady || this.loadingSong || !this.selectedSession },
    isConnected() { return this.connection === 'Connected' },
    sessionIsLoading () {
      if (this.selectedSession) {
        return this.selectedSession.state === SessionState.Loading;
      } else {
        return false;
      }
    },
    isPlaying() {
      return this.transportState === TransportState.Playing;
    }
  },
  methods: {
    ...mapActions('musicLibrary', ['songPlay', 'songPause', 'songStop', 'setMasterVolume', 'toggleMute']),
    ...mapActions('musicLibrary', ['updateSessionState', 'setLoadingSong', 'previewNextSong', 'previewPreviousSong']),
    async nextSong () {
      if (this.previewSongIndex !== undefined) {
        this.previewNextSong();
        await set_next_song_index(this.previewSongIndex)
        this.playNextSongIn(800);
      }
    },
    async previousSong () {
      if (this.previewSongIndex !== undefined) {
        this.previewPreviousSong();
        await set_next_song_index(this.previewSongIndex)
        this.playNextSongIn(800);
      }
    },
    async playNextSongIn(ms) {
      if (this.previewSongTimeout !== null) {
        clearTimeout(this.previewSongTimeout)
      }
      this.previewSongTimeout = setTimeout(async () => {
        if (this.previewSong.id !== this.currentSong.id) { 
          await play_next_song()
        }
      }, ms);
    },
    togglePlay () {
      if (this.transportState === TransportState.Stopped || this.transportState === TransportState.Paused) {
        this.songPlay()
      } else if (this.transportState === TransportState.Playing) {
        // We deactivate pause for now.
        // There are some cases with module clocks, that are confusing.
        this.songPause()
        // instead we always stop the song
        // this.songStop()
      }
    },
  },
  created () {
    this.setMasterVolume = debounce(this.setMasterVolume, 5)
  },
  async mounted () {
    this.sessionPlayerStateListener = listen('session-player-state', (e) => {
      const message = e.payload;
      console.log(message);
      this.updateSessionState(message);
      // if (message.next_song['Loading']) {
      //   console.log('LOADING')
      //   this.nextSongIsReady = false
      // } else if (message.next_song['Loaded']) {
      //   console.log('LOADED')
      //   this.nextSongIsReady = true
      // }
    });
    await subscribe_for_session_player_state();
  },
  beforeDestroy () {
    if (this.sessionPlayerStateListener) {
      this.sessionPlayerStateListener()
    }
  }
};
</script>

<style lang="sass" scoped>
.fade-enter-active, .fade-leave-active
  transition: opacity .5s

.fade-enter, .fade-leave-to
  opacity: 0

@keyframes blink
  0%
    background-color: rgba(240, 240, 240, 0.3)

  50%
    background-color: rgba(102, 183, 126, 0.2)

  100%
    background-color: rgba(240, 240, 240, 0.3)

@-webkit-keyframes blink
  0%
    background-color: rgba(230, 230, 230, 1)

  50%
    background-color: rgba(230, 230, 230, 0.5)

  100%
    background-color: rgba(230, 230, 230, 1)

.song-loading
  -moz-transition: all 0.5s ease-in-out
  -webkit-transition: all 0.5s ease-in-out
  -o-transition: all 0.5s ease-in-out
  -ms-transition: all 0.5s ease-in-out
  transition: all 0.5s ease-in-out
  -moz-animation: blink normal 1.5s infinite ease-in-out

  /* Firefox
  -webkit-animation: blink normal 1.5s infinite ease-in-out

  /* Webkit
  -ms-animation: blink normal 1.5s infinite ease-in-out

  /* IE
  animation: blink normal 1.5s infinite ease-in-out

  /* Opera
</style>
