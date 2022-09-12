<template>
	<view>

		<view>
			<view class="header">
				<view class="left_margin">选择收货地址</view>
				<view class="right_margin" @click="changeAdd">添加新地址</view>
			</view>

			<van-radio-group v-model="radio"  @change="onChange">
				<van-cell-group>
				    <van-cell  v-for="(item,index) in addressList" icon="shop-o"  :label="item.areaName+item.addrContent" clickable  >
				     <template #title>
				       <span class="custom-title">{{item.receiverName+' : '+item.receiverPhone}}</span>
				       <van-tag type="info">{{item.addrName}}</van-tag>
					   <van-tag v-if="item.isDef==1" type="primary">默认</van-tag>
				     </template>
					  <template #right-icon>
				        <van-radio :name="index" />
				      </template>
				    </van-cell>
				  </van-cell-group>
			</van-radio-group>
		</view>
		<van-button class="bottom_button" type="primary" block color="#ff6700" @click="changeAddress()" :disabled="radio==-1">确认选择</van-button>
	</view>

</template>

<script>
	import {
		userAddList,editAddress
	} from '@/api/api.js';

	export default {
		data() {
			return {
				addressList: [],
				radio: -1,
				orderId:'',
				newAddress:{},//选择的新地址，要存到Storage中

			}
		},
		onShow() {
			this.getAddList()
		},
		onLoad(option){
			if(option.param){
				const item = JSON.parse(decodeURIComponent(option.param));
						this.orderId=item;
			}
			
		},
		methods: {
			getAddList() {
				var params = {
					"url": userAddList.url,
					"content-type": userAddList.contentType,
				}
				this.request.getRequest(params).then(res => {
					console.log("11",res)
					this.addressList=res;
						
				})
			
			
			},
			onChange(event){
				this.radio=event.detail;
				console.log("this.radio",this.radio);
			},
			changeAddress() {
				const item=this.addressList[this.radio];
				this.newAddress=item;
				this.newAddress.orderAddress=item.areaName+item.addrContent;
				uni.showToast({
					title: '选择成功,即将转到下单页面！',
					duration: 1000,
					icon: 'none'
				});					
				setTimeout(() => {
					uni.navigateTo({
						url:'./confirmOrder?item='+JSON.stringify(this.newAddress),
					})
				}, 1000)

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
			//添加新的地址
			changeAdd(){
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
