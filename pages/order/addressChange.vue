<template>
	<view>
		<van-notice-bar   wrapable
 :scrollable="false" text="修改地址会影响物流失效,只能修改一次。若商品已发货,则无法修复地址,请您谅解" />

		<view>
			<view class="header">
				<view class="left_margin">选择收货地址</view>
				<view class="right_margin" @click="newAddress">添加新地址</view>
			</view>

			<van-radio-group v-model="radio"  @change="onChange">
				<van-cell-group>
				    <van-cell  v-for="(item,index) in addressList" icon="shop-o"  :label="item.areaName+item.addrContent" clickable  >
				     <template #title>
				       <span class="custom-title">{{item.receiverName+' : '+item.receiverPhone}}</span>
				       <van-tag type="info">{{item.addrName}}</van-tag>
				     </template>
					  <template #right-icon>
				        <van-radio :name="index" />
				      </template>
				    </van-cell>
				  </van-cell-group>
			</van-radio-group>
		</view>
		<van-button class="bottom_button" type="primary" block color="#ff6700" @click="changeAddress()" :disabled="radio==-1">确认修改</van-button>
	</view>

</template>

<script>
	import {
		userAddList,editAddress
	} from '@/api/api.js';

	export default {
		data() {
			return {
				addressList: [1, 2, 3, 4, 5],
				radio: -1,
				orderId:''

			}
		},
		onShow() {
			this.getAddList()
		},
		onLoad(option){
			const item = JSON.parse(decodeURIComponent(option.param));
					this.orderId=item;
		},
		methods: {
			getAddList() {
				var params = {
					"url": userAddList.url,
					"content-type": userAddList.contentType,
			// 		payload: {
			// 			// orderNumber:'',
			// 			// startTime:'',
			// 			// endTime:'',
			// 			status:status,
			// 			pageSize: 20,
			// 			pageNum: 1
			
			// 		}
				}
				this.request.getRequest(params).then(res => {
					console.log(res)
					this.addressList=res;
						
				})
			
			
			},
			onChange(event){
				this.radio=event.detail;
			},
			changeAddress() {
				const item=this.addressList[this.radio];
				var params = {
						"url": editAddress.url,
						"content-type": editAddress.contentType,
						payload: {
							orderName :item.receiverName,
							orderTel:item.receiverPhone,
							orderAddress:item.areaName+item.addrContent,
							orderId:this.orderId
						}
					}
					//等接口改正后再调
					this.request.postRequest(params).then(res => {
						// console.log(res)
						// this.addressList=res.data;
						uni.showToast({
						    title: '修改成功',
						    duration: 2000
						});
						
						setTimeout(res => {
						uni.navigateBack({
							delta:1
						})
						}, 2000)
						
						
						
							
					})

			},
			
			changeTab(e) {
				var status = e.target.index;
				if (status == 0) {
					this.getOrderList('');
				} else {
					this.getOrderList(status - 1);
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
						status: status,
						pageSize: 20,
						pageNum: 1

					}
				}
				this.request.postRequest(params).then(res => {
					console.log(res)
					this.orderList = res;

				})


			},
			newAddress(){
				const item={};
				uni.navigateTo({
					url:'../personal/newAddress?param='
				})
				
			}

		}
	}
</script>

<style scoped>
	.header {
		padding-top: 20rpx;
		display: flex;
		justify-content: space-between;
	}

	.left_margin {
		padding-left: 20rpx;
		font-size: 24rpx;
		padding-bottom: 10rpx;
		color: #808080;
	}

	.right_margin {
		padding-right: 20rpx;
		font-size: 24rpx;
		padding-bottom: 10rpx;
		color: #007AFF;
	}
	  .custom-title {
	    margin-right: 10rpx;
	    vertical-align: middle;
	  }
	  .bottom_button{
	  	width: 95%;
	  	position: fixed;
	  	bottom: 10rpx;
	  	left:2.5%;
	  	border-radius: 10rpx;
	  }
</style>
