<style lang="less">

.content {
  background: white;
}
.top-bar {
  height: 50px;
  width: 100%;
  background: red;
  position: fixed;
  top:0;
  left: 0;
  // z-index: 10;

}
</style>
<template>
  <div class="container">
      <div class="top-bar" >
        <button @click.stop="showMe">你好</button>
      </div>
      <div class="content">
        <h1 v-for="i in 100">{{i}} Hello World</h1>
      </div>
      

      <wc-side-menu :move="['.content', '.top-bar','xx']" ref="side">
        <h1 v-for="i in 50">我是侧壁难</h1>
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
        // this.show = !this.show;

        this.$refs.side.show();
        // setTimeout(()=>{
        //   this.$refs.side.hide();
        // },2000);
        // console.log('当前的状态', this.show);
      }
    }

  }
</script>