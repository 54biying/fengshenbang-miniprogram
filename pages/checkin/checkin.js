// pages/checkin/checkin.js
import { checkinApi } from '../../utils/api.js'

Page({
  data: {
    todayCheckedIn: false,
    studyTime: 30,
    tasks: [],
    notes: '',
    mood: 'happy',
    weekStatus: [false, false, false, false, false, false, false],
    stats: {
      totalCheckIns: 0,
      currentStreak: 0,
      longestStreak: 0,
      points: 0
    }
  },

  onLoad() {
    this.loadCheckinStatus()
  },

  onShow() {
    this.loadCheckinStatus()
  },

  // 加载打卡状态
  async loadCheckinStatus() {
    wx.showLoading({ title: '加载中...' })
    try {
      const data = await checkinApi.getStatus()
      this.setData({
        todayCheckedIn: data.todayCheckedIn,
        weekStatus: data.weekStatus || [false, false, false, false, false, false, false],
        stats: data.stats || {}
      })
    } catch (err) {
      console.error('加载失败', err)
      wx.showToast({ title: '加载失败', icon: 'none' })
    } finally {
      wx.hideLoading()
    }
  },

  // 学习时长变化
  onStudyTimeChange(e) {
    this.setData({ studyTime: parseInt(e.detail.value) })
  },

  // 心情选择
  selectMood(e) {
    this.setData({ mood: e.currentTarget.dataset.mood })
  },

  // 笔记输入
  onNotesInput(e) {
    this.setData({ notes: e.detail.value })
  },

  // 提交打卡
  async submitCheckin() {
    if (this.data.todayCheckedIn) {
      wx.showToast({ title: '今日已打卡', icon: 'none' })
      return
    }

    wx.showLoading({ title: '打卡中...' })
    try {
      const result = await checkinApi.submit({
        studyTime: this.data.studyTime,
        tasks: this.data.tasks,
        notes: this.data.notes,
        mood: this.data.mood
      })

      wx.hideLoading()
      wx.showToast({ 
        title: `打卡成功! +${result.pointsEarned}积分`, 
        icon: 'success',
        duration: 2000
      })

      // 刷新状态
      this.loadCheckinStatus()
    } catch (err) {
      wx.hideLoading()
      wx.showToast({ 
        title: err.message || '打卡失败', 
        icon: 'none' 
      })
    }
  },

  // 获取星期几的名称
  getDayName(index) {
    const days = ['日', '一', '二', '三', '四', '五', '六']
    return days[index]
  }
})
