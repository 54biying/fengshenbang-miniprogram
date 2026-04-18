// API 工具类
const app = getApp()

// 封装请求方法
function request(url, method = 'GET', data = {}) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${app.globalData.baseUrl}${url}`,
      method: method,
      data: data,
      header: {
        'Content-Type': 'application/json',
        'Authorization': app.globalData.token ? `Bearer ${app.globalData.token}` : ''
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else if (res.statusCode === 401) {
          // 未登录，跳转到登录页
          wx.navigateTo({
            url: '/pages/login/login'
          })
          reject(new Error('未登录'))
        } else {
          reject(res.data)
        }
      },
      fail: (err) => {
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        })
        reject(err)
      }
    })
  })
}

// 用户相关 API
export const userApi = {
  // 验证码登录（待后端实现）
  login(phone, code) {
    return request('/auth/login', 'POST', { phone, code })
  },

  // 密码登录（后端已实现 /login-password）
  loginWithPassword(phone, password) {
    return request('/login-password', 'POST', { phone, password })
  },

  // 获取用户信息（后端已实现）
  getUserInfo() {
    return request('/user/profile')
  },

  // 更新用户信息（后端已实现）
  updateUserInfo(data) {
    return request('/user/profile', 'PUT', data)
  },

  // 获取用户等级（待后端实现）
  getUserLevel() {
    return request('/user/level')
  }
}

// 测试相关 API
export const testApi = {
  // 开始测试（待后端实现）
  startTest() {
    return request('/test/start', 'POST')
  },

  // 提交答案（后端已实现 /test/submit）
  submitAnswer(questionId, answer) {
    return request('/test/submit', 'POST', { questionId, answer })
  },

  // 获取测试结果（待后端实现）
  getTestResult(testId) {
    return request(`/test/result/${testId}`)
  },

  // 获取测试历史（后端已实现）
  getTestHistory() {
    return request('/test/history')
  }
}

// 匹配相关 API
export const matchApi = {
  // 获取推荐匹配（后端已实现 /matching/recommend）
  getRecommendations() {
    return request('/matching/recommend')
  },

  // 发送匹配请求（后端已实现 /matching/request）
  sendMatchRequest(targetUserId) {
    return request('/matching/request', 'POST', { targetUserId })
  },

  // 获取匹配请求列表（后端已实现 /matching/requests）
  getMatchRequests() {
    return request('/matching/requests')
  },

  // 接受匹配请求（待后端实现）
  acceptMatchRequest(requestId) {
    return request(`/matching/accept/${requestId}`, 'POST')
  },

  // 拒绝匹配请求（待后端实现）
  rejectMatchRequest(requestId) {
    return request(`/matching/reject/${requestId}`, 'POST')
  }
}

// 拜师礼相关 API
export const mentorApi = {
  // 获取导师列表（后端已实现 /mentorship/list）
  getMentors() {
    return request('/mentorship/list')
  },

  // 获取导师详情（待后端实现）
  getMentorDetail(mentorId) {
    return request(`/mentorship/mentors/${mentorId}`)
  },

  // 发送拜师礼请求（后端已实现 /mentorship/create）
  sendGiftRequest(mentorId, amount, message) {
    return request('/mentorship/create', 'POST', { mentorId, amount, message })
  },

  // 获取我的拜师礼记录（待后端实现）
  getMyGifts() {
    return request('/mentorship/my-gifts')
  },

  // 获取收到的拜师礼（待后端实现）
  getReceivedGifts() {
    return request('/mentorship/received-gifts')
  }
}

// 打卡相关 API
export const checkinApi = {
  // 获取今日打卡状态
  getStatus() {
    return request('/checkin')
  },

  // 提交打卡
  submit(data) {
    return request('/checkin', 'POST', data)
  },

  // 获取打卡统计
  getStats() {
    return request('/checkin/stats')
  }
}

// 积分相关 API（待后端实现）
export const pointsApi = {
  // 获取积分余额
  getPointsBalance() {
    return request('/points/balance')
  },

  // 获取积分记录
  getPointsHistory() {
    return request('/points/history')
  },

  // 兑换积分
  exchangePoints(points, itemId) {
    return request('/points/exchange', 'POST', { points, itemId })
  }
}

// 支付相关 API（待后端实现）
export const paymentApi = {
  // 创建支付订单
  createPayment(giftId, amount) {
    return request('/payment/create', 'POST', { giftId, amount })
  },

  // 获取支付状态
  getPaymentStatus(orderId) {
    return request(`/payment/status/${orderId}`)
  }
}

export default {
  request,
  userApi,
  testApi,
  matchApi,
  mentorApi,
  checkinApi,
  pointsApi,
  paymentApi
}
