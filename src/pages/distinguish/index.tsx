import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Input } from '@tarojs/components'
import styles from './style.module.less'
import { AtFloatLayout } from "taro-ui"
interface PageOwnProps { }
export default class Distinguish extends Component<PageOwnProps, any> {
  constructor(props: PageOwnProps) {
    super(props);
    this.state = {
      isOpened: true,
      list: [],
      checked: -1,
    };
  }
  config: Config = {
    navigationBarTitleText: '识别内容'
  }

  componentWillReceiveProps(nextProps: any) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount() { }

  componentDidShow() {
    Taro.getStorage({ key: 'result' })
      .then(res => {
        console.log('获取识别内容缓存', res.data);
        this.setState({
          list: res.data
        })
      })
  }
  componentDidMount() {

  }
  componentDidHide() { }
  handleClose = () => {
    Taro.navigateBack()
  }
  handleChange = () => {

  }
  handleClick = () => {
    const { checked, list, inputValue } = this.state
    let tag = ''
    if (!inputValue && checked == -1) {
      Taro.showToast({ title: '请告诉我们是什么垃圾哦～', icon: 'none' })
      return
    }
    if (inputValue) {
      tag = inputValue
      Taro.navigateTo({ url: '/pages/details/index?tag=' + tag })
    } else {
      tag = list[checked].keyword
      let root = list[checked].root
      let score = list[checked].score
      Taro.navigateTo({ url: '/pages/details/index?tag=' + tag + '&root=' + root + '&score=' + score })
    }

  }
  render() {
    const { isOpened, list, checked } = this.state
    return (
      <View className='qw-page'>
        {/* <View className='qw-page-main'> */}
        <AtFloatLayout isOpened={isOpened} title="识别可能结果" onClose={this.handleClose.bind(this)}>
          <View className={styles.popModal}>
            {
              list && list.map((item: any, index: any) => (
                <View key={item.score} className={`${styles.itemBox} ${checked == index ? styles.checked : ''}`}
                  onClick={() => {
                    this.setState({ checked: index })
                  }}>
                  {item.keyword}</View>
              ))
            }
            <View className={styles.inputBox}>
              <Input
                className={styles.inputs}
                type='text'
                placeholder='没找到？补充说明一下'
                onInput={event => {
                  const value = event.detail.value;
                  this.setState({
                    inputValue: value
                  })
                }}
                onBlur={event => {
                  const value = event.detail.value;

                }} />
            </View>
            <View className={styles.btnBox} onClick={() => this.handleClick()}>
              <Image className={styles.image} src={'http://qiniu.smallbook.cn/define-btn.png'} />
            </View>
          </View>

        </AtFloatLayout>
        {/* </View> */}
      </View>
    )
  }
}

