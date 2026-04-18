// 首页逻辑
import { userApi, pointsApi, checkinApi, taskApi, badgeApi } from '../../utils/api.js'

Page({
  data: {
    userInfo: null,
    userLevel: 0,
    userPoints: 0,
    todayCheckedIn: false,
    checkinStats: null,
    weekStatus: [false, false, false, false, false, false, false],
    tasks: [],
    badges: [],
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
      try {
        const levelData = await userApi.getUserLevel()
        this.setData({
          userLevel: levelData.level || 0
        })
      } catch (e) {
        console.error('获取等级失败', e)
      }

      // 获取积分余额
      try {
        const pointsData = await pointsApi.getPointsBalance()
        this.setData({
          userPoints: pointsData.balance || 0
        })
      } catch (e) {
        console.error('获取积分失败', e)
      }

      // 获取打卡状态
      try {
        const checkinData = await checkinApi.getStatus()
        this.setData({
          todayCheckedIn: checkinData.todayCheckedIn || false,
          checkinStats: checkinData.stats,
          weekStatus: checkinData.weekStatus || [false, false, false, false, false, false, false]
        })
      } catch (e) {
        console.error('获取打卡状态失败', e)
      }

      // 获取任务列表
      try {
        const taskData = await taskApi.getTasks()
        this.setData({
          tasks: taskData.tasks || []
        })
      } catch (e) {
        console.error('获取任务失败', e)
      }

      // 获取勋章列表
      try {
        const badgeData = await badgeApi.getBadges()
        this.setData({
          badges: badgeData.badges || []
        })
      } catch (e) {
        console.error('获取勋章失败', e)
      }

      // 获取用户信息
      try {
        const userData = await userApi.getUserInfo()
        if (userData.user) {
          this.setData({
            stats: {
              testCount: 0,
              matchCount: 0,
              giftCount: 0
            }
          })
        }
      } catch (e) {
        console.error('获取用户信息失败', e)
      }
    } catch (err) {
      console.error('加载用户数据失败', err)
    }
  },

  // 打卡
  async doCheckin() {
    if (this.data.todayCheckedIn) {
      wx.showToast({ title: '今日已打卡', icon: 'none' })
      return
    }

    wx.showLoading({ title: '打卡中...' })
    try {
      const result = await checkinApi.submit({ studyTime: 30, tasks: [], notes: '', mood: 'happy' })
      wx.hideLoading()
      if (result.success) {
        wx.showToast({ title: `打卡成功！+${result.pointsEarned}积分`, icon: 'success' })
        this.loadUserData()
      } else {
        wx.showToast({ title: result.error || '打卡失败', icon: 'none' })
      }
    } catch (err) {
      wx.hideLoading()
      wx.showToast({ title: err.message || '打卡失败', icon: 'none' })
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
  },

  // 跳转到积分页
  goToPoints() {
    if (!getApp().isLoggedIn()) {
      this.goToLogin()
      return
    }
    wx.navigateTo({
      url: '/pages/points/points'
    })
  }
})
