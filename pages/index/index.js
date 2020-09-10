//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        // status: unlogin->loading->loaded
        status: "unlogin"
    },
    //事件处理函数
    bindUserInfo: function (e) {
        console.log(e)
        this.setData({status: "loading"})
        const that = this
        setTimeout(function () {
            that.setData({status: "loaded"})
        }, 3000)
    },
    onLoad: function () {

    },
    onClickLeft() {
        wx.showToast({ title: '点击返回', icon: 'none' });
    },
    onClickRight() {
        wx.showToast({ title: '点击按钮', icon: 'none' });
    },
})
