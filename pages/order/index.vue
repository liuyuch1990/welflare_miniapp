<template>
	<view>
		<van-tabs v-model="active" @click="changeTab" sticky="true">
			<van-tab v-for="(tab,tabIndex) in tabList" :title=tab  :key="tabIndex" :name='tab'>
				<van-list v-model="loading"  :finished="finished" finished-text="没有更多了" @load="onLoad">
					<!-- 订单卡片 -->
					<view v-for="item,index in orderList" :key="index" class="order">
						<view class="header">
							<view class="left_margin">订单编号:{{item.orderNumber}}</view>
							<view class="right_margin">{{item.orderTime}}</view>
						</view>
						<!-- 商品列表 -->
						<view class="good_list" v-for="good in item.orderGoods" :key=index>
							<van-card :num=good.goodsNum  :desc=good.typeName :title=good.goodsName
								:thumb="baseUrl+'/wsp-boot'+good.picSavepath" />

						</view>
						<!-- 物流信息 -->
						<view class="logistics">
							<view class="left_margin">{{item.status==0?'待发货':item.status==1?'已发货':'已取消'}}</view>


							<view class="right_margin">共{{item.orderGoods.length}}件商品</view>

						</view>
						<view class="left_margin">收货人：{{item.orderName}},{{item.orderTel}}</view>
						<view class="left_margin">收货地址：{{item.orderAddress}}</view>
						<!-- 按钮 -->


						<view v-if="item.status==1" >

							<view v-for="logistic,logIndex in item.express" >
								<view class="logistics_line">
									<view class="left_margin">{{logistic.logisticsCompany}} : {{logistic.courierNumber}}</view>
									<van-button v-if="logIndex==activeLogis&&index==activeIndex" class="right_margin" style="padding-right:20rpx;" type="primary" size="small" @click="viewLogistics(item,logIndex,index)">收起物流信息</van-button>
									<van-button v-else class="right_margin" style="padding-right:20rpx;" type="primary" size="small" @click="viewLogistics(item,logIndex,index)">展开物流信息</van-button>
								</view>
								<van-steps v-if="logIndex==activeLogis&&index==activeIndex" direction="vertical" active-color="#1E90FF" active="0" :steps="steps">
						</van-steps>
						</view>


						</view>



						<view v-if="item.status==0" class="button_group">
							<van-button style="padding-right:20rpx;" type="primary" size="small" plain @click="cancelOrder(item)">取消订单</van-button>
							<van-button style="padding-right:20rpx;" size="small" type="primary" @click="changeAddress(item)">修改地址</van-button>
						</view>
						<view v-if="item.status==1" class="button_group">
							<van-button style="padding-right:20rpx;" type="primary" size="small" plain @click="rollBackOrder(item,3)">申请退货</van-button>
							<van-button style="padding-right:20rpx;" size="small" type="primary" @click="rollBackOrder(item,4)">申请换货</van-button>
						</view>
					</view>
				</van-list>

			</van-tab>
		</van-tabs>
	</view>
</template>

<script>

	import {
		userOrderList,rollBackOrder,cancelOrder,queryLogis
	} from '@/api/api.js';
	import {
		GoodsTypeVariable
	} from "@/utils/Variable";
	export default {
		data() {
			return {
				activeLogis:-1,
				activeIndex:-1,
					steps:[],
				tabList: ['全部','待发货','已发货','已取消','待退货','待换货'],
				activeTab:'',
				orderList: [],
				orderStatus: "未付款",
				status:'',
				baseUrl:uni.getStorageSync('baseUrl'),
			}
		},
		onShow() {
			this.getOrderList(this.status)
			this.$nextTick(() => {
				// DOM 更新完毕
				// this.active = 0
				this.active = "待发货"
			})
		},
		methods: {

			viewLogistics(item,logIndex,orderIndex){

				if(logIndex==this.activeLogis&&orderIndex==this.activeIndex){
					//收起
					this.activeLogis=-1
					this.activeIndex=-1;
				}else{
					//展开当前
					this.activeLogis=logIndex;
					this.activeIndex=orderIndex;

					//获取物流信息
					var params = {
						"url": queryLogis.url+'?orderId='+item.express[logIndex].courierNumber,
						"content-type": queryLogis.contentType,
						payload: {
							orderId:item.express[logIndex].courierNumber,

						}
					}
					this.steps=[]
					this.request.getRequest(params).then(res => {
					var infos=JSON.parse(res)
					infos.forEach(item=>{
						var info={};
						info.desc=item.context;
						info.text=item.ftime
						this.steps.push(info)
					})
					})



				}

			},
			changeAddress(item){
				const param=JSON.stringify(item.orderId)
				uni.navigateTo({
					url:'./addressChange?param='+encodeURIComponent(JSON.stringify(param))
				})

			},
			cancelOrder(item){
				let that=this;
				uni.showModal({
				    title: '取消订单',
				    content: '订单取消后无法恢复，确定要取消吗？',
					confirmText:'确认取消',
					cancelText:'我再想想',
					confirmColor:'#ff6700',
					cancelColor:'#C0C0C0',
				    success: function (res) {
				        if (res.confirm) {
							var params = {
								"url": cancelOrder.url+item.orderId,
								"content-type": cancelOrder.contentType,
								// payload: {
								// 	// orderNumber:'',
								// 	// startTime:'',
								// 	// endTime:'',
								// }
							}
							that.request.getRequest(params).then(res => {
								uni.showToast({
								    title: '取消成功',
								    duration: 2000
								});
								that.$nextTick(() => {
									// DOM 更新完毕
									that.active = 0
								})
									that.getOrderList('');
							})




				        } else if (res.cancel) {
				            // console.log('用户点击取消');
				        }
				    }
				});
			},
			rollBackOrder(item, i){
				let title = i == 3? '退货': '换货'
				let that=this;
				uni.showModal({
					title: title,
					content: '确定要'+ title + '吗？',
					confirmText:'确认',
					cancelText:'我再想想',
					confirmColor:'#ff6700',
					cancelColor:'#C0C0C0',
					success: function (res) {
						if (res.confirm) {
							let params = {
								"url": rollBackOrder.url,
								"content-type": rollBackOrder.contentType,
								payload: {
									orderId: item.orderId,
									status: i + ''
									// endTime:'',
								}
							}
							that.request.postRequest(params).then(res => {
								uni.showToast({
									title: '退换成功',
									duration: 2000
								});
								that.$nextTick(() => {
									// DOM 更新完毕
									that.active = 0
								})
								that.getOrderList('');
							})




						} else if (res.cancel) {
							// console.log('用户点击取消');
						}
					}
				});
			},
			changeTab(e){
				this.status=e.target.index;
				if(this.status==0){
					this.getOrderList('');
				}else{
					this.getOrderList(this.status-1);
				}
			},
			getOrderList(status) {
				var params = {
					"url": userOrderList.url,
					"content-type": userOrderList.contentType,
					payload: {
						// orderNumber:'',
						// startTime:'',
						// endTime:'',
						status:status,
						pageSize: 200,
						pageNum: 1

					}
				}
				this.request.postRequest(params).then(res => {
					this.orderList=res;
					this.orderList.forEach((item) => {
					item.orderGoods.forEach((v) => {
						GoodsTypeVariable.forEach((k) => {
							if (v.goodsType == k.goodsType) {
								v.typeName = k.typeName;
							}
						});
					});
					});

						console.log(this.orderList,'转换后')
				})


			}

		}
	}
</script>

<style scoped>
	.order {
		margin-top: 20rpx;
		background-color: #FFFFFF;
		margin: 20rpx;
	}

	.header {
		padding-top: 20rpx;
		display: flex;
		justify-content: space-between;
	}

	.left_margin {
		padding-left: 20rpx;
		font-size: 24rpx;
		padding-bottom: 10rpx;
	}

	.right_margin {
		padding-right: 20rpx;
		font-size: 24rpx;
		padding-bottom: 10rpx;
	}

	.logistics {
		padding-top: 10rpx;
		display: flex;
		justify-content: space-between;
		padding-bottom: 10rpx;
	}

	.good_list {
		padding: 20rpx;
	}

	.button_group {
		display: flex;
		justify-content: flex-end;
		padding-bottom: 20rpx;
		padding-top: 20rpx;

	}
	.logistics_line{
			display: flex;
		justify-content: space-between;
		padding-top: 10rpx;
	}
	.logistics_group{
		padding-top: 20rpx;
		padding-bottom: 20rpx;
	}
</style>
