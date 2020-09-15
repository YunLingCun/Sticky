//app.js


import apis from "./apis/apis";

App({
    onLaunch: function () {
        apis.Login().then(result => console.log(result)).catch(reason => console.log(reason))
    },
    globalData: {}
})