<template>
	<div>
       <md-tabs class="md-primary" md-alignment="centered" md-sync-route router-link>
            <md-tab id="tab-stream" md-icon="downloading" md-label="Stream or Download" to="/stream"></md-tab>
            <md-tab id="tab-seed" md-icon="share" md-label="Share Files" to="/seed"></md-tab>
			<md-tab id="tab-about" md-icon="help" md-label="About" to="/about"></md-tab>
        </md-tabs md-sync-route>
		<keep-alive>
			<router-view></router-view>
		</keep-alive>
	</div>
</template>