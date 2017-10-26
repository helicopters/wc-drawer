<style>
.container {
  /*background: #738393;*/
}
.top-bar {
  height: 50px;
  width: 100%;
  background: red;
  position: fixed;
  top:0;
  left: 0;
  z-index: 10;
}
</style>
<template>
  <div class="container">
      <div class="top-bar" @click="showMe">1223</div>
      <div class="content">
        <h1 v-for="i in 100">{{i}} Hello World</h1>
      </div>
      

      <wc-side-menu v-model="show" content=".content" bar=".top-bar"  :move="['.content', '.top-bar','xx']">
        老子是侧边栏边栏边栏边栏
        <!-- <h1 @click="fn">你好</h1> -->
      </wc-side-menu>
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
        // console.log(this.show)
        // this.show = !this.show;
        this.show = !this.show;


        console.log('当前的状态', this.show);
      },
      end () {
        // con
        this.show = false;
      },
      fn () {
        alert(1)
      }
    }

  }
</script>