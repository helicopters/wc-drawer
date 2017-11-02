<style lang="less">
.wc-drawer-container {
	/* 这样保证不随着主体内容滚动而滚动 */
	position: fixed;
	top: 0;
	bottom: 0;
	/* 这样让 drawer 在刚开始的时候不会显示*/
	/* 这样让 drawer 可以滚动 */
	overflow: scroll;
	-webkit-overflow-scrolling: touch;
	/* 这样保证层级最高, 不会被页面上的其他元素覆盖*/
	z-index: 10000;
}
.wc-drawer-overlay {
	position: absolute;
	width: 100%;
	height: 100%;
	background: transparent;
	opacity: 0;
	top: 0;
	left: 0;
}
</style>
<template>
	<div class="wc-drawer-container" ref="drawer" @transitionend="drawerTransitionend">
		<slot/>
	</div>
</template>
<script>
	let DRAWER_MOVE = false;
	let CONTNET_MOVE = false;
	export default {
		name: 'wcDrawer',
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
					return ['content'];
				}
			},
			/* 渐变出来的时间 */
			duration: {
				default: 300
			},
			/* 从哪个方向出来 */
			from: {
				default: 'left'
			},
			value: {
				default: false
			}
		},
		data () {
			return {
				linkageElements: [],
				drawerWidth: 0,
				overlay: null
			}
		},

		watch: {
			value (n) {
				if (n) {
					this.show();
				} else {
					this.hide();
				}
			}
		},
		mounted () {
			/* 
				先找到所有的需要联动的元素
				再拿到 drawer 的宽度, 以确定 content 和 drawer 的移动宽度.
				然后确定移动的模式. 
			*/
			this.getLinkageElements();
			this.drawerWidth = this.$refs.drawer.clientWidth;
			/* 判断 content 动*/
			if (this.mode.indexOf('content') > -1) {
				CONTNET_MOVE = true;
			}
			/* 判断方向 */
			if (this.from === 'left') {
				this.$refs.drawer.style.left = 0;
				this.translateX(-this.drawerWidth, this.$refs.drawer);
			} else {
				this.$refs.drawer.style.right = 0;
				this.translateX(this.drawerWidth, this.$refs.drawer);
			}
			/* 判断 drawer 动*/
			if (this.mode.indexOf('drawer') > -1) {
				DRAWER_MOVE = true;
			} else {
				this.translateX(0, this.$refs.drawer);
				this.$refs.drawer.style.zIndex = -1;
			}
		},
		methods: {
			drawerTransitionend () {
				/* 其实不设置位置也可以, 反正 drawer 的层级最高*/
				this.addOverlay();
				/* 禁用 overlay 的 touchmove*/
				this.overlay = document.querySelector('.wc-drawer-overlay');
				/* 阻止滚动 */
				this.overlay.addEventListener('touchmove' , e=>{
					e.preventDefault();
				}, false);
				this.overlay.addEventListener('click', e=>{
					this.$emit('input', false);
				}, false);
			},
			/* 开始唤起 drawer */
			show () {
				/*
					区分不同的模式
					drawer 动, cotnent 不动
					drawer 动, cotnent 动
					drawewr 不动, content 动
				*/
				/* drawer 动, cotnent 不动 */
				if (DRAWER_MOVE && !CONTNET_MOVE) {
					this.moveDrawer();			
				}
				/* drawer 动, cotnent 动 */
				if (DRAWER_MOVE && CONTNET_MOVE) {
					this.moveDrawer();
					this.moveContent();
				}
				/* drawewr 不动, content 动 */
				if (!DRAWER_MOVE && CONTNET_MOVE) {
					this.moveContent();
					let handler = ()=>{
						this.$refs.drawer.style.zIndex = 1;
						this.linkageElements[0].removeEventListener('transitionend', handler, false);
						this.drawerTransitionend();
					}
					this.linkageElements[0].addEventListener('transitionend', handler, false);
				}

				document.body.style.overflow = 'hidden';

				this.$emit('input', true);

			},
			hide () {
				/* 删除 overlay*/
				document.body.removeChild(this.overlay);
				/* drawer 动, cotnent 不动 */
				if (DRAWER_MOVE && !CONTNET_MOVE) {
					this.recoverDrawer();			
				}
				/* drawer 动, cotnent 动 */
				if (DRAWER_MOVE && CONTNET_MOVE) {
					this.recoverDrawer();
					this.recoverContent();
				}
				/* drawewr 不动, content 动 */
				if (!DRAWER_MOVE && CONTNET_MOVE) {
					this.$refs.drawer.style.zIndex = -1;
					this.recoverContent();
				}	
				/* 其他操作
				   允许滚动
				   解绑点击事件
				*/
				document.body.style.overflow = 'auto';
				this.$emit('input', false);
			},
			/* 显示 drawer */
			moveDrawer () {
				this.transitionDuration(this.duration, this.$refs.drawer);
				this.translateX(0, this.$refs.drawer);					
			},
			/* 隐藏 drawer */
			recoverDrawer () {
				this.transitionDuration(this.duration, this.$refs.drawer);
				if (this.from == 'left') {
					this.translateX(-this.drawerWidth, this.$refs.drawer);	
				}
				if (this.from == 'right') {
					this.translateX(this.drawerWidth, this.$refs.drawer);
				}
			},
			moveContent () {
				this.linkageElements.forEach(el=>{
					/*  fixed bug: 
						fixed 元素在使用 transform 的时候导致不显示, 需要设置一个z-index 来控制
						需要为 fixed 元素指定一个 zIndex 
					*/
					let position = getComputedStyle(el).position;
					if (position === 'fixed') {
						el.zIndex = getComputedStyle(el).zIndex;
						el.style.zIndex = 9999;
					}
					this.transitionDuration(this.duration, el);
					if (this.from == 'left') {
						this.translateX(this.drawerWidth, el);
					}
					if (this.from == 'right') {
						this.translateX(-this.drawerWidth, el);
					}
				})
			},
			recoverContent () {
				this.linkageElements.forEach(el => {
					/* 恢复之前的样子 */
					this.transitionDuration(this.duration, el);
					this.translateX(0, el);
					/* 这个解决一个 bug: 如果只有 content 动的话, 在恢复之后, fixed 元素的 fixed 失效*/
					el.style.transform = null;
				});					
			},
			translateX (value,el) {
				el.style.transform = 'translateX(' + value + 'px)';
			},
			transitionDuration (ms,el) {
				el.style.transitionDuration = ms + 'ms';
			},
			/* 添加遮罩层 */
			addOverlay () {
				let div = document.createElement('div');
				div.className = 'wc-drawer-overlay';
				document.body.appendChild(div);
			},
			/* 获取在侧边栏出来的时候, 所有需要跟着移动的页面元素 */
			getLinkageElements () {
				this.linkageElements = this.move.map((selector) => {
					return document.querySelector(selector);
				}).filter(el=>{
					/*过滤掉所有的无效选择器*/
					return el !== null;
				})
			}
		}
	}
</script>