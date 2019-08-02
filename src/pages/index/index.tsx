import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Button } from '@tarojs/components'
import styles from './style.module.less'
import { AtSearchBar } from 'taro-ui'
import { wxlogin } from '@actions/common'
import boz from '@BOZ';
const { nurseTrainApi } = boz['api'][`${boz.env}`]
// #region 书写注意
// 
// 目前 typescript 版本还无法在装饰器模式下将 Props 注入到 Taro.Component 中的 props 属性
// 需要显示声明 connect 的参数类型并通过 interface 的方式指定 Taro.Component 子类的 props
// 这样才能完成类型检查和 IDE 的自动提示
// 使用函数模式则无此限制
// ref: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20796
//
// #endregion

interface PageOwnProps { }
export default class Index extends Component<PageOwnProps, any> {
  config: Config = {
    navigationBarTitleText: '首页'
  }

  componentWillReceiveProps(nextProps: any) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount() { }

  componentDidShow() {

  }
  componentDidMount() {
    const _this = this
    Taro.getSetting({
      success(res: any) {
        if (res.authSetting['scope.userInfo']) {
          _this.login(3)
        }
      }
    })
  }
  login = (type: any) => {
    const _this = this
    const { userId } = this.$router.params
    Taro.showLoading({ title: '登陆中...', mask: true })
    Taro.login({
      success: function (res) {
        if (res.code) {
          Taro.getUserInfo({
            success(resUser) {
              let param = {
                code: res.code,
                iv: resUser.iv,
                encryptedData: resUser.encryptedData,
                sharerid: userId
              }
              wxlogin(param).then((data: any) => { //登陆接口
                if (data.msg !== 'success') {
                  Taro.showToast({ title: data.msg, icon: 'none' });
                  return
                }
                _this.setState({
                  userInfo: data.userInfo,
                  token: data.token
                })
                Taro.setStorage({ key: 'userInfo', data: data.userInfo })
                  .then(res => console.log('个人信息缓存成功'))
                Taro.setStorage({ key: 'token', data: data.token })
                  .then(res => console.log('token缓存成功'))
                Taro.hideLoading()
                if (type == 1) {
                  _this.chooseImages(data.token)
                }
              })
            }
          })

          //用户登录凭证（有效期五分钟）。开发者需要在开发者服务器后台调用 api，使用 code 换取 openid 和 session_key 等信息
        } else {
          console.log("登录失败！" + res.errMsg);
        }
      }
    });
  }
  componentDidHide() { }
  // 保存用户信息微信登录
  tobegin = (res: any) => {
    const { token } = this.state
    if (res.detail.userInfo) {
      if (token) {
        Taro.hideLoading()
        this.chooseImages(token)
      } else {
        this.login(1)
      }
    } else {
      console.log('拒绝授权');
    }
  }
  chooseImages = (token: any) => {
    Taro.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        Taro.showLoading({ title: '正在识别...' });
        console.log('token', token)
        Taro.uploadFile({
          url: nurseTrainApi + '/refuseClass/api/v1/baidu/AipImageClassify',
          filePath: tempFilePaths[0],
          name: 'file',
          header: {
            'token': token,
            'content-type': 'multipart/form-data;charset=utf-8'
          },
          success(data) {
            Taro.hideLoading()
            const resData = JSON.parse(data.data)
            if (resData.msg !== 'success') {
              Taro.showToast({ title: resData.msg, icon: 'none' });
              return
            }
            Taro.setStorage({ key: 'tempFilePaths', data: resData.data.imgurl })
            Taro.setStorage({ key: 'result', data: resData.data.result })
              .then(res => Taro.navigateTo({ url: '/pages/distinguish/index' }))
          }
        })
      }
    })
  };
  onChange = (value: any) => {
    this.setState({
      serchVal: value
    })
  }
  onConfirm = () => {
    const { serchVal = '' } = this.state
    Taro.navigateTo({ url: '/pages/details/index?tag=' + serchVal + '&isIndex=1' })
    // Taro.navigateTo({ url: `/pages/search/index?serchVal=` + serchVal })
  }
  onActionClick = () => {
    const { serchVal = '' } = this.state
    Taro.navigateTo({ url: '/pages/details/index?tag=' + serchVal + '&isIndex=1' })
    // Taro.navigateTo({ url: `/pages/search/index?serchVal=` + serchVal })
  }
  render() {
    const { userInfo } = this.state
    return (
      <View className='qw-page'>
        <View className='qw-page-main'>
          <View className={styles.Index}>
            <AtSearchBar
              value={this.state.serchVal}
              onChange={this.onChange.bind(this)}
              onConfirm={this.onConfirm.bind(this)}
              onActionClick={this.onActionClick.bind(this)}
            />
            <View onClick={() => Taro.navigateTo({ url: '/pages/guide/index' })} className={styles.zhinan}>
              <Image className={styles.image} src={require('../../images/zhinan.png')} />
            </View>
            {
              userInfo ? <View className={styles.headerImg} onClick={() => Taro.navigateTo({ url: '/pages/my/index' })}>
                <View className={styles.shuBg}></View>
                <Image className={styles.image} src={userInfo.avatarUrl} />
              </View> : ''
            }
            <View className={styles.people}>
              <Image className={styles.image} src={'http://qiniu.smallbook.cn/ljt.png'} />
            </View>
            <View className={`${styles.icon} ${styles.icon1}`}>
              <Image className={styles.image} src={require('../../images/icon1.png')} />
            </View>
            <View className={`${styles.icon} ${styles.icon2}`}>
              <Image className={styles.image} src={require('../../images/icon2.png')} />
            </View>
            <View className={`${styles.icon} ${styles.icon3}`}>
              <Image className={styles.image} src={require('../../images/icon3.png')} />
            </View>
            <View className={`${styles.icon} ${styles.icon4}`}>
              <Image className={styles.image} src={require('../../images/icon4.png')} />
            </View>
            {/* <View className={styles.btn} onClick={() => this.photograph()}>
              <Image className={styles.image} src={require('../../images/btn.png')} />
            </View> */}
            <Button className={styles.btn} type="primary" open-type="getUserInfo" onGetUserInfo={this.tobegin}></Button>
          </View>
        </View>
      </View>
    )
  }
}

// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性
// 这样在使用这个子类时 Ts 才不会提示缺少 JSX 类型参数错误
//
// #endregion

