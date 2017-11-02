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
	// background: red;
	background: red;
	opacity: 0.2;
	top: 0;
	left: 0;

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
					return ['drawer'];
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
				// console.log(n)
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
			// this.addOverlay();
			// this.overlay = document.querySelector('.overlay');
		},
		methods: {

			/* 开始唤起 drawer */
			show () {
				// console.log('??')
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
					}
					this.linkageElements[0].addEventListener('transitionend', handler, false);
				}
				/* 
					其他方面 
					1 drawer 出现的时候, content 不允许滚动
					2 点击剩余的内容区域, 可以关闭 drawer
					3 为 body 加一层 overlay, 要不然主内容里面的链接是可以点击的. 
				*/
				// this.overlay.style.display = 'block';
				/* pc 上生效 */
				document.body.style.overflow = 'hidden';

				/* 其实不设置位置也可以, 反正 drawer 的层级最高*/
				this.addOverlay();

				/* 禁用 overlay 的 touchmove*/

				this.overlay = document.querySelector('.wc-drawer-overlay')

				this.overlay.addEventListener('touchmove' , e=>{
					e.preventDefault();
				}, false);

				/* 支持点击 overlay 可以关闭弹窗*/

				setTimeout(()=>{
					this.overlay.addEventListener('click', this.hide, false);
				}, 10);
				




				/* 
					点击剩余的内容区域, 可以关闭 drawer 
					这个转交给 transition 结束来做. 
					不能转给 transitionend 来做, 因为drawer 不动的时候, 
					transitionend 不会触发, 导致问题. 
				*/
				// setTimeout(()=>{
				// 	this.linkageElements.addEventListener('click', this.hide, false);
				// },10);
				this.$emit('input', true)
			},
			hide () {
				// console.log(+new Date())
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

				/* 删除 overlay*/
				document.body.removeChild(this.overlay);



				// this.overlay.removeEventListener('click', this.hide, false);
				this.$emit('input', false);
				// this.overlay.style.display = 'none';
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
						// this.translateX(this.drawerWidth, this.overlay);
					}
					if (this.from == 'right') {
						this.translateX(-this.drawerWidth, el);
						// this.translateX(-this.drawerWidth, this.overlay);
					}
				})
			},
			recoverContent () {
				this.linkageElements.forEach(el => {
					/* 恢复之前的样子 */
					this.transitionDuration(this.duration, el);
					this.translateX(0, el);
					// this.translateX(0, this.overlay);
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
				// div.style.position = 'absolute';
				// div.style.zIndex = 8888;
				// div.style.left = 0;
				// div.style.top = 0;
				// div.style.width = '100%';
				// div.style.height = document.body.clientHeight + 'px'
				// div.style.opacity = 0;
				// div.className = 'overlay'
				// document.body.appendChild(div);	
				// div.style.display = 'none';
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