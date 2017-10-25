<style>
.container {
  background: #738393;
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
      

      <wc-side-menu :show="show" content=".content" bar=".top-bar">
        老子是侧边栏
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
        this.show = !this.show;
      }
    }

  }
</script>