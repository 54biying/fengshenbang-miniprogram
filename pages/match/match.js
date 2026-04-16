// pages/match/match.js - 增强版
import { matchApi } from '../../utils/api.js'

// 本地模拟推荐数据
const mockRecommendations = [
  {
    id: 'mock_1',
    name: '程序员小李',
    avatar: '/images/default-avatar.png',
    level: 3,
    levelName: '中级',
    tags: '前端开发、React、Vue',
    matchDegree: 95,
    bio: '专注前端5年，擅长Vue生态'
  },
  {
    id: 'mock_2',
    name: '架构师王',
    avatar: '/images/default-avatar.png',
    level: 4,
    levelName: '高级',
    tags: '系统设计、微服务、云架构',
    matchDegree: 88,
    bio: '10年架构经验，专注高并发系统'
  },
  {
    id: 'mock_3',
    name: '全栈张',
    avatar: '/images/default-avatar.png',
    level: 3,
    levelName: '中级',
    tags: 'Node.js、Python、数据库',
    matchDegree: 82,
    bio: '全栈开发者，善于解决问题'
  },
  {
    id: 'mock_4',
    name: '创业者刘',
    avatar: '/images/default-avatar.png',
    level: 2,
    levelName: '初级',
    tags: '创业、产品、商业思维',
    matchDegree: 76,
    bio: '连续创业者，专注产品落地'
  },
  {
    id: 'mock_5',
    name: '算法达人',
    avatar: '/images/default-avatar.png',
    level: 5,
    levelName: '专家级',
    tags: '算法、LeetCode、竞赛',
    matchDegree: 70,
    bio: 'ACM竞赛选手，LeetCode 500+'
  }
]

Page({
  data: {
    recommendations: [],
    requests: [],
    myLevel: 0,
    myLevelName: '',
    hasTested: false,
    showEmpty: true,
    emptyReason: ''
  },

  onShow() {
    this.loadMyStatus()
    this.loadRecommendations()
    this.loadRequests()
  },

  // 加载我的测试状态
  loadMyStatus() {
    const app = getApp()
    const testHistory = wx.getStorageSync('testHistory') || []
    const userInfo = wx.getStorageSync('userInfo') || {}
    
    let myLevel = userInfo.level || 0
    let myLevelName = '未测试'
    let hasTested = false
    
    if (testHistory.length > 0) {
      hasTested = true
      const latestTest = testHistory[0]
      myLevel = latestTest.level || 0
      myLevelName = latestTest.levelName || '未知'
      
      // 保存到全局
      app.globalData.myLevel = myLevel
      app.globalData.myLevelName = myLevelName
    }
    
    this.setData({
      myLevel,
      myLevelName,
      hasTested
    })
  },

  // 加载推荐匹配
  async loadRecommendations() {
    wx.showLoading({ title: '加载中...' })
    
    try {
      // 尝试从后端获取
      const recommendations = await matchApi.getRecommendations()
      
      if (recommendations && recommendations.length > 0) {
        this.setData({
          recommendations,
          showEmpty: false
        })
      } else {
        // 使用本地数据
        this.loadLocalRecommendations()
      }
    } catch (err) {
      console.log('后端加载失败，使用本地数据')
      // 使用本地数据
      this.loadLocalRecommendations()
    }
    
    wx.hideLoading()
  },

  // 使用本地推荐数据
  loadLocalRecommendations() {
    const { myLevel, hasTested } = this.data
    
    if (!hasTested) {
      this.setData({
        recommendations: [],
        showEmpty: true,
        emptyReason: '请先完成能力测试，获取你的等级后再进行匹配'
      })
      return
    }
    
    // 根据我的等级筛选推荐
    let filtered = mockRecommendations.filter(r => {
      // 匹配度：同等级 ±1 级以内匹配度更高
      const levelDiff = Math.abs(r.level - myLevel)
      return levelDiff <= 1
    })
    
    // 如果筛选后太少，补充一些
    if (filtered.length < 3) {
      const others = mockRecommendations.filter(r => !filtered.find(f => f.id === r.id))
      filtered = [...filtered, ...others.slice(0, 3 - filtered.length)]
    }
    
    this.setData({
      recommendations: filtered,
      showEmpty: false
    })
  },

  // 加载匹配请求
  async loadRequests() {
    try {
      const requests = await matchApi.getMatchRequests()
      this.setData({
        requests: requests || []
      })
    } catch (err) {
      console.log('加载匹配请求失败', err)
    }
  },

  // 查看用户资料
  viewUserProfile(e) {
    const user = e.currentTarget.dataset.user
    wx.showModal({
      title: user.name,
      content: `等级：${user.levelName || 'Lv.' + user.level}\n标签：${user.tags}\n匹配度：${user.matchDegree}%\n简介：${user.bio || '暂无'}`,
      showCancel: false,
      confirmText: '知道了'
    })
  },

  // 发送匹配请求
  async sendRequest(e) {
    const targetUser = e.currentTarget.dataset.user
    const targetUserId = targetUser.id

    wx.showModal({
      title: '确认发送匹配请求',
      content: `向「${targetUser.name}」发送匹配请求？\n\n该用户等级：${targetUser.levelName || 'Lv.' + targetUser.level}\n匹配度：${targetUser.matchDegree}%`,
      success: async (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '发送中...' })
          
          try {
            await matchApi.sendMatchRequest(targetUserId)
            wx.hideLoading()
            wx.showToast({
              title: '请求已发送',
              icon: 'success'
            })
            
            // 从列表移除（模拟成功）
            const recommendations = this.data.recommendations.filter(r => r.id !== targetUserId)
            this.setData({ recommendations })
            
          } catch (err) {
            wx.hideLoading()
            
            // 模拟成功（后端不可用时）
            wx.showToast({
              title: '请求已发送（模拟）',
              icon: 'success'
            })
            
            // 从列表移除
            const recommendations = this.data.recommendations.filter(r => r.id !== targetUserId)
            this.setData({ recommendations })
          }
        }
      }
    })
  },

  // 接受请求
  async acceptRequest(e) {
    const requestId = e.currentTarget.dataset.id

    wx.showLoading({ title: '处理中...' })

    try {
      await matchApi.acceptMatchRequest(requestId)
      wx.hideLoading()
      wx.showToast({
        title: '匹配成功！',
        icon: 'success'
      })
      this.loadRequests()
    } catch (err) {
      wx.hideLoading()
      wx.showToast({
        title: '操作成功（模拟）',
        icon: 'success'
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
          wx.showLoading({ title: '处理中...' })

          try {
            await matchApi.rejectMatchRequest(requestId)
            wx.hideLoading()
            wx.showToast({
              title: '已拒绝',
              icon: 'success'
            })
            this.loadRequests()
          } catch (err) {
            wx.hideLoading()
            wx.showToast({
              title: '已拒绝（模拟）',
              icon: 'success'
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
  },

  // 去打卡
  goToCheckin() {
    wx.switchTab({
      url: '/pages/checkin/checkin'
    })
  }
})
