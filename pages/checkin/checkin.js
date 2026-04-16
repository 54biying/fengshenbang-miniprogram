// pages/checkin/checkin.js - 完整版
import { checkinApi } from '../../utils/api.js'

// 打卡任务列表
const checkinTasks = [
  { id: 'read', name: '阅读学习', icon: '📚', points: 5 },
  { id: 'practice', name: '实战练习', icon: '💻', points: 10 },
  { id: 'share', name: '分享交流', icon: '💬', points: 5 },
  { id: 'note', name: '做笔记', icon: '📝', points: 5 },
  { id: 'review', name: '复习总结', icon: '🔍', points: 5 },
  { id: 'early', name: '早起学习', icon: '🌅', points: 5 },
  { id: 'challenge', name: '完成挑战', icon: '🎯', points: 15 },
  { id: 'help', name: '帮助他人', icon: '🤝', points: 10 }
]

// 学习内容分类
const learningCategories = [
  { id: 'frontend', name: '前端开发', icon: '🎨' },
  { id: 'backend', name: '后端开发', icon: '⚙️' },
  { id: 'algorithm', name: '算法', icon: '🧮' },
  { id: 'system', name: '系统设计', icon: '🏗️' },
  { id: 'business', name: '商业思维', icon: '💡' },
  { id: 'softskill', name: '软技能', icon: '🤝' },
  { id: 'english', name: '英语', icon: '🌐' },
  { id: 'other', name: '其他', icon: '📌' }
]

Page({
  data: {
    todayCheckedIn: false,
    todayData: null,
    studyTime: 30,
    studyTimeOptions: [15, 30, 45, 60, 90, 120, 150, 180],
    selectedTasks: [],
    selectedCategory: '',
    notes: '',
    mood: 'happy',
    weekStatus: [false, false, false, false, false, false, false],
    stats: {
      totalCheckIns: 0,
      currentStreak: 0,
      longestStreak: 0,
      points: 0,
      totalStudyTime: 0
    },
    tasks: checkinTasks,
    categories: learningCategories,
    showTaskModal: false,
    showCategoryModal: false
  },

  onLoad() {
    this.loadCheckinStatus()
    this.loadLocalStats()
  },

  onShow() {
    this.loadCheckinStatus()
  },

  // 从本地加载打卡数据
  loadLocalStats() {
    const checkinData = wx.getStorageSync('checkinData') || {}
    const today = this.getTodayString()
    
    // 生成本周数据
    const weekStatus = this.generateWeekStatus(checkinData)
    
    // 计算统计
    let totalCheckIns = 0
    let currentStreak = 0
    let longestStreak = 0
    let totalStudyTime = 0
    
    Object.values(checkinData).forEach(day => {
      if (day.checkedIn) {
        totalCheckIns++
        totalStudyTime += day.studyTime || 0
      }
    })
    
    // 计算连续天数
    currentStreak = this.calculateStreak(checkinData)
    longestStreak = this.calculateLongestStreak(checkinData)
    
    this.setData({
      todayCheckedIn: !!(checkinData[today] && checkinData[today].checkedIn),
      todayData: checkinData[today] || null,
      weekStatus,
      stats: {
        totalCheckIns,
        currentStreak,
        longestStreak,
        points: wx.getStorageSync('userPoints') || 0,
        totalStudyTime
      }
    })
  },

  // 获取今日日期字符串
  getTodayString() {
    const today = new Date()
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  },

  // 生成本周打卡状态
  generateWeekStatus(checkinData) {
    const weekStatus = [false, false, false, false, false, false, false]
    const today = new Date()
    const dayOfWeek = today.getDay() // 0是周日
    
    for (let i = 0; i <= dayOfWeek; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() - (dayOfWeek - i))
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
      weekStatus[i] = !!(checkinData[dateStr] && checkinData[dateStr].checkedIn)
    }
    
    return weekStatus
  },

  // 计算当前连续天数
  calculateStreak(checkinData) {
    let streak = 0
    const today = new Date()
    
    for (let i = 0; i < 365; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
      
      if (checkinData[dateStr] && checkinData[dateStr].checkedIn) {
        streak++
      } else if (i > 0) {
        break
      }
    }
    
    return streak
  },

  // 计算最长连续天数
  calculateLongestStreak(checkinData) {
    let maxStreak = 0
    let currentStreak = 0
    
    // 获取所有日期并排序
    const dates = Object.keys(checkinData).sort()
    let lastDate = null
    
    dates.forEach(dateStr => {
      if (checkinData[dateStr].checkedIn) {
        if (lastDate) {
          const current = new Date(dateStr)
          const last = new Date(lastDate)
          const diffDays = (current - last) / (1000 * 60 * 60 * 24)
          
          if (diffDays === 1) {
            currentStreak++
          } else {
            currentStreak = 1
          }
        } else {
          currentStreak = 1
        }
        
        maxStreak = Math.max(maxStreak, currentStreak)
        lastDate = dateStr
      }
    })
    
    return maxStreak
  },

  // 加载打卡状态（尝试从后端获取）
  async loadCheckinStatus() {
    try {
      const data = await checkinApi.getStatus()
      this.setData({
        todayCheckedIn: data.todayCheckedIn,
        todayData: data.todayCheckIn || null,
        weekStatus: data.weekStatus || this.data.weekStatus,
        stats: {
          ...this.data.stats,
          ...data.stats
        }
      })
    } catch (err) {
      // 后端失败，使用本地数据
      console.log('后端获取失败，使用本地数据')
      this.loadLocalStats()
    }
  },

  // 学习时长变化
  onStudyTimeChange(e) {
    const index = parseInt(e.detail.value)
    this.setData({ studyTime: this.data.studyTimeOptions[index] })
  },

  // 打开任务选择弹窗
  showTaskSelector() {
    this.setData({ showTaskModal: true })
  },

  // 关闭任务弹窗
  closeTaskModal() {
    this.setData({ showTaskModal: false })
  },

  // 选择任务
  toggleTask(e) {
    const taskId = e.currentTarget.dataset.id
    const { selectedTasks } = this.data
    
    if (selectedTasks.includes(taskId)) {
      this.setData({
        selectedTasks: selectedTasks.filter(id => id !== taskId)
      })
    } else {
      this.setData({
        selectedTasks: [...selectedTasks, taskId]
      })
    }
  },

  // 打开分类选择
  showCategorySelector() {
    this.setData({ showCategoryModal: true })
  },

  // 关闭分类弹窗
  closeCategoryModal() {
    this.setData({ showCategoryModal: false })
  },

  // 选择分类
  selectCategory(e) {
    this.setData({
      selectedCategory: e.currentTarget.dataset.id,
      showCategoryModal: false
    })
  },

  // 心情选择
  selectMood(e) {
    this.setData({ mood: e.currentTarget.dataset.mood })
  },

  // 笔记输入
  onNotesInput(e) {
    this.setData({ notes: e.detail.value })
  },

  // 计算预计积分
  calculatePoints() {
    let points = 10 // 基础打卡积分
    
    // 学习时长积分
    if (this.data.studyTime >= 60) points += 20
    else if (this.data.studyTime >= 30) points += 10
    
    // 任务积分
    this.data.selectedTasks.forEach(taskId => {
      const task = this.data.tasks.find(t => t.id === taskId)
      if (task) points += task.points
    })
    
    // 连续打卡奖励
    if (this.data.stats.currentStreak >= 6) points += 50
    else if (this.data.stats.currentStreak >= 2) points += 20
    
    return points
  },

  // 提交打卡
  async submitCheckin() {
    if (this.data.todayCheckedIn) {
      wx.showToast({ title: '今日已打卡', icon: 'none' })
      return
    }

    // 验证
    if (this.data.selectedTasks.length === 0) {
      wx.showToast({ title: '请至少选择一项学习任务', icon: 'none' })
      return
    }

    if (!this.data.selectedCategory) {
      wx.showToast({ title: '请选择学习内容分类', icon: 'none' })
      return
    }

    wx.showLoading({ title: '打卡中...' })

    const pointsEarned = this.calculatePoints()
    const today = this.getTodayString()
    
    const checkinData = {
      date: today,
      studyTime: this.data.studyTime,
      tasks: this.data.selectedTasks,
      category: this.data.selectedCategory,
      notes: this.data.notes,
      mood: this.data.mood,
      pointsEarned,
      checkedIn: true,
      timestamp: Date.now()
    }

    try {
      // 尝试提交到后端
      await checkinApi.submit(checkinData)
    } catch (err) {
      console.log('后端提交失败，保存到本地')
    }

    // 保存到本地
    const allCheckinData = wx.getStorageSync('checkinData') || {}
    allCheckinData[today] = checkinData
    wx.setStorageSync('checkinData', allCheckinData)
    
    // 更新积分
    const currentPoints = wx.getStorageSync('userPoints') || 0
    wx.setStorageSync('userPoints', currentPoints + pointsEarned)

    wx.hideLoading()

    wx.showToast({
      title: `打卡成功! +${pointsEarned}积分`,
      icon: 'success',
      duration: 2000
    })

    // 刷新状态
    this.loadLocalStats()
  },

  // 获取星期几的名称
  getDayName(index) {
    return ['日', '一', '二', '三', '四', '五', '六'][index]
  },

  // 获取已选任务名称
  getSelectedTaskNames() {
    return this.data.selectedTasks.map(id => {
      const task = this.data.tasks.find(t => t.id === id)
      return task ? task.name : ''
    }).filter(Boolean)
  },

  // 获取已选分类名称
  getSelectedCategoryName() {
    const cat = this.data.categories.find(c => c.id === this.data.selectedCategory)
    return cat ? cat.name : ''
  }
})
