<template>
    <div>
        <ejs-slider
            min="1"
            :tooltip="tooltip"
            @rendering-ticks="onRenderingTicks"
            @tooltip-change="onTooltipChange"
            :change="onChange"
            max="20" v-model="dateRange" type="Range"></ejs-slider>
    </div>
</template>

<script>
import Vue from 'vue';
import { addDays } from 'date-fns';
import { SliderPlugin } from '@syncfusion/ej2-vue-inputs';

Vue.use(SliderPlugin);

export default {
    props: {
        value: { type: Array, required: true },
    },
    data () {
        return {
            minVal: addDays(new Date(), -30).getTime(),
            maxVal: new Date().getTime(),
            stepSize: 86400000,
            dateRange: this.value,
            tooltip: { placement: 'Before', isVisible: true },
            ticks: { placement: 'After', largeStep: 2 * 86400000 }
        };
    },
    methods: {
        onChange (args) {
            this.$emit('value', this.dateRange);
        },
        onTooltipChange (args) {
            const totalMiliSeconds = Number(args.text);

            // Convert the current milliseconds to the respective date in desired format
            const custom = { year: 'numeric', month: 'short', day: 'numeric' };
            args.text = new Date(totalMiliSeconds).toLocaleDateString(
                'en-us',
                custom
            );
        },
        onRenderingTicks (args) {
            const totalMiliSeconds = Number(args.value);

            // Convert the current milliseconds to the respective date in desired format
            const custom = { year: 'numeric', month: 'short', day: 'numeric' };

            args.text = new Date(totalMiliSeconds).toLocaleDateString('en-us', custom);
        }
    }
};
</script>

<style>
@import '~@syncfusion/ej2-base/styles/material.css';
@import '~@syncfusion/ej2-buttons/styles/material.css';
@import '~@syncfusion/ej2-popups/styles/material.css';
@import '~@syncfusion/ej2-vue-inputs/styles/material.css';
</style>
