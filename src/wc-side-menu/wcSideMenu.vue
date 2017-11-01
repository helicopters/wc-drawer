<style lang="less" scoped>
.wc-drawer-container {
	/* 这样保证不随着主体内容滚动而滚动 */
	position: fixed;
	top: 0;
	left: 0;
	bottom: 0;
	/* 这样让 drawer 在刚开始的时候不会显示*/
	transform: translateX(-100%);
	/* 这样让 drawer 可以滚动 */
	overflow: scroll;
	-webkit-overflow-scrolling: touch;
	/* 这样保证层级最高, 不会被页面上的其他元素覆盖*/
	z-index: 10000;
}
</style>
<template>
	<div class="wc-drawer-container" ref="drawer">
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
			}
		},
		data () {
			return {
				linkageElements: [],
				drawerWidth: 0
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
			/* content 动*/
			if (this.mode.indexOf('content') > -1) {
				CONTNET_MOVE = true;
			}
			/* drawer 动*/
			if (this.mode.indexOf('drawer') > -1) {
				DRAWER_MOVE = true;
			} else {
				this.translateX(0, this.$refs.drawer);
				this.$refs.drawer.style.zIndex = -1;
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
				}
				/* 
					其他方面 
					1 drawer 出现的时候, content 不允许滚动
					2 点击剩余的内容区域, 可以关闭 drawer
				*/
				/* pc 上生效 */
				document.body.style.overflow = 'hidden';

				/* 
					点击剩余的内容区域, 可以关闭 drawer 
					这个转交给 transition 结束来做. 
					不能转给 transitionend 来做, 因为drawer 不动的时候, 
					transitionend 不会触发, 导致问题. 
				*/
				setTimeout(()=>{
					this.linkageElements.forEach(el => {
						el.addEventListener('click', this.hide, false);
					});						
				},10)
			},

			hide () {
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
					this.recoverContent();
				}	
				/* 其他操作
					恢复
				*/
				document.body.style.overflow = 'auto';
				this.linkageElements.forEach(el => {
					el.removeEventListener('click', this.hide, false);
				});	
			},

			/* 显示 drawer */
			moveDrawer () {
				this.transitionDuration(this.duration, this.$refs.drawer);
				this.translateX(0, this.$refs.drawer);					
			},
			moveContent () {
				this.linkageElements.forEach(el=>{
					/* fixed bug: fixed 元素在使用 transform 的时候导致不显示, 需要设置一个
					   z-index 来控制 
					*/
					el.style.zIndex = 1;
					this.transitionDuration(this.duration, el);
					this.translateX(this.drawerWidth, el);
				})
			},
			/* 隐藏 drawer */
			recoverDrawer () {
				this.transitionDuration(this.duration, this.$refs.drawer);
				this.translateX(-this.drawerWidth, this.$refs.drawer);				
			},
			recoverContent () {
				console.log('shiwo ')
				this.linkageElements.forEach(el => {
					this.transitionDuration(this.duration, el);
					this.translateX(0, el);
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