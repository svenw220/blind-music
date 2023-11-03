<template>
  <q-card class="bg-secondary text-primary disable-select" style="height: 38rem; min-width: 68rem; border-radius: 5px;">
    <q-toolbar class="bg-secondary q-pa-none items-start" style="height: 3rem;">
        <div class="col-2 q-pa-none justify-start items-start">
          <q-btn color="accent" text-color="secondary" v-close-popup style="height: 3.2rem; width: 3.2rem;">
              <q-icon name="close" style="height: 2rem;">  
              </q-icon>
          </q-btn>
        </div>
        <div class="col-8 text-center">
          <span class="t-h1">
            {{ $t('sessionFinishedPanel.title') }}
          </span>
        </div>
        <div class="col-2 text-right">
          <span class="q-pr-md">
            Date: {{ today() }}
          </span>
        </div>
        
    </q-toolbar>
    
    <q-card-section class="q-pt-lg">
        <div class="row full-width justify-center">
          <div class="col-3">
            <div class="q-pb-sm">
              <q-card>
                <q-card-section class="t-body">
                  {{ $t('sessionFinishedPanel.exerciseTime') }}
                </q-card-section>
                <q-card-section class="t-body-bold">
                  {{ Math.floor(sessionResults.duration / 60) }} min {{ Math.floor(sessionResults.duration % 60) }} s
                </q-card-section>
              </q-card>
            </div>
            <div class="q-pb-sm">
              <q-card>
                <q-card-section class="t-body">
                  {{ $t('sessionFinishedPanel.averageSpeed') }}
                </q-card-section>
                 <q-card-section >
                  <span class="t-body-bold">{{ Math.floor(sessionResults.meanRpm) }}</span> 
                  <span class="t-body q-pl-xs">{{ $t('sessionFinishedPanel.rpm') }}</span>
                 </q-card-section>
              </q-card>
            </div>
            <div class="q-pb-sm">
              <q-card>
                <q-card-section class="t-body">
                  {{ $t('sessionFinishedPanel.averagePower') }}
                </q-card-section>
                <q-card-section>
                  <span class="t-body-bold">{{ Math.floor(sessionResults.meanPower) }}</span> 
                  <span class="t-body q-pl-xs">W</span>
                </q-card-section>
              </q-card>
            </div>
            <div>
              <q-card>
                <q-card-section class="t-body">
                  {{ $t('sessionFinishedPanel.yourPlaylist') }}
                </q-card-section>
                <q-card-section>
                  <span class="t-body-bold">{{ selectedSession ? selectedSession.title : 'nothing.' }}</span> 
                </q-card-section>
              </q-card>
            </div>
          </div>
          <div class="col-9 justify-start">
            <div class="row justify-center">
              <div>
                <q-card>
                  <q-card-section>
                   <line-chart style="height: 18rem; width: 42rem;"/>
                  </q-card-section>
                  <q-card-section>
                    <div class="row justify-center full-width items-center">
                      <div class="legend q-pa-sm"></div> 
                      <div class="q-pl-xs">= {{ $t('sessionFinishedPanel.power') }}</div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
            <div class="row justify-center items-center q-pt-md">
              <div>
                <q-btn color="accent" label="Ok" v-close-popup class="q-px-lg" size="lg"/>
              </div>
            </div>
          </div>
        </div>
    </q-card-section>
    <!-- <q-card-actions vertical align="center" class="q-pt-xl">
      <q-btn color="accent" label="Ok" v-close-popup />
    </q-card-actions> -->
  </q-card>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import LineChart from './LineChart';

export default {
  components: {
    LineChart
  },
  props: {
    value: Boolean
  },
  computed: {
    ...mapState('cyclingSession', ['sessionResults']),
    ...mapGetters('userLibrary', ['getSelectedUser']),
    ...mapState('musicLibrary', ['selectedSession']),
    difficulty: {
      get() {
        return this.getSelectedUser ? this.getSelectedUser.difficulty : 5;
      },
      set(value) {
        this.setDifficulty(value);
      }
    }
  },
  methods: {
    ...mapActions('userLibrary', ['showUserLibrary', 'setDifficulty']),
    today () {
      var today = new Date();
      return `${today.getDate()}.${today.getMonth()+1}.${today.getFullYear()}`;
    }
  }
};
</script>

<style lang="sass" scoped>
.legend
  background-color: #5885ad
  height: 1rem
  width: 1rem
</style>
