//app.js
import {promisifyAll} from 'miniprogram-api-promise';
import apis from "./apis/apis";
// 获取小程序全局配置（变量、函数等）
const wxp = {}
promisifyAll(wx, wxp)

App({
    onLaunch: function () {
        this.Login().then(response => console.log("login:", response))
    },
    async Login() {
        const response = await apis.Login()
        console.log("login:", response)
        switch (response.statusCode) {
            case apis.HTTPCode.OK:
                break
            case apis.HTTPCode.NetworkError:
                wx.showToast({
                    title: "网络错误,请检查网络",
                    duration: 1000,
                    mask: false,
                    icon: "none"
                })
                break
            default:
                wx.showToast({
                    title: "未知错误",
                    duration: 1000,
                    mask: false,
                    icon: "none"
                })
                break
        }
    },
    isAuth: async function () {
        try {
            const setting = await wxp.getSetting()
            if (setting.authSetting['scope.userInfo']) {
                this.putUserInfo(3).then(result => {
                    console.log("putUserInfo:", result ? "success" : "fail")
                })
                return true
            }
            return false
        } catch (e) {
            console.log("isAuth:", e)
            return false
        }
    },
    putUserInfo: async function (times) {
        if (times <= 0) {
            return false
        }
        try {
            const userInfo = await wxp.getUserInfo()
            const response = await apis.PutUserInfo(userInfo.encryptedData, userInfo.iv)
            switch (response.statusCode) {
                case apis.HTTPCode.OK:
                    return true
                case apis.HTTPCode.NetworkError:
                    wx.showToast({
                        title: "网络错误,请检查网络",
                        duration: 1000,
                        mask: false,
                        icon: "none"
                    })
                    break
                case apis.HTTPCode.Unauthorized:
                    await this.Login()
                    break
                default:
                    wx.showToast({
                        title: "未知错误",
                        duration: 1000,
                        mask: false,
                        icon: "none"
                    })
                    break
            }
        } catch (e) {
            console.log("putUserInfo:", e)
        }
        return await this.putUserInfo(times - 1)
    },

    globalData: {}
})