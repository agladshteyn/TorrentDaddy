
import Vue from 'vue'
import App from './App.vue'
import { router } from './_helpers';
import { store } from './_store';
import { GridPlugin } from '@syncfusion/ej2-vue-grids';

import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

import { MdToolbar, MdTabs, MdIcon, MdButton, MdCard, MdProgress, MdDialog, MdDivider, MdTooltip, MdSnackbar, MdField, MdBadge } from 'vue-material/dist/components'


Vue.use(MdToolbar)
Vue.use(MdTabs)
Vue.use(MdIcon)
Vue.use(MdButton)
Vue.use(MdCard)
Vue.use(MdProgress)
Vue.use(MdDialog)
Vue.use(MdDivider)
Vue.use(MdTooltip)
Vue.use(GridPlugin)
Vue.use(MdSnackbar)
Vue.use(MdField)
Vue.use(MdBadge)

new Vue({
  router: router,
  store,
  render: h => h(App),
}).$mount('#app')
