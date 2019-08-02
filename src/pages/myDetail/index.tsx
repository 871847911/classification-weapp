import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import styles from './style.module.less'
import { getList } from '@actions/common'
interface PageOwnProps { }
export default class MyDetail
  extends Component<PageOwnProps, any> {
  constructor(props: PageOwnProps) {
    super(props);
    this.state = {};
  }
  config: Config = {
    navigationBarTitleText: '我的贡献'
  }

  componentWillReceiveProps(nextProps: any) {
    console.log(this.props, nextProps)
  }
  componentDidMount() {

  }
  componentWillUnmount() { }

  componentDidShow() {
    const { type } = this.$router.params
    this.setState({
      type
    })
    let param = {
      limit: "1000",
      page: "1",
      params: {
        refuseType: type
      }
    }
    Taro.showLoading({ title: '加载中...' })
    getList(param).then((data: any) => {
      Taro.hideLoading()
      if (data.msg !== 'success') {
        Taro.showToast({ title: data.msg, icon: 'none' });
        return
      }
      this.setState({
        dataList: data.page.list
      })
    })
  }

  componentDidHide() { }
  typeName = (type: any) => {
    switch (type) {
      case 1:
        return '湿垃圾';
      case 2:
        return '干垃圾';
      case 3:
        return '有害垃圾';
      default:
        return '可回收垃圾'
    }
  };
  render() {
    const { type, dataList } = this.state

    return (
      <View className='qw-page'>
        <View className='qw-page-main'>
          <View className={styles.MyDetail}>
            <View className={styles.listBox}>
              <Image className={styles.bg} src={require('../../images/bg.png')} />
              <View className={styles.listMain}>
                <View className={`${styles.typeName} ${type == 1 ? styles.typeName1 : type == 2 ? styles.typeName2 : type == 3 ? styles.typeName3 : styles.typeName4}`}>{this.typeName(type)}</View>
                <View className={styles.listBox}>
                  {
                    dataList && dataList.map((item: any, index: any) => (
                      <View key={item.score} className={styles.itemBox}>
                        <View className={styles.name}>{item.keyword}</View>
                        <View className={styles.date}>{item.createTime}</View>
                      </View>
                    ))
                  }
                  {
                    dataList && dataList.length > 0 ? <View className={styles.noMore}>垃圾也是有底线的</View>
                      : <View className={styles.noData}>
                        <View className={styles.mainBox}>
                          <Image src={require('../../images/none.png')} className={styles.images} />
                          <View className={styles.text}>emm…啥也没，去丢垃圾吧</View>
                        </View>
                      </View>
                  }
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

