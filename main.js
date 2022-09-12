import Vue from 'vue'
import App from './App'
Vue.config.productionTip = false

App.mpType = 'app'
import md5 from 'js-md5'
import request from '@/api/request.js'
import {requestApi} from '@/api/ssd.js'

Vue.prototype.$target = "";

// Vue.prototype.$target = "http://unicorncto.top/wsp-boot";
// import {Dialog, Toast} from 'vant';

Vue.prototype.request=request;
Vue.prototype.ssdapi=requestApi;
Vue.prototype.md5=md5;
const app = new Vue({
    ...App
})
app.$mount()
