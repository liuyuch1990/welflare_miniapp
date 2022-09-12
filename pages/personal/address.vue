<template>
	<view>
		<view class="header">

				<van-cell-group>
				    <van-cell  v-for="(item,index) in addressList" icon="shop-o"  :label="item.areaName+item.addrContent" clickable @click="editAddress(index)" >
				     <template #title>
				       <span class="custom-title">{{item.receiverName+' : '+item.receiverPhone}}</span>
				       <van-tag type="info">{{item.addrName}}</van-tag>
				     </template>
					  <template #right-icon>
						  <view  class="right_icon">
							  <van-icon slot="right-icon" name="edit" class="custom-icon" />
							  <br>
							  <van-tag v-if="item.isDef==1" type="primary">默认</van-tag>
						  </view>
				         
				      </template>
					  
				    </van-cell>
				  </van-cell-group>
				 
		</view>
		<van-button  class="bottom_button" type="primary" block color="#ff6700" @click="newAddress()"
			:disabled="click">新增地址</van-button>
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

			}
		},
		onShow() {
			this.getAddList()
		},
		onLoad(option){
			// const item = JSON.parse(decodeURIComponent(option.param));
			// 		this.orderId=item;
		},
		methods: {
			getAddList() {
				var params = {
					"url": userAddList.url,
					"content-type": userAddList.contentType,
				}
				this.request.getRequest(params).then(res => {
					console.log(res)
					this.addressList=res
						
				})
			},
			editAddress(index) {
				// const param=JSON.stringify(item)
				uni.navigateTo({
					url:'./newAddress?param='+encodeURIComponent(JSON.stringify(this.addressList[index]))
				})
			},
			newAddress(){
				const item={};
				uni.navigateTo({
					url:'./newAddress?param='
				})
				
			}
			

		}
	}
</script>

<style scoped>
	.header{
		margin-top: 20rpx;
	}
	.right_icon{
		text-align: center;
		display: block;
	
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
