* 侧边栏出来之后, 内容区域不能滚动, 但是侧边栏可以

* 暂时让侧边栏不能滚动. 

position:fixed 滚动穿透. 

topbar 不能是 fixed, 否则没办法移动, 或者说, 这个玩意还的额外处理一下 topbar 

我在实现过程中, 有哪些问题, 需要思考哪些问题, 我自己都是清楚的, 不需要记录下来. 

局部滚动会可以允许整个页面进行滚动
模拟

3种模式 

不可滑动的行为模式

滚动行为，放元素或者链接过去之后的操作模式 


直接滚动 body



linkageElements: [], 我觉得比 all 好. 

fixed 元素始终会在顶层, 即使其他元素的 z-index 比它高. 比它高也没有用. 

这个就导致了内容动, drawer 不动的情况下, 布局不能使用 fixed, 只能用 absolute 模拟

  
z-index只能在position属性值为relative或absolute或fixed的元素上有效。  

可以通过 fixed 元素来遮住微信的背景, 还可以做一个固定的背景. 