<template>
    <div class="container">
        <div class="options">
            <Help />
            <DataToggle :data-type="dataType" @click.native="changeDataType()" />
        </div>

        <Loading v-if="loading" />
        <Map v-else class="map" :countries="countries" />

        <!-- <DatePicker v-model="dateRange" /> -->
    </div>
</template>

<script>
import * as interpolate from 'color-interpolate';
import { loadData } from '@/lib/data';
import Help from '@/components/Help';
import DataToggle from '@/components/DataToggle';
import Map from '@/components/Map';
import Loading from '@/components/Loading';
import DatePicker from '@/components/DatePicker';

// TODO

// High:
// - Confirm calculation is correct / useful
// - Get data working for grey countries
// - Fix Hong Kong etc like in other versions
// - Date range slider to pick dates for calculation
// - Finalise colour scheme!
// - Improve map tooltips

// Low:
// - Show details of country in another panel while hovering / on click?
// - Fade map in
// - Zoom to geo coords
// - Download data sets and save to local storage for quicker subsequent loads on same day
// - Get data per US state

// Done:
// - Toggle between confirmed cases and deaths

// const gradient = ['#017a29', '#c7c214', '#c40707'];
// const gradient = ['#447c46', '#5b995e', '#81c784', '#d0855c', '#c84646'];
// const gradient = ['#440154', '#414487', '#2a788e', '#22a884', '#7ad151', '#fde725'];
// const gradient = ['#006837', '#1A9850', '#66BD63', '#D73027', '#A50026'];

const goodGradient = ['#4CAF50', '#C8E6C9'];
const badGradient = ['#FFECB3', '#EF5350'];

export default {
    name: 'Home',
    components: {
        DataToggle,
        DatePicker,
        Help,
        Loading,
        Map
    },
    data () {
        return {
            loading: true,
            dataType: 'cases',
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

            const max = 1;
            const min = -1;

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
    padding: 2em;
}

.map {
    flex: 1;
}

.range {
    height: 50px;
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
