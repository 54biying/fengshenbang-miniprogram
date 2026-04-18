// 测试页逻辑
import { testApi } from '../../utils/api.js'

// 测试题目数据
const TEST_QUESTIONS = [
  {
    id: '1',
    question: '以下哪种不是面向对象编程的基本特性？',
    options: ['封装', '继承', '多态', '重载'],
    category: '编程基础'
  },
  {
    id: '2',
    question: '算法的时间复杂度反映了什么？',
    options: [
      '算法的代码长度',
      '算法运行时间与输入规模的关系',
      '算法的空间占用',
      '算法的实现难度'
    ],
    category: '编程基础'
  },
  {
    id: '3',
    question: '负载均衡的主要作用是什么？',
    options: [
      '加快网页加载速度',
      '将请求分发到多个服务器',
      '减少数据库连接数',
      '提高代码安全性'
    ],
    category: '系统设计'
  },
  {
    id: '4',
    question: 'CAP定理描述了分布式系统的三个特性，其中不包括哪一个？',
    options: [
      '一致性、可用性、分区容错性',
      '一致性、可靠性、分区容错性',
      '一致性、可用性、分区容错性',
      '一致性、可用性、网络容错性'
    ],
    category: '系统设计'
  },
  {
    id: '5',
    question: 'LRU缓存机制通常使用哪种数据结构实现最合适？',
    options: [
      '数组',
      '链表 + 哈希表',
      '二叉树',
      '图结构'
    ],
    category: '数据结构'
  },
  {
    id: '6',
    question: '二分查找的时间复杂度是多少？',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    category: '数据结构'
  },
  {
    id: '7',
    question: '快速排序的平均时间复杂度是？',
    options: ['O(n)', 'O(n log n)', 'O(log n)', 'O(n²)'],
    category: '算法'
  },
  {
    id: '8',
    question: '动态规划算法通常需要满足的两个条件是？',
    options: [
      '最优子结构 + 重叠子问题',
      '递归 + 迭代',
      '分治 + 合并',
      '贪心 + 回溯'
    ],
    category: '算法'
  },
  {
    id: '9',
    question: '数据库索引的主要作用是？',
    options: [
      '存储数据',
      '加快查询速度',
      '保证数据安全',
      '实现数据压缩'
    ],
    category: '数据库'
  },
  {
    id: '10',
    question: 'ACID是指数据库事务的四个特性，其中不包括？',
    options: [
      '原子性、一致性、隔离性、持久性',
      '原子性、一致性、并发性、持久性',
      '原子性、一致性、隔离性、持久性',
      '可用性、一致性、隔离性、持久性'
    ],
    category: '数据库'
  }
]

Page({
  data: {
    testStatus: 'idle', // idle | testing | result
    currentQuestion: null,
    currentIndex: 0,
    selectedOption: null,
    answers: {},
    testResult: null,
    testHistory: [],
    questions: TEST_QUESTIONS,
    currentTestId: null
  },

  onLoad() {
    this.loadTestHistory()
  },

  onShow() {
    this.loadTestHistory()
  },

  // 加载测试历史
  async loadTestHistory() {
    try {
      const result = await testApi.getTestHistory()
      if (result.history) {
        this.setData({
          testHistory: result.history || []
        })
      }
    } catch (err) {
      console.error('加载测试历史失败', err)
    }
  },

  // 开始测试
  async startTest() {
    wx.showLoading({ title: '准备中...' })
    try {
      const result = await testApi.startTest()
      wx.hideLoading()
      this.setData({
        testStatus: 'testing',
        currentIndex: 0,
        selectedOption: null,
        answers: {},
        currentTestId: result.testId
      })
      this.updateCurrentQuestion()
    } catch (err) {
      wx.hideLoading()
      wx.showToast({ title: err.message || '开始测试失败', icon: 'none' })
    }
  },

  // 更新当前题目
  updateCurrentQuestion() {
    const { questions, currentIndex } = this.data
    this.setData({
      currentQuestion: questions[currentIndex],
      selectedOption: this.data.answers[currentIndex] || null
    })
  },

  // 选择选项
  selectOption(e) {
    const index = e.currentTarget.dataset.index
    this.setData({
      selectedOption: index
    })
  },

  // 下一题
  nextQuestion() {
    const { currentIndex, questions, selectedOption, answers } = this.data
    if (selectedOption === null) {
      wx.showToast({ title: '请选择一个答案', icon: 'none' })
      return
    }

    // 保存答案
    answers[currentIndex] = selectedOption
    this.setData({ answers })

    // 如果是最后一题，提交测试
    if (currentIndex === questions.length - 1) {
      this.submitTest()
    } else {
      this.setData({
        currentIndex: currentIndex + 1,
        selectedOption: null
      })
      this.updateCurrentQuestion()
    }
  },

  // 上一题
  prevQuestion() {
    const { currentIndex, answers } = this.data
    if (currentIndex > 0) {
      this.setData({
        currentIndex: currentIndex - 1,
        selectedOption: answers[currentIndex - 1] !== undefined ? answers[currentIndex - 1] : null
      })
      this.updateCurrentQuestion()
    }
  },

  // 提交测试
  async submitTest() {
    wx.showLoading({ title: '提交中...' })
    try {
      const { answers, currentTestId } = this.data
      // 将答案索引转换为选项文本
      const answerTexts = {}
      this.data.questions.forEach((q, idx) => {
        if (answers[idx] !== undefined) {
          answerTexts[q.id] = q.options[answers[idx]]
        }
      })

      const result = await testApi.submitTest(currentTestId, answerTexts)
      wx.hideLoading()
      this.setData({
        testStatus: 'result',
        testResult: result
      })
      this.loadTestHistory()
    } catch (err) {
      wx.hideLoading()
      wx.showToast({ title: err.message || '提交失败', icon: 'none' })
    }
  },

  // 返回首页
  backToHome() {
    this.setData({ testStatus: 'idle' })
  },

  // 返回测试列表
  backToList() {
    this.setData({ testStatus: 'idle' })
  },

  // 重新测试
  retest() {
    this.setData({
      testStatus: 'idle',
      testResult: null,
      currentTestId: null
    })
  }
})
