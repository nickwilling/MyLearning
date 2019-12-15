// 初始化数据库实例
const db = wx.cloud.database()
// 初始化command实例
const _ = db.command
Page({
    query: function () {
      db.collection('data')
      .where({
        name: new RegExp({
          regexp:'name-0[1-9]',
          options: 'i'
        })
      })
      .get().then(
        console.log
      ).catch(console.error)
    },
    add: function () {
      db.collection('location').add({
        data: {
          location: db.Geo.Point(100.0012,10.0022)
        }
      }).then(res => {
        console.log(res)
        db.collection('location').add({
          data:{
            location: db.Geo.Point(10.0012, 10.0022)
          }
        })
      }).then(res => {
        db.collection('location').add({
          data:{
            location:db.Geo.Point(35.0012,45.0021)
          }
        })
      })
    },
    queryLoc: function () {
      db.collection('location').get().then(
        res => {
          console.log(res)
          res.data.forEach(function(item, index){
            console.log('第' + (index + 1) + '个地点,他的latitude是' + item.location.latitude + ',longitude是' + item.location.longitude)
          })
        }
      )
    },
    onClick: function () {
      wx.cloud.getTempFileURL({
        fileList: ['cloud://wwl.7777-wwl-1300755893/my-image.png','cloud://wwl.7777-wwl-1300755893/快捷键.png'],
        success: res => {
          console.log(res.fileList[1].tempFileURL)
        }
      })
    }
})
