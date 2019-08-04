<template>
<div class="main-container">
    <router-view :key="key"></router-view>
</div>
</template>

<script>
// import Footer from "@VUE/components/Footer";
export default {
    name: "Main",
    components: {
        // Footer
    },
    computed: {
        key() {
            return this.$route.fullPath;
        }
    }
};
</script>
