<!-- 首页 -->
<template>
	<view class="container">
		<!-- <view class="title-marquee">
			<van-notice-bar left-icon="volume-o" text="北方华创2022新春问候发货时间截止至2022年1月10日，到期后，部分商品将会下架，请您尽快兑换！" />
		</view> -->

		<!-- 轮播图 -->
		<swiper class="content-swipe" :indicator-dots="true" :autoplay="true" interval="5000" duration="500">
			<swiper-item class="content-swipe-item" v-for="(item,index) in images" :key="index">
				<image :src="item.imgPath" mode=""></image>
			</swiper-item>
		</swiper>
		<!-- 轮播图END -->

		<!-- tab内容 -->
		<view class="content-tab">
			<van-tabs v-model="active" :swipeable="true" :ellipsis="false" @change="tabChange">
				<van-tab v-for="tabItem in tabList" :title="tabItem.dictName" :name="tabItem.dictCode">
					<van-grid :column-num="2" :gutter='8'>
						<van-grid-item class='content-grid-item' use-slot v-for="(item,index) in goodsList"
							:key="index">
							<image @click="jumpDetail(item)" class="content-grid-item-img"
								:src="baseUrl+item.coverPath" />
							<text class="content-goods-name multi-ellipsis--l2 mt10">{{item.goodsName}}</text>
							<text class="content-goods-content multi-ellipsis--l2 mt10">
								{{item.goodsContent}}
							</text>
							<view class="mt10">
								<text class="content-goods-num">库存:{{item.goodsSum}}</text>
							</view>
						</van-grid-item>
					</van-grid>

				</van-tab>

			</van-tabs>
		</view>
		<!-- tab内容END -->

	</view>
</template>

<script>
	export default {
		data() {
			return {
				queryParams: {
					pageNum: 1,
					pageSize: 30,

				},
				images: [],
				titleTips:'',
				baseUrl: uni.getStorageSync('baseUrl'),
				active: "全部",
				tabList: [], //商品的分类
				goodsList: [], //商品的列表
			}
		},
		onLoad() { //
			// this.baseUrl=uni.getStorageSync('baseUrl') +'/wsp-boot';
			// 为了显示tabList,只有onload时循环列表里的分类，存进tabList中
			// 如果在onshow里调用-带商品分类查询时tablist会不准确-缺失---待优化
			// this.getList().then(res => {})
			this.getConfig()
		},
		onShow() { //每次切换页面调用
			this.getList()
			this.getTabList()
		},
		methods: {
			getConfig() {
				const params = {
					"url": this.ssdapi.getConfigInfo.url,
					"content-type": this.ssdapi.getConfigInfo.contentType,
				}
				this.request.getRequest(params).then((res) => {
					this.titleTips = res.indexText
					var i = 0;
					for (const key in res) {
						i = i + 1;
						console.log(key);
						if (res["indexPic" + i]) {
							this.images.push({
								imgPath: res["indexPic" + i],
								id: i,
							});
						}
					}
				});
			},
			// 切换tabbar
			tabChange(event) {
				// 全部tab时删除goodsType查询条件
				console.log(event)
				if (event.detail.title == "全部") {
					delete this.queryParams.goodsType;
				} else {
					this.queryParams.goodsType = event.detail.name;
				}
				this.getList()
			},
			//获得商品列表
			getList() {
				const params = {
					"url": this.ssdapi.goodsList.url,
					"content-type": this.ssdapi.goodsList.contentType,
					payload: this.queryParams
				}
				this.request.postRequest(params).then(res => {
					this.goodsList = res.rows;

				})
			},

			//获得tabList
			getTabList() {
				this.tabList = [];
				const params = {
					"url": this.ssdapi.queryTab.url,
					"content-type": this.ssdapi.queryTab.contentType,
				}
				this.request.getRequest(params).then(res => {
					this.tabList = [{
						dictCode: "all",
						dictName: "全部"
					}];

					this.tabList.push(...res);
				});
			},
			// 查看详情
			jumpDetail(item) {
				uni.navigateTo({
					url: '/pages/index/detail?id=' + item.goodsId + "&typeName=" + item.typeName
				})
			}
		}
	}
</script>

<style scoped>
	/* 	text{
		color: #888;
	} */
	.container {
		width: 720rpx;
		margin: 0 auto;
	}

	.title-marquee {
		margin-bottom: 15rpx;
	}

	.content-swipe {
		width: 100%;
		height: 300rpx;
		margin-bottom: 20rpx;
	}

	.content-swipe-item {
		width: 100%;
	}

	.content-swipe-item>image {
		width: 100%;
		height: 100%;
	}

	.content-tab {}

	.content-grid-item-img {
		width: 320rpx;
		height: 320rpx;
	}

	.content-goods-name {
		min-height: 82rpx;
		font-weight: 700;
	}

	.content-goods-content {
		height: 64rpx;
		font-size: 12px;
		color: #999;
	}

	.content-goods-num {
		color: #999;
		margin-right: 10rpx;
	}

	.mt10 {
		margin-top: 10rpx;
	}
</style>
