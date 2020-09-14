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
        this.isAuth()
    },
    getUserInfo: function (e) {
        if (e.detail.errMsg === 'getUserInfo:ok') {
            this.setData({auth: true})
            console.log(e.detail)
        } else {
            Toast('授权后才能使用哦😊😊');
        }
    },
    isAuth: function () {
        const that = this
        wx.getSetting({
            success(res) {
                if (res.authSetting['scope.userInfo']) {
                    that.setData({auth: true})
                } else {
                    that.setData({auth: false})
                }
            }
        })
    }
})
