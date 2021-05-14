<template>
	<div>
	   <main>
        <md-tabs class="md-primary" md-alignment="centered" md-sync-route  router-link>
            <md-tab id="tab-stream" md-icon="downloading" md-label="Stream or Download" to="/stream"></md-tab>
            <md-tab id="tab-seed" md-icon="share" md-label="Share Files" to="/seed"></md-tab>
        </md-tabs md-sync-route>
        <router-view></router-view>
		</main>
	</div>
</template>

<script>
//import Stream from '../components/Stream.vue';

export default {
  name: 'Main',
  props: {
    msg: String
  },
  components: {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
