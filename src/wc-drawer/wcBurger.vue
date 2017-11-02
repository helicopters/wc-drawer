<style lang="less" scoped>
.burger-menu {
  position: relative;
  width: 20px;
  height: 20px;
}

.burger {
  position: absolute;
  width: 100%;
  background: #58595b;
  top: -1px;
  height: 1px;
  opacity: 1;
  border-radius: 2px;
}

.burger::before {
  position: absolute;
  width: 100%;
  background: #58595b;
  height: 1px;
  top: 7px;
  content: "";
  display: block;
  border-radius: 2px;
}

.burger::after {
  position: absolute;
  width: 100%;
  background: #58595b;
  height: 1px;
  top: -7px;
  content: "";
  display: block;
  border-radius: 2px;
}

.burger::after, .burger::before, .burger {
  transition: all .3s ease-in-out;
  -webkit-transition: all .3s ease-in-out;
}

.burger-menu.menu-on .burger::after {
  transform: rotate(-45deg) translate(-14px, 15px);
  -webkit-transform: rotate(-45deg) translate(0px, 10px);
  bottom: 0px;
  right: 5px;
}

.burger-menu.menu-on .burger::before {
  transform: rotate(45deg) translate(5px, -5px);
  -webkit-transform: rotate(45deg) translate(5px, -5px);
  top: 0px;
  right: 5px;
}

.burger-menu.menu-on .burger {
  background: rgba(255, 255, 255, 0);
}	
</style>
<template>
  <div class="burger-menu" @click.stop="fn" :class="{'menu-on': value}">
    <div class="burger"></div>
  </div>	
</template>
<script>
	export default {
		name: 'wcBurger',
    props: {
      value: {
        default: false
      }
    },

		methods: {
			fn () {
        this.$emit('click');
			}
		}
	}
</script>