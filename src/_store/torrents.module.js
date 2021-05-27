import { torrentService } from '../_services';

export const torrents = {
    namespaced: true,
    state: {
        search: {},
		add: {},
		remove: {}
    },
    actions: {
        search({ commit }, options ) {
            commit('searchRequest');

            torrentService.search(options)
                .then(
                    torrents => commit('searchSuccess', torrents),
                    error => commit('searchFailure', error)
                );
        },
		add ({ commit }, torrent) {
			commit('addRequest', torrent)
		},
		remove ({ commit }) {
			commit('removeRequest')
		},
		onAdded ({ commit }, torrent) {
			commit('addRequestComplete', torrent)
		}
    },
    mutations: {
        searchRequest(state) {
            state.search = { loading: true };
        },
        searchSuccess(state, torrents) {
            state.search = { items: torrents };
        },
        searchFailure(state, error) {
            state.search = { error };
        },
		addRequest(state, torrent) {
            state.add = { torrent: torrent };
        },
		addRequestComplete(state, torrent) {
            state.add = { added: true, torrent: torrent };
        },
		removeRequest(state) {
            state.remove = {};
        }
    }
}
