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
  // 密码登录
  loginWithPassword(phone, password) {
    return request('/login-password', 'POST', { phone, password })
  },

  // 获取用户信息
  getUserInfo() {
    return request('/user/profile')
  },

  // 更新用户信息
  updateUserInfo(data) {
    return request('/user/profile', 'PUT', data)
  },

  // 获取用户等级
  getUserLevel() {
    return request('/user/level')
  }
}

// 测试相关 API
export const testApi = {
  // 开始测试
  startTest() {
    return request('/test/start', 'POST')
  },

  // 获取测试结果
  getTestResult(testId) {
    return request(`/test/result/${testId}`)
  },

  // 获取测试历史
  getTestHistory() {
    return request('/test/history')
  },

  // 提交测试答案
  submitTest(testId, answers) {
    return request('/test/submit', 'POST', {
      testId,
      answers,
      questions: [
        { id: '1', category: '编程基础' },
        { id: '2', category: '编程基础' },
        { id: '3', category: '系统设计' },
        { id: '4', category: '系统设计' },
        { id: '5', category: '数据结构' },
        { id: '6', category: '数据结构' },
        { id: '7', category: '算法' },
        { id: '8', category: '算法' },
        { id: '9', category: '数据库' },
        { id: '10', category: '数据库' }
      ]
    })
  }
}

// 匹配相关 API
export const matchApi = {
  // 获取推荐匹配
  getRecommendations() {
    return request('/matching/recommend')
  },

  // 发送匹配请求
  sendMatchRequest(targetUserId, type = 'study') {
    return request('/matching/request', 'POST', { targetId: targetUserId, type })
  },

  // 获取匹配请求列表
  getMatchRequests() {
    return request('/matching/requests')
  },

  // 接受匹配请求
  acceptMatchRequest(requestId) {
    return request(`/matching/accept/${requestId}`, 'POST')
  },

  // 拒绝匹配请求
  rejectMatchRequest(requestId) {
    return request(`/matching/reject/${requestId}`, 'POST')
  }
}

// 拜师礼相关 API
export const mentorApi = {
  // 获取导师列表
  getMentors() {
    return request('/mentorship/mentors')
  },

  // 获取导师详情
  getMentorDetail(mentorId) {
    return request(`/mentorship/mentors/${mentorId}`)
  },

  // 发送拜师礼请求
  sendGiftRequest(mentorId, giftAmount, goal) {
    return request('/mentorship/create', 'POST', { mentorId, giftAmount, goal })
  },

  // 获取我的拜师礼记录
  getMyGifts() {
    return request('/mentorship/my-gifts')
  },

  // 获取收到的拜师礼
  getReceivedGifts() {
    return request('/mentorship/received-gifts')
  }
}

// 打卡相关 API
export const checkinApi = {
  // 获取打卡状态
  getStatus() {
    return request('/checkin')
  },

  // 打卡
  submit({ studyTime = 30, tasks = [], notes = '', mood = 'happy' }) {
    return request('/checkin', 'POST', { studyTime, tasks, notes, mood })
  }
}

// 积分相关 API
export const pointsApi = {
  // 获取积分余额
  getPointsBalance() {
    return request('/points/balance')
  },

  // 获取积分记录
  getPointsHistory() {
    return request('/points/history')
  }
}

// 支付相关 API
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

// 勋章相关 API
export const badgeApi = {
  // 获取勋章列表
  getBadges() {
    return request('/badges')
  }
}

// 任务相关 API
export const taskApi = {
  // 获取今日任务
  getTasks() {
    return request('/tasks')
  },

  // 完成任务
  completeTask(taskId) {
    return request('/tasks', 'POST', { taskId })
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
  paymentApi,
  badgeApi,
  taskApi
}
