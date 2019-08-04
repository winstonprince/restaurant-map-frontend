import axios from 'axios';
const API_URL = 'https://restaurant-map-api.rawinby.com';
export class APIService {

    constructor() {
        //---
    }

    getRestaurant(textsearch) {
        let q = '';
        if (textsearch) {
            q = textsearch;
        }
        const url = `${API_URL}/api/restaurant/${q}`;
        return axios.get(url).then(res => res.data);
    }

    getRestaurantId(placeid) {
        const url = `${API_URL}/api/restaurant/placeid/${placeid}`;
        return axios.get(url).then(res => res.data);
    }

}