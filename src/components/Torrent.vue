<template>
    <md-card style="margin-top:20px">
        <md-card-content>
            <md-dialog :md-active.sync="showStreamDialog" :md-click-outside-to-close="false">
               <md-dialog-title>{{selectedFile.name}}</md-dialog-title>
               <md-dialog-content>
                   <media :file="selectedFile"></media>
               </md-dialog-content>
               <md-dialog-actions>
                   <md-button class="md-primary" @click="onMediaDialogCloseClick">Close</md-button>
                </md-dialog-actions>
            </md-dialog>		
            <md-dialog :md-active.sync="showDeleteConfirmDialog" :md-click-outside-to-close="false">
               <md-dialog-title>Please confirm</md-dialog-title>
               <md-divider></md-divider>
               <p style="margin-left:15px;margin-right:15px">Are you sure you wish to delete this torrent?</p>
               <md-dialog-actions>
                   <md-button class="md-primary" @click="onDeleteDialogCancelClick">Cancel</md-button>
                   <md-button class="md-primary md-raised" @click="onDeleteDialogOkClick">Ok</md-button>
                </md-dialog-actions>
            </md-dialog>
			<md-dialog :md-active.sync="showMessageDialog" :md-click-outside-to-close="false">
               <md-dialog-title>Information</md-dialog-title>
               <md-divider></md-divider>
               <p style="margin-left:15px;margin-right:15px">{{message}}</p>
               <md-dialog-actions>
                   <md-button class="md-primary md-raised" @click="onMessageDialogOk">Ok</md-button>
                </md-dialog-actions>
            </md-dialog>
			<div v-if="status !== ''" class="md-layout md-gutter" style="margin:10px">
				<h4>{{title}}</h4>
			</div>  
			<div v-if="status !== ''" class="md-layout md-gutter" style="margin:10px">
				<!-- Progress bar -->
				<div class="progress-bar-container md-layout-item md-size-40 lg-size-30 sm-size-100 md-gutter">
					<span>{{status}}</span>
					<div style="display:flex">
						<md-progress-bar class="torrent-progress-bar" md-mode="determinate" style="margin-left:10px;margin-top:10px" :md-value="progress"></md-progress-bar>
						<span style="margin-left:10px">{{progress}}%</span>
					</div>
				</div>
				<div class="torrent-stats md-layout-item md-gutter">
					<div style="display:flex" class="speedStatsContainer">
						<div>
							<md-icon>arrow_downward</md-icon>
							<md-tooltip>Download speed</md-tooltip>
							<span>{{downloadSpeed}}</span>
						</div>
						<div style="margin-left:25px">
							<md-icon>arrow_upward</md-icon>
							<md-tooltip>Upload speed</md-tooltip>
							<span>{{uploadSpeed}}</span>
						</div>
					</div>
					<div style="display:flex" class="numPeersAndSizeContainer">
						<span class="num-peers" style="margin-left:25px">{{peersFormatted}}</span>
						<span style="margin-left:25px">{{sizeFormatted}}</span>
					</div>
					<div class="save-files-container">
						<span>Files: {{totalFiles}}</span>
						<md-button id="btnSave" @click="onSaveTorrentClick" class="md-icon-button md-seconday" style="top:-8px"  v-if="savingFiles === false">
                            <md-tooltip>Save</md-tooltip>
                            <md-icon class="md-size-1x">download</md-icon>
                        </md-button>
						<span v-if="savingFiles" style="margin-left:25px;color:gray;font-style:italic">Saving...</span>
					</div>
				</div>
			</div>
			<div v-if="status !== ''" class="md-layout md-gutter" style="margin:10px">
				<div class="torrent-stats md-layout-item md-gutter">
					<md-button  style="max-width: 120px;min-width: 120px;padding-right:20px;padding-left:20px" class="control-button md-raised md-primary" @click="onStreamClick"><md-icon>play_circle_outline</md-icon><span style="margin-left:5px">Play</span></md-button>
					<md-button  style="max-width: 120px; min-width: 120px;padding-right:20px;padding-left:20px"   class="control-button md-raised md-accent" @click="onDeleteTorrentClick"><md-icon>delete</md-icon><span style="margin-left:5px">Delete</span></md-button>
				</div>
				<div class="torrent-stats md-layout-item md-gutter" style="justify-content:flex-end">
					<a :href="torrentMagnetUri" style="margin-top:20px" target="_blank">[Magnet URI]</a>
                       <span style="margin-left:5px;margin-right:5px;margin-top:20px">|</span>
                       <a :href="torrentFileBlobURL"  style="margin-top:20px"  :download="torrentDownloadLink">[Download .torrent]</a>
				</div>
			</div>
            <div v-if="status === ''" class="md-layout md-gutter" style="margin:10px">
               <div class="md-layout-item md-size-10 md-gutter">
                   <md-progress-spinner md-mode="indeterminate" :md-diameter="50"></md-progress-spinner>
               </div>
               <div class="md-layout-item md-size-70 md-gutter">
                  <h3>Waiting for metadata...</h3>
               </div>
               <div  class="md-layout-item" style="display: flex;align-items: center;justify-content: center">
                   <md-button @click="onDeleteTorrentClick" class="md-icon-button md-primary">
                        <md-tooltip>Delete</md-tooltip>
                        <md-icon class="md-size-1x">clear</md-icon>
                    </md-button>
               </div>			   
			</div>
        </md-card-content>
    </md-card>
</template>

<script>

import Mime from 'mime-types'
import Media from '../components/Media.vue';

export default {
  name: 'Torrent',
  props: {
    msg: String,
	torrent: { }
  },
  data() {
    return {
		status: '',
		title: '',
		progress: 0,
		peers: 0,
		peersFormatted: '',
		sizeFormatted: '0 MB',
		showDeleteConfirmDialog: false,
		interval: null,
		totalFiles: 0,
		torrentDownloadLink: '',
		torrentFileBlobURL: '',
		torrentMagnetUri: '',
		selectedFile: {},
        showStreamDialog: false,
		showMessageDialog: false,
		message: '',
		savingFiles: false,
		downloadSpeed: '0 KB',
		uploadSpeed: '0 KB'
    };
  },
  components: {
      'media': Media
  },
  created () {
 
     let self = this
     self.interval = setInterval(function () {

        if (self.torrent && self.torrent.instance) {
            if (self.torrentDownloadLink === '')
                self.torrentDownloadLink = self.torrent.instance.name + '.torrent'
				
            if (self.torrentFileBlobURL === '')
                self.torrentFileBlobURL = self.torrent.instance.torrentFileBlobURL	
	
            if (self.title === '')
                self.title = self.torrent.instance.name
				
			if (self.torrentMagnetUri === '')
                self.torrentMagnetUri = self.torrent.instance.magnetURI	

            let progress = parseInt(self.torrent.instance.progress * 100);
			
			self.progress = progress	
			
			if (progress >= 100) {
                self.status = 'Seeding'
				self.peers = self.torrent.instance._numConns
				self.formatPeers()
			}
			else {
                self.status = 'Downloading'
				self.peers = self.torrent.instance.numPeers
				self.formatPeers()
			}

			self.sizeFormatted = self.humanFileSize(self.torrent.instance.downloaded)
			self.totalFiles = self.torrent.instance.files.length
			
			self.downloadSpeed = self.humanFileSize(self.torrent.instance.downloadSpeed)
			self.uploadSpeed = self.humanFileSize(self.torrent.instance.uploadSpeed)
		}
     }, 5000)
  },
  mounted() {
	this.formatPeers()
  },
  watch: {
      torrent: function() {
          console.log('on torrent...')
      }
  },
  methods: {
    isMediaFile (filename) {
	    if (filename && filename !== '') {
			let mimeType = Mime.lookup(filename)
			return mimeType.indexOf('video/') !== -1 || mimeType.indexOf('audio/') !== -1
		}
		
		return false
	},
    download (filename, name) {
        var a = document.createElement("a")
        a.href = filename;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
             window.URL.revokeObjectURL(filename);  
        }, 0); 
    },
	
	displayMessage (msg) {
		this.message = msg
		this.showMessageDialog = true
	},
	
	onMessageDialogOk () {
		this.message = ''
		this.showMessageDialog = false
	},
  
	onDeleteTorrentClick () {
		this.showDeleteConfirmDialog = true
	},
	onMediaDialogCloseClick () {
		this.showStreamDialog = false
	},
	onSaveTorrentClick () {
        let self = this
	    self.savingFiles = true
		if (self.progress < 100) {
            self.displayMessage('Please wait for the download to complete before saving files')
			self.savingFiles = false
			return
		}

		self.savingFiles = true
	
		let totalFilesProcessed = this.torrent.instance.files.length
		for (const [index, file] of this.torrent.instance.files.entries()) {
			file.getBlobURL(function (err, url) {
				totalFilesProcessed--
				self.download(url, file.name)
			})
		}
		
		let saveInterval
		saveInterval = setInterval(function () {
			if (totalFilesProcessed <= 0) {
				clearInterval(saveInterval)
				console.log('CLEARED SAVE INTERVAL')
				self.savingFiles = false
			}
		}, 300)
	},
	onStreamClick () {
        let self = this
		if (!this.torrent.instance.files || this.torrent.instance.files.length === 0) {
			self.displayMessage('No files exist in this torrent')
			return
		}

		let mediaFiles = []
		
		for (const [index, file] of this.torrent.instance.files.entries()) {
			if (self.isMediaFile(file.name) === true)
				mediaFiles.push(file)
		}
		
		console.log('total media files: ' + mediaFiles.length)
		
		// TODO: if multiple media files, let the user choose which one to play
		if (mediaFiles.length > 0) {
			// For now, just play the first one
			self.selectedFile = mediaFiles[0]
			self.showStreamDialog = true
			console.log('Selected file: ' + self.selectedFile.name)
		}
		else {
			self.selectedFile = this.torrent.instance.files[0]
			self.showStreamDialog = true
			console.log('Selected file: ' + self.selectedFile.name)
		}
	},
	onDeleteDialogCancelClick () {
		this.showDeleteConfirmDialog = false
	},
	
	onDeleteDialogOkClick () {
		if (this.torrent.instance)
            this.torrent.instance.destroy()
		
		this.$store.dispatch('torrents/remove'); 
			
		clearInterval(this.interval)
		this.$emit('destroyed', this.torrent)
	},
	formatPeers () {
		this.peersFormatted = this.peers + ' peer(s)'
	},
	
	humanFileSize(bytes, si=true, dp=1) {
       const thresh = si ? 1000 : 1024;

         if (Math.abs(bytes) < thresh) {
         return bytes + ' B';
      }
 
         const units = si 
       ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] 
     : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
      let u = -1;
    const r = 10**dp;
 
     do {
      bytes /= thresh;
        ++u;
        } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);
      
      return bytes.toFixed(dp) + ' ' + units[u];
    }
  }
}
</script>



<style>
.torrent-stats {
	display: flex;
}

.progress-bar-container {
	display: flex;
}

.save-files-container {
	margin-left: 25px;
	display: flex;
}

@media (max-width:1470px) {
	.torrent-stats {
		min-width: 100%;
		max-width: 100%;
		margin-top: 20px;
		display: block;
	}
	
	.num-peers {
		margin-left: 0px !important;
	}
	
	.save-files-container {
		margin-left: 0px;
		margin-top: 20px;
	}
	
	.numPeersAndSizeContainer {
		margin-top: 20px;
	}
}

@media (max-width:1470px) {
 
	.progress-bar-container2 span {
		margin-left:7px;
	}
}

.torrent-progress-bar {
	width: 150px;
}

@media (max-width:570px) {
 
	.torrent-progress-bar {
		width: 100px;
	}
	
	.control-button {
		min-width: auto !important;
		padding-right:0px !important;
		padding-left:0px  !important;
	}
}

@media (min-width:570px) {
	min-width: 120px;
}

 
.control-button span {
	position: relative;
	top: 2px;
}

</style>
