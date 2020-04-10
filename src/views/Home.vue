<template>
    <div v-if="loading" class="loading">
        Loading...
    </div>
    <div v-else class="container">
        <Map :countries="countries" />
    </div>
</template>

<script>
// Ideas:
// - Show world map in gradient from red -> green
// - Names : "us vs covid" "beat it"

import * as interpolate from 'color-interpolate';
import { loadData } from '@/lib/data';
import Map from '@/components/Map';

const gradient = ['#017a29', '#c7c214', '#c40707'];

export default {
    name: 'Home',
    components: {
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

        const max = 5;
        const min = -5;

        const colormap = interpolate(gradient);
        const normalize = x => (Math.max(Math.min(x, max), min) + Math.abs(min)) / (Math.abs(max) + Math.abs(min));

        this.countries = data.map(c => ({
            id: c.id,
            gradient: normalize(c.gradient),
            fill: colormap(normalize(c.gradient))
        }));

        this.loading = false;
    },
};
</script>

<style>

.container {
    box-sizing: border-box;
    padding: 3em;
    height: 100%;
}

</style>
