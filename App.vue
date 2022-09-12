<script>
	export default {
		onLaunch: function() {
		},
		onShow: function() {
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/* @import "/wxcomponents/vant/common/index"; */
	@import "./static/css/common.css";	/*每个页面公共css */
	page{
		background-color: #F5f5f5;
		--checkbox-checked-icon-color:#ff6700;
		--button-default-color: #ff6700;
		--tabs-default-color:#ff6700;
		--tabs-bottom-bar-color:#ff6700;
	}
</style>
