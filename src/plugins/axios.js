"use strict";

import Vue from 'vue';
import axios from "axios";
import {
	message
} from 'ant-design-vue';

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.baseURL =  'http://192.168.1.4:8082'; // 张明育
// axios.defaults.baseURL = 'http://47.254.29.31:8090'; // 服务器
axios.defaults.baseURL = 'http://47.254.38.148:8090'; // 服务器

// axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;

console.log(process)
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
	// baseURL: process.env.baseURL || process.env.apiUrl || ""
	// timeout: 60 * 1000, // Timeout
	// withCredentials: true, // Check cross-site Access-Control
};

const _axios = axios.create(config);

_axios.interceptors.request.use(
	function(config) {
		// Do something before request is sent
		return config;
	},
	function(error) {
		// Do something with request error
		return Promise.reject(error);
	}
);

// Add a response interceptor
_axios.interceptors.response.use(
	function(response) {
		// Do something with response data
		return response;
	},
	function(error) {
		// Do something with response error
		console.log(error)
		message.error('接口请求失败！')
		return Promise.reject(error);
	}
);

Plugin.install = function(Vue) {
	Vue.axios = _axios;
	window.axios = _axios;
	Object.defineProperties(Vue.prototype, {
		axios: {
			get() {
				return _axios;
			}
		},
		$axios: {
			get() {
				return _axios;
			}
		},
	});
};

Vue.use(Plugin)

export default Plugin;
