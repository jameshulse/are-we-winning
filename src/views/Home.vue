<template>
    <Loading v-if="loading" />
    <div v-else class="container">
        <div class="options">
            <Help />
            <DataToggle :data-type="dataType" @click.native="changeDataType()" />
        </div>
        <Map class="map" :countries="countries" />
        <ejs-slider id="range" min="1" max="20" v-model="dateRange" type="Range"></ejs-slider>
    </div>
</template>

<script>
import Vue from 'vue';
import * as interpolate from 'color-interpolate';
import { SliderPlugin } from '@syncfusion/ej2-vue-inputs';
import { loadData } from '@/lib/data';
import Help from '@/components/Help';
import DataToggle from '@/components/DataToggle';
import Map from '@/components/Map';
import Loading from '@/components/Loading';

// TODO
// - Fade map etc in
// - Date range slider to pick dates for calculation
// - Toggle between confirmed cases and deaths
// - Download data sets and save to local storage for quicker subsequent loads on same day
// - Confirm calculation is correct / useful
// - Get data working for grey countries
// - Finalise colour scheme!

Vue.use(SliderPlugin);

// const gradient = ['#017a29', '#c7c214', '#c40707'];
// const gradient = ['#447c46', '#5b995e', '#81c784', '#d0855c', '#c84646'];
// const gradient = ['#440154', '#414487', '#2a788e', '#22a884', '#7ad151', '#fde725'];
// const gradient = ['#006837', '#1A9850', '#66BD63', '#D73027', '#A50026'];

const goodGradient = ['#4CAF50', '#C8E6C9'];
const badGradient = ['#FFECB3', '#EF6C00'];

export default {
    name: 'Home',
    components: {
        DataToggle,
        Help,
        Loading,
        Map
    },
    data () {
        return {
            loading: true,
            dataType: 'cases',
            dateRange: null,
            countries: null
        };
    },
    async created () {
        await this.loadData();
    },
    computed: {
        periodLength () {
            return 7; // Default to 7 days
        }
    },
    watch: {
        dataType () {
            this.loadData();
        }
    },
    methods: {
        async loadData () {
            this.loading = true;

            const data = await loadData(this.dataType, this.periodLength);

            const max = 8;
            const min = -8;

            const goodColormap = interpolate(goodGradient);
            const badColormap = interpolate(badGradient);
            const normalize = x => (Math.max(Math.min(x, max), min) + Math.abs(min)) / (Math.abs(max) + Math.abs(min));

            this.countries = data.map(c => ({
                id: c.id,
                gradient: c.gradient,
                fill: c.gradient === 0
                    ? '#C8E6C9'
                    : (c.gradient < 0 ? goodColormap(normalize(c.gradient)) : badColormap(normalize(c.gradient)))
            }));

            this.loading = false;
        },
        changeDataType () {
            this.dataType = this.dataType === 'cases' ? 'deaths' : 'cases';
        }
    }
};
</script>

<style>

.container {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    height: 100%;
}

.map {
    flex: 1;
}

.options {
    z-index: 1;
    position: absolute;
    left: 10px;
    top: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.options > * {
    margin-bottom: 1em;
}

.fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
    opacity: 0;
}

</style>
