<template>
	<view>
		<view class="banner">
			<!-- <image src='../../static/bg_test.jpg'></image> -->
			
		</view>
		<van-cell-group >
		    <van-field
		      :value="userCom"
		      label="公司编号"
			  left-icon=""
			  required
			  :error-message="userComError"
		      placeholder="请输入公司编号" @change="handleChangeUserCom()"/>
		    <van-field
		      :value="userNo"
		      label="工号"
			  left-icon=""
			  required
		      placeholder="请输入工号"
		      border="false" @change="handleChangeUserNo()"/>
			  <van-field
			    :value="userName"
			    label="姓名"
			    left-icon=""
				required
			    placeholder="请输入姓名"
			    border="false" @change="handleChangeUserName()" @blur="inputUserName"/>
		  <van-button class="bottom_button" type="primary" color="#ff6700" @click="handleNext" block :disabled="!(userCom&&userNo&&userName)">下一步</van-button>
		</van-cell-group>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userCom:'',
				userNo:'',
				userName:'',
				//最后的校验
				flag:"false",
				
			}
		},
		methods:{
			//公司编号的输入框
			handleChangeUserCom(e){
				this.userCom=e.detail;
				uni.setStorageSync('userCom',this.userCom);
			},
			//工号的输入框
			handleChangeUserNo(e){
				this.userNo=e.detail;
				uni.setStorageSync('userNo',this.userNo);
			},
			//姓名的输入框
			handleChangeUserName(e){
				this.userName=e.detail;
				uni.setStorageSync('userName',this.userName);
			},
			//公司编号的验证
			handleNext(){
				if(this.flag=="true"){
					uni.showLoading({
						title: '加载中'
					});
					const params = {
						"url": this.ssdapi.checkCom.url+this.userCom,
						"content-type": this.ssdapi.checkCom.contentType,
					}
					this.request.noneTokenGetRequest(params).then((res)=>{
						    uni.hideLoading();
							uni.navigateTo({
							    url:'./registerTwo'
							})
					}).catch((res)=>{
						if(res.data.resultCode==50000){
							uni.showToast({
								title: '您输入的公司编号不正确,请重新输入!',
								duration: 2000,
								icon: 'none'
							});
						}
					})
				}
			},
			//姓名的验证
			inputUserName(e){
				
				let str =/^[\u2E80-\u9FFF]{2,6}$/
				 
				if (str.test(this.userName)) {
				this.flag="true";
				return true
				 
				} else {
				uni.showToast({
				 
				title: '姓名不规范',
				duration: 2000,
				icon: 'none'
				 
				})
				this.flag="false";
				return false
				 
				}
			},
		}
	}
</script>

<style scoped>
	.bottom_button{
	margin-top: 20rpx !important;
	width:95%;
	display: flex;
	margin: 0 auto;
	}
	.banner{
		justify-content: center;
		display: flex;
		background-color: white;
	}
	.banner image {
		width: 100vw;
	}
</style>
