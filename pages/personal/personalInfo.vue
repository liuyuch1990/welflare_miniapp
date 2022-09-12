<template>
	<van-cell-group  title="个人信息" class="bg_gray">
	  <van-cell :value="userInfo.userPhone" title="手机号"  />
	  <!-- <van-cell :value="userInfo.userNo" title="工号"  /> -->
	  <van-cell :value="userInfo.userCom" title="公司名称"  />
	  <!-- <van-cell :value="userInfo.userPhone" title="绑定手机"  /> -->
	</van-cell-group>
</template>

<script>
	export default {
		data() {
			return {
				userInfo:{},
			}
		},
		onShow(){
			this.getUserInfo()
			
		},
		methods: {
			getUserInfo(){
				this.userInfo =uni.getStorageSync('userInfo');
				
			},
		}
	}
</script>

<style scoped>
/* 	.bg_gray{
		background-color: red;
	} */
</style>
