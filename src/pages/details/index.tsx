import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Button } from '@tarojs/components'
import styles from './style.module.less'
import { queryRefuseClassByTag, saveLog } from '@actions/common'
interface PageOwnProps { }
export default class Details extends Component<PageOwnProps, any> {
  constructor(props: PageOwnProps) {
    super(props);
    this.state = {
      type: -1,//垃圾类型
      isShowImg: true
    };
  }
  config: Config = {
    navigationBarTitleText: '垃圾类别'
  }

  componentWillReceiveProps(nextProps: any) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount() { }

  componentDidShow() {
    Taro.showLoading({ title: '加载中...' })

    const { tag, root, score, isIndex, userId, imgUrl } = this.$router.params;
    Taro.getStorage({ key: 'userInfo' })
      .then(res => {
        this.setState({
          userIdd: res.data.userId
        })
      })
    if (isIndex == 1) {
      this.setState({
        isShowImg: false
      })
    } else {
      Taro.getStorage({ key: 'tempFilePaths' })
        .then(res => {
          this.setState({
            imgUrl: imgUrl || res.data
          })
        })
    }
    queryRefuseClassByTag({ tag }).then((data: any) => {
      Taro.hideLoading()
      if (data.msg !== 'success') {
        Taro.showToast({ title: data.msg, icon: 'none' });
        return
      }
      //0:可回收 1:湿垃圾 2:干垃圾 3:有害垃圾 4:外星物种
      this.setState({
        type: data.data.type == 4 ? 0 : data.data.type == 0 ? 4 : data.data.type,
        detail: data.data,
        tag
      })
      if (userId || isIndex) {
        return
      }
      this.saveLog(data.data.type)
    })
  }
  saveLog = (type: any) => {
    const { tag, root, score, isIndex } = this.$router.params;
    let param = {}
    if (root && score) {
      param = {
        refusetype: type,
        keyword: tag,
        root,
        score
      }
    } else {
      param = {
        refusetype: type,
        keyword: tag,
      }
    }
    saveLog(param).then((data: any) => {
      if (data.msg !== 'success') {
        Taro.showToast({ title: data.msg, icon: 'none' });
        return
      }
    })
  }
  componentDidMount() {

  }
  componentDidHide() { }
  //分享点击
  goHome = () => {
    const { tag } = this.state
    Taro.navigateTo({ url: '/pages/add/index?tag=' + tag })
  }
  onShareAppMessage = (ops: any) => {
    const { tag, root, score, isIndex } = this.$router.params;
    const { detail, userIdd, imgUrl } = this.state
    if (ops.from === 'button') { //页面按钮触发分享
      console.log('pages/details/index?tag=' + tag + '&root=' + root + '&score=' + score + '&isIndex=' + isIndex + '&userId=' + userIdd + '&imgUrl=' + imgUrl)
    }
    return {
      title: tag + '属于' + detail.cName,
      desc: '你是什么垃圾，赶紧来测一测吧！',
      path: 'pages/details/index?tag=' + tag + '&root=' + root + '&score=' + score + '&isIndex=' + isIndex + '&userId=' + userIdd,
      success: function (res: any) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res: any) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }

  }
  render() {
    const { type, detail, imgUrl, isShowImg } = this.state
    const { userId } = this.$router.params
    const imgIcon = 'type_' + type
    return (
      <View className='qw-page'>
        <View className='qw-page-main'>
          <View className={styles.Details}>
            <View className={`${styles.main} ${type == 0 ? styles.main0 : type == 1 ? styles.main1 : type == 2 ? styles.main2 : type == 3 ? styles.main3 : styles.main4}`}>
              {
                isShowImg ? <View className={styles.imgBox}>
                  <Image className={styles.image} src={imgUrl} />
                </View> : ''
              }
              <View className={styles.iconBox}>
                {
                  type != -1 ? <Image className={styles.image} src={`http://qiniu.smallbook.cn/${imgIcon}.png`} /> : ''
                }
              </View>
              <View className={`${styles.typeName} ${type == 0 ? styles.typeName0 : type == 1 ? styles.typeName1 : type == 2 ? styles.typeName2 : type == 3 ? styles.typeName3 : styles.typeName4}`}>{detail.cName}</View>
              <View className={styles.contant}>{detail.cDesc}</View>
              <View className={styles.textBox}>{detail.howThrow}</View>
            </View>
            {
              type != -1 ? type == 4 ?
                <Button className={styles.btnBoxHome} onClick={() => this.goHome()} ></Button>
                : userId ? <Button className={styles.shareIn} onClick={() => Taro.navigateTo({ url: '/pages/index/index?userId=' + userId })}></Button>
                  : <Button className={styles.btnBoxShare} open-type="share"></Button> : ''
            }
          </View>
        </View>
      </View>
    )
  }
}

