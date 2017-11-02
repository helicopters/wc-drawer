<style lang="less">
body {
  position: relative;
}
.content {
  background: white;
  text-align: center;
  padding-top: 100px;
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
  top: 30px;
  right: 20px;
}
</style>
<template>
  <div class="container">
      <wc-drawer v-model="show" ref="side" class="drawer" :move="['.top-bar', '.content']" from="left">
         <h1>主要标题</h1>
         <p v-for="i in 50">标题 {{i + 1}}</p>
      </wc-drawer>
      <div class="top-bar" ref="topbar">
      <wc-burger class="bugg" @click="showMe" v-model="show"/>
      </div>
      <div class="content" ref="content">
         <h1 v-for="i in 100">{{i}} Hello World</h1>
      </div>
  </div>
</template>
<script>
  export default {
    name: 'App',
    data () {
      return {
        show: false,
        on: false
      }
    },
    methods: {
      showMe () {
        console.log('触发了绑定在 burger 上面的事件')
        this.show = !this.show;
      },
    }
  }
</script>