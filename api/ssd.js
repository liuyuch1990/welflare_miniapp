export const requestApi = {
	goodsList: {
		url: '/goods/list',
		contentType: 'application/json'
	}, // 首页-商品列表
	queryDept: {
		url: '/dept/queryDeptList',
		contentType: 'application/json'
	}, // 商品详情
	goodsDetail: {
		url: '/goods/queryById/',
		contentType: 'application/json'
	}, // 商品详情
	login:{
		url:'/user/login',
		contentType: 'application/json'
	},//登录
	checkCom: {
		url:'/com/check/',
		contentType:'application/json',
	}, // 校验公司编码
	getWallet: {
		url:'/gift/card/wallet',
		contentType:'application/json',
	} ,// 查询用户余额
	getUser: {
		url:'/user/queryById',
		contentType:'application/json',
	}, // 获取用户信息
	register:{
		url: '/user/register',
		contentType:'application/json',
	}, // 注册
	getAddress: {
		url:'/addr/queryList',
		contentType:'application/json',
	} ,//获取地址
	createOrder:{
		url: '/order/createOrder',
		contentType:'application/json',
	}, //获取地址
	checkOrder: {
		url:'/order/createOrderCheck',
		contentType:'application/json',
	} // 下单校验
}
