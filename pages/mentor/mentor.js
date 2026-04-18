// 导师页逻辑
import { mentorApi } from '../../utils/api.js'

Page({
  data: {
    mentors: [],
    filteredMentors: [],
    searchKeyword: ''
  },

  onLoad() {
    this.loadMentors()
  },

  // 加载导师列表
  async loadMentors() {
    wx.showLoading({
      title: '加载中...'
    })

    try {
      const mentors = await mentorApi.getMentors()
      this.setData({
        mentors: mentors || [],
        filteredMentors: mentors || []
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

  // 搜索输入
  onSearchInput(e) {
    const keyword = e.detail.value.toLowerCase()
    this.setData({
      searchKeyword: keyword,
      filteredMentors: this.data.mentors.filter(mentor =>
        mentor.name.toLowerCase().includes(keyword) ||
        mentor.title.toLowerCase().includes(keyword) ||
        mentor.tags.some(tag => tag.toLowerCase().includes(keyword))
      )
    })
  },

  // 查看导师详情
  viewMentor(e) {
    const mentor = e.currentTarget.dataset.mentor
    wx.showModal({
      title: mentor.name,
      content: `头衔：${mentor.title}\n经验：${mentor.experience}\n评分：${mentor.rating}分\n价格：¥${mentor.price}/次\n\n确定要向这位导师发送拜师礼吗？`,
      success: (res) => {
        if (res.confirm) {
          this.sendGift(mentor)
        }
      }
    })
  },

  // 发送拜师礼
  sendGift(mentor) {
    wx.navigateTo({
      url: `/pages/gift/gift?mentorId=${mentor.id}&price=${mentor.price}`
    })
  }
})
