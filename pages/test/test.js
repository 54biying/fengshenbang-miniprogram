// pages/test/test.js - 完整版（含本地题库）
import { testApi } from '../../utils/api.js'

// 本地题库（作为备选，也可直接使用）
const localQuestions = [
  {
    id: '1',
    dimension: '编程基础',
    text: '以下哪个概念描述了"代码重用和模块化"？',
    options: [
      { label: 'A', value: 'A', content: '封装' },
      { label: 'B', value: 'B', content: '继承' },
      { label: 'C', value: 'C', content: '多态' },
      { label: 'D', value: 'D', content: '抽象' }
    ],
    correctAnswer: 'A',
    explanation: '封装是将数据和操作数据的方法绑定在一起，实现代码重用和模块化。'
  },
  {
    id: '2',
    dimension: '编程基础',
    text: '什么是"时间复杂度"？',
    options: [
      { label: 'A', value: 'A', content: '代码执行时间' },
      { label: 'B', value: 'B', content: '算法运行时间与输入规模的关系' },
      { label: 'C', value: 'C', content: '代码开发时间' },
      { label: 'D', value: 'D', content: '服务器响应时间' }
    ],
    correctAnswer: 'B',
    explanation: '时间复杂度描述算法执行时间随输入规模增长的变化趋势，用大O表示法。'
  },
  {
    id: '3',
    dimension: '系统设计',
    text: '什么是"负载均衡"？',
    options: [
      { label: 'A', value: 'A', content: '减少服务器数量' },
      { label: 'B', value: 'B', content: '将请求分发到多个服务器' },
      { label: 'C', value: 'C', content: '增加服务器内存' },
      { label: 'D', value: 'D', content: '优化数据库查询' }
    ],
    correctAnswer: 'B',
    explanation: '负载均衡将流量分发到多台服务器，提高系统可用性和性能。'
  },
  {
    id: '4',
    dimension: '系统设计',
    text: 'CAP定理中的C、A、P分别代表什么？',
    options: [
      { label: 'A', value: 'A', content: '成本、可用性、性能' },
      { label: 'B', value: 'B', content: '一致性、可用性、分区容错性' },
      { label: 'C', value: 'C', content: '容量、可用性、性能' },
      { label: 'D', value: 'D', content: '缓存、认证、权限' }
    ],
    correctAnswer: 'B',
    explanation: 'CAP定理：一致性(Consistency)、可用性(Availability)、分区容错性(Partition tolerance)。'
  },
  {
    id: '5',
    dimension: '数据结构',
    text: '以下哪种数据结构适合实现LRU缓存？',
    options: [
      { label: 'A', value: 'A', content: '数组' },
      { label: 'B', value: 'B', content: '栈' },
      { label: 'C', value: 'C', content: '链表 + 哈希表' },
      { label: 'D', value: 'D', content: '队列' }
    ],
    correctAnswer: 'C',
    explanation: 'LRU需要O(1)的查找和删除，哈希表提供O(1)查找，链表提供O(1)删除。'
  },
  {
    id: '6',
    dimension: '数据结构',
    text: '二叉搜索树的时间复杂度平均是多少？',
    options: [
      { label: 'A', value: 'A', content: 'O(1)' },
      { label: 'B', value: 'B', content: 'O(n)' },
      { label: 'C', value: 'C', content: 'O(log n)' },
      { label: 'D', value: 'D', content: 'O(n log n)' }
    ],
    correctAnswer: 'C',
    explanation: '平衡二叉搜索树的查找、插入、删除平均时间复杂度都是O(log n)。'
  },
  {
    id: '7',
    dimension: '算法',
    text: '快速排序的平均时间复杂度是？',
    options: [
      { label: 'A', value: 'A', content: 'O(n)' },
      { label: 'B', value: 'B', content: 'O(n log n)' },
      { label: 'C', value: 'C', content: 'O(n²)' },
      { label: 'D', value: 'D', content: 'O(log n)' }
    ],
    correctAnswer: 'B',
    explanation: '快排平均O(n log n)，最坏O(n²)。通过随机化可基本避免最坏情况。'
  },
  {
    id: '8',
    dimension: '算法',
    text: '动态规划的核心思想是？',
    options: [
      { label: 'A', value: 'A', content: '递归' },
      { label: 'B', value: 'B', content: '分治' },
      { label: 'C', value: 'C', content: '最优子结构和重叠子问题' },
      { label: 'D', value: 'D', content: '贪心选择' }
    ],
    correctAnswer: 'C',
    explanation: 'DP通过保存子问题的解来避免重复计算，适用于最优子结构问题。'
  },
  {
    id: '9',
    dimension: '软技能',
    text: '作为创业者，最重要的能力是什么？',
    options: [
      { label: 'A', value: 'A', content: '技术能力' },
      { label: 'B', value: 'B', content: '执行力' },
      { label: 'C', value: 'C', content: '融资能力' },
      { label: 'D', value: 'D', content: '演讲能力' }
    ],
    correctAnswer: 'B',
    explanation: '执行力是创业者最核心的能力，将想法转化为结果的能力决定成败。'
  },
  {
    id: '10',
    dimension: '软技能',
    text: '如何有效管理时间？',
    options: [
      { label: 'A', value: 'A', content: ' multitasking（多任务并行）' },
      { label: 'B', value: 'B', content: '优先级排序 + 时间块管理' },
      { label: 'C', value: 'C', content: '延长工作时间' },
      { label: 'D', value: 'D', content: '减少休息时间' }
    ],
    correctAnswer: 'B',
    explanation: '优先级排序确保重要事项先做，时间块管理提高专注度和效率。'
  }
]

Page({
  data: {
    currentTest: null,
    currentQuestion: null,
    questions: [],
    currentIndex: 0,
    selectedOption: null,
    answers: {},
    testResult: null,
    testHistory: [],
    // 维度得分
    dimensionScores: {
      '编程基础': 0,
      '系统设计': 0,
      '数据结构': 0,
      '算法': 0,
      '软技能': 0
    }
  },

  onLoad() {
    this.loadTestHistory()
  },

  // 加载测试历史（使用本地数据模拟）
  loadTestHistory() {
    // 从本地存储读取
    const history = wx.getStorageSync('testHistory') || []
    this.setData({ testHistory: history })
  },

  // 开始测试
  async startTest() {
    wx.showLoading({ title: '准备中...' })

    try {
      // 尝试调用后端API
      const result = await testApi.startTest()
      
      // 如果后端返回题目，使用后端题目
      if (result.questions && result.questions.length > 0) {
        this.setData({
          currentTest: result.testId,
          questions: result.questions,
          currentIndex: 0,
          answers: {},
          selectedOption: null,
          dimensionScores: {
            '编程基础': 0,
            '系统设计': 0,
            '数据结构': 0,
            '算法': 0,
            '软技能': 0
          }
        })
      } else {
        // 使用本地题库
        this.setData({
          currentTest: Date.now().toString(),
          questions: localQuestions,
          currentIndex: 0,
          answers: {},
          selectedOption: null,
          dimensionScores: {
            '编程基础': 0,
            '系统设计': 0,
            '数据结构': 0,
            '算法': 0,
            '软技能': 0
          }
        })
      }

      wx.hideLoading()
      this.loadCurrentQuestion()

    } catch (err) {
      // 后端失败，使用本地题库
      wx.hideLoading()
      this.setData({
        currentTest: Date.now().toString(),
        questions: localQuestions,
        currentIndex: 0,
        answers: {},
        selectedOption: null,
        dimensionScores: {
          '编程基础': 0,
          '系统设计': 0,
          '数据结构': 0,
          '算法': 0,
          '软技能': 0
        }
      })
      this.loadCurrentQuestion()
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

  // 提交测试并计算结果
  submitTest() {
    wx.showLoading({ title: '计算结果中...' })

    const { questions, answers, dimensionScores } = this.data
    let totalScore = 0
    const newDimensionScores = { ...dimensionScores }

    // 计算得分
    questions.forEach((q, index) => {
      const userAnswer = answers[index]
      if (userAnswer === q.correctAnswer) {
        totalScore += 10
        newDimensionScores[q.dimension] += 10
      }
    })

    // 确定等级
    let level = 1
    let levelName = '入门级'
    if (totalScore >= 90) {
      level = 5
      levelName = '专家级'
    } else if (totalScore >= 70) {
      level = 4
      levelName = '高级'
    } else if (totalScore >= 50) {
      level = 3
      levelName = '中级'
    } else if (totalScore >= 30) {
      level = 2
      levelName = '初级'
    }

    // 生成能力分析
    const analysis = [
      { name: '编程基础', score: newDimensionScores['编程基础'] * 5 },
      { name: '系统设计', score: newDimensionScores['系统设计'] * 5 },
      { name: '数据结构', score: newDimensionScores['数据结构'] * 5 },
      { name: '算法', score: newDimensionScores['算法'] * 5 },
      { name: '软技能', score: newDimensionScores['软技能'] * 5 }
    ]

    // 生成建议
    const suggestions = this.generateSuggestions(newDimensionScores, totalScore)

    const result = {
      testId: this.data.currentTest,
      level,
      levelName,
      score: totalScore,
      analysis,
      suggestions,
      date: new Date().toLocaleDateString('zh-CN'),
      answers: this.data.answers
    }

    // 保存到历史
    const history = wx.getStorageSync('testHistory') || []
    history.unshift(result)
    wx.setStorageSync('testHistory', history.slice(0, 10)) // 只保留最近10条

    wx.hideLoading()

    this.setData({
      testResult: result,
      testHistory: history.slice(0, 10)
    })
  },

  // 生成学习建议
  generateSuggestions(scores, totalScore) {
    const suggestions = []
    
    if (totalScore < 50) {
      suggestions.push('建议从基础开始系统学习')
    } else if (totalScore < 80) {
      suggestions.push('基础不错，继续深入学习')
    } else {
      suggestions.push('能力优秀，可以尝试挑战更难的内容')
    }

    // 找出薄弱环节
    const weakAreas = []
    if (scores['编程基础'] < 15) weakAreas.push('编程基础')
    if (scores['系统设计'] < 15) weakAreas.push('系统设计')
    if (scores['数据结构'] < 15) weakAreas.push('数据结构')
    if (scores['算法'] < 15) weakAreas.push('算法')
    if (scores['软技能'] < 15) weakAreas.push('软技能')

    if (weakAreas.length > 0) {
      suggestions.push(`薄弱环节：${weakAreas.join('、')}，建议针对性提升`)
    }

    return suggestions
  },

  // 查看结果
  viewResult(e) {
    const id = e.currentTarget.dataset.id
    const history = wx.getStorageSync('testHistory') || []
    const result = history.find(h => h.testId === id)
    if (result) {
      this.setData({
        testResult: result
      })
    }
  },

  // 返回首页
  backToHome() {
    this.setData({
      currentTest: null,
      testResult: null,
      questions: [],
      answers: {}
    })
    wx.switchTab({
      url: '/pages/index/index'
    })
  },

  // 重新测试
  retest() {
    this.setData({
      currentTest: null,
      testResult: null,
      questions: [],
      answers: {}
    })
    this.startTest()
  },

  // 去匹配
  goToMatch() {
    wx.switchTab({
      url: '/pages/match/match'
    })
  }
})
