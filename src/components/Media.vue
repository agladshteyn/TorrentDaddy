<template>
	<div id="mediaContainer" style="height:100%">

	</div>
</template>

<script>

export default {
  props: {
    file: Object
  },
  
  data() {
    return {

    };
  },
  created () {
  },
  
  mounted () {
	 this.file.appendTo('#mediaContainer')
  },
  
  computed: {
 
   }
}

</script>

<style scoped>

#mediaContainer video {
	height: 100%;
	width: 100%;
}
 
  .md-dialog /deep/.md-dialog-container {
 
	 height: 90%;
	 width: 90%;
  }

 
</style>