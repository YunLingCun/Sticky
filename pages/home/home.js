//home.js
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import apis from "../../apis/apis";
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
            console.log(e)
            apis.UserInfo(e.detail.encryptedData, e.detail.iv).then(result => {
            }).catch(reason => console.log(reason))
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
                    wx.getUserInfo({
                        success: result => {
                            apis.UserInfo(result.encryptedData, result.iv).then(result => {
                                console.log(result)
                            }).catch(reason => console.log(reason))
                        }
                    })
                } else {
                    that.setData({auth: false})
                }
            }
        })
    }
})
