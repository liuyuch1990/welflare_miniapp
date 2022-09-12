<!-- 商品详情 -->
<template>
	<view class="container">
		<view class="content-detail">
			<!-- 商品详情 -->
			<view class="detail-info">
				<image class="detail-coverimg" v-if="goodsDetail.coverPath" :src="baseUrl+goodsDetail.coverPath"
					mode="">
				</image>
				<view class="detail-desc">
					<view class="goods-name">{{goodsDetail.goodsName}}</view>
					<view class="goods-type mt10">商品类别:{{typeName}}</view>
					<view class="goods-content mt10">商品描述:{{goodsDetail.goodsContent}}</view>
					<view class="goods-num-view mt20">
						<text>库存:&nbsp;&nbsp;{{goodsDetail.goodsSum}}</text>

						<van-stepper v-model="goodsNum" @change="chooseGoodsNum" />
					</view>
				</view>
			</view>
			<!-- 商品详情END -->

			<!-- 商品图片 -->
			<view class="detail-img">
				<image v-for="(item,index) in goodsDetail.pics" class="detail-detailimg"
				 mode='widthFix'	:src="baseUrl+item.picSavepath">
			</view>
			<!-- 商品图片END -->

			<!-- 加购按钮 -->
			<view class="detail-bottom-btns">
				<van-button @click='showShopCart' class='button-show-shopcart' block type="warning" icon='cart-o'>查看购物车
				</van-button>
				<van-button @click='addshopCart' class='button-add-shopcart' block type="danger" icon='plus'>加入购物车
				</van-button>
			</view>
			<!-- 加购按钮END -->
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				loading:true,
				queryParams: {},
				goodsDetail: {}, //商品的列表
				goodsId: "", //商品ID
				typeName: "", //分类名
				goodsNum: 1, // 商品数量
				shopCartData: [], //购物车信息
				baseUrl: 'https://unicorncto.top/wsp-boot',
			}
		},
		onLoad(options) {
			uni.showLoading({
				title: '加载中...',
				mask: false
			});
			this.goodsId = options.id
			this.typeName = options.typeName
			this.getDetail();
		},
		methods: {
			getDetail() {
				var params = {
					"url": this.ssdapi.goodsDetail.url + this.goodsId,
					"content-type": this.ssdapi.goodsDetail.contentType,
				}
				this.request.getRequest(params).then(res => {
					uni.hideLoading()
					this.goodsDetail = res
					this.goodsDetail.typeName = this.typeName;
					// this.baseUrl = uni.getStorageSync('baseUrl') +'/wsp-boot';
				})
			},
			// 选择商品数量 步进器
			chooseGoodsNum(event) {
				this.goodsNum = event.detail
			},
			// 加入购物车
			addshopCart() {
				this.goodsDetail.goodsNum = this.goodsNum
				let getShopCart = uni.getStorageSync("shopcart")
				if (getShopCart == '') {
					const shopCartData = []
					shopCartData.push(this.goodsDetail)
				uni.setStorageSync("shopcart", shopCartData)
				} else {
					/**
					 * 找出购物车中是否有相同的商品
					 * 如果有数量相加
					 * 如果没有返回false，结束当前循环
					 *  */
					const tempSame = getShopCart.find((v) => {
						if (v.goodsId == this.goodsDetail.goodsId) {
							return v.goodsNum += this.goodsDetail.goodsNum;
						} else {
							return false
						}
					});
					/**
					 * 没有相同商品，push进数组保存商品
					 */
					if (!tempSame) {
						getShopCart.push(this.goodsDetail);
					}
					uni.setStorageSync("shopcart", getShopCart)
				}
				uni.showToast({
					title: "加购成功",
					icon: 'success'
				})
			},
			showShopCart() {
				const a = uni.getStorageSync("shopcart")
				console.log(a);
				uni.switchTab({
					url: '../shoppingCart/index',
				})
			},

		}
	}
</script>

<style scoped>
	.mt10 {
		margin-top: 10rpx;
	}

	.mt20 {
		margin-top: 20rpx;
	}

	.detail-coverimg {
		width: 375rpx;
		height: 375rpx;
		display: block;
		margin: 0 auto;
	}

	.detail-desc {
		padding: 20rpx;
	}

	.goods-name {
		font-weight: 700;
		font-size: 24px;
	}

	.goods-type {
		color: #999999;
	}

	.goods-content {
		color: #999999;
	}

	.detail-info {
		background: #FFFFFF;
		margin: 0 auto;
	}

	.goods-num-view {
		font-size: 18px;
		display: flex;
		justify-content: space-between;
	}

	.detail-bottom-btns {
		width: 100%;
		display: flex;
		position: fixed;
		bottom: 0;
	}

	.button-show-shopcart,
	.button-add-shopcart {
		width: 50%;
	}

	.detail-img {
		margin: 30rpx 0 100rpx 0;
	}
/* 	.detail-img>image{
		width: 750rpx;
	} */

	.detail-detailimg {
		width: 750rpx;
		margin-bottom: 20rpx;
	}
</style>
