<style lang="less">
// body {
// 	ov
// }
.wc-side-menu-container {
	position: fixed;
	top:0;
	left: 0;
	// height: 100%;
	// right: 0;
	bottom: 0;	
	background: yellow;
	
	transform: translate(-100%);
	z-index: 100;
	overflow: scroll;
	// transition:
	// transitionDura
	
}
.test {
	position: absolute;
	top:0;
	right: 0;
	bottom: 0;
	left: 0;
	background: blue;
	pointer-events: none;
	opacity: 0.2;
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
				default () {
					return [];
				}
			},
			// value: {
			// 	default: false
			// },
/*
menu, content

menu 动, content 不动 
menu 动, content 动
menu 不动, content 动
menu 不动, content 动 // 这个不管. 
*/

			mode: {
				default () {
					return ['menu'];
				}
			}
		},
		// computed: {

		// },
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



		// watch: {
		// 	value (show) {
		// 		if (show) {
		// 			this.show();
		// 		}

		// 		//  else {
		// 		// 	this.hide();
		// 		// }
		// 	}
		// },
		// mounted () {



		// },
		methods: {
			transitionend () {
				console.log('transitionDuration')
				this.$refs.drawer.style.position = 'absolute';
				// this.$refs.drawer.style.top = document.body.scrollTop;
								this.$refs.drawer.style.top = document.documentElement.scrollTop + 'px'


			},
			/* 获取所有的需要联动的页面上的元素 */
			getLinkageElements () {
				this.linkageElements = this.move.map((selector) => {
					return document.querySelector(selector);
				}).filter(el=>{
					/*过滤掉所有的无效选择器*/
					return el !== null;
				})
			},
			show () {
				console.log('hello?')
				// this.$refs.drawer.addEventListener('transitionend', ()=>{
				// 	console.log('xxxx')
				// },false)



				document.body.style.overflow = 'hidden'



			this.getLinkageElements();
			this.drawerWidth = this.$refs.drawer.clientWidth;


			console.log(this.drawerWidth)

			if (this.mode.indexOf('menu') == -1 && this.mode.indexOf('content') > -1) {
				alert('relayout')

				// this.$refs.drawer.style.position = 'absolute';
				// this.$refs.drawer.style.height = '100%';



				// document.addEventListener('touchmove', ()+)


				// this.$refs.drawer.translateX(0)
				this.translateX(0, this.$refs.drawer);

				this.linkageElements.forEach(el=>{
					el.style.zIndex = 101;
					// console.log(getComputedStyle(el).position)
					if (getComputedStyle(el).position == 'static') {
						el.style.position = 'relative'
					} else if (getComputedStyle(el).position == 'fixed'){
						// el.style.position = 
						el.style.zIndex = 200;
					}
					// if ()
					
				})


			}






/*
在第二次点击, 和第一次之后, 
都执行到这里了, 但是没有触发. 

*/
				if (this.mode.indexOf('menu') > -1) {
					console.log('fdffddf')

					// this.$refs.drawer.style.left = '200px'
					/* 首先是侧边栏肯定要自己移动一下*/
					this.transitionDuration(200, this.$refs.drawer);
					this.translateX(0, this.$refs.drawer);

				}

				if (this.mode.indexOf('content') > -1) {
					/* 其次, 所有的联动元素都要移动一下, 移动的距离是 drawer 的宽度*/
					this.linkageElements.forEach(el => {
						this.transitionDuration(200, el);
						this.translateX(this.drawerWidth, el);
					});					
				}

				/* 此时主内容还是可以滚动, 这样不行, 这个时候我们不能让页面滚动*/
				// document.addEventListener('touchmove', handler, false);

				// setTimeout(()=>{
				// console.log('transitionDuration')
				// this.$refs.drawer.style.position = 'absolute';
				// // this.$refs.drawer.style.top = document.body.scrollTop;
				// 				this.$refs.drawer.style.top = document.documentElement.scrollTop + 'px'

				// },2000)


// 				var div = document.createElement('div');
// 				div.className = 'test'
// 				div.style.zIndex = 1000;

// div.style.top = document.documentElement.scrollTop + 'px'


// 				this.translateX(this.drawerWidth, div);

// 				document.body.append(div);


// document.querySelector('.test').addEventListener('touchmove', (e)=>{
// 	e.preventDefault();
// },false)






				/* 支持侧边栏滑动 和所有联动的元素滑动 */
				let recover = ()=> {


				this.linkageElements.forEach(el => {
					el.removeEventListener('click', recover, false);
					// el.addEventListener('touchstart', s, false);
					// el.addEventListener('touchmove', m, false);
					// el.addEventListener('touchend', e, false);
				});





					document.body.style.overflow = 'auto'


					if (this.mode.indexOf('menu') > -1) {
						this.transitionDuration(100, this.$refs.drawer);
						this.translateX(-this.drawerWidth, this.$refs.drawer);

						setTimeout(()=>{
							this.transitionDuration(0, this.$refs.drawer);
						}, false);

					}

					if (this.mode.indexOf('content') > -1) {
						this.linkageElements.forEach(el => {
							this.transitionDuration(100, el);
							this.translateX(0, el);
						});

					}

					if (this.mode.indexOf('menu') == -1 && this.mode.indexOf('content') > -1) {

						// this.$refs.drawer.style.zIndex = 50;
						// this.$refs.
						this.translateX(-this.drawerWidth, this.$refs.drawer);

						// this.linkageElements.forEach(el=>{
						// 	if (getComputedStyle(el).position == 'fixed'){
						// 		// el.style.position = 
						// 		el.style.zIndex = 90;
						// 	}
						// 	// if ()
							
						// })


					}



				// this.linkageElements.forEach(el => {
				// 	el.removeEventListener('click', recover, false);
				// 	// el.addEventListener('touchstart', s, false);
				// 	// el.addEventListener('touchmove', m, false);
				// 	// el.addEventListener('touchend', e, false);
				// });






					/*更新状态*/
					// this.$emit('input', false);
					/*移除绑定的事件*/
					// this.$refs.drawer.removeEventListener('touchstart', s, false);
					// this.$refs.drawer.removeEventListener('touchmove', m, false);
					// this.$refs.drawer.removeEventListener('touchend', e, false);



					// this.linkageElements.forEach(el => {
					// 	el.removeEventListener('touchstart', s, false);
					// 	el.removeEventListener('touchmove', m, false);
					// 	el.removeEventListener('touchend', e, false);
					// });



				// document.removeEventListener('touchmove', handler, false);
				// this.$emit('input', false);




				}
				/*toushstart handler*/
				let s = (e) => {
					// e.stopProgapation();
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
					// e.stopProgapation();
					let active = e.touches.length - 1;
					this.pos.moveX = e.touches[active].clientX;
					this.pos.distance = this.pos.moveX - this.pos.startX;

					/*移动的逻辑

						只有往左边移动才允许, 并且往左边移动的距离只能是 drawer 的宽度 最大. 

						当 mode 里面有 content 的时候, 才会被允许移动

					*/
					if (this.pos.distance < 0 && Math.abs(this.pos.distance) <= this.drawerWidth) {

						if (this.mode.indexOf('menu') > -1) {
							this.translateX(this.pos.distance, this.$refs.drawer);
						}

						if (this.mode.indexOf('content') > -1) {
							this.linkageElements.forEach(el => {
								this.translateX(this.pos.local + this.pos.distance, el);
							});							
						}


					}

				}
				let e = (e) =>{
					// e.stopProgapation();
					let curId = toArray(e.changedTouches)[0].identifier;
					this.pos.endX = e.changedTouches[0].clientX;
					this.pos.distance = this.pos.endX - this.pos.startX;
					recover();
				}
				// this.$refs.drawer.addEventListener('touchstart', s, false);
				// this.$refs.drawer.addEventListener('touchmove', m, false);
				// this.$refs.drawer.addEventListener('touchend', e, false);
				this.linkageElements.forEach(el => {
					el.addEventListener('click', recover, false);
					// el.addEventListener('touchstart', s, false);
					// el.addEventListener('touchmove', m, false);
					// el.addEventListener('touchend', e, false);
				});














			},
			// /*隐藏*/
			// hide () {
			// 	/* 首先是侧边栏肯定要自己移动一下*/


			// 	if (this.mode.indexOf('menu') > -1) {
			// 		console.log('shall me')
			// 		this.transitionDuration(200, this.$refs.drawer);
			// 		this.translateX(-this.drawerWidth, this.$refs.drawer);

			// 	}


			// 	if (this.mode.indexOf('content') > -1) {

			// 		/* 其次, 所有的联动元素都要移动一下, 移动的距离是 drawer 的宽度*/
			// 		this.linkageElements.forEach(el => {
			// 			this.transitionDuration(200, el);
			// 			this.translateX(0, el);
			// 		});


			// 	}














			// },
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