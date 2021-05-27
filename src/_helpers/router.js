import Vue from 'vue';
import Router from 'vue-router';

import Stream from '../components/Stream.vue'
import Seed from '../components/Seed.vue'
import About from '../components/About.vue'
import Search from '../components/Search.vue'

Vue.use(Router);

export const router = new Router({
  mode: 'history',
  routes: [
	{ path: '/', redirect: '/stream' },
    { path: '/stream', component: Stream, name: 'stream' },
    { path: '/seed', component: Seed, name: 'seed' },
	{ path: '/about', component: About, name: 'about' },
	{ path: '/search', component: Search, name: 'search' },
    // otherwise redirect to home
    { path: '*', redirect: '/stream', name: 'stream' }
  ]
});
