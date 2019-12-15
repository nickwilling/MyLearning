// 给这个页面注册一个空对象作为其页面对象

// 数据绑定
// 通过开发者工具调试器的APPdata这个type，我们可以实时的调试每个页面的所有内部状态变量的取值
Page({
  data: {
    weeklyMovieList: [
    {
      name: "教父",
      comment: "最精彩的剧本，最真实的黑帮电影。",
      imagePath: "/images/jf.jpg",
      isHighlyRecommended: true, //条件渲染，如果是强烈推荐的就要显示一个强烈推荐的红色标记
      id: 1291841
    },
    {
      name: "这个杀手不太冷",
      comment: "小萝莉与怪叔叔纯真烂漫的爱情故事。",
      imagePath: "/images/leon.jpg",
      isHighlyRecommended: false, //条件渲染，如果是强烈推荐的就要显示一个强烈推荐的红色标记
      id: 1295644
    },
    {
      name: "泰坦尼克号",
      comment: "失去的才是永恒的。",
      imagePath: "/images/titanic.jpg",
      isHighlyRecommended: false,
      id: 1292722
    }
    ],
    count:123,
    score: 61,
    // currentIndex: 0 通过this.setData（）来新增定义
    
  },
  // 在页面onLoad时将currentIndex设为数组长度-1
  onLoad: function (options) {
    this.setData({
      currentIndex: this.data.weeklyMovieList.length - 1
    })
  },
  f0: function(event) {
    this.setData({
      currentIndex: this.data.weeklyMovieList.length - 1
    })
  },
  // 新增事件处理函数f1的定义
  f1: function(event) {
    console.log(event)
    // this.setData不仅可以更新已有的内部状态变量的取值，也可以根据需要动态得新增一个内部状态变量
    this.setData({
      count: this.data.count + 1 ,
      // 修改变量的局部值
      "weeklyMovieList[2].name":"教父3"
    })
    // this.data.count++ 在小程序中对内部状态数据进行更新，不能采用直接赋值写入的方式，必须调用小程序提供的this.setData()方法
  },
  f2: function(event) {
    var movieId = event.currentTarget.dataset.movieId
    console.log(movieId)
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + movieId
    })
  },

  onShareAppMessage: function(){
    return {
      title: "每周推荐"
    }
  }

})