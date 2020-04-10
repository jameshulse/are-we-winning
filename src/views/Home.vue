<template>
    <Loading v-if="loading" />
    <div v-else class="container">
        <!-- <h1 class="title">Are We Winning?</h1> -->
        <Help />
        <Map class="map" :countries="countries" />
    </div>
</template>

<script>
import * as interpolate from 'color-interpolate';
import { loadData } from '@/lib/data';
import Help from '@/components/Help';
import Map from '@/components/Map';
import Loading from '@/components/Loading';

// const gradient = ['#017a29', '#c7c214', '#c40707'];
// const gradient = ['#447c46', '#5b995e', '#81c784', '#d0855c', '#c84646'];
// const gradient = ['#440154', '#414487', '#2a788e', '#22a884', '#7ad151', '#fde725'];
// const gradient = ['#006837', '#1A9850', '#66BD63', '#D73027', '#A50026'];

const goodGradient = ['#4CAF50', '#C8E6C9'];
const badGradient = ['#FFECB3', '#EF6C00'];

export default {
    name: 'Home',
    components: {
        Help,
        Loading,
        Map
    },
    data () {
        return {
            loading: true,
            countries: null
        };
    },
    async created () {
        const data = await loadData();

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
};
</script>

<style>

.container {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    /* padding: 3em; */
    height: 100%;
}

.map {
    flex: 1;
}

.fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
}

</style>
