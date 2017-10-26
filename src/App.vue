<style lang="less">
.content {
  background: white;
  text-align: center;
}
.top-bar {
  height: 50px;
  width: 100%;
  background: #7e57c2;
  position: fixed;
  top:0;
  left: 0;
  img {
    position: relative;
    top: 10px;
    left: 20px;
  }
}
.drawer {
  width: 220px;
  background: #873;
  padding: 10px;
  color: white;
}


</style>
<template>
  <div class="container">

      <wc-side-menu :move="['.content', '.top-bar','xx']" ref="side" class="drawer">
         <h1>主要标题</h1>
         <p v-for="i in 50">标题 {{i + 1}}</p>
      </wc-side-menu>

      <div class="top-bar" >
        <img src="./icon.png" alt="" @click="showMe">
      </div>



      <div class="content">
         <h1 v-for="i in 100">{{i}} Hello World</h1>
      </div>
      


  </div>
</template>
<script>
  import wcSideMenu from './wc-side-menu/wcSideMenu'
  export default {
    name: 'App',
    components: {
      wcSideMenu
    },
    data () {
      return {
        show: false
      }
    },
    methods: {
      showMe () {
        this.$refs.side.show();
      }
    }

  }
</script>