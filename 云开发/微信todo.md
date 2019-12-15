### 云代办数据库设计

```json
{
    "title": "here is a title",
    "status": "done|in-progress|abandon",
    "location": "腾讯大厦",
    "location_gps": {
        'long': 116,
        'lati': 23
    },
    "image": "url"
}
```

### Vant UI
Vant Weapp (https://youzan.github.io/vant-weapp/#/quickstart)
安装
```
npm i @vant/weapp -S --production
```
构建 npm 包

打开微信开发者工具，点击 工具 -> 构建 npm，并勾选 使用 npm 模块 选项，构建完成后，即可引入组件
![](https://img.yzcdn.cn/public_files/2019/08/15/fa0549210055976cb63798503611ce3d.png)
引入组件：
```
// app.json
"usingComponents": {
  "van-button": "@vant/weapp/button"
}
```
使用组件:

引入组件后，可以在 wxml 中直接使用组件
```
<van-button type="primary">按钮</van-button>
```

### 添加编译模式
有时候我们添加了一个页面，但是小程序默认的启动页面是index，如果想要测试添加的页面的功能就需要添加编译模式

普通编译-->添加编译模式

添加编译模式以后就可以通过切换编译模式来测试不同的页面
![](https://raw.githubusercontent.com/nickwilling/figurebed/master/img/20191212104431.png)

### 表单form
通过bindsubmit来接收表单提交的数据
```wxml
<form bindsubmit="onSubmit">
<input name="title"></input>
<button form-type="submit">提交</button>
</form>
```

在js里定义表单提交的事情处理函数，接受一个发过来的请求事件
```js
  onSubmit: function (event) {
    console.log(event)
  }
```
![](https://raw.githubusercontent.com/nickwilling/figurebed/master/img/20191212110137.png)
可以看到，表单提交的属性被包装在`event.detail.value`里。

### 将表单提交的数据保存到数据库
```js
const db = wx.cloud.database()
// 创建collection实例
const todos = db.collection('todos')

// pages/addTodo/addTodo.js
Page({
  onSubmit: function (event) {
    todos.add({
      data:{
        title: event.detail.value.title
      }
    }).then(res => {
      wx.showToast({
        title: 'Success',
        icon:'Success'
      })
    })
  }
 
})
```

###显示消息提示框：wx.showToast
```js
wx.showToast({
  title: '成功',
  icon: 'success',
  duration: 2000
})
```

### 查看所有todo
```js
 onLoad: function (options) {
    todos.get().then(res => {
      this.setData({
        tasks:res.data
      })
    })
  }
```

```wxml
<van-cell-group>
<block wx:for="{{tasks}}">
  <van-cell title="{{item.title}}" />
</block>
</van-cell-group>
```

### 下拉刷新
如果使用下面的方法实现下拉刷新，因为`getData`方法是一个异步方法，所以调用它的时候会出现我们的数据还没有渲染好，下拉刷新事件就结束了。

在index.json里配置：
```
{
  "enablePullDownRefresh":true
}
```
在index.js里设置`onPullDownRefresh`事件
```js
  onPullDownRefresh: function () {
    this.getData()
    wx.stopPullDownRefresh()
  },
  getData: function () {
    todos.get().then(res => {
      this.setData({
        tasks: res.data
      })
    })
  }
```

### 应该在数据渲染完成之后再停止刷新
为此，我们需要在调用getData方法的时候传进去一个回调函数，并将停止刷新写在这个回调函数里，等数据渲染好之后再调用这个回调函数，就会执行里面的停止刷新。这样就可以实现先渲染数据再停止刷新，以获得良好的用户体验。
```js
onLoad: function (options) {
   this.getData(() => {

   })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getData(() => {
      wx.stopPullDownRefresh();
    });
  },
  getData: function (callback) {
    todos.get().then(res => {
      this.setData({
        tasks: res.data
      }, res => { //这个函数是this.setData的回调函数
        callback();
      })
    })
  }

})
```

### 优化操作体验（加入Loading）
 // 我们在getData之前可以加上showLoading，在数据渲染完成之后，也就是setData的回调函数中隐藏Loading
```js
 wx.showLoading({
      title: '数据加载中',
    })
wx.hideLoading()
```

### 分页查询数据并自动补全
```js
const db = wx.cloud.database()
const todos = db.collection('todos')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tasks:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData(() => {

    })
  },
  onReachBottom: function () {
    this.getData()
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getData(res => {
      wx.stopPullDownRefresh();
    });
  },
  getData: function (callback) {
    // 如果callback不存在（因为不是每次查数据都有异步要求的），将callback=一个匿名函数就可以了
    if (!callback) {
      callback = () => { }
    }
    // 我们在getData之前可以加上showLoading，在数据渲染完成之后，也就是setData的回调函数中隐藏Loading
    wx.showLoading({
      title: '数据加载中',
    })
    todos.skip(this.pageData.skip).get().then(res => {
      let oldData = this.data.tasks
      this.setData({
        //每次显示的数据应该是上一次的数据和这次查出来的数据做一个拼接
        tasks: oldData.concat(res.data) 
      }, res => {//这个函数是this.setData的回调函数
        // 第一次跳过以后要对skip进行增加
        this.pageData.skip = this.pageData.skip + 20
        wx.hideLoading()
        callback();
      })
    })
  },
  pageData: {
    skip: 0 //默认跳过0个
  }

})
```
### 通过id查找
```js
// options是传过来的id=？
onLoad: function (options) {
    todos.doc(options.id).get().then(res =>{
      console.log(res)
      this.setData({
        task:res.data
      })
    })
  }
```
将查出来的英文变成中文
```wxml
<van-cell-group>
  <van-cell 
  title="{{task.title}}" 
  border="{{false}}"
  value="{{task.status === 'in-progress'?'待完成':'已完成'}}"/>
</van-cell-group>
```

### 上传图片API
```js
   wx.cloud.uploadFile({
          cloudPath: `${Math.floor(Math.random()*10000000)}.png`,
          filePath: res.tempFilePaths[0]
        }).then(res => {
          console.log(res.fileID)
          this.setData({
            image: res.fileID
          })
        }).catch(err => {
          console.log(err)
        })
```

### 关于丢失this
回调函数是会丢失页面的this属性的，此时只要换成宁明函数res =>{}即可
```js
  selectImage:function(e){
    wx.chooseImage({
      success: function (res) { //回调函数是会丢失页面的this属性的，此时只要换成宁明函数res =>{}即可
        console.log(res.tempFilePaths[0])
        wx.cloud.uploadFile({
          cloudPath: `${Math.floor(Math.random()*10000000)}.png`,
          filePath: res.tempFilePaths[0]
        }).then(res => {
          console.log(res.fileID)
          this.setData({
            image: res.fileID
          })
        }).catch(err => {
          console.log(err)
        })
      },
    })
  }
```

### 地理位置授权
在app.json添加配置
```json
   "permission": {
      "scope.userLocation": {
        "desc": "你的位置信息将用于小程序位置接口的效果展示" // 高速公路行驶持续后台定位
      }
    }
```