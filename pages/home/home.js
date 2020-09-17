//home.js
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';

//获取应用实例
const app = getApp()


Page({
    data: {
        canIUse: wx.canIUse("button.open-type.getUserInfo"),
        auth: true
    },
    onLoad: function () {
        const that = this
        app.isAuth().then(auth => that.setData({auth: auth}))
    },
    getUserInfo: function (e) {
        if (e.detail.errMsg === 'getUserInfo:ok') {
            this.setData({auth: true})
        } else {
            Toast('授权后才能使用哦😊😊');
        }
    },
})
