import Vue from 'vue';
import Vuex from 'vuex';

import { alert } from './alert.module';
import { torrents } from './torrents.module';

Vue.use(Vuex);

export const store = new Vuex.Store({
    modules: {
        alert,
        torrents
    }
});
