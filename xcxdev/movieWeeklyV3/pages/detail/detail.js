Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this
    this.setData({
      mid: options.id
    })
     // 发起请求API，wx.request发起HTTP request，调用Server端一个API来获取数据或者操作数据，与ajax类似
    wx.request({
      // url: "https://douban.uieee.com/v2/movie/subject/" + options.id,
      url:"https://restapi.amap.com/v3/traffic/status/rectangle?extensions=all&rectangle=116.351147,39.966309;116.357134,39.968727&key=cff1f2ddead564b82ef355e240874029",
      //https://baidu.com 不在以下 request 合法域名列表中,因为小程序对每一个网络请求指定的url对应的服务器域名都必须在小程序后台中进行登记配置
      header: {
        "content-type": "json"
      },

      //小程序在接收到server端返回的HTTP response之后，会对response进行解析，将其中的关键数据封装成js对象，传递给success回调函数进行处理。
      success: function(response) {
        console.log(response)
        if(response.statusCode==200){
            // that.setData({
            //   movie: response.data
            // })
            // wx.setNavigationBarTitle({
            //   title: response.data.rating.average + "分： " +
            //   response.data.title,
            // })
            // wx.hideNavigationBarLoading()
        }
      },

      // // 当调用失败的时候
      // fail: function() {

      // },
      // // 无论成功还是失败都会被调用
      // complete: function(res) {
      //   console.log("11111"+res)
      // }


    })

    wx.showNavigationBarLoading()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 页面事件处理函数
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: "向你推荐： " + this.data.movie.title
    }
  }
})