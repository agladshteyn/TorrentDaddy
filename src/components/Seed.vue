<template>
    <div style="padding-bottom:40px">
	    <div style="width:100%;text-align:center">
		   <form style="margin:auto;width:60%" enctype="multipart/form-data" novalidate v-if="isInitial || isSaving">
				<div class="dropbox">
                    <input type="file" multiple :name="uploadFieldName" :disabled="isSaving" @change="filesChange($event.target.name, $event.target.files); fileCount = $event.target.files.length" accept="/*.torrent" class="input-file">
                    <p v-if="isInitial">
                        Drag file(s) here or click to browse
                    </p>
                </div>
		   </form>
		</div>
       <div style="margin:auto;width:60%;margin-top:40px;text-align:left">
			<h2>Total seeds: {{this.torrents.length}}</h2>
			<hr style="margin-bottom:20px"/>
			<div  id="torrents">
				<torrent v-for="item in torrents" v-bind:torrent="item" :key="item.id" @destroyed="torrentDestroyed"></torrent>
			</div>
		</div>
	</div>
</template>

<script>

const STATUS_INITIAL = 0, STATUS_SAVING = 1, STATUS_SUCCESS = 2, STATUS_FAILED = 3;
import TorrentComponent from '../components/Torrent.vue';

export default {
  data() {
    return {
		uploadedFiles: [],
        uploadError: null,
        currentStatus: null,
		uploadFieldName: 'torrents',
		torrents: []
    };
  },
  created () {
   
   },
  methods: {
	 reset() {
        // reset form to initial state
        this.currentStatus = STATUS_INITIAL;
        this.uploadedFiles = [];
        this.uploadError = null;
      },
	  filesChange(fieldName, fileList) {
		let self = this;
		
		function onTorrent(torrent) {
			let newTorrent = {
				id: torrent.magnetURI,
				instance: torrent
			}
			
			self.torrents.push(newTorrent)
		}
		
		window.webtorrent.seed(fileList, onTorrent)
      },
	  torrentDestroyed (torrent) {
		// Delete from collection.
		for (let i in this.torrents) {
            let t = this.torrents[i]
            if (t.id === torrent.id) {
                this.torrents.splice(i, 1)
			}
		}
	 }
  },
  computed: {
      isInitial() {
        return this.currentStatus === STATUS_INITIAL;
      },
      isSaving() {
        return this.currentStatus === STATUS_SAVING;
      },
      isSuccess() {
        return this.currentStatus === STATUS_SUCCESS;
      },
      isFailed() {
        return this.currentStatus === STATUS_FAILED;
      }
   },
   watch: {

   },
   mounted() {
      this.reset();
   },
   components: {
      'torrent': TorrentComponent
   }
}
</script>

 