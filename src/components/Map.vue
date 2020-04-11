<template>
    <div id="mapContainer"></div>
</template>

<script>
import { create, color } from '@amcharts/amcharts4/core';
import { MapChart, MapPolygonSeries, projections } from '@amcharts/amcharts4/maps';
import worldLow from '@amcharts/amcharts4-geodata/worldLow';

export default {
    props: {
        countries: { type: Array, required: true },
        allowZoom: { type: Boolean, default: true },
        center: { type: Object, default: null },
    },
    data () {
        return {
            map: null
        };
    },
    mounted () {
        this.map = create('mapContainer', MapChart);

        this.map.geodata = worldLow;
        this.map.projection = new projections.Miller();

        if (!this.allowZoom) {
            this.map.seriesContainer.draggable = false;
            this.map.seriesContainer.resizable = false;
            this.map.maxZoomLevel = 1;
        }

        this.map.seriesContainer.events.disableType('doublehit');
        this.map.chartContainer.background.events.disableType('doublehit');

        // Background series
        const series = new MapPolygonSeries();

        series.mapPolygons.template.fill = color('#aaaaaa');
        series.exclude = ['AQ'];
        series.useGeodata = true;

        if (this.center) {
            this.map.homeGeoPoint = this.center;
            this.map.homeZoomLevel = 1.5;
        }

        this.map.series.push(series);

        this.updateData();
    },
    methods: {
        updateData () {
            const series = new MapPolygonSeries();

            series.mapPolygons.template.tooltipText = '{name} {value}';
            // series.mapPolygons.template.tooltipText = '{name}';
            series.tooltip.background.filters.clear();
            series.tooltip.getFillFromObject = false;
            series.tooltip.background.fill = color('#aaa');

            series.mapPolygons.template.fill = color('#aaaaaa');
            series.mapPolygons.template.propertyFields.fill = 'fill';
            series.exclude = ['AQ'];
            series.useGeodata = true;

            series.data = this.countries;

            // series.slices.template.getFillFromObject = false;
            // const hover = series.mapPolygons.template.states.create('hover');

            if (this.map.series.length > 1) {
                this.map.series.removeIndex(1).dispose();
            }

            this.map.series.push(series);
        }
    },
    destroyed () {
        this.map.dispose();
    }
};
</script>
