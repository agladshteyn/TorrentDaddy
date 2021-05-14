<template>
    <div style="padding-bottom:40px">
         <md-dialog :md-active.sync="showMessageDialog" :md-click-outside-to-close="false">
             <md-dialog-title>Error</md-dialog-title>
             <md-divider></md-divider>
             <p style="margin-left:15px;margin-right:15px">{{message}}</p>
             <md-dialog-actions>
                 <md-button class="md-primary md-raised" @click="onMessageDialogOk">Ok</md-button>
             </md-dialog-actions>
        </md-dialog>
        <div style="width:100%;text-align:center">
            <form style="margin:auto;width:60%" enctype="multipart/form-data" novalidate v-if="isInitial || isSaving">
                <div class="dropbox">
                    <input type="file" single :name="uploadFieldName" :disabled="isSaving" @change="filesChange($event.target.name, $event.target.files); fileCount = $event.target.files.length" accept=".torrent" class="input-file">
                    <p v-if="isInitial">
                        Drag a torrent file here or click to browse
                    </p>
                </div>
            </form>
			<h4 style="margin-top:10px;margin-bottom:10px">--- OR ---</h4>
            <div>
                <textarea style="margin:auto;width:60%;cursor:arrow;resize:none" class="dropbox message" @paste="onPaste" placeholder="Paste a torrent magnet link">
                </textarea>
                <div style="margin:auto;width:60%;margin-top:40px;text-align:left">
                    <h2>Total downloads: {{this.torrents.length}}</h2>
                    <hr style="margin-bottom:20px"/>
                    <div  id="torrents">
                        <torrent v-for="item in torrents" v-bind:torrent="item" :key="item.id" @destroyed="torrentDestroyed"></torrent>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import TorrentComponent from '../components/Torrent.vue';
import WebTorrent from 'webtorrent'
import Media from '../components/Media.vue';

const STATUS_INITIAL = 0, STATUS_SAVING = 1, STATUS_SUCCESS = 2, STATUS_FAILED = 3;

export default {
  props: ["webtorrent"],
  data() {
    return {
		uploadedFiles: [],
        uploadError: null,
        currentStatus: null,
        uploadFieldName: 'torrents',
		numDownloads: 0,
		torrents: [],
		showMessageDialog: false,
		message: ''
    };
  },
  created () {
		// this.torrents.push({})
		//this.showStreamDialog = true

		//this.test()
		
		
	},

  methods: {
    test() {
	    let torrent = {
            id: 'Test torrent...',
			instance: {
				name: 'Test torrent',
				magnetURI: 'magent URI test'
			}
		}

		
		this.torrents.push(torrent)
	},
  
    onMessageDialogOk () {
	    this.showMessageDialog = false
		this.message = ''
	},
	
	displayMessage (msg) {
		this.message = msg
		this.showMessageDialog = true
	},
  
    torrentDestroyed (torrent) {
		// Delete from collection.
		for (let i in this.torrents) {
            let t = this.torrents[i]
            if (t.id === torrent.id) {
                this.torrents.splice(i, 1)
			}
		}
	},
	validateMagnetUri(value) {
		if (!value || value === '')
			return false;
			
		let valueLower = value.toLowerCase().trim();
		if (!valueLower.startsWith('magnet:?xt='))
			return false;
			
		return true; 
	},
	
	addTorrent (torrentId) {
		let self = this
		let client = window.webtorrent

		client.on('error', function (err) {
           console.error('ERROR: ' + err.message)
		})
		function onTorrent (torrent) {
           console.log('Received torrent metadata...')
 
            for (let i in self.torrents) {
                let t = self.torrents[i]
                if (t.id === torrentId) {
                    t.instance = torrent
                }
           }
       }
    
        client.add(torrentId, onTorrent)
		
		let torrent = {
            id: torrentId
		}

		self.torrents.push(torrent)
	},
	
    onPaste(event) {
        let self = this
		let paste = (event.clipboardData || window.clipboardData).getData('text');
		event.preventDefault()
		
		if (!self.validateMagnetUri(paste)) {
		    self.displayMessage('Specified magnet URI is invalid:   ' + paste)
			return
		}

		let torrentId = paste
		self.addTorrent(torrentId)
	},
	reset() {
        // reset form to initial state
        this.currentStatus = STATUS_INITIAL;
        this.uploadedFiles = [];
        this.uploadError = null;
      },
      save() {
        // upload data to the server
        this.currentStatus = STATUS_SAVING;
   
      },
      filesChange(fieldName, fileList) {
		if (!fileList || fileList.length === 0)
			return;
			
		if (fileList[0].name.toLowerCase().indexOf('.torrent') === -1) {
			this.displayMessage('You have selected an invalid torrent file')
			return
		}
	  
		let reader = new FileReader();
		reader.addEventListener('load', (event) => {
			let arrayBuff = event.target.result;
			let buff = new Buffer(arrayBuff, 'hex')
			this.addTorrent(buff)
		  });
		  
		 reader.readAsArrayBuffer(fileList[0]);
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
   mounted() {
      this.reset();
   },
   components: {
      'torrent': TorrentComponent,
	   'media': Media
   }
}
</script>


 