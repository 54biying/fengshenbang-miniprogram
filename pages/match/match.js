// 匹配页逻辑
import { matchApi } from '../../utils/api.js'

Page({
  data: {
    recommendations: [],
    requests: []
  },

  onShow() {
    this.loadRecommendations()
    this.loadRequests()
  },

  // 加载推荐匹配
  async loadRecommendations() {
    try {
      const recommendations = await matchApi.getRecommendations()
      this.setData({
        recommendations: recommendations || []
      })
    } catch (err) {
      console.error('加载推荐匹配失败', err)
    }
  },

  // 加载匹配请求
  async loadRequests() {
    try {
      const requests = await matchApi.getMatchRequests()
      this.setData({
        requests: requests || []
      })
    } catch (err) {
      console.error('加载匹配请求失败', err)
    }
  },

  // 查看用户资料
  viewUserProfile(e) {
    const user = e.currentTarget.dataset.user
    wx.showModal({
      title: user.name,
      content: `等级：Lv.${user.level}\n标签：${user.tags}\n匹配度：${user.matchDegree}%`,
      showCancel: false
    })
  },

  // 发送匹配请求
  async sendRequest(e) {
    const targetUserId = e.currentTarget.dataset.userid

    wx.showLoading({
      title: '发送中...'
    })

    try {
      await matchApi.sendMatchRequest(targetUserId)

      wx.hideLoading()
      wx.showToast({
        title: '发送成功',
        icon: 'success'
      })

      // 重新加载推荐
      this.loadRecommendations()

    } catch (err) {
      wx.hideLoading()
      wx.showToast({
        title: err.message || '发送失败',
        icon: 'none'
      })
    }
  },

  // 接受请求
  async acceptRequest(e) {
    const requestId = e.currentTarget.dataset.id

    wx.showLoading({
      title: '处理中...'
    })

    try {
      await matchApi.acceptMatchRequest(requestId)

      wx.hideLoading()
      wx.showToast({
        title: '匹配成功',
        icon: 'success'
      })

      // 重新加载
      this.loadRequests()

    } catch (err) {
      wx.hideLoading()
      wx.showToast({
        title: err.message || '操作失败',
        icon: 'none'
      })
    }
  },

  // 拒绝请求
  async rejectRequest(e) {
    const requestId = e.currentTarget.dataset.id

    wx.showModal({
      title: '确认拒绝',
      content: '确定要拒绝这个匹配请求吗？',
      success: async (res) => {
        if (res.confirm) {
          wx.showLoading({
            title: '处理中...'
          })

          try {
            await matchApi.rejectMatchRequest(requestId)

            wx.hideLoading()
            wx.showToast({
              title: '已拒绝',
              icon: 'success'
            })

            // 重新加载
            this.loadRequests()

          } catch (err) {
            wx.hideLoading()
            wx.showToast({
              title: err.message || '操作失败',
              icon: 'none'
            })
          }
        }
      }
    })
  },

  // 去测试
  goToTest() {
    wx.switchTab({
      url: '/pages/test/test'
    })
  }
})
