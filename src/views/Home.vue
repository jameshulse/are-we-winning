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

import data from '@/lib/data';
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
        this.countries = await data.load();

        this.loading = false;
    },
};
</script>

<style>

.container {
    padding: 3em;
    height: 100%;
}

</style>
