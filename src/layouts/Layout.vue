<template>
<fragment>
    <Header></Header>
    <Main></Main>
</fragment>
</template>

<script>
import Header from "../layouts/Header";
import Main from "../layouts/Main";
export default {
    name: "Layout",
    components: {
        Header,
        Main
    }
};
</script>
