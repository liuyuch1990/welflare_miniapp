<template>
	<view class="container">
		<!-- 收货地址 -->
		<van-cell-group>
			<van-cell class='address-cell' is-link link-type="navigateTo" url="./address">
				<view class="address-info">
					<p>收货人：{{addressInfo.receiverName||'-'}}</p>
					<p>手机号码：{{addressInfo.receiverPhone||'-'}}</p>
					<p type="primary">收货地址：{{address||'-'}}</p>
				</view>
<!-- 				<view class="address-info" v-else>
					<p>收货人：{{newAddress.orderName||'-'}}</p>
					<p>手机号码：{{newAddress.orderTel||'-'}}</p>
					<p type="primary">收货地址：{{newAddress.orderAddress||'-'}}</p>
				</view> -->
			</van-cell>
		</van-cell-group>
		<!-- 收货地址END -->
		<!-- 商品 -->
		<van-cell-group v-for="(item,index) in goodsList">
			<van-cell :title="item.goodsName">
				<van-tag type="info">{{item.goodsName}}</van-tag>
				<van-card :desc="item.info.goodsContent" :title="item.info.goodsName" :thumb="baseUrl+item.info.coverPath"
					:num="item.info.goodsNum">
				</van-card>
			</van-cell>
		</van-cell-group>
		<!-- 商品END -->

		<!-- 去下单 -->
		<view class="content-bottom">
			<van-submit-bar :loading="submitLoading" :price="length*100" currency="共" decimal-length="0" suffix-label="种商品" button-text="下单"
				safe-area-inset-bottom='true' @submit="onSubmit" >
			</van-submit-bar>
		</view>
		<!-- 去下单END -->
	</view>
</template>

<script>
	var _self;
	export default {
		data() {
			return {
				baseUrl:uni.getStorageSync('baseUrl'),
				submitLoading:false,
				//商品数据
				goodsList: [],
				//用户的默认地址
				addressInfo: {},
				//用户用来下单的地址
				address: '',
				//商品数量
				length: '',
				//用户地址改变后的新地址
				newAddress:'',
				//获取要下单的商品
				goodsAddOrders:[],
				titleQuato:"",
			}
		},
		onLoad(option) {
			console.log(option,222)
			// 	var item=JSON.parse(option.item)
			console.log(!option.item,333)
			if(!option.item){
				console.log('没有地址,获取默认')
				//获取用户的默认地址
				const params = {
					"url": this.ssdapi.getAddress.url,
					"content-type": this.ssdapi.getAddress.contentType,
				}
				this.request.getRequest(params).then((res => {
					res.forEach((v) => {
						if (v.isDef == 1) {
							//找到默认地址，并赋值
							this.addressInfo = v;
						this.address = this.addressInfo.areaName + this.addressInfo.addrContent
						}
					});
				}))
			}else{
				var item=JSON.parse(option.item)
				console.log(item,'有地址')
				this.addressInfo=item
				this.address = this.addressInfo.areaName + this.addressInfo.addrContent
			
			}
			
			
			//获取商品数量
			this.goodsList = [];
			this.goodsList = uni.getStorageSync("orderData");
			//获取要下单的商品
			this.goodsList.forEach((good)=>{
				var item={};
				item=good.info;
				item.goodsId=good.goodsId;
				item.goodsType=good.goodsType;
				this.goodsAddOrders.push(item);
			})
			this.length = uni.getStorageSync('length');
		
		},
		onShow() {
		},
		methods: {
			//下订单的事件
			checkTrue(){
				//获取用户用来下单的信息
				const params = {
					"url": this.ssdapi.createOrder.url,
					"content-type": this.ssdapi.createOrder.contentType,
					payload: {
						orderName: this.addressInfo.receiverName,
						orderTel: this.addressInfo.receiverPhone,
						orderAddress: this.addressInfo.areaName + this.addressInfo.addrContent,
						orderGoodsJson: this.goodsAddOrders,
					}
				}
				this.request.postRequest(params).then((res) => {
					this.submitLoading=false;
					uni.showModal({
						title: '兑换成功',
						showCancel: true,
						cancelText: '返回首页',
						confirmText: '查看订单',
						success: function(res) {
							if (res.confirm) {
								console.log('用户点击确定');
								setTimeout(()=>{
									uni.switchTab({
										url: '../order/index'
									})
								},1000)
							} else {
								console.log('用户点击取消');
								setTimeout(()=>{
									uni.switchTab({
										url: '../index/index'
									})
								},1000)
							}
						}
					})
				
				
					//1.下单商品从购物车清空
					uni.removeStorageSync('shopcart')
					uni.setStorageSync('length',0)
					
				}).catch((res)=>{
					
					this.submitLoading=false;
					if(res.resultCode==40000){
						uni.showToast({
							title:'地址不能为空',
							icon:'none',
						})
						}
					
				})
			},
			
			//提交订单
			onSubmit() {
				this.submitLoading=true;
				// console.log(!this.newAddress,'this.newAddress')
				if (!this.addressInfo) {
					uni.showToast({
						title: '下单失败,请先选择地址!',
						icon:'none',
						duration:1000,
					})
					this.submitLoading=false;
				} else {
					//获取用户用来下单的信息
					const params = {
						"url": this.ssdapi.checkOrder.url,
						"content-type": this.ssdapi.checkOrder.contentType,
						payload: {
							orderName: this.addressInfo.receiverName,
							orderTel: this.addressInfo.receiverPhone,
							orderAddress: this.addressInfo.areaName + this.addressInfo.addrContent,
							orderGoodsJson: this.goodsAddOrders,
						}
					}
					//用来下单检验
					this.request.postRequest(params).then((res) => {
								
									this.checkTrue();
						
					}).catch((res)=>{
						this.submitLoading=false;
						if(res.resultCode==50000){
							uni.showToast({
								title:res.message,
								icon:'none',
							})
							}
						else if(res.resultCode==60000){
							uni.showToast({
								title:res.message,
								icon:'none',
							})
						}else if(res.resultCode==70000){
							this.titleQuato = "您兑换的商品数量小于可兑换数量，此次兑换后余额清0，剩余的商品不可进行二次兑换，确认继续兑换吗？";
							uni.showModal({
							    content: this.titleQuato,
								confirmText:'继续兑换',
								cancelText:'取消',
							    success:  (res)=> {
							        if (res.confirm) {
							            console.log('用户点击确定');
										this.checkTrue();
							        }else{
										console.log('用户点击确定');
									}
							    }
							});
						}
					})

				}
			},
		},
	}
</script>

<style scoped>
	.container {
		margin-bottom: 100rpx;
	}

	.address-cell /deep/ .van-cell {
		align-items: center;
	}

	.address-info {
		text-align: left;
	}

	.content-bottom /deep/ button {
		background: #FF6700 !important;
		border: 0;
	}
</style>
