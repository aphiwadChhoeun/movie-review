import Vue from 'nativescript-vue'
import App from './components/App'
import store from './store';
import RadGaugePlugin from "nativescript-ui-gauge/vue";

import VueDevtools from 'nativescript-vue-devtools'

if(TNS_ENV !== 'production') {
  Vue.use(VueDevtools, { host: '10.16.191.98' })
}
// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')

Vue.use(RadGaugePlugin);

new Vue({
  store,
  render: h => h('frame', [h(App)])
}).$start()
