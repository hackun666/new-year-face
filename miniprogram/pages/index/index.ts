
const app = getApp<IAppOption>()
Page({
  data: {
    userInfo: null,
    hasUserInfo: false,
    now_mask: 1,
    prurl: '',
    mask_list: [
      {
        id: 1,
        text: '虎年大吉'
      },
      {
        id: 2,
        text: '虎头帽'
      },
      {
        id: 3,
        text: '新年好'
      },
      {
        id: 4,
        text: '虎年招牌'
      },
      {
        id: 5,
        text: '虎年如意'
      },
      {
        id: 6,
        text: '虎虎生威'
      },
      {
        id: 7,
        text: '虎到福到'
      },
      {
        id: 8,
        text: '寅虎招财'
      },
      {
        id: 9,
        text: '新年快乐'
      },
      {
        id: 10,
        text: '虎年剪纸'
      }
    ]
  },

  onLoad() {
  },
  getUserProfile(e) {
    console.log(e)
    let that = this;
    wx.getUserProfile({
      desc: '仅用于生成头像使用',
      success: (res) => {
        var url = res.userInfo.avatarUrl;
        while (!isNaN(parseInt(url.substring(url.length - 1, url.length)))) {
          url = url.substring(0, url.length - 1)
        }
        url = url.substring(0, url.length - 1) + "/0";
        res.userInfo.avatarUrl = url;
        console.log(JSON.stringify(res.userInfo));
        that.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        that.drawImg();
      }
    });
  },
  drawImg() {
    let that = this;
    wx.showLoading({
      title: '生成头像中...',
    })
    let promise1 = new Promise(function (resolve, reject) {
      wx.getImageInfo({
        src: that.data.userInfo.avatarUrl,
        success: function (res) {
          resolve(res);
        }
      })
    });
    var mask_id = that.data.now_mask;
    let promise2 = new Promise(function (resolve, reject) {
      wx.getImageInfo({
        src: `../../assets/img/mask0${mask_id}.png`,
        success: function (res) {
          console.log(res)
          resolve(res);
        }
      })
    });
    Promise.all([
      promise1, promise2
    ]).then(res => {
      console.log(res)
      //主要就是计算好各个图文的位置
      var windowWidth = wx.getSystemInfoSync().windowWidth
      var context = wx.createCanvasContext('myAvatar');
      var size = windowWidth /750 * 500
      // var size = 500
      context.drawImage(res[0].path, 0, 0, size, size);
      context.draw(true)
      context.save();
      context.drawImage('../../'+res[1].path, 0, 0, size, size);
      context.draw(true)
      context.save();

    })
    wx.hideLoading()
  },
  applyMask(e){
    console.log(e)
    if(!this.data.userInfo){
      wx.showModal({
        title: '温馨提示',
        content: '请先点击上方获取微信头像',
        showCancel: false,
      })
      return
    }
    var mask_id = e.currentTarget.dataset.id
    this.setData({
      now_mask: mask_id
    })
    this.drawImg()

  },
  canvasToTempFile(){
    if(!this.data.userInfo){
      wx.showModal({
        title: '温馨提示',
        content: '请先点击上方获取微信头像',
        showCancel: false,
      })
      return
    }
    var windowWidth = wx.getSystemInfoSync().windowWidth
    var size = 500
    // var dpr = 750 / windowWidth
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      height: size,
      width: size,
      canvasId: 'myAvatar',
      success: (res) => {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: result => {
            wx.hideLoading();
            wx.showModal({
              content: '图片已保存到相册,请前往微信去设置哟!',
              showCancel: false,
              success: function(res) {
                if (res.confirm) {
                  console.log('用户点击确定');
                }
              }
            })
          }, fail(e) {
            wx.hideLoading();
            console.log("err:" + e);
          }
        })
      }
    });
  },
  yinsi() {
    wx.showModal({
      title: '隐私说明',
      content: '「虎年头像生成器」的图片生成功能仅依赖于本地浏览器，我们不会在服务器中储存或者收集用户的数据和图片。请遵守当地法律法规，违者后果自负。',
      showCancel: false
    })
  },
  onShareAppMessage() {
    return {
      title: '虎年头像生成器',
      path: '/pages/index/index',
      imageUrl: '../../assets/img/share.jpg'
    }
  },
  onShareTimeline() {
    return {
      title: '虎年头像生成器',
      imageUrl: '../../assets/img/sharetimeline.png'
    }
  },
})
