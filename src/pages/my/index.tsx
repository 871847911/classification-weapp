import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import styles from './style.module.less'
import { AtIcon } from 'taro-ui'
import { statisticsLogById, getUserById } from '@actions/common'
interface PageOwnProps { }
export default class My extends Component<PageOwnProps, any> {
  constructor(props: PageOwnProps) {
    super(props);
    this.state = {
      checked: 0,
      detail: '',//个人信息
      type: 4,//选中垃圾类别
      typeList: [
        {
          id: 5,
          type: 4,
          url: 'http://qiniu.smallbook.cn/type_0.png',
          name: '可回收',
          unUrl: 'http://qiniu.smallbook.cn/type_none_0.png',
        },
        {
          id: 2,
          type: 1,
          url: 'http://qiniu.smallbook.cn/type_1.png',
          unUrl: 'http://qiniu.smallbook.cn/type_none_1.png',
          name: '湿垃圾'
        }, {
          id: 3,
          type: 2,
          url: 'http://qiniu.smallbook.cn/type_2.png',
          unUrl: 'http://qiniu.smallbook.cn/type_none_2.png',
          name: '干垃圾'
        }, {
          id: 4,
          type: 3,
          url: 'http://qiniu.smallbook.cn/type_3.png',
          unUrl: 'http://qiniu.smallbook.cn/type_none_3.png',
          name: '有害'
        },
      ]
    };
  }
  config: Config = {
    navigationBarTitleText: '我的'
  }

  componentWillReceiveProps(nextProps: any) {
    console.log(this.props, nextProps)
  }
  componentDidMount() {
    statisticsLogById().then((data: any) => {
      if (data.msg !== 'success') {
        Taro.showToast({ title: data.msg, icon: 'none' });
        return
      }
      this.setState({ dataSourse: data.data }, () => {
        this.findTypeList(4)
      })
    })
  }
  componentWillUnmount() { }

  componentDidShow() {
    const _this = this
    Taro.getStorage({ key: 'userInfo' })
      .then(res => {
        getUserById({ userId: res.data.userId }).then((data: any) => {
          if (data.msg !== 'success') {
            Taro.showToast({ title: data.msg, icon: 'none' });
            return
          }
          Taro.setStorage({ key: 'userInfo', data: data.data }).then(res => {
            console.log('个人信息缓存成功', data.data)
          })
          _this.setState({
            userInfo: data.data
          })
        })
      })

  }
  //根据类型筛选数据
  findTypeList = (type: any) => {
    const { dataSourse } = this.state
    let typeList: any = []
    dataSourse && dataSourse.map((item: any, index: any) => {
      if (type == item.refuse_type) {
        return typeList.push(item)
      }
    })
    this.setState({
      detail: typeList[0] || ''
    })
  }
  componentDidHide() { }
  onChange = () => {

  }
  render() {
    const { checked, typeList, userInfo, detail, type } = this.state
    return (
      <View className='qw-page'>
        <View className='qw-page-main'>
          <View className={styles.My}>
            <View className={styles.header}>
              <View className={styles.editInfo} onClick={() => Taro.navigateTo({ url: '/pages/edit/index?userId=' + userInfo.userId })}><View>完善资料</View><AtIcon value='chevron-right' size='26' color='#4A4A4A'></AtIcon></View>
              <View className={styles.headerImg}>
                <Image src={userInfo.avatarUrl} className={styles.images} />
              </View>
              <View className={styles.name}>{userInfo.nickName}</View>
              <View className={styles.levelBOx}>
                <View className={styles.level}></View>
              </View>
            </View>
            <View className={styles.contribution}>我的贡献</View>
            <View className={styles.contant}>
              <View className={styles.mainBox}>
                <View className={styles.textBox}>
                  {
                    detail ?
                      <View>
                        <View className={styles.title1}>恭喜你</View>
                        <View className={styles.title2}>目前该分类已识别件数达到<Text className={styles.text}>{detail.score || 0}</Text>件！</View>
                        {/* <View className={styles.title3}>你已经战胜了全市<Text className={styles.text}>64%</Text>的人</View> */}
                      </View>
                      : <View className={styles.title4}>emm,木有垃圾...</View>
                  }
                </View>
                <View className={styles.detailBtn} onClick={() => { Taro.navigateTo({ url: '/pages/myDetail/index?type=' + type }) }}>
                  <Image src={'http://qiniu.smallbook.cn/details-btn.png'} className={styles.images} />
                </View>
              </View>
              <View className={styles.typeBox}>
                {typeList && typeList.map((item: any, index: any) => (
                  <View key={item.id} onClick={() => { this.findTypeList(item.type), this.setState({ checked: index, type: item.type }) }} className={`${styles.main} ${checked == index ? (item.type == 1 ? styles.main1 : item.type == 2 ? styles.main2 : item.type == 3 ? styles.main3 : styles.main4) : styles.main5}`}>
                    {item.name}
                    <Image src={checked == index ? item.url : item.unUrl} className={styles.typeIcon} />
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
      </View >
    )
  }
}

