<template functional>
    <div class="help">
        <div class="opener">
            <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="question-circle" class="svg-inline--fa fa-question-circle fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 448c-110.532 0-200-89.431-200-200 0-110.495 89.472-200 200-200 110.491 0 200 89.471 200 200 0 110.53-89.431 200-200 200zm107.244-255.2c0 67.052-72.421 68.084-72.421 92.863V300c0 6.627-5.373 12-12 12h-45.647c-6.627 0-12-5.373-12-12v-8.659c0-35.745 27.1-50.034 47.579-61.516 17.561-9.845 28.324-16.541 28.324-29.579 0-17.246-21.999-28.693-39.784-28.693-23.189 0-33.894 10.977-48.942 29.969-4.057 5.12-11.46 6.071-16.666 2.124l-27.824-21.098c-5.107-3.872-6.251-11.066-2.644-16.363C184.846 131.491 214.94 112 261.794 112c49.071 0 101.45 38.304 101.45 88.8zM298 368c0 23.159-18.841 42-42 42s-42-18.841-42-42 18.841-42 42-42 42 18.841 42 42z"></path></svg>
        </div>

        <div ref="panel" class="panel">
            <p>
                The fight against COVID-19 is being waged across the globe. This visualisation shows which countries are winning against exponential growth.
                Countries are colour coded to represent the rate at which infection is spreading. Green countries have fought back against the growth and the number
                of new cases per day are decreasing. For countries in red their cases per day are increasing.
            </p>
        </div>
    </div>
</template>

<script>
export default {
    // data () {
    //     return {
    //         isOpen: false
    //     };
    // },
    // methods: {
    //     toggle (e) {
    //         this.isOpen = !this.isOpen;

    //         if (this.isOpen) {
    //             document.addEventListener('click', this.closeOnOutsideClick);
    //         }

    //         e.stopPropagation();
    //     },
    //     closeOnOutsideClick (e) {
    //         this.isOpen = false;

    //         document.removeEventListener('click', this.closeOnOutsideClick);
    //     }
    // }
};
</script>

<style scoped>

.help {
    position: relative;
}

.opener {
    width: 50px;
    height: 50px;
    cursor: pointer;
    color: #9a9a9a;
}

.help:hover .panel {
    display: block;
}

.panel {
    display: none;
    position: absolute;
    left: 60px;
    top: 0px;
    border: 1px solid #565656;
    background: white;
    width: 300px;
    padding: 1em;
    z-index: 1;
}

.opener:hover {
    color: #565656;
}

</style>
