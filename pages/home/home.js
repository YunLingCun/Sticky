//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        canIUse: wx.canIUse("button.open-type.getUserInfo")
    },
    onLoad: function () {

    },
    getUserInfo: function (e) {
        console.log(e)
    }
})
