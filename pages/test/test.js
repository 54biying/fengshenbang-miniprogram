// 测试页逻辑
import { testApi } from '../../utils/api.js'

Page({
  data: {
    currentTest: null,
    currentQuestion: null,
    questions: [],
    currentIndex: 0,
    selectedOption: null,
    answers: {},
    testResult: null,
    testHistory: []
  },

  onLoad() {
    this.loadTestHistory()
  },

  // 加载测试历史
  async loadTestHistory() {
    try {
      const history = await testApi.getTestHistory()
      this.setData({
        testHistory: history || []
      })
    } catch (err) {
      console.error('加载测试历史失败', err)
    }
  },

  // 开始测试
  async startTest() {
    wx.showLoading({
      title: '准备中...'
    })

    try {
      // 调用开始测试接口
      const result = await testApi.startTest()

      wx.hideLoading()

      this.setData({
        currentTest: result.testId,
        questions: result.questions,
        currentIndex: 0,
        answers: {},
        selectedOption: null
      })

      this.loadCurrentQuestion()

    } catch (err) {
      wx.hideLoading()
      wx.showToast({
        title: err.message || '开始测试失败',
        icon: 'none'
      })
    }
  },

  // 加载当前题目
  loadCurrentQuestion() {
    const { questions, currentIndex } = this.data
    this.setData({
      currentQuestion: questions[currentIndex],
      selectedOption: this.data.answers[currentIndex] || null
    })
  },

  // 选择选项
  selectOption(e) {
    const value = e.currentTarget.dataset.value
    this.setData({
      selectedOption: value
    })
  },

  // 下一题
  nextQuestion() {
    const { currentIndex, questions, selectedOption, answers } = this.data

    // 保存答案
    answers[currentIndex] = selectedOption
    this.setData({ answers })

    // 如果是最后一题，提交测试
    if (currentIndex === questions.length - 1) {
      this.submitTest()
    } else {
      // 下一题
      this.setData({
        currentIndex: currentIndex + 1,
        selectedOption: null
      })
      this.loadCurrentQuestion()
    }
  },

  // 上一题
  prevQuestion() {
    const currentIndex = this.data.currentIndex - 1
    this.setData({
      currentIndex: currentIndex,
      selectedOption: this.data.answers[currentIndex]
    })
    this.loadCurrentQuestion()
  },

  // 提交测试
  async submitTest() {
    wx.showLoading({
      title: '提交中...'
    })

    try {
      // 提交答案
      const result = await testApi.getTestResult(this.data.currentTest)

      wx.hideLoading()

      this.setData({
        testResult: result
      })

      // 刷新测试历史
      this.loadTestHistory()

    } catch (err) {
      wx.hideLoading()
      wx.showToast({
        title: err.message || '提交失败',
        icon: 'none'
      })
    }
  },

  // 查看结果
  async viewResult(e) {
    const id = e.currentTarget.dataset.id

    wx.showLoading({
      title: '加载中...'
    })

    try {
      const result = await testApi.getTestResult(id)
      wx.hideLoading()

      this.setData({
        testResult: result
      })

    } catch (err) {
      wx.hideLoading()
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    }
  },

  // 返回首页
  backToHome() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },

  // 去匹配
  goToMatch() {
    wx.switchTab({
      url: '/pages/match/match'
    })
  }
})
