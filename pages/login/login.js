// 登录页逻辑
import { userApi } from '../../utils/api.js'

Page({
  data: {
    phone: '',
    code: '',
    password: '',
    loginType: 'password', // 默认密码登录
    countdown: 0,
    timer: null
  },

  onLoad() {
    // 检查是否已登录
    const app = getApp()
    if (app.isLoggedIn()) {
      wx.switchTab({
        url: '/pages/index/index'
      })
    }
  },

  onUnload() {
    // 清除倒计时
    if (this.data.timer) {
      clearInterval(this.data.timer)
    }
  },

  // 切换登录方式
  switchLoginType(e) {
    const type = e.currentTarget.dataset.type
    this.setData({ loginType: type })
  },

  // 手机号输入
  onPhoneInput(e) {
    this.setData({
      phone: e.detail.value
    })
  },

  // 验证码输入
  onCodeInput(e) {
    this.setData({
      code: e.detail.value
    })
  },

  // 密码输入
  onPasswordInput(e) {
    this.setData({
      password: e.detail.value
    })
  },

  // 发送验证码
  sendCode() {
    const { phone } = this.data

    // 验证手机号
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
      return
    }

    // 验证码功能暂未开放
    wx.showToast({
      title: '验证码功能暂未开放',
      icon: 'none'
    })
  },

  // 开始倒计时
  startCountdown() {
    let countdown = 60
    this.setData({ countdown })

    const timer = setInterval(() => {
      countdown--
      this.setData({ countdown })

      if (countdown <= 0) {
        clearInterval(timer)
        this.setData({ timer: null })
      }
    }, 1000)

    this.setData({ timer })
  },

  // 处理登录
  async handleLogin() {
    const { phone, code, password, loginType } = this.data

    // 验证手机号
    if (!phone) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
      return
    }

    wx.showLoading({
      title: '登录中...'
    })

    try {
      let result

      if (loginType === 'password') {
        // 密码登录
        if (!password) {
          wx.showToast({
            title: '请输入密码',
            icon: 'none'
          })
          wx.hideLoading()
          return
        }
        result = await userApi.loginWithPassword(phone, password)
      } else {
        // 验证码登录
        if (!code) {
          wx.showToast({
            title: '请输入验证码',
            icon: 'none'
          })
          wx.hideLoading()
          return
        }
        // 验证码登录暂未实现
        wx.showToast({
          title: '验证码登录暂未开放，请使用密码登录',
          icon: 'none'
        })
        wx.hideLoading()
        return
      }

      // 保存登录信息
      const app = getApp()
      app.setLoginInfo(result.token, result.user)

      wx.hideLoading()
      wx.showToast({
        title: '登录成功',
        icon: 'success'
      })

      // 跳转到首页
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/index/index'
        })
      }, 1500)

    } catch (err) {
      wx.hideLoading()
      wx.showToast({
        title: err.message || '登录失败',
        icon: 'none'
      })
    }
  }
})
