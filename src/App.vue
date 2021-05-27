<template>
	<div>
		<md-snackbar :md-position="position" :md-duration="isInfinity ? Infinity : duration" :md-active.sync="alert.message !== null" md-persistent>
			<span>{{alert.message}}</span>
			<md-button class="md-primary" @click="clearAlert()">Ok</md-button>
		</md-snackbar>
		<navigation></navigation>
	</div>
</template>
		
<script>
import WebTorrent from 'webtorrent'
import Buffer  from 'buffer'
import Navigation from './Navigation.vue';

export default {
  name: 'app',
  data() {
    return {
		webtorrent: null,
		position: 'center',
		duration: 4000,
		isInfinity: false,
		numDownloading: 0,
		numSharing: 0
    };
  },
  mounted() {
	
  },
  created () {

      window.webtorrent = new WebTorrent({
           tracker: {
               rtcConfig: {
                   "iceServers": [
                   {
                       "urls": [
                           "stun:stun.l.google.com:19302",
                           "stun:global.stun.twilio.com:3478"
                       ]
                    },
                    {
                        "urls": [
                            "turn:relay.instant.io:443?transport=udp",
                            "turn:relay.instant.io:443?transport=tcp",
                            "turns:relay.instant.io:443?transport=tcp"
                        ],
                        "username": "relay.instant.io",
                        "credential": "nepal-cheddar-baize-oleander"
                    }
                ]
             }
          }
      })
   },
   components: {
      'navigation': Navigation
   },
   	methods: {
		clearAlert() {
			this.$store.dispatch('alert/clear');
		},
		updateBadgeDownloading(num) {
			let elem = document.querySelector('[mdicon="downloading"]').querySelector('.md-ripple');
			// If badge already exists, update its inner text.
			let badge = elem.querySelector('.md-badge');
			if (badge) {
				badge.innerText = num;
				return;
			}
			
			var div = document.createElement('div');
			div.innerText = num;
			div.className  = 'md-badge md-theme-default md-position-top'
			div.style['top'] = '5px';
			div.style['margin-left'] = '25px';
			div.style['right'] = 'auto';
			elem.appendChild(div);
		},
		removeBadgeDownloading() {
			let elem = document.querySelector('[mdicon="downloading"]').querySelector('.md-ripple');
			let badge = elem.querySelector('.md-badge');
			if (badge)
				elem.removeChild(badge);
		}
	},
	watch:{
        $route (to, from){
            // clear alert on location change
            this.clearAlert()
        },
		addTorrent(newState, oldState) {
			if (newState.added === true) {
				this.numDownloading++;
				this.updateBadgeDownloading(this.numDownloading)
				this.$store.dispatch('alert/success', 'Torrent added successfully!'); 
			}
		},
		removeTorrent(newState, oldState) {
			this.numDownloading--;
			if (this.numDownloading < 0)
				this.numDownloading = 0;
				
			if (this.numDownloading === 0)	
				this.removeBadgeDownloading();
			else
				this.updateBadgeDownloading(this.numDownloading)
		}
    },
    computed: {
        alert () {
            return this.$store.state.alert
        },
		addTorrent() {
			return this.$store.state.torrents.add;
		},
		removeTorrent() {
			return this.$store.state.torrents.remove;
		}
    }
}
</script>

<style>
@import '../assets/main.css'; 
@import '../../node_modules/@syncfusion/ej2-base/styles/material.css'; 
@import '../../node_modules/@syncfusion/ej2-buttons/styles/material.css';  
@import '../../node_modules/@syncfusion/ej2-calendars/styles/material.css';  
@import '../../node_modules/@syncfusion/ej2-dropdowns/styles/material.css';  
@import '../../node_modules/@syncfusion/ej2-inputs/styles/material.css';  
@import '../../node_modules/@syncfusion/ej2-navigations/styles/material.css';
@import '../../node_modules/@syncfusion/ej2-popups/styles/material.css';
@import '../../node_modules/@syncfusion/ej2-splitbuttons/styles/material.css';
@import '../../node_modules/@syncfusion/ej2-vue-grids/styles/material.css';
</style>
