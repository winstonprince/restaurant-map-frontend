<template>
    <fragment>
        <GmapMap ref="mapRef" :center="center" :zoom="zoom" map-type-id="terrain" style="width: 100%; height: 100%;" :options="{
            mapTypeControl: true,
            zoomControl: true,
            streetViewControl: true,
            scaleControl: false,
            rotateControl: true,
            fullscreenControl: false,
            disableDefaultUi: false,
            mapTypeControlOptions: {
            position: 3
            },
        }">
            <gmap-info-window :options="infoOptions" :position="infoWindowPos" :opened="infoWinOpen" @closeclick="infoWinOpen=false"></gmap-info-window>
            <GmapMarker :key="index" v-for="(m, index) in markers" :position="m.position" :clickable="true" :draggable="false" @click="toggleInfoWindow(m,index)" :icon="icon" />
        </GmapMap>
    
        <div class="search-map">
            <div class="form-row align-items-center">
    
                <div class="col-md-9 col-9 pl-0 pr-0">
                    <autocomplete ref="autocomplete" class="form-control" source="https://restaurant-map-api.rawinby.com/api/restaurant/" placeholder="Bangsue." results-property="data" results-display="name" v-model="textsearch" @selected="selectRestaurant" @clear="autocomplete_clear">
                    </autocomplete>
                </div>
    
                <div class="col-md-3 col-3 pl-0 pr-0">
                    <button type="button" class="btn btn-primary" @click="btnSearchRestaurant">Search</button>
                </div>
    
            </div>
        </div>
    
    </fragment>
</template>

<script>
import Vue from 'vue';
import autocomplete from 'vuejs-auto-complete';
import { APIService } from '../APIService';
const apiService = new APIService();

export default {
    name: 'Gmap',
    props: {
        // msg: String
    },
    components: {
        autocomplete
    },
    data() {
        return {
            textsearch: 'Bangsue.',
            select_placeid: '',
            zoom: 11,
            center: {
                lat: 13.804040,
                lng: 100.538300
            },
            infoWindowPos: null,
            infoWinOpen: false,
            currentMidx: null,
            infoOptions: {
                content: '',
                //optional: offset infowindow so it visually sits nicely on top of our marker
                pixelOffset: {
                    width: 0,
                    height: -35
                }
            },
            markers: [],
            icon: require('../assets/img/marker.png')
        }
    },
    methods: {
        btnSearchRestaurant() {
            this.selectRestaurant(this.select_placeid);
        },
        autocomplete_clear() {
            this.select_placeid = '';
            if (this.markers.length > 0) {
                // console.info('markers =', this.markers);
                this.$refs.mapRef.$mapPromise.then((map) => {
                    // console.info('mapRef =', map)
                    map.panTo({ lat: parseFloat(this.center.lat), lng: parseFloat(this.center.lng) });
                    map.setZoom(12);
                });
                this.closeInfoWindow(this.markers[0], 0); //trigger open info window
                this.markers = [];
            }
        },
        selectRestaurant(place) {
            let placeid = '';
            if (typeof(place) == 'object') {
                placeid = place.selectedObject.place_id;
            } else {
                placeid = place;
            }
            if (!placeid) {
                // alert('ยังไม่ได้กรอกข้อมูล');
                this.$swal({ 'type': 'warning', 'text': 'ยังไม่ได้กรอกข้อมูล' });
            } else {
                this.select_placeid = placeid;
                console.info('placeid =', this.select_placeid);

                if (Vue.ls.get('placeid:' + placeid)) { //Get Data From Storage

                    let item = JSON.parse(Vue.ls.get('placeid:' + placeid));
                    let marker_arr = [];
                    marker_arr.push({
                        position: {
                            lat: parseFloat(item.geometry.location.lat),
                            lng: parseFloat(item.geometry.location.lng)
                        },
                        infoText: '<div class="marker_name"><img width="18" src="' + item.icon + '"/> ' + item.name + '</div><hr/><div class="marker_desc">' + item.adr_address + '</div> ' + (item.formatted_phone_number ? '<div>Tel: ' + item.formatted_phone_number + '</div>' : '') + ''
                    });

                    if (marker_arr.length > 0) {
                        this.markers = marker_arr;
                        // console.info('markers =', this.markers);
                        this.$refs.mapRef.$mapPromise.then((map) => {
                            // console.info('mapRef =', map)
                            map.panTo({ lat: parseFloat(marker_arr[0].position.lat), lng: parseFloat(marker_arr[0].position.lng) });
                            map.setZoom(12);
                        });
                        this.openInfoWindow(this.markers[0], 0); //trigger open info window
                    }

                } else {
                    apiService.getRestaurantId(placeid).then((res) => {
                        if (res.data) {
                            let item = res.data;

                            ///Save Data To Storage
                            const placeid_parsed = JSON.stringify(item);
                            Vue.ls.set('placeid:' + placeid, placeid_parsed, 60 * 60 * 1000); //expiry 1 hour

                            let marker_arr = [];
                            marker_arr.push({
                                position: {
                                    lat: parseFloat(item.geometry.location.lat),
                                    lng: parseFloat(item.geometry.location.lng)
                                },
                                infoText: '<div class="marker_name"><img width="18" src="' + item.icon + '"/> ' + item.name + '</div><hr/><div class="marker_desc">' + item.adr_address + '</div> ' + (item.formatted_phone_number ? '<div>Tel: ' + item.formatted_phone_number + '</div>' : '') + ''
                            });

                            if (marker_arr.length > 0) {
                                this.markers = marker_arr;
                                // console.info('markers =', this.markers);
                                this.$refs.mapRef.$mapPromise.then((map) => {
                                    // console.info('mapRef =', map)
                                    map.panTo({ lat: parseFloat(marker_arr[0].position.lat), lng: parseFloat(marker_arr[0].position.lng) });
                                    map.setZoom(12);
                                });
                                this.openInfoWindow(this.markers[0], 0); //trigger open info window
                            }
                        }
                    });
                }
            }
        },

        openInfoWindow: function(marker, idx) {
            this.infoWindowPos = marker.position;
            this.infoOptions.content = marker.infoText;
            this.infoWinOpen = true;
        },
        closeInfoWindow: function(marker, idx) {
            this.infoWindowPos = marker.position;
            this.infoOptions.content = marker.infoText;
            this.infoWinOpen = false;
            this.currentMidx = idx;
        },
        toggleInfoWindow: function(marker, idx) {
            this.infoWindowPos = marker.position;
            // console.info(this.infoWindowPos.lat, this.infoWindowPos.lng)
            this.infoOptions.content = marker.infoText;
            //check if its the same marker that was selected if yes toggle
            if (this.currentMidx == idx) {
                this.infoWinOpen = !this.infoWinOpen;
            }
            //if different marker set infowindow to open and reset current marker index
            else {
                this.infoWinOpen = true;
                this.currentMidx = idx;
            }
        }
    }
}
</script>

<!--
<style scoped lang="scss">

</style>
-->
