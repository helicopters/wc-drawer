import Vue from 'vue'
import App from './App'

import wcDrawer from './wc-drawer'
Vue.use(wcDrawer);

new Vue({
    el: '#app',
    template: '<App/>',
    components: {App}
})
