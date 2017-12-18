// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './routers'
import ElementUI from 'element-ui'
import VueI18n from 'vue-i18n'
import GlobalJs from '../static/js/globalParams'
import locale from 'element-ui/lib/locale/lang/en'
import { getCookie } from '../static/js/cookie'
// import {drag} from '../static/js/directive'

import 'element-ui/lib/theme-default/index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import './assets/scss/reset.css'
import './assets/scss/base.css'
import './assets/scss/colorBtn.css'

require('./assets/scss/base.scss');
// $.blockUI.defaults.baseZ = 9999;

Vue.config.productionTip = false

Vue.use(router)
Vue.use(ElementUI, { locale })
Vue.use(VueI18n)

const i18n = new VueI18n({
    locale: getCookie('PLAY_LANG', 'zh'),
    messages: {
        zh: require('./common/lang/zh'),
        en: require('./common/lang/en')
    }
})

/* eslint-disable no-new */
const app = new Vue({
    router,
    i18n,
    ...App
}).$mount('#app')
