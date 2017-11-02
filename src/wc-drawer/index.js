import Vue from 'vue'

import wcDrawer from './wcDrawer';
import wcBurger from './wcBurger';

export default {
	install (Vue) {
		Vue.component('wcDrawer', Vue.extend(wcDrawer));
		Vue.component('wcBurger', Vue.extend(wcBurger));
	}
}