<template>
    <svg :height="`${height}px`" :width="`${width}px`" :viewBox="`0 0 ${width} ${height}`">
        <defs>
        <linearGradient id="difficultyGradient">
            <stop :stop-color="graphColor" stop-opacity="0" offset="0%" />
            <stop :stop-color="graphColor" stop-opacity="30%" offset="90%" />
            <stop :stop-color="graphColor" stop-opacity="0" offset="100%" />
        </linearGradient>
        
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="0deg">
            <polygon points="0 0, 10 3.5, 0 7" :stroke="graphColor" :fill="graphColor"/>
        </marker>
  
        </defs>
        <rect
            x="0"
            :y="height * (1.0 - outMax)"
            :width="`${width}`"
            :height="`${height - (height * (1.0 - outMax)) - (height * outMin)}`"
            fill="url(#difficultyGradient)"
        />
        <g :transform="`scale(${xZoom} 1.0)`">
            <polyline
                fill="none"
                :stroke="graphColor"
                stroke-width="2"
                :points="curvePath"
                marker-end="url(#arrowhead)"
                />
        </g>
        <!-- <circle :cx="latestPointCircle.cx" :cy="latestPointCircle.cy" :r="latestPointCircle.r" :fill="graphColor"/> -->
    </svg>
</template>

<script>
// import { ipcRenderer } from 'electron'
import { listen } from '@tauri-apps/api/event'
import { mapState, mapActions } from 'vuex'
import { TransportState } from 'src/store/music-library/state';

export default {
    props: ['height', 'width'],
    data () {
        return {
            dataPoints: [],
            animationInterval: null,
            backendListener: null,
            sessionStateListener: null,
            count: 0,
            value: 0.0,
            target: 0.0,
            step: 0.0,
            smoothingSteps: 20
        }
    },
    computed: {
        ...mapState('cyclingSession', ['sessionState']),
        ...mapState('userLibrary', ['outputRange']),
        ...mapState('musicLibrary', ['transportState']),
        isPlaying () { return this.transportState === TransportState.Playing },
        xZoom () {
            if (this.dataPoints.length > 0) {
                return  this.width / this.dataPoints.length
            } else {
                return 1.0
            }
        },
        graphColor () {
            return this.isPlaying ? '#1ba77e' : '#afafaf'
        },
        outMin () {
            return this.outputRange.min
        },
        outMax () {
            return this.outputRange.max
        },
        curvePath () {
            let straightLine = [];
            let lineLength = 20;
            for (var i = 0; i <= lineLength; i++) {
                straightLine.push(this.dataPoints[this.dataPoints.length - lineLength]);
            }
            return [...this.dataPoints.slice(0, this.dataPoints.length - lineLength), ...straightLine].map((v, i) => `${i},${(this.height - 1) - (v * (this.height - 2))}`).join(' ')
        },
        latestPointCircle () {
            const latest = this.dataPoints.length > 0 ? this.dataPoints[this.dataPoints.length - 1] : 0.0
            return {
                cx: `${this.width - 12}`,
                cy: `${(this.height - 1) - (latest * (this.height - 2))}`,
                r: '12'
            }
        }

    },
    methods: {
        ...mapActions('userLibrary', ['setOutputRange']),
        animateCurve () {
            // console.log(this.dataPoints)
            // TODO: implement cycling session state
            if (this.sessionState === 'Playing') {
                if (Math.abs(this.target - this.value) > 0.0001) {
                    this.value = this.value + this.step
                }
                this.dataPoints = this.dataPoints.slice(1)
                this.dataPoints.push(this.value)
                // this.dataPoints.push(Math.sin(this.count * 0.1) * 0.5 + 0.5)
                this.count += 1
            }
            this.animationInterval = window.requestAnimationFrame(this.animateCurve)
        },
        checkForOutputRangeUpdate (signals) {
            // console.log(signals)
            let id = Object.keys(signals).filter(k => {
                // console.log(signals[k])
                return signals[k].name === 'Output Range'
            })[0];
            if (id) {
                let outputRangeTuple = signals[id].signal_type['Range'];
                // console.log(outputRangeTuple)
                this.setOutputRange(outputRangeTuple)
            }
        },
        processSignals (data) {
            // console.log(data)
            this.checkForOutputRangeUpdate(data.signals)
            let id = Object.keys(data.signals).filter(k => {
                // console.log(data.signals[k])
                return data.signals[k].name === 'Activity'
            })[0];
            if (id !== undefined) {
                let activity_signal = data.signals[id].signal_type['Activity'];
                // console.log(activity_signal)
                this.target = activity_signal;
                this.step = (this.target - this.value) / this.smoothingSteps
            }
        },
        async initializeCyclingActivityCurve () {
            this.animationInterval = window.requestAnimationFrame(this.animateCurve)
            const unlisten = await listen('processed-signals', event => {
                this.processSignals(event.payload)
            })
            this.backendListener = unlisten
        },
        initSession () {
            this.dataPoints = Array.apply(this, new Array(Math.floor(this.width))).map(() => { return 0.0 })
            this.target = 0
            this.value = 0
        },
        addSessionStateListener () {
            this.sessionStateListener = listen('state-update', (e) => {    
                const message = e.payload;
                const action = `${message.store}/${message.action}`
                if (action === 'cyclingSession/updateSessionState') {
                    if (message.data === 'Stopped') {
                        this.initSession()
                    }
                }
            })
        },
        removeSessionStateListener () {
            this.sessionStateListener()
            this.sessionStateListener = null
        },
        clearAnimation () {
            if (this.animationInterval) {
                window.cancelAnimationFrame(this.animationInterval)
            }
            if (this.backendListener) {
                this.backendListener()
                this.backendListener = null
            }
        }
    },
    mounted () {
        this.addSessionStateListener()
        this.initSession()
        this.initializeCyclingActivityCurve()
    },
    beforeDestroy() {
        this.clearAnimation();
    }
};
</script>
