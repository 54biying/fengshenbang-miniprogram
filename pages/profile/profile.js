// 个人资料页逻辑
import { userApi, mentorApi, pointsApi } from '../../utils/api.js'

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

  onShow() {
    this.loadUserData()
  },

  // 加载用户数据
  async loadUserData() {
    try {
      const app = getApp()
      if (!app.isLoggedIn()) {
        wx.navigateTo({
          url: '/pages/login/login'
        })
        return
      }

      this.setData({
        userInfo: app.globalData.userInfo
      })

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

  // 跳转到积分明细
  goToPoints() {
    wx.navigateTo({
      url: '/pages/points/points'
    })
  },

  // 跳转到我的拜师礼
  goToMyGifts() {
    wx.navigateTo({
      url: '/pages/gift/gift?type=my'
    })
  },

  // 跳转到收到的拜师礼
  goToReceivedGifts() {
    wx.navigateTo({
      url: '/pages/gift/gift?type=received'
    })
  },

  // 编辑资料
  editProfile() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  },

  // 联系客服
  contactSupport() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  },

  // 退出登录
  logout() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          const app = getApp()
          app.clearLoginInfo()

          wx.showToast({
            title: '已退出登录',
            icon: 'success'
          })

          setTimeout(() => {
            wx.reLaunch({
              url: '/pages/login/login'
            })
          }, 1500)
        }
      }
    })
  }
})
