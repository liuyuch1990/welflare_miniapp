<template>
	<view>
		<view class="top">
		<view class="topbanner">
			<view class="avar">
				
			</view>
			<view class="name">{{name}}</view>
			
		</view>
		</view>
		<van-cell  title="个人信息" is-link url="./personalInfo" />
		<van-cell title="账户额度" is-link  url="./accountBalance" />
		<van-cell title="收货地址" is-link url="./address" />
		<van-button class="bottom_button" type="primary" block color="#ff6700" @click="logout">退出登录</van-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				name:'用户',
			}
		},
		onShow(){
			this.getUserInfo()
			
		},
		methods: {
			getUserInfo(){
				var userInfo =uni.getStorageSync('userInfo');
				this.name=userInfo.userPhone;
				
			},
			logout(){
				uni.clearStorageSync();
				uni.redirectTo({
					url:'../login/login'
				})
			}
		}
	}
</script>

<style scoped>
	.topbanner{
	background-color: #ff6700;	
	height: 400rpx;
	position:relative;
	}
	.avar{
		width: 180rpx;
		height: 180rpx;
		border:2px solid #fff;
		border-radius:100rpx;
		background-image: url(../../static/avar.png);
		 background-repeat:no-repeat;
		 background-size:100% ;
		 -moz-background-size:100% 100%;
		position:absolute;
		z-index: 999;
		top: 150rpx;
		left:300rpx;
	}
	.name{
		position:absolute;
		top: 340rpx;
		width: 100%;
		text-align: center;
		color: white;
	}
	.top{
		height:400rpx;
		
	}
	.bottom_button{
		width: 95%;
		position: fixed;
		bottom: 10rpx;
		left:2.5%;
		border-radius: 10rpx;
	}

</style>
