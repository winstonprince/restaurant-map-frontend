<template>
<fragment>
    <Gmap></Gmap>
</fragment>
</template>

<script>
import Gmap from '@/components/Gmap.vue'
export default {
    name: 'Home',
    components: {
        Gmap
    },
    metaInfo: {
      title: 'Restaurants Maps',
      titleTemplate: 'Home - %s',
      htmlAttrs: {
        lang: 'en',
        amp: true
      }
    }
}
</script>
