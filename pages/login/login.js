Page({
  data: {
    isLogging: false, // 用于控制登录状态，显示或隐藏加载动画
    hasUserInfo: false, // 用于判断用户是否已登录并获取到用户信息
    userInfo: {} // 存储用户信息
  },

  // 用户点击登录按钮时的处理函数
  login: function () {
    this.setData({ isLogging: true }); // 显示登录中的加载动画

    wx.login({
      success: res => {
        if (res.code) {
          // 调用云函数，传递 code 获取 openid 和 session_key
          wx.cloud.callFunction({
            name: 'login',  // 云函数名称
            data: {
              code: res.code  // 将 code 传递给云函数
            },
            success: (response) => {
              console.log("成功返回：", response.result);

              // 获取 openid 和 session_key
              const { openid, session_key } = response.result;

              // 假设这里的用户信息存储到本地
              const userInfo = {
                openid: openid,
                userName: '默认昵称',  // 默认昵称
                avatarUrl: '默认头像链接'  // 默认头像链接
              };

              // 保存用户信息到本地存储
              wx.setStorageSync('userInfo', userInfo);

              // 更新用户信息和登录状态
              this.setData({
                userInfo: userInfo,
                hasUserInfo: true,
                isLogging: false // 登录完成，隐藏加载动画
              });

              // 登录成功后跳转到 bindInfo 页面
              wx.reLaunch({
                url: '/pages/bindInfo/bindInfo'  // 跳转到绑定信息页面
              });
            },
            fail: (error) => {
              console.error("调用云函数失败", error);
              this.setData({ isLogging: false }); // 登录失败，隐藏加载动画
            }
          });
        } else {
          console.error('登录失败！' + res.errMsg);
          this.setData({ isLogging: false }); // 登录失败，隐藏加载动画
        }
      }
    });
  }
});