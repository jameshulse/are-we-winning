<template>
    <div class="toggle" @click="changeDataType()">
        <svg v-if="value === 'cases'" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="notes-medical" class="svg-inline--fa fa-notes-medical fa-w-12" role="img" viewBox="0 0 384 512"><path fill="currentColor" d="M336 64h-80c0-35.3-28.7-64-64-64s-64 28.7-64 64H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48zM192 40c13.3 0 24 10.7 24 24s-10.7 24-24 24-24-10.7-24-24 10.7-24 24-24zm96 304c0 4.4-3.6 8-8 8h-56v56c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8v-56h-56c-4.4 0-8-3.6-8-8v-48c0-4.4 3.6-8 8-8h56v-56c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v56h56c4.4 0 8 3.6 8 8v48zm0-192c0 4.4-3.6 8-8 8H104c-4.4 0-8-3.6-8-8v-16c0-4.4 3.6-8 8-8h176c4.4 0 8 3.6 8 8v16z"/></svg>
        <svg v-else-if="value === 'deaths'" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="skull" class="svg-inline--fa fa-skull fa-w-16" role="img" viewBox="0 0 512 512"><path fill="currentColor" d="M256 0C114.6 0 0 100.3 0 224c0 70.1 36.9 132.6 94.5 173.7 9.6 6.9 15.2 18.1 13.5 29.9l-9.4 66.2c-1.4 9.6 6 18.2 15.7 18.2H192v-56c0-4.4 3.6-8 8-8h16c4.4 0 8 3.6 8 8v56h64v-56c0-4.4 3.6-8 8-8h16c4.4 0 8 3.6 8 8v56h77.7c9.7 0 17.1-8.6 15.7-18.2l-9.4-66.2c-1.7-11.7 3.8-23 13.5-29.9C475.1 356.6 512 294.1 512 224 512 100.3 397.4 0 256 0zm-96 320c-35.3 0-64-28.7-64-64s28.7-64 64-64 64 28.7 64 64-28.7 64-64 64zm192 0c-35.3 0-64-28.7-64-64s28.7-64 64-64 64 28.7 64 64-28.7 64-64 64z"/></svg>

        <div class="tooltip">
            <p>Data based on {{ value === 'cases' ? 'confirmed cases' : 'deaths' }} by country.</p>
            <p>Click to change.</p>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        value: { type: String, required: true, validator: (v) => ['cases', 'deaths'].includes(v) },
    },
    methods: {
        changeDataType () {
            this.$emit('input', this.value === 'cases' ? 'deaths' : 'cases');
        }
    }
};
</script>

<style scoped lang="scss">

.toggle {
    width: 40px;
    height: 40px;
    cursor: pointer;
    color: #9a9a9a;
    position: relative;

    &:hover {
        color: #565656;
    }

    svg {
        position: absolute;
        top: 50%;
        left: 0;
        height: 100%;
        width: 100%;
        transform: translateY(-50%);
    }

    p {
        margin: 0;
    }
}

.tooltip {
    display: none;
    width: 300px;
}

.toggle:hover .tooltip {
    position: absolute;
    top: 0px;
    left: 60px;
    display: block;
    background: white;
    border: 1px solid black;
    padding: 0.5em;
}

</style>
