<template>
	<div style="margin:20px">
		<md-dialog :md-active.sync="showMagnetLinkDialog" :md-click-outside-to-close="false">
             <md-dialog-title>Error</md-dialog-title>
             <md-divider></md-divider>
             <p style="margin-left:15px;margin-right:15px">{{message}}</p>
             <md-dialog-actions>
                 <md-button class="md-primary md-raised" @click="onMessageDialogOk">Ok</md-button>
             </md-dialog-actions>
        </md-dialog>
		<div class="md-layout md-gutter" style="justify-content:center">
			<div class="md-layout-item md-size-60">
				<md-field :class="getValidationClass('searchTerm')">
					<input id="searchTerm" placeholder="Search torrents..."  v-model="searchTerm" aria-label="Search torrents..." v-on:keyup.enter="onEnterClick">
					<span class="md-error" v-if="!$v.searchTerm.required">Please enter search criteria</span>
					<md-button type="submit" style="margin-top:0px;margin-bottom:0px;height:40px" :disabled="this.loading === true" class="md-primary md-raised" @click="searchTorrents">Search</md-button>
			   </md-field>
			</div>
		</div>
		<div v-if="this.loading === true" class="md-layout md-gutter"  style="justify-content:center">
			<div class="md-layout-item md-size-60">
				<md-progress-bar md-mode="indeterminate"></md-progress-bar>
			</div>
		</div>
		<div  v-if="this.displayGrid === true">
			<ejs-grid  ref='grid' :dataSource="this.torrents.items" :pageSettings='pageSettings' :allowPaging="true" :allowFiltering='true' :allowSorting='true' :filterSettings='filterOptions'>
			  <e-columns>
				  <e-column headerText='Title' textAlign='Left' field='title' min-width=250></e-column>
				  <e-column headerText='Date' field='time' textAlign='Center' width=200></e-column>
				  <e-column headerText='Size' field='size' textAlign='Center' width=120></e-column>
				  <e-column headerText='Peers' textAlign='Center' field='peers' width=120></e-column>
				  <e-column headerText='Seeds' textAlign='Center' field='seeds' width=120></e-column>
				  <e-column headerText='Files' textAlign='Center' field='numFiles' width=120></e-column>
				  <e-column headerText='Add Torrent' textAlign='Center' :template='templateAddTorrent' width=140></e-column>
				</e-columns>
			</ejs-grid>
		</div>
	</div>
</template>

<script>
import Vue from "vue";
import { GridPlugin, Page, Sort, Filter } from "@syncfusion/ej2-vue-grids";
import {
    required
  } from 'vuelidate/lib/validators'
import { validationMixin } from 'vuelidate';
import { router } from '../_helpers';

export default {
  mixins: [validationMixin],
  data() {
    return {
		displayGrid: false,
		showMagnetLinkDialog: false,
		searchTerm: '',
		activeProviders: [],
		loading: false,
		filterOptions: {
		    type: 'Menu'
       },
	   pageSettings: { pageSize: 10 },
	   templateAddTorrent: function() {
			return { template : Vue.component('columnTemplate',{
               template: `<div>
                   <md-button class="md-fab md-mini md-plain" @click="addTorrent(item)">
				      <md-icon>add</md-icon>
				   </md-button>
                </div>`,
				/*
                data: function() {
                    return {
                        data: {}
                    }
                },
				*/
				
				methods: {
					addTorrent(torrent) {
						this.$root.$store.dispatch('torrents/add', torrent); 
					}
				},
                computed: {
                     item: function() {
						return this.data;
					}
                }
           })}
	    }
     };
  },
  
  methods: {
	  onEnterClick () {
	     if (this.searchTerm && this.searchTerm !== '')
			this.searchTorrents()
	  },
  
	 searchTorrents () {
		 this.$v.$touch();
		 if (!this.$v.$invalid) {
			 let opts = {
			    searchTerm: this.searchTerm,
				providers: [ // TODO: allow user to choose providers
					"ThePirateBay",
					"KickassTorrents"		
				]
			 }

			 this.$store.dispatch('torrents/search', opts); 
		 }
	  },
	  getValidationClass (fieldName) {
		const field = this.$v[fieldName]
		if (field) {
			return {
				'md-invalid': field.$invalid && field.$dirty
			}
		}
	 }
  },
  
  validations: {
     searchTerm: {
        required
     }
  },
  
  provide: {
	  grid: [Page, Sort, Filter]
  },
  created () {

  },
  
  mounted () {

  },
  
  computed: {
	torrents () {
		return this.$store.state.torrents.search;
	  }
   },
   
   watch: {
	   torrents(newState, oldState) {
		  this.displayGrid = true;
		  this.loading = newState.loading === true;
		  
		  if (newState.items) {
			 for (let i in newState.items) {
				let d = newState.items[i].time;
				if (d && d !== '') {
					try {
						newState.items[i].time = new Date(d).toLocaleString()
					}
					catch (err) {}
				}
			 }
		  }
	   }
   }
}

</script>

<style>
#searchTerm {
	width: 100%;
	border: 1px solid #ced4da;
	-webkit-transition: 0.5s;
	transition: 0.5s;
	box-sizing: border-box;
	outline: none;
	color: #495057;
	font-weight: 400;
	line-height: 1.5;
	background-color: #fff;
	background-clip: padding-box;
	padding: .375rem .75rem;
	border-radius: .25rem;
}

#searchTerm:focus {
	border: 2px solid #ced4da;
}
	
.md-field.md-theme-default:after {

	background-color: transparent !important;
}
</style>
