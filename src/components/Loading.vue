<template functional>
    <div class="loader">
        <span class="text">Loading...</span>
    </div>
</template>

<script>
export default {
    props: {
        progress: { type: Number, default: 0 },
    }
};
</script>

<style scoped>

.loader {
    position: relative;
    width: 100%;
    height: 100%;
}

.text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

</style>
