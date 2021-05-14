
import Vue from 'vue'
import App from './App.vue'
import { router } from './_helpers';


import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'


import { MdToolbar, MdTabs, MdIcon, MdButton, MdCard, MdProgress, MdDialog, MdDivider, MdTooltip } from 'vue-material/dist/components'


Vue.use(MdToolbar)
Vue.use(MdTabs)
Vue.use(MdIcon)
Vue.use(MdButton)
Vue.use(MdCard)
Vue.use(MdProgress)
Vue.use(MdDialog)
Vue.use(MdDivider)
Vue.use(MdTooltip)


new Vue({
  router: router,
  render: h => h(App),
}).$mount('#app')
