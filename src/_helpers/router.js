import Vue from 'vue';
import Router from 'vue-router';

import Stream from '../components/Stream.vue'
import Seed from '../components/Seed.vue'
import About from '../components/About.vue'

Vue.use(Router);

export const router = new Router({
  mode: 'history',
  routes: [
	{ path: '/', component: Stream },
    { path: '/stream', component: Stream, name: 'stream' },
    { path: '/seed', component: Seed, name: 'seed' },
	{ path: '/about', component: About, name: 'about' },
    // otherwise redirect to home
    { path: '*', redirect: '/stream', name: 'seed' }
  ]
});
