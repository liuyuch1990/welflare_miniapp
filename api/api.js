
export const userOrderList = {
	url: '/order/get/getOrder',
	contentType: 'application/json',
}; // 用户订单列表）
export const userAddList = {
	url: '/addr/queryList',
	contentType: 'application/json',
}; //获取用户地址列表
export const editAddress = {
	url: '/order/edit',
	contentType: 'application/json',
}; // 更改订单地址
export const cancelOrder = {
url: '/order/cancelOrder/',
	contentType: 'application/json',
}; // 更改订单地址

export const rollBackOrder = {
	url: '/order/rollBackOrder',
	contentType: 'application/json',
}; // 退还活

export const getProvince = {
	url: '/addr/province',
	contentType: 'application/json',
}; // 获取省

export const getCity = {
	url: '/addr/city/',
	contentType: 'application/json',
}; // 获取市
export const getArea = {
	url: '/addr/area/',
	contentType: 'application/json',
}; // 获取区


export const editUserAddress = {
	url: '/addr/update',
	contentType: 'application/json',
}; // 编辑用户地址

export const newUserAddress = {
	url: '/addr/insert',
	contentType: 'application/json',
}; // 编辑用户地址

export const queryCard = {
	url: '/gift/card/wallet',
	contentType: 'application/json',
}; // 查询礼品卡额度

export const chargeCard = {
	url: '/gift/card/exchange/',
	contentType: 'application/json',
}; // 充值礼品卡

export const queryLogis = {
	url: '/order/queryLogistics',
	contentType: 'application/json',
}; // 查询物流信息