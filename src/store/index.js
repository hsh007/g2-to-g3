import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		gatewayid: '',
		historyid: '',
	},
	getters: {
		getgatewayid: (state) => (id) => {
			state.gatewayid = id;
		},
		gethistoryid: (state) => (id) => {
			state.historyid = id;
		}
	},
	actions: {},
	modules: {}
})
