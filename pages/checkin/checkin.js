// pages/checkin/checkin.js
import { checkinApi } from '../../utils/api.js'

// 学习任务分类
const TASK_CATEGORIES = [
  {
    id: 'frontend',
    name: '前端开发',
    icon: '🎨',
    tasks: [
      { id: 'f1', name: '学习HTML/CSS', points: 5 },
      { id: 'f2', name: '练习JavaScript', points: 10 },
      { id: 'f3', name: '学习Vue/React', points: 10 },
      { id: 'f4', name: '看技术文章', points: 5 }
    ]
  },
  {
    id: 'backend',
    name: '后端开发',
    icon: '⚙️',
    tasks: [
      { id: 'b1', name: '学习Node.js', points: 10 },
      { id: 'b2', name: '练习SQL', points: 10 },
      { id: 'b3', name: '学习API设计', points: 10 },
      { id: 'b4', name: '看技术文章', points: 5 }
    ]
  },
  {
    id: 'algorithm',
    name: '算法数据结构',
    icon: '🧮',
    tasks: [
      { id: 'a1', name: '刷LeetCode', points: 15 },
      { id: 'a2', name: '学习新算法', points: 10 },
      { id: 'a3', name: '复习数据结构', points: 10 },
      { id: 'a4', name: '看算法题解', points: 5 }
    ]
  },
  {
    id: 'design',
    name: '系统设计',
    icon: '🏗️',
    tasks: [
      { id: 'd1', name: '学习架构设计', points: 10 },
      { id: 'd2', name: '画系统图', points: 10 },
      { id: 'd3', name: '看设计案例', points: 5 },
      { id: 'd4', name: '整理笔记', points: 5 }
    ]
  },
  {
    id: 'business',
    name: '产品/商业',
    icon: '💼',
    tasks: [
      { id: 'bu1', name: '学习产品思维', points: 5 },
      { id: 'bu2', name: '分析竞品', points: 10 },
      { id: 'bu3', name: '看商业案例', points: 5 },
      { id: 'bu4', name: '写产品文档', points: 10 }
    ]
  },
  {
    id: 'softskill',
    name: '软技能',
    icon: '🎯',
    tasks: [
      { id: 's1', name: '阅读书籍', points: 5 },
      { id: 's2', name: '学习英语', points: 10 },
      { id: 's3', name: '写作练习', points: 10 },
      { id: 's4', name: '分享知识', points: 10 }
    ]
  }
]

// 通用打卡选项
const COMMON_TASKS = [
  { id: 'read', name: '阅读技术文章', icon: '📖', points: 5 },
  { id: 'practice', name: '动手练习编码', icon: '💻', points: 10 },
  { id: 'share', name: '分享学习心得', icon: '📝', points: 5 },
  { id: 'note', name: '整理学习笔记', icon: '📓', points: 5 },
  { id: 'review', name: '复习旧知识', icon: '🔄', points: 5 },
  { id: 'early', name: '早起学习', icon: '🌅', points: 10 },
  { id: 'challenge', name: '挑战难题', icon: '🏆', points: 15 },
  { id: 'help', name: '帮助他人解答', icon: '🤝', points: 10 }
]

Page({
  data: {
    todayCheckedIn: false,
    studyTime: 30,
    selectedTasks: [],
    customTasks: [],
    newCustomTask: '',
    taskCategories: TASK_CATEGORIES,
    commonTasks: COMMON_TASKS,
    selectedCategory: null,
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
    try {
      const data = await checkinApi.getStatus()
      this.setData({
        todayCheckedIn: data.todayCheckedIn,
        weekStatus: data.weekStatus || [false, false, false, false, false, false, false],
        stats: data.stats || {}
      })
    } catch (err) {
      console.error('加载失败', err)
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

  // 选择分类
  selectCategory(e) {
    const categoryId = e.currentTarget.dataset.id
    const category = TASK_CATEGORIES.find(c => c.id === categoryId)
    this.setData({ 
      selectedCategory: category
    })
  },

  // 选择具体任务
  toggleTask(e) {
    const taskId = e.currentTarget.dataset.id
    const taskPoints = parseInt(e.currentTarget.dataset.points)
    const { selectedTasks } = this.data
    
    const index = selectedTasks.findIndex(t => t.id === taskId)
    if (index > -1) {
      selectedTasks.splice(index, 1)
    } else {
      selectedTasks.push({ id: taskId, points: taskPoints })
    }
    this.setData({ selectedTasks })
  },

  // 选择通用任务
  toggleCommonTask(e) {
    const taskId = e.currentTarget.dataset.id
    const taskPoints = parseInt(e.currentTarget.dataset.points)
    const { selectedTasks } = this.data
    
    const index = selectedTasks.findIndex(t => t.id === taskId)
    if (index > -1) {
      selectedTasks.splice(index, 1)
    } else {
      selectedTasks.push({ id: taskId, points: taskPoints })
    }
    this.setData({ selectedTasks })
  },

  // 添加自定义任务
  addCustomTask() {
    const { newCustomTask } = this.data
    if (!newCustomTask.trim()) {
      wx.showToast({ title: '请输入任务内容', icon: 'none' })
      return
    }
    
    const customTasks = this.data.customTasks || []
    customTasks.push({
      id: 'custom_' + Date.now(),
      name: newCustomTask,
      points: 10
    })
    
    this.setData({ 
      customTasks,
      newCustomTask: ''
    })
  },

  // 删除自定义任务
  removeCustomTask(e) {
    const index = e.currentTarget.dataset.index
    const customTasks = this.data.customTasks
    customTasks.splice(index, 1)
    this.setData({ customTasks })
  },

  // 选择自定义任务
  toggleCustomTask(e) {
    const taskId = e.currentTarget.dataset.id
    const taskPoints = 10
    const { selectedTasks } = this.data
    
    const index = selectedTasks.findIndex(t => t.id === taskId)
    if (index > -1) {
      selectedTasks.splice(index, 1)
    } else {
      selectedTasks.push({ id: taskId, points: taskPoints })
    }
    this.setData({ selectedTasks })
  },

  // 自定义任务输入
  onCustomTaskInput(e) {
    this.setData({ newCustomTask: e.detail.value })
  },

  // 笔记输入
  onNotesInput(e) {
    this.setData({ notes: e.detail.value })
  },

  // 计算总积分
  calculateTotalPoints() {
    const { selectedTasks } = this.data
    return selectedTasks.reduce((sum, task) => sum + (task.points || 0), 0)
  },

  // 提交打卡
  async submitCheckin() {
    if (this.data.todayCheckedIn) {
      wx.showToast({ title: '今日已打卡', icon: 'none' })
      return
    }

    const { selectedTasks } = this.data
    if (selectedTasks.length === 0) {
      wx.showToast({ title: '请至少选择一个学习任务', icon: 'none' })
      return
    }

    const totalPoints = this.calculateTotalPoints()

    wx.showLoading({ title: '打卡中...' })
    try {
      const result = await checkinApi.submit({
        studyTime: this.data.studyTime,
        tasks: selectedTasks.map(t => t.id),
        notes: this.data.notes,
        mood: this.data.mood,
        points: totalPoints
      })

      wx.hideLoading()
      wx.showToast({ 
        title: `打卡成功! +${totalPoints}积分`, 
        icon: 'success',
        duration: 2000
      })

      // 刷新状态
      this.loadCheckinStatus()
      this.setData({ 
        selectedTasks: [],
        selectedCategory: null
      })
    } catch (err) {
      wx.hideLoading()
      // 演示模式
      wx.showToast({ 
        title: `打卡成功! +${totalPoints}积分`, 
        icon: 'success'
      })
      this.setData({ 
        todayCheckedIn: true,
        selectedTasks: [],
        selectedCategory: null
      })
    }
  }
})
