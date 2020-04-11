<template>
    <div class="container">
        <div class="options">
            <Help />
            <DataToggle v-model="dataType" />
            <Github />
        </div>

        <Loading v-if="loading" />

        <template v-else>
            <!-- <keep-alive> -->
                <Map class="map" :countries="countries" :center="location" />
            <!-- </keep-alive> -->

            <DatePicker
                v-model="dateRange"
                :min-date="minimumDate"
                :max-date="maximumDate"
            />
        </template>
    </div>
</template>

<script>
import * as interpolate from 'color-interpolate';
import { addDays } from 'date-fns';
import { getCountryRates } from '@/lib/data';
import { debounce } from '@/lib/utils';
import Help from '@/components/Help';
import DataToggle from '@/components/DataToggle';
import Map from '@/components/Map';
import Loading from '@/components/Loading';
import DatePicker from '@/components/DatePicker';
import Github from '@/components/Github';

// TODO

// High:
// - Confirm calculation is correct / useful
// - Fix Hong Kong etc like in other versions
// - Finalise colour scheme!
// - Improve map tooltips

// Low:
// - Get data working for remaining grey countries
// - Show details of country in another panel while hovering / on click?
// - Fade map in
// - Zoom to geo coords
// - Local storage of data type toggle
// - Get data per US state

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
        Github,
        Help,
        Loading,
        Map
    },
    data () {
        return {
            loading: true,
            dataType: localStorage.getItem('data-type') ?? 'cases',
            countries: null,
            minimumDate: null,
            maximumDate: null,
            dateRange: null,
            location: null,
            slowLoad: debounce(this.loadData, 1000)
        };
    },
    async created () {
        await this.getIpLocation();
        await this.loadData();
    },
    computed: {
        periodLength () {
            return 7; // Default to 7 days
        }
    },
    watch: {
        dataType () {
            localStorage.setItem('data-type', this.dataType);

            this.loadData();
        },
        dateRange (newValue, oldValue) {
            if (oldValue === null) {
                return;
            }

            this.slowLoad();
        }
    },
    methods: {
        async loadData () {
            this.loading = true;

            const { result, lastDate } = await getCountryRates(this.dataType, this.dateRange, 'logarithmic');

            if (!this.dateRange) {
                this.saveDateRange(lastDate);
            }

            const max = 1;
            const min = -1;

            const goodColormap = interpolate(goodGradient);
            const badColormap = interpolate(badGradient);
            const normalize = x => (Math.max(Math.min(x, max), min) + Math.abs(min)) / (Math.abs(max) + Math.abs(min));

            this.countries = result.map(c => ({
                id: c.id,
                value: c.angle,
                fill: c.gradient === 0
                    ? '#C8E6C9'
                    : (c.gradient < 0 ? goodColormap(normalize(c.gradient)) : badColormap(normalize(c.gradient)))
            }));

            this.loading = false;
        },
        async getIpLocation () {
            const response = await fetch('https://ipapi.co/json');
            const data = await response.json();

            this.location = {
                latitude: data.latitude,
                longitude: data.longitude
            };
        },
        saveDateRange (lastDate) {
            this.maximumDate = lastDate;
            this.minimumDate = addDays(lastDate, -30);
            this.dateRange = [addDays(lastDate, -7), lastDate];
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
    padding: 3.5em;
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
    background: #fafafa;
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
