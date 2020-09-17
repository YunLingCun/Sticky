//home.js
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';

//获取应用实例
const app = getApp()


Page({
    data: {
        canIUse: wx.canIUse("button.open-type.getUserInfo"),
        isAuth: true
    },
    onLoad: function () {
        const that = this
        app.isAuth().then(isAuth => that.setData({isAuth}))
    },
    getUserInfo: function (e) {
        const that = this
        app.isAuth().then(isAuth => {
            if (isAuth) {
                that.setData({isAuth})
            } else {
                Toast('授权后才能使用哦😊😊');
            }
        })
    },
    getPhoneNumber: function (e) {
        if (e.detail.errMsg === 'getPhoneNumber:ok') {
            app.putUserInfo(3, e.detail).then(result => {
                console.log("putUserInfo:", result ? "success" : "fail")
            })
        }
    }
})
