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

import { loadData } from '@/lib/data';
import Map from '@/components/Map';

export default {
    name: 'Home',
    components: {
        Map
    },
    data () {
        return {
            loading: true,
            country: 'United Kingdom'
        };
    },
    async created () {
        this.countries = await loadData();

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
