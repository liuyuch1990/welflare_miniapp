<!-- 购物车 -->
<template>
	<view>
		<scroll-view scroll-y="true" style="height: 3000rpx;">
			<view class="category" v-for="(cate) in cateList">
				<view class="category_name">{{cate}}</view>
				<van-checkbox-group v-model="selectList" @change="singleChecked">
					<!-- 购物车详情 -->
					<view class="item" v-for="(item,index) in goodsList" v-if="cate==item.typeName">
						<view class="goods">
							<van-checkbox :value="item.checked" :name="index" ref="checkboxes" />
							<van-swipe-cell
							  id="swipe-cell"
							  :right-width="65"
							  async-close
							  @click="onOpen(item)"
							>
							  <van-cell-group>
							    <van-card :title="item.info.goodsName" :thumb="baseUrl+'/wsp-boot'+item.info.coverPath">
							    	<view class="desc_class multi-ellipsis--l2" slot="desc">{{item.info.goodsContent}}
							    	</view>
							    </van-card>
							  </van-cell-group>
							  <view slot="right" class="right_delete">删除</view>
							</van-swipe-cell>
						
						</view>
						<view class="stepper">
							<van-stepper v-model="item.info.goodsNum" @change="goodsNumOnChange($event,item)" />
						</view>
					</view>
					<!-- 购物车详情END -->
				</van-checkbox-group>
			</view>
		</scroll-view>
		<!-- 底部操作按钮 -->
		<view class="content-bottom">
			<van-submit-bar :price="length*100" currency="共" decimal-length="0" suffix-label="件商品" :disabled="length<=0"
				button-text="下一步" safe-area-inset-bottom='true' @submit="nextButton">
				<van-checkbox :value="ischecked" @change="onCheckboxChange"></van-checkbox>
			</van-submit-bar>
		</view>
		<!-- 底部操作按钮END -->
	</view>
</template>

<script>
	import {
		GoodsTypeVariable
	} from "@/utils/Variable";
	var _self;
	export default {
		data() {
			return {
				baseUrl:uni.getStorageSync('baseUrl'),
				//选择的商品
				queryParams: {
					pageNum: 1,
					pageSize: 10,
				},
				//购物车里的商品数据处理完成的格式
				goodsList: [],
				//選擇的商品
				selectList: [],
				//监听的商品数量
				length: 0,
				//选择的商品
				orderList: [],
				cateList: [],
				ischecked:false,
				//购物车中存的商品
				shopcart:[],
				
				
			}
		},

		//每次切換頁面都會刷新s           
		onShow() { 
			//把全选按钮清空
			this.ischecked=false;
			this.length=0;
			//清空购物车中的商品
			this.goodsList = [];
			//把单选按钮清空
			this.selectList=[];
			//把标题清空
			this.cateList=[];
			//获取购物车中的商品
			this.shopcart = uni.getStorageSync("shopcart")
			if(this.shopcart){
				this.shopcart.forEach((item, index) => {
					var goods ={};
					goods.typeName = item.typeName;
					goods.goodsId = item.goodsId;
					goods.goodsType=item.goodsType;
					var info = {};
					info.coverPath = this.$target + item.coverPath;
					info.goodsName = item.goodsName;
					info.goodsContent = item.goodsContent;
					info.goodsNum = item.goodsNum;
					goods.info = info;
					if (!this.goodsList.includes(goods)) {
						this.goodsList.push(goods);
					}
					if (!this.cateList.includes(goods.typeName)) {
						this.cateList.push(goods.typeName);
					}
					var good=item;
				})
			}
		},
		created(){
			_self=this;
		},
		methods: {
			//打开删除的页面
			onOpen(row) {
				console.log(row);
			        uni.showModal({
			            title: '确定要删除该商品吗！',
			            success: function (res) {
			                if (res.confirm) {
			                    console.log('用户点击确定');
								_self.handleDelete(row);
			                }else{
								console.log('用户点击取消');
							}
			            }
			        });
			  },
			//删除购物车中的商品
			handleDelete(e){
				console.log(e);
				//删除购物车页面中的商品
				this.goodsList.forEach((good,index)=>{
					if(good.goodsId==e.goodsId){
						this.goodsList.splice(index,1);
					}
				})
				this.shopcart.forEach((good,index)=>{
					if(good.goodsId==e.goodsId){
						this.shopcart.splice(index,1);
					}
				})
				uni.setStorageSync("shopcart",this.shopcart);
			},
			goodsNumOnChange(e, item) {
				item.info.goodsNum = e.detail;
				const shopcart = uni.getStorageSync("shopcart")
				shopcart.forEach(v => {
					if (v.goodsId == item.goodsId) {
						v.goodsNum = item.info.goodsNum
					}
				})
				uni.setStorageSync("shopcart", shopcart)

			},
			// 下一步
			nextButton() {
				
				//获取选中的商品，分两步，获取全部选择的商品，获取单个选择的商品
				//获取全部选择的商品
					if (this.total) {
					//要下单的商品存起来
					uni.setStorageSync("orderData", this.goodsList);
					uni.navigateTo({
						url: './confirmOrder',
					})
				} else {
					this.orderList = [];
					this.selectList.forEach((item, index) => {
						this.orderList.push(this.goodsList[item]);
					})
					uni.setStorageSync("orderData", this.orderList);
					uni.navigateTo({
						url: './confirmOrder',
					})
				}

			},
			//复选框选择的商品
			singleChecked(e) {
				console.log(e);
				//选择的商品
				this.selectList = e.detail;
				this.ischecked = this.selectList.length == this.goodsList.length;
				this.length = this.selectList.length;
				uni.setStorageSync("length", this.length);
				// }

			},
			//全选按钮
			onCheckboxChange(e) {
				if (this.selectList.length == this.goodsList.length) {

					//说明是清空
					this.selectList = []
				} else {
					this.selectList = []
					this.goodsList.forEach((item, index) => {
						this.selectList.push(index.toString())
					})
				}
				this.length = this.selectList.length;
				this.ischecked = !this.ischecked
				uni.setStorageSync("length", this.length);
			}

		}
	}
</script>

<style scoped>
	.category {
		margin-top: 30rpx;
		/* background-color: white; */
	}

	.category_name {
		padding-left: 40rpx;
		color: #808080;
	}

	.goods {
		display: flex;
		align-items: center;
		padding: 20rpx;
	}

	.stepper {
	text-align: right;
	margin-right: 20rpx;
	padding-bottom: 10rpx;
	}

	.desc_class {
		padding-top: 20rpx;
	}

	.content-bottom /deep/ button {
		background: #FF6700 !important;
		border: none !important;
	}
	.right_delete{
		color: #FF6700;
		width: 100%;
		top:40%;
		left: 50%;
		position: relative;
	}
	#swipe-cell{
		width: 100% !important;
	}
	.item{
		background-color: white;
		margin-bottom: 20rpx;
	}
</style>
