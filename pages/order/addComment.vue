<template>
	<view>
			<van-cell-group class="cell-group">
				<van-rate :value="stars" @change="onChangeStar" />
				<van-field
					:value="comment"
					rows="5"
					autosize
					label="评价"
					type="textarea"
					maxlength="300"
					@change="onChangeComment"
					placeholder="请输入商品评价"
					show-word-limit
				/>
			</van-cell-group>
		<van-button class="bottom_button" type="primary" block color="#ff6700" @click="submitComment()">提交</van-button>
	</view>

</template>

<script>
	import {
		addCommentOrReturnReason
	} from '@/api/api.js';

	export default {
		data() {
			return {
				addressList: [1, 2, 3, 4, 5],
				radio: -1,
				comment: '',
				stars: '',
				orderId:''

			}
		},
		onShow() {
			// this.getAddList()
		},
		onLoad(option){
					this.orderId=option.id;
			this.comment=option.comment;
			this.stars=option.stars;

		},
		methods: {
			submitComment() {
				var params = {
					"url": addCommentOrReturnReason.url,
					"content-type": addCommentOrReturnReason.contentType,
					payload: {
						// orderNumber:'',
						// startTime:'',
						// endTime:'',
						stars:this.stars,
						comment: this.comment,
						orderId: this.orderId

					}
				}
				this.request.postRequest(params).then(res => {
					uni.navigateBack({
						delta:1
					})
				})

			},
			onChangeStar(e) {
				this.stars = e.detail
			},
			onChangeComment(e) {
				this.comment = e.detail
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
	.cell-group {
		width: 90%;
		margin: 0 auto;
		display: block;
	}
	  .bottom_button{
	  	width: 95%;
	  	position: fixed;
	  	bottom: 10rpx;
	  	left:2.5%;
	  	border-radius: 10rpx;
	  }
</style>
