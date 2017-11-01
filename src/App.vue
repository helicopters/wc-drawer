<style lang="less">
.content {
  background: white;
  text-align: center;
  // min-height: 
  padding-top: 100px;
}
.top-bar {
  height: 50px;
  width: 100%;
  // background: #7e57c2;
  position: fixed;
  top:0;
  left: 0;
  img {
    position: relative;
    top: 10px;
    left: 20px;
  }
  margin-bottom: 100px;
}
.drawer {
  width: 220px;
  background: #873;
  padding: 10px;
  color: white;
}

.bugg {
  position: absolute!important;
  top: 20px;
  right: 10px;
}


</style>
<template>
  <div class="container">

      <wc-side-menu v-model="show" ref="side" class="drawer" :move="['.top-bar', '.content']" from="left">
         <h1>主要标题</h1>
         <p v-for="i in 50">标题 {{i + 1}}</p>
      </wc-side-menu>

      <div class="top-bar" ref="topbar">

      
      <wc-burger class="bugg" @click="showMe" v-model="show"/>


      </div>



      <div class="content" ref="content">
        <a href="http://www.baidu.com">爸爸打包打包打包打包打包打包吧</a>
         <h1 v-for="i in 100">{{i}} Hello World</h1>
      </div>
      


  </div>
</template>
<script>
  import wcSideMenu from './wc-side-menu/wcSideMenu'
  import wcBurger from './wc-side-menu/wcBurger'
  export default {
    name: 'App',
    components: {
      wcSideMenu,
      wcBurger
    },
    data () {
      return {
        show: false,
        on: false
      }
    },
    methods: {
      showMe () {

        console.log('hello')
        console.log(this.$refs.side.value, this.show)


        // this.$refs.side.show();
        this.show = !this.show;
        // this.
      },
      // fn () {
      //   this.on = !this.on;
      // }
    }

  }
</script>