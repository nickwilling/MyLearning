// // 云函数入口文件
// const cloud = require('wx-server-sdk')
// const http = require('http')
// cloud.init()


// const db = cloud.database()
// const userDB = db.collection("data")
// // 云函数入口函数
// exports.main = async (event, context) => {
//   const wxContext = cloud.getWXContext()
//   console.log("sssss")
//   // userDB.add({
//   //   data:{
//   //     name:"嗡嗡嗡"
//   //   }
//   // }).then(res => {
//   //   console.log(res)
//   // })
// }

// 云函数入口文件
const cloud = require('wx-server-sdk')
//引入request-promise用于做网络请求
var rp = require('request-promise');
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let url = 'https://www.baidu.com';
  return await rp(url)
    .then(function (res) {
      return res
    })
    .catch(function (err) {
      return '失败'
    });
}