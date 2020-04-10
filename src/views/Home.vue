<template>
    <Loading v-if="loading" />
    <div v-else class="container">
        <transition name="fade">
            <Map :countries="countries" />
        </transition>
    </div>
</template>

<script>
import * as interpolate from 'color-interpolate';
import { loadData } from '@/lib/data';
import Map from '@/components/Map';
import Loading from '@/components/Loading';

const gradient = ['#017a29', '#c7c214', '#c40707'];
// const gradient = ['#440154', '#414487', '#2a788e', '#22a884', '#7ad151', '#fde725'];
// const gradient = ['#006837', '#1A9850', '#66BD63', '#D73027', '#A50026'];

export default {
    name: 'Home',
    components: {
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

        const colormap = interpolate(gradient);
        const normalize = x => (Math.max(Math.min(x, max), min) + Math.abs(min)) / (Math.abs(max) + Math.abs(min));

        this.countries = data.map(c => ({
            id: c.id,
            gradient: c.gradient,
            fill: colormap(normalize(c.gradient))
        }));

        this.loading = false;
    },
};
</script>

<style>

.container {
    box-sizing: border-box;
    /* padding: 3em; */
    height: 100%;
}

.fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
}

</style>
