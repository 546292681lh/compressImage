const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

const cutstomPromise = (api)=>{
  return options=> new Promise((resolve,reject)=>{
    api({
        ...options,
        success:resolve,
        fail:reject
    })
  })
}
const promisifyWithThis = api=>{
  return (options,that)=> new Promise((resolve,reject)=>{
    api({
        ...options,
        success:resolve,
        fail:reject
    },that)
  })
}
const chooseImage = cutstomPromise(wx.chooseImage)
const canvasToTempFilePath = promisifyWithThis(wx.canvasToTempFilePath.bind(wx))
const getFileInfo = cutstomPromise(wx.getFileInfo)
const getImageInfo = cutstomPromise(wx.getImageInfo)
module.exports = {
  formatTime,
  chooseImage,
  canvasToTempFilePath,
  getFileInfo,
  getImageInfo
}
