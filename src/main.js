import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue)
    //-----------------------------------------------
import Fragment from 'vue-fragment'
Vue.use(Fragment.Plugin)
    //-----------------------------------------------
import VueMeta from 'vue-meta'
Vue.use(VueMeta, {
        // optional pluginOptions
        refreshOnceOnNavigation: true
    })
    //-----------------------------------------------
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
Vue.use(VueSweetalert2);
//-----------------------------------------------
import VueLocalStorage from 'vue-ls';
const options = {
    namespace: 'vuejs__'
};
Vue.use(VueLocalStorage, options);

//-----------------------------------------------
import App from './App.vue'
import router from './router'
import store from './store'

import * as VueGoogleMaps from 'vue2-google-maps'
Vue.use(VueGoogleMaps, {
    load: {
        key: 'AIzaSyDEZFBkQ4QjKvASO337DYMNEKvWj0zSmQc',
        libraries: 'places',
        region: 'TH',
        language: 'th',
    },
    installComponents: true,
})

import './assets/css/fontCSChatThai.css'
import './assets/css/custom.scss'
Vue.config.productionTip = false
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')