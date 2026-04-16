// 首页逻辑
import { userApi, pointsApi } from '../../utils/api.js'

Page({
  data: {
    userInfo: null,
    userLevel: 0,
    userPoints: 0,
    stats: {
      testCount: 0,
      matchCount: 0,
      giftCount: 0
    }
  },

  onLoad() {
    this.checkLogin()
  },

  onShow() {
    if (this.data.userInfo) {
      this.loadUserData()
    }
  },

  // 检查登录状态
  checkLogin() {
    const app = getApp()
    if (app.isLoggedIn()) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
      this.loadUserData()
    }
  },

  // 加载用户数据
  async loadUserData() {
    try {
      // 获取用户等级
      const levelData = await userApi.getUserLevel()
      this.setData({
        userLevel: levelData.level || 0
      })

      // 获取积分余额
      const pointsData = await pointsApi.getPointsBalance()
      this.setData({
        userPoints: pointsData.balance || 0
      })

      // 获取用户统计
      const userData = await userApi.getUserInfo()
      this.setData({
        stats: userData.stats || {}
      })
    } catch (err) {
      console.error('加载用户数据失败', err)
    }
  },

  // 跳转到登录页
  goToLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    })
  },

  // 跳转到测试页
  goToTest() {
    if (!getApp().isLoggedIn()) {
      this.goToLogin()
      return
    }
    wx.switchTab({
      url: '/pages/test/test'
    })
  },

  // 跳转到匹配页
  goToMatch() {
    if (!getApp().isLoggedIn()) {
      this.goToLogin()
      return
    }
    wx.switchTab({
      url: '/pages/match/match'
    })
  },

  // 跳转到导师页
  goToMentor() {
    if (!getApp().isLoggedIn()) {
      this.goToLogin()
      return
    }
    wx.navigateTo({
      url: '/pages/mentor/mentor'
    })
  }
})
