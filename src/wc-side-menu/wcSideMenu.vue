<style lang="less">
.wc-side-menu-container {
	position: fixed;
	top:0;
	left: 0;
	height: 100%;
	background: yellow;
	
	transform: translate(-100%);
	
}

</style>
<template>

	<div class="wc-side-menu-container" ref="drawer">
		<slot/>
	</div>
</template>
<script>
	function toArray(arraylike) {
	    return Array.prototype.slice.call(arraylike);
	}
	/* 如果放在 handler 中, 每次都相当于是新建, 导致 add 和 remove 中的 handler 实际上不一样*/
	let handler =  e => e.preventDefault();
	export default {
		name: 'wcSideMenu',
		props: {
			move: {
				default: []
			},
			value: {
				default: false
			}
		},
		data () {
			return {
				linkageElements: [],
				/*这个变量需要在 show/hide 里面都使用到 */
				drawerWidth: 0,
				pos: {
					startX: 0,
					moveX: 0,
					endX: 0, 
					local: 0,
					distance: 0
				},
			}
		},
		watch: {
			value (show) {
				if (show) {
					this.show();
				} else {
					this.hide();
				}
			}
		},
		mounted () {
			this.getLinkageElements();
			this.drawerWidth = this.$refs.drawer.clientWidth;
		},
		methods: {
			/* 获取所有的需要联动的页面上的元素 */
			getLinkageElements () {
				this.linkageElements = this.move.map((selector) => {
					console.log(selector)
					return document.querySelector(selector);
				}).filter(el=>{
					/*过滤掉所有的无效选择器*/
					return el !== null;
				})
			},
			show () {
				/* 首先是侧边栏肯定要自己移动一下*/
				this.transitionDuration(200, this.$refs.drawer);
				this.translateX(0, this.$refs.drawer);
				/* 其次, 所有的联动元素都要移动一下, 移动的距离是 drawer 的宽度*/
				this.linkageElements.forEach(el => {
					this.transitionDuration(200, el);
					this.translateX(this.drawerWidth, el);
				});
				/* 此时主内容还是可以滚动, 这样不行, 这个时候我们不能让页面滚动*/
				document.addEventListener('touchmove', handler, false);
				/* 支持侧边栏滑动 和所有联动的元素滑动 */
				let recover = ()=> {
					this.transitionDuration(100, this.$refs.drawer);
					this.translateX(-this.drawerWidth, this.$refs.drawer);
					this.linkageElements.forEach(el => {
						this.transitionDuration(100, el);
						this.translateX(0, el);
					});
					/*更新状态*/
					this.$emit('input', false);
					/*移除绑定的事件*/
					this.$refs.drawer.removeEventListener('touchstart', s, false);
					this.$refs.drawer.removeEventListener('touchmove', m, false);
					this.$refs.drawer.removeEventListener('touchend', e, false);
					this.linkageElements.forEach(el => {
						el.removeEventListener('touchstart', s, false);
						el.removeEventListener('touchmove', m, false);
						el.removeEventListener('touchend', e, false);
					});
				}
				/*toushstart handler*/
				let s = (e) => {
					this.transitionDuration(0, this.$refs.drawer);
					this.linkageElements.forEach(el => {
						this.transitionDuration(0, el);
					});
					let active = e.touches.length - 1;
					this.pos.local = this.left(this.linkageElements[0]);
					this.pos.startX = e.touches[active].clientX;
					/* 一次 touch 的 起始local 点, 是固定的 */
				}
				/*toushmove handler*/
				let m = (e) =>{
					let active = e.touches.length - 1;
					this.pos.moveX = e.touches[active].clientX;
					this.pos.distance = this.pos.moveX - this.pos.startX;
					if (this.pos.distance < 0 && Math.abs(this.pos.distance) <= this.drawerWidth) {
						this.translateX(this.pos.distance, this.$refs.drawer);
						this.linkageElements.forEach(el => {
							this.translateX(this.pos.local + this.pos.distance, el);
						});
					}
				}
				let e = (e) =>{
					let curId = toArray(e.changedTouches)[0].identifier;
					this.pos.endX = e.changedTouches[0].clientX;
					this.pos.distance = this.pos.endX - this.pos.startX;
					recover();
				}
				this.$refs.drawer.addEventListener('touchstart', s, false);
				this.$refs.drawer.addEventListener('touchmove', m, false);
				this.$refs.drawer.addEventListener('touchend', e, false);
				this.linkageElements.forEach(el => {
					el.addEventListener('touchstart', s, false);
					el.addEventListener('touchmove', m, false);
					el.addEventListener('touchend', e, false);
				});
			},
			/*隐藏*/
			hide () {
				/* 首先是侧边栏肯定要自己移动一下*/
				this.transitionDuration(200, this.$refs.drawer);
				this.translateX(-this.drawerWidth, this.$refs.drawer);
				/* 其次, 所有的联动元素都要移动一下, 移动的距离是 drawer 的宽度*/
				this.linkageElements.forEach(el => {
					this.transitionDuration(200, el);
					this.translateX(0, el);
				});
				document.removeEventListener('touchmove', handler, false);
				this.$emit('input', false);
			},
			translateX (value,el) {
				el.style.transform = 'translate3d(' + value + 'px, 0, 0)';
			},
			transitionDuration (ms,el) {
				el.style.transitionDuration = ms + 'ms';
			},
			left (el) {
				return el.getBoundingClientRect().left;
			}
		}
	}
</script>