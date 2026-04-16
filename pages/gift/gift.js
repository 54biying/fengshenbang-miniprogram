// 拜师礼页逻辑
import { mentorApi, paymentApi } from '../../utils/api.js'

Page({
  data: {
    type: '', // send, my, received
    mentor: null,
    myGifts: [],
    receivedGifts: [],
    amountOptions: [99, 199, 299, 499],
    selectedAmount: 199,
    customAmount: '',
    message: ''
  },

  onLoad(options) {
    const type = options.type || 'send'
    this.setData({ type })

    if (type === 'send' && options.mentorId) {
      this.loadMentor(options.mentorId, options.price)
    } else if (type === 'my') {
      this.loadMyGifts()
    } else if (type === 'received') {
      this.loadReceivedGifts()
    }
  },

  // 加载导师信息
  async loadMentor(mentorId, price) {
    try {
      const mentor = await mentorApi.getMentorDetail(mentorId)
      this.setData({
        mentor,
        selectedAmount: parseInt(price) || 199
      })
    } catch (err) {
      console.error('加载导师信息失败', err)
    }
  },

  // 加载我的拜师礼
  async loadMyGifts() {
    wx.showLoading({
      title: '加载中...'
    })

    try {
      const gifts = await mentorApi.getMyGifts()
      this.setData({
        myGifts: gifts || []
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

  // 加载收到的拜师礼
  async loadReceivedGifts() {
    wx.showLoading({
      title: '加载中...'
    })

    try {
      const gifts = await mentorApi.getReceivedGifts()
      this.setData({
        receivedGifts: gifts || []
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

  // 选择金额
  selectAmount(e) {
    const amount = e.currentTarget.dataset.amount
    this.setData({
      selectedAmount: amount,
      customAmount: ''
    })
  },

  // 自定义金额输入
  onCustomAmountInput(e) {
    this.setData({
      customAmount: e.detail.value,
      selectedAmount: 0
    })
  },

  // 留言输入
  onMessageInput(e) {
    this.setData({
      message: e.detail.value
    })
  },

  // 提交拜师礼
  async submitGift() {
    const amount = this.data.customAmount || this.data.selectedAmount

    if (!amount || amount < 1) {
      wx.showToast({
        title: '请输入有效金额',
        icon: 'none'
      })
      return
    }

    if (!this.data.message.trim()) {
      wx.showToast({
        title: '请输入留言',
        icon: 'none'
      })
      return
    }

    wx.showLoading({
      title: '提交中...'
    })

    try {
      // 创建支付订单
      const order = await paymentApi.createPayment(this.data.mentor.id, amount)

      wx.hideLoading()

      // 调起微信支付
      wx.requestPayment({
        timeStamp: order.timeStamp,
        nonceStr: order.nonceStr,
        package: order.package,
        signType: order.signType,
        paySign: order.paySign,
        success: () => {
          wx.showToast({
            title: '支付成功',
            icon: 'success'
          })

          setTimeout(() => {
            wx.navigateBack()
          }, 1500)
        },
        fail: (err) => {
          wx.showToast({
            title: '支付失败',
            icon: 'none'
          })
        }
      })

    } catch (err) {
      wx.hideLoading()
      wx.showToast({
        title: err.message || '提交失败',
        icon: 'none'
      })
    }
  },

  // 接受拜师礼
  acceptGift(e) {
    const id = e.currentTarget.dataset.id
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  },

  // 拒绝拜师礼
  rejectGift(e) {
    const id = e.currentTarget.dataset.id
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  }
})
