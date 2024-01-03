import Vue from 'vue'

import Cookies from 'js-cookie'

import Element from 'element-ui'
import './assets/styles/element-variables.scss'

import '@/assets/styles/index.scss' // global css
import '@/assets/styles/ruoyi.scss' // ruoyi css
import App from './App'
import store from './store'
import router from './router'
import directive from './directive' // directive
import plugins from './plugins' // plugins
import service,{ download } from '@/utils/request'
import Vimg from "@/components/Vimg/Vimg.vue";
import './assets/icons' // icon
import './permission' // permission control
 
import { parseTime, resetForm, addDateRange, selectDictLabel, selectDictLabels, handleTree } from "@/utils/ruoyi";
 

 
 
console.log(process.env.VUE_APP_IMG_URL);
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectDictLabels = selectDictLabels
Vue.prototype.download = download
Vue.prototype.handleTree = handleTree
Vue.prototype.apiFn = service  
 
Vue.prototype.$filImg = ['image/png', 'image/jpg', 'image/jpeg', 'image/jfif', 'image/jpe']

import Avue from '@smallwei/avue';
import '@smallwei/avue/lib/index.css';

Vue.use(Avue);
Vue.use(directive)
Vue.use(plugins)
Vue.component('Vimg', Vimg)

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
