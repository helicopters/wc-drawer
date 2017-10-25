<style lang="less" scoped>
.wc-side-menu-container {
	position: fixed;
	top:0;
	left: 0;
	height: 100%;
	background: yellow;
	transition-duration: 200ms;
	transform: translate(-100%);
	z-index: 100;
}
.show {
	transform: translate(0);
}
</style>
<template>

	<div class="wc-side-menu-container" :class="{show: show}" ref="drawer">
		<slot/>
	</div>
</template>
<script>
	/* 如果放在 handler 中, 每次都相当于是新建, 导致 add 和 remove 中的 handler 实际上不一样*/
	let handler =  e => e.preventDefault();
	export default {
		name: 'wcSideMenu',
		props: {
			show: {
				default: false
			},
			content: {
				default: ''
			},
			bar: {
				default: ''
			}
		},
		watch: {
			show (n) {
				// console.log(n)
				// console.log(this.content)

				// let content = document.querySelector(this.content);
				// console.log(content)

				

				if (n) {
					document.addEventListener('touchmove', handler, false);

					this.slide();

				} else {
					// console.log('revmoe', handler)
					// console.log(document.removeEventListener)
					document.removeEventListener('touchmove', handler, false);
					this.back();
					// console.log('dddddd')
				}
			}
		},
		mounted () {

		},
		methods: {
			slide () {
				let content = document.querySelector(this.content);
				let bar = document.querySelector(this.bar)

				console.log(this.$refs.drawer.clientWidth);
				let w = this.$refs.drawer.clientWidth

				content.style.transitionDuration = '200ms';
				content.style.transform = 'translateX(' + w + 'px)'

				bar.style.transitionDuration = '200ms';
				bar.style.transform = 'translateX(' + w + 'px)'


				let handler = e => {
					
				}

				content.addEventListener('touchstart', handler, false);
				content.addEventListener('touchmove', handler, false);
				content.addEventListener('touchend', handler, false);






			},
			back () {
				let content = document.querySelector(this.content);
				let bar = document.querySelector(this.bar)

				console.log(this.$refs.drawer.clientWidth);
				let w = this.$refs.drawer.clientWidth

				content.style.transitionDuration = '200ms';
				content.style.transform = 'translateX(' + 0 + 'px)'

				bar.style.transitionDuration = '200ms';
				bar.style.transform = 'translateX(' + 0 + 'px)'


			}
		}
	}
</script>