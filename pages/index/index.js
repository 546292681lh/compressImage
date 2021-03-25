// index.js
const regeneratorRuntime = require('../../utils/runtime')
import {chooseImage,canvasToTempFilePath,getFileInfo,getImageInfo} from '../../utils/util'
// 获取应用实例
const app = getApp()

Page({
  data: {
    list:[],
    cWidth:400,
    cHeight:400
  },
  lifetimes: {
    attached: function () {
        this.setData({
            ctx:wx.createCanvasContext('canvas',this)
        })
    }
},
  async getFile(){
    const that = this;
    const res = await chooseImage();
    console.log('压缩前:'+res.tempFiles[0].size);
    this.compressImage(res.tempFiles[0].path,{
      quality:0.5,
      success:(result)=>{
        that.updateList([result])
      }
    });
    // this.data.ctx.drawImage()
  },
  compressImage(src,options){
    this.data.ctx.drawImage(src,0,0,400,400);
    this.data.ctx.draw(false,()=>{
      this.data.timer = setTimeout(async ()=>{
        let res
        try {
            res = await canvasToTempFilePath({
                quality:options.quality,
                fileType:'jpg',
                canvasId: 'canvas',
                destWidth: 400,
                destHeight: 400
            },this)
            clearTimeout(this.data.timer)
        }catch (e) {
            console.log(e)
        }
        const fileInfo = await getFileInfo({filePath:res.tempFilePath})
        console.log(fileInfo.size)
        if (fileInfo.size<=1048576){//小于1MB
            options.success && options.success({path:res.tempFilePath,size:fileInfo.size})
        }else {
            this.compressImage(res.tempFilePath,options)
        }
      },100)
    })
  },
  updateList(res){
    this.list = res.map(item=>({
      src:item.path,
      size:item.size
    }))
    this.setData({
      list:this.list
    })
  },
  onLoad() {
    this.setData({
      ctx:wx.createCanvasContext('canvas',this)
  })
  }
})
