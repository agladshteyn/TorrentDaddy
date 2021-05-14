<template>
	<navigation></navigation>
</template>
		
<script>
import WebTorrent from 'webtorrent'
import Buffer  from 'buffer'
import Navigation from './Navigation.vue';

export default {
  name: 'app',
  data() {
    return {
		webtorrent: null
    };
  },
  created () {

	//	window.Buffer = window.Buffer || require('buffer').Buffer;
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
  }
}
</script>

<style>
@import '../assets/main.css'; 
</style>
