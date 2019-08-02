import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Input, Button } from '@tarojs/components'
import styles from './style.module.less'
import { saveRefuseClass } from '@actions/common'
import { AtModal, AtModalContent, AtIcon } from "taro-ui"
interface PageOwnProps { }
export default class ADD extends Component<PageOwnProps, any> {
  constructor(props: PageOwnProps) {
    super(props);
    this.state = {
      isOpened: false,
      checked: 1,
      typeList: [
        { type: 1, name: '湿垃圾' },
        { type: 2, name: '干垃圾' },
        { type: 3, name: '有害垃圾' },
        { type: 4, name: '可回收垃圾' },
      ]
    };
  }
  config: Config = {
    navigationBarTitleText: '送它回家'
  }

  componentWillReceiveProps(nextProps: any) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount() { }

  componentDidShow() {
    const { tag } = this.$router.params
    this.setState({ ljName: tag })
  }
  componentDidMount() {

  }
  componentDidHide() { }

  handleClick = () => {
    const { checked, ljName } = this.state
    Taro.showLoading({ title: '正在路上...' })
    const param = {
      lname: ljName,
      type: checked
    }
    saveRefuseClass(param).then((data: any) => {
      if (data.msg !== 'success') {
        Taro.showToast({ title: data.msg, icon: 'none' });
        return
      }
      this.setState({ isOpened: true })
      Taro.hideLoading()
    })
  }
  render() {
    const { typeList, checked, ljName, isOpened } = this.state
    return (
      <View className='qw-page'>
        {/* <View className='qw-page-main'> */}
        <View className={styles.mainBox}>
          <View className={styles.stitle}>垃圾名称</View>
          <View className={styles.inputBox}>
            <Input
              value={ljName}
              className={styles.inputs}
              type='text'
              placeholder='没找到？补充说明一下'
              onInput={event => {
                const value = event.detail.value;
                this.setState({ ljName: value })
              }}
              onBlur={event => {
                const value = event.detail.value;

              }} />
          </View>
          <View className={styles.stitle}>垃圾类别</View>
          <View className={styles.popModal}>
            {
              typeList && typeList.map((item: any, index: any) => (
                <View key={item.type} className={`${styles.itemBox} ${checked == item.type ? styles.checked : ''}`}
                  onClick={() => {
                    console.log(item.type)
                    this.setState({ checked: item.type })
                  }}>
                  {item.name}</View>
              ))
            }
          </View>
        </View>
        <View className={styles.btnBox_b} onClick={() => this.handleClick()}>
          <Image className={styles.image} src={'http://qiniu.smallbook.cn/define-btn.png'} />
        </View>
        {/* </View> */}
        <AtModal isOpened={isOpened}>
          <AtModalContent>
            <View className={`${styles.closeIcon}`}><AtIcon onClick={() => { this.setState({ isOpened: false }) }} value='close' size='20' color='#000'></AtIcon></View>
            <View className={styles.modalTitle}>提交成功</View>
            <View className={styles.modalContent}>您已把此垃圾安全送回家</View>
            <Button onClick={() => { Taro.reLaunch({ url: '/pages/index/index' }) }} className={styles.btnBox}></Button>
          </AtModalContent>
        </AtModal>
      </View>
    )
  }
}

