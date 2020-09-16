import {promisifyAll} from 'miniprogram-api-promise';
// 获取小程序全局配置（变量、函数等）
const wxp = {}
promisifyAll(wx, wxp)
const app = getApp()
// 定义网络请求API地址
const BaseURL = 'https://api.bytebody.com'
const AuthTokenName = 'authToken'
const NetworkError = "网络错误，请检查网络"
const HTTPCode = {
    OK: 200,
    BadRequest: 400,
    Unauthorized: 401,
    NetworkError: -1
}

const defaultHeader = {
    Type: "miniprogram",
    "X-Version-Code": "1.0.0",
    "X-APP-ID": "wxae0d23630594d9a0"
}

const fetch = async (path, data, method, header, ...other) => {
    header = {...header, ...defaultHeader}
    try {
        return await wxp.request({// 请求地址拼
            url: BaseURL + path,
            data: data,
            // 获取请求头配置
            header: header,
            method: method,
            ...other,
        })
    } catch (e) {
        console.log("fetch:", e)
        return {statusCode: HTTPCode.NetworkError}
    }
}

// 重构请求方式
const authFetch = async (path, data, method, header) => {
    const auth = wx.getStorageSync(AuthTokenName)
    // auth 不存在或者已过期
    if (!auth || auth.expires < new Date()) {
        return {statusCode: HTTPCode.Unauthorized}
    }
    return await fetch(path, data, method, {"Authorization": auth.token, ...header})
}


const login = (enforce) => new Promise((resolve) => {
    if (!enforce) {
        const auth = wx.getStorageSync(AuthhokenName)
        // auth 不存在或者已过期
        if (auth && auth.expires > new Date()) {
            resolve(auth)
            return
        }
    }
    wx.login({
        fail: (result) => {
            throw Error(result.errMsg)
        },
        success: result => {
            const data = {code: result.code, system: wx.getSystemInfoSync()}
            const other = {dateType: "其他"}
            fetch("/auth/miniprogram/token", data, "post", null, other).then(response => {
                if (response.statusCode === HTTPCode.OK) {
                    wx.setStorageSync(AuthTokenName, response.data)
                    resolve(response.data)
                } else {
                    throw Error(response.data)
                }
            }).catch(reason => {
                throw Error(reason.errMsg)
            })
        }
    })
})

const userInfo = async (encryptedData, iv) => {
    await authFetch("/users/miniprogram/userinfo", {encryptedData, iv}, "put", null).then(response => {
        if (response.statusCode === HTTPCode.OK) {
            app.globalData.userInfo = response.data
        } else {
            throw  new Error(response.data)
        }
    }).catch(reason => {
        throw new Error(reason.errMsg)
    })
}


const APIs = {
    Get: (path, data, header, loading) =>
        fetch(path, data, "get", header, loading),
    Post: (path, data, header, loading) =>
        fetch(path, data, "post", header, loading),
    Delete: (path, data, header, loading) =>
        fetch(path, data, "delete", header, loading),
    Put: (path, data, header, loading) =>
        fetch(path, data, "put", header, loading),
    Fetch: fetch,
}

const AuthAPIs = {
    Get: (path, data, header, loading) =>
        authFetch(path, data, "get", header, loading),
    Post: (path, data, header, loading) =>
        authFetch(path, data, "post", header, loading),
    Delete: (path, data, header, loading) =>
        authFetch(path, data, "delete", header, loading),
    Put: (path, data, header, loading) =>
        authFetch(path, data, "put", header, loading),
    Fetch: authFetch
}

module.exports = {
    BaseURL: BaseURL,
    AuthTokenName: AuthTokenName,
    AuthAPIs: AuthAPIs,
    APIs: APIs,
    HTTPCode: HTTPCode,
    Login: login,
    UserInfo: userInfo
}
