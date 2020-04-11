<template>
    <div>
        <ejs-slider
            v-model="dateRange"
            type="Range"
            :min="minValue"
            :max="maxValue"
            :tooltip="tooltip"
            :step="stepSize"
            :change="onChange"
            @tooltipChange="onTooltipChange"
        />
    </div>
</template>

<script>
import Vue from 'vue';
import { format } from 'date-fns';
import { SliderPlugin } from '@syncfusion/ej2-vue-inputs';

Vue.use(SliderPlugin);

export default {
    props: {
        value: { type: Array, required: true },
        minDate: { type: Date, required: true },
        maxDate: { type: Date, required: true },
    },
    data () {
        return {
            stepSize: 86400000,
            dateRange: [this.value[0].getTime(), this.value[1].getTime()],
            tooltip: { placement: 'Before', isVisible: true, showOn: 'Hover' },
        };
    },
    computed: {
        minValue () {
            return this.minDate.getTime();
        },
        maxValue () {
            return this.maxDate.getTime();
        }
    },
    methods: {
        onChange (args) {
            const [from, to] = this.dateRange;

            this.$emit('input', [new Date(from), new Date(to)]);
        },
        onTooltipChange (args) {
            const [fromMillis, toMillis] = args.value;

            const from = format(fromMillis, 'd/M/yy');
            const to = format(toMillis, 'd/M/yy');

            args.text = `${from} - ${to}`;
        },
    }
};
</script>

<style>
@import '~@syncfusion/ej2-base/styles/material.css';
@import '~@syncfusion/ej2-buttons/styles/material.css';
@import '~@syncfusion/ej2-popups/styles/material.css';
@import '~@syncfusion/ej2-vue-inputs/styles/material.css';
</style>
