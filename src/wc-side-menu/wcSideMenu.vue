<style lang="less" scoped>
.wc-side-menu-container {
	position: fixed;
	top: 0;
	left: 0;
	bottom: 0;
	transform: translate(-100%);
	overflow: scroll;
	-webkit-overflow-scrolling: touch;
	z-index: 9;
}
</style>
<template>
	<div class="wc-side-menu-container" ref="drawer">
		<slot/>
	</div>
</template>
<script>
	let DRAWER_MOVE = false;
	let CONTNET_MOVE = false;
	export default {
		name: 'wcSideMenu',
		props: {
			/* 需要移动的元素列表 */
			move: {
				default () {
					return [];
				}
			},
			/* 移动模式 */
			mode: {
				default () {
					return ['content','drawer'];
				}
			},
			duration: {
				default: 300
			}
		},
		data () {
			return {
				linkageElements: [],
				drawerWidth: 0
			}
		},
		mounted () {
			this.getLinkageElements();
			this.drawerWidth = this.$refs.drawer.clientWidth;	
			if (this.mode.indexOf('content') > -1) {
				CONTNET_MOVE = true;
			}
			if (this.mode.indexOf('drawer') > -1) {
				DRAWER_MOVE = true;
			}
		},
		methods: {
			/* 获取在侧边栏出来的时候, 所有需要跟着移动的页面元素 */
			getLinkageElements () {
				this.linkageElements = this.move.map((selector) => {
					return document.querySelector(selector);
				}).filter(el=>{
					/*过滤掉所有的无效选择器*/
					return el !== null;
				})
			},
			/* 显示侧边栏 */
			show () {
				/*
					根据不同的移动方式, 需要有不同的处理方法.
					drawer 主动出来 
					content 主动出来
				*/
				this.$refs.drawer.style.display = 'block';

				if (DRAWER_MOVE) {
					/* 仅仅抽屉动 */
					this.transitionDuration(this.duration, this.$refs.drawer);
					this.translateX(0, this.$refs.drawer);
					/* 内容元素跟着移动 */
					if (CONTNET_MOVE) {
						this.linkageElements.forEach(el => {
							el.style.zIndex = 8;
							this.transitionDuration(this.duration, el);
							this.translateX(this.drawerWidth, el);
						});						
					}
				} else if (CONTNET_MOVE) {

					this.translateX(0, this.$refs.drawer);
					this.linkageElements.forEach(el=>{
						el.style.zIndex = 10;
						if (getComputedStyle(el).position == 'static') {
							el.style.position = 'relative'
						} else if (getComputedStyle(el).position == 'fixed'){
							el.style.zIndex = 11;
						}
							this.transitionDuration(this.duration, el);
							this.translateX(this.drawerWidth, el);
					})
				}
				/* 此时主内容还是可以滚动, 这样不行, 这个时候我们不能让页面滚动*/
				/* 支持侧边栏滑动 和所有联动的元素滑动 */
				setTimeout(()=>{

					this.linkageElements.forEach(el => {
						/*支持点击内容区域隐藏 drawer*/
						el.addEventListener('click', this.hide, false);
						/*阻止侧边栏出来的时候内容区域可以滚动*/
						el.addEventListener('touchmove', this.handler, false);
					});


				}, 10);

			},

			hide () {
				/* 如果是抽屉动 */
				if (DRAWER_MOVE) {
					this.transitionDuration(this.duration, this.$refs.drawer);
					this.translateX(-this.drawerWidth, this.$refs.drawer);
					/* 内容跟着动 */
					if (CONTNET_MOVE) {
						this.linkageElements.forEach(el => {
							this.transitionDuration(this.duration, el);
							this.translateX(0, el);
						});						
					}
				} else if (CONTNET_MOVE) {
					this.linkageElements.forEach(el=>{
						this.transitionDuration(this.duration, el);
						this.translateX(0, el);
						setTimeout(()=>{
							this.$refs.drawer.style.display = 'none';
						}, this.duration);
						
					});
				}
				/* 如果是内容动*/
				this.linkageElements.forEach(el => {
					el.removeEventListener('click', this.hide, false);
					el.removeEventListener('touchmove', this.handler, false);
				});
			},
			translateX (value,el) {
				el.style.transform = 'translate3d(' + value + 'px, 0, 0)';
			},
			transitionDuration (ms,el) {
				el.style.transitionDuration = ms + 'ms';
			},
			handler (e) {
				e.preventDefault();
			}
		}
	}
</script>