<style lang="less" scoped>
.wc-side-menu-container {
	position: fixed;
	top:0;
	left: 0;
	height: 100%;
	background: yellow;
	transition-duration: 200ms;
	transform: translate(-100%);
}
.show {
	transform: translate(0);
}
</style>
<template>

	<div class="wc-side-menu-container" :class="{show: show}">
		<slot/>
	</div>
</template>
<script>
	export default {
		name: 'wcSideMenu',
		props: {
			show: {
				default: false
			}
		},
		watch: {
			show (n) {
				console.log(n)
				let handler =  e => e.preventDefault();
				if (n) {
					document.addEventListener('touchmove', handler, false);
				} else {
					document.removeEventListener('touchmove', handler, false);
				}
			}
		}
	}
</script>