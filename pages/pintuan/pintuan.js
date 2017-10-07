var app = getApp();
var API_URL = app.globalData.path_info.api;  //服务器地址 host+url
var IMG_URL = app.globalData.path_info.path;  // 图片
var num = 5; // 初始化显示五个商品
var loadProd = function (that, limitNum) {
	wx.request({
		url: API_URL + '/api/product/productList?offset=0&limit=' + limitNum,
		data: {},
		method: 'GET',
		header: {
			'content-type': 'application/json'
		},
		success: function (res) {
			wx.hideLoading();
			console.log(res.data.data, 'product data acquisition success');
			// 分离出无分类的数据<待做处理>
			var productList = res.data.data;  // 获取接口提供的数据
			// for (var i = 0; i < productList.length; i++) {
			//   if (productList[i].cate_id == 0) {
			//     console.log(productList[1].cate_id = 0)
			//   }
			// }
			// 根据cate_id排序
			function compare(cate_id) {
				return function (a, b) {
					var cate_id1 = a[cate_id];
					var cate_id2 = b[cate_id];
					return cate_id1 - cate_id2;
				};
			}
			
			console.log(productList.sort(compare('cate_id'))); // console.log(productList);
			// 对图片路径进行处理<得到轮播图中的第一个图展示>
			for (var i in productList) {
				console.log(productList[i].prod_images = IMG_URL + JSON.parse(productList[i].prod_images)[0]);
				
			}
			that.setData({
				productList: res.data.data
			});
		}
	});
};
var loadProdC = function (that, cate_id, limitc) {
	wx.request({
		url: API_URL + '/api/product/getProductByCateId?offset=0&limit=' + limitc + '&cate_id=' + cate_id,
		data: {},
		method: 'GET',
		header: {
			'content-type': 'application/json'
		},
		success: function (res) {
			wx.hideLoading();
			console.log(res.data.data, 'product data acquisition success');
			// 分离出无分类的数据<待做处理>
			var productList = res.data.data;  // 获取接口提供的数据
			// 对图片路径进行处理<得到轮播图中的第一个图展示>
			for (var i in productList) {
				console.log(productList[i].prod_images = IMG_URL + JSON.parse(productList[i].prod_images)[0]);
			}
			that.setData({
				productList1: res.data.data
			});
		}
	});
};


Page({
	
	data: {
		winHeight: "",//窗口高度
		currentTab: 0, //预设当前项的值
		scrollLeft: 0, //tab标题的滚动条位置
		list: [],
		dd: '',
		hidden: false,
		page: 1,
		size: 20,
		hasMore: true,
		hasRefesh: false,
		hidden: true,
		expertList: [{ //假数据
			img: "",
			name: "",
			tag: "",
			answer: 134,
			listen: 2234
		}],
		category: []
	},
	//
	//
	//
	onShow: function (e) {
		wx.getSystemInfo({
			success: (res) => {
				this.setData({
					windowHeight: res.windowHeight,
					windowWidth: res.windowWidth
				});
			}
		});
	},
	pullDownRefresh: function (e) {
		wx.showNavigationBarLoading(); //在标题栏中显示加载
		console.log("下拉刷新....");
		this.onLoad();
		setTimeout(() => {
			wx.hideNavigationBarLoading(); //完成停止加载
			wx.stopPullDownRefresh(); //停止下拉刷新
		}, 2000);
	},
	
	pullUpLoad: function (e) {
		this.setData({
			page: this.data.page + 1
		});
		wx.showNavigationBarLoading(); //在标题栏中显示加载
		console.log("上拉拉加载更多...." + this.data.page);
		
		loadProd(this, num += 3);
		loadProdC(this, this.data.currentTab, num += 3);
	},
	
	// 页面加载
	onLoad: function (e) {
		var that = this;
		console.log('onLoad');
		//-----------------------------
		// category 导航栏<类别>
		//-----------------------------
		wx.request({
			//上线接口地址要是https测试可以使用http接口方式
			url: API_URL + '/api/category/categoryList',
			data: {},
			method: 'GET',
			header: {
				'content-type': 'application/json'
			},
			success: function (res) {
				wx.hideLoading();
				console.log(res.data.data, 'category data acquisition success');
				that.setData({category: res.data.data});
			}
		});
		
		//-----------------------------
		// product con<商品>
		//-----------------------------
		loadProd(that, 5); // 默认显示5个商品
	},
	
	footerTap: app.footerTap,
	// 滚动切换标签样式
	switchTab: function (e) {
		var that = this;
		this.setData({
			currentTab: e.detail.current
		});
		this.checkCor();
		// 请求数据
		loadProdC(this, this.data.currentTab, 5);
		
	},
	// 点击标题切换当前页时改变样式
	swichNav: function (e) {
		var that = this;
		var cur = e.target.dataset.current;
		if (this.data.currentTab == cur) {
			return false;
		}
		else {
			this.setData({
				currentTab: cur
			});
		}
		// 请求数据
		loadProdC(that, this.data.currentTab, 5);
	},
	//判断当前滚动超过一屏时，设置tab标题滚动条。
	checkCor: function () {
		if (this.data.currentTab > 4) {
			this.setData({
				scrollLeft: 300
			});
		} else {
			this.setData({
				scrollLeft: 0
			});
		}
	}
});
