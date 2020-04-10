<template>
    <div id="mapContainer"></div>
</template>

<script>
import { create, color } from '@amcharts/amcharts4/core';
import { MapChart, MapPolygonSeries } from '@amcharts/amcharts4/maps';
import worldLow from '@amcharts/amcharts4-geodata/worldLow';

export default {
    props: {
        countries: { type: Array, required: true }
    },
    data () {
        return {
            map: null
        };
    },
    mounted () {
        this.map = create('mapContainer', MapChart);

        this.map.geodata = worldLow;
        this.map.seriesContainer.draggable = false;
        this.map.seriesContainer.resizable = false;
        this.map.maxZoomLevel = 1;
        this.map.seriesContainer.events.disableType('doublehit');
        this.map.chartContainer.background.events.disableType('doublehit');

        const series = new MapPolygonSeries();

        series.mapPolygons.template.tooltipText = '{name}';
        series.mapPolygons.template.fill = color('#74B266');
        series.exclude = ['AQ'];

        // const hover = series.mapPolygons.template.states.create('hover');

        series.useGeodata = true;

        this.map.series.push(series);
    }
};
</script>

<style scoped>

#mapContainer {
    width: 100%;
    height: 100%;
}

</style>
