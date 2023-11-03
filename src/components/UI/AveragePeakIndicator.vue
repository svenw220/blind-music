<template>
    <q-circular-progress
              show-value
              :min="min"
              :max="max"
              :angle="180"
              :value="average"
              :size="size"
              :color="color"
              track-color="dark"
              class="q-ma-md"
              >
              <div class="column">
                <div class="row t-h1" :class="`text-${color}`">
                <div class="q-pr-sm">ø</div> 
                <div >{{ average }}</div>
                <div class="t-body">
                    {{ unit }}
                </div>
                </div>
                <div class="row t-body text-primary">
                    <div>
                        <q-icon name="img:peak_icon.png"  class="q-pr-sm q-pb-xs" />
                    </div> 
                  <div class=""> {{ peak }} {{ unit }}</div>
                </div>
              </div>
            </q-circular-progress>
</template>

<script>
export default {
  name: 'AveragePeakIndicator',
  props: ['average', 'peak', 'min', 'max', 'size', 'unit', 'color']
}
</script>
