// 积分页逻辑
import { pointsApi } from '../../utils/api.js'

Page({
  data: {
    balance: 0,
    history: []
  },

  onShow() {
    this.loadBalance()
    this.loadHistory()
  },

  // 加载积分余额
  async loadBalance() {
    try {
      const data = await pointsApi.getPointsBalance()
      this.setData({
        balance: data.balance || 0
      })
    } catch (err) {
      console.error('加载积分余额失败', err)
    }
  },

  // 加载积分历史
  async loadHistory() {
    wx.showLoading({
      title: '加载中...'
    })

    try {
      const data = await pointsApi.getPointsHistory()
      this.setData({
        history: data || []
      })
      wx.hideLoading()
    } catch (err) {
      wx.hideLoading()
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    }
  },

  // 赚取积分
  earnPoints() {
    wx.showModal({
      title: '赚取积分',
      content: '赚取积分的方式：\n\n1. 完成测试：+100分\n2. 成功匹配：+50分\n3. 发送拜师礼：+200分\n4. 帮助他人：+50-100分\n5. 每日签到：+10分',
      showCancel: false,
      confirmText: '我知道了'
    })
  },

  // 兑换积分
  exchangePoints() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  }
})
