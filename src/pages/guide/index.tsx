import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, ScrollView } from '@tarojs/components'
import styles from './style.module.less'
import { getTypelist } from '@actions/common'
interface PageOwnProps { }
export default class Guide extends Component<PageOwnProps, any> {
  constructor(props: PageOwnProps) {
    super(props);
    this.state = {
      checked: 0,
      type: 4,
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
      ],
      nameList: [
        { type: 4, list: [{ name: '食品保鲜盒' }, { name: '毛绒玩具' }, { name: '木积木' }, { name: '碎玻璃' }, { name: '信封' }] },
        { type: 1, list: [{ name: '宠物饲料' }, { name: '花卉' }, { name: '剩饭剩菜' }, { name: '蔬菜' }, { name: '鱼、虾' }] },
        { type: 2, list: [{ name: '笔' }, { name: '餐巾纸' }, { name: '创可贴' }, { name: '内衣裤' }, { name: '纸尿裤' }] },
        { type: 3, list: [{ name: 'X光片' }, { name: '电池' }, { name: '过期药品' }, { name: '节能灯' }, { name: '染发剂壳' }] },
      ]
    };
  }
  config: Config = {
    navigationBarTitleText: '垃圾分类指南'
  }

  componentWillReceiveProps(nextProps: any) {
    console.log(this.props, nextProps)
  }
  componentDidMount() {
    Taro.showLoading({title:'加载中...')
    getTypelist().then((data: any) => {
      if (data.msg !== 'success') {
        Taro.showToast({ title: data.msg, icon: 'none' });
        return
      }
      Taro.hideLoading()
      this.setState({ dataSourse: data.data }, () => {
        this.findTypeList(4)
      })
    })
  }
  componentWillUnmount() { }

  componentDidShow() {
    
  }

  componentDidHide() { }
  findTypeList = (type: any) => {
    const { dataSourse } = this.state
    let typeList: any = []
    dataSourse && dataSourse.map((item: any, index: any) => {
      if (type == item.type) {
        return typeList.push(item)
      }
    })
    this.setState({
      detail: typeList[0] || ''
    })
  }
  render() {

    const { typeList, checked, detail, nameList, type } = this.state
    return (
      <View className='qw-page'>
        <View className='qw-page-main'>
          <View className={styles.Guide}>
            <View className={styles.typeBox} >
              <ScrollView
                scrollX
                className={styles.itemBox}
                scrollWithAnimation={true}
              >
                {typeList && typeList.map((item: any, index: any) => (
                  <View key={item.id} onClick={() => { this.findTypeList(item.type), this.setState({ checked: index, type: item.type }) }} className={`${styles.main} ${checked == index ? (item.type == 1 ? styles.main1 : item.type == 2 ? styles.main2 : item.type == 3 ? styles.main3 : styles.main4) : styles.main5}`}>
                    {item.name}
                    <Image src={checked == index ? item.url : item.unUrl} className={styles.typeIcon} />
                  </View>
                ))}
              </ScrollView>
            </View>
            {
              detail ? <View className={styles.mainBox}>
                <View className={styles.title}>{detail.cName}</View>
                <View className={styles.main}>{detail.cDesc}</View>
              </View> : ''
            }
            {
              detail ? <View className={styles.mainBox}>
                <View className={styles.main}>{detail.howThrow}</View>
              </View> : ''
            }
            <View className={styles.listBox}>
              {
                nameList[checked].list && nameList[checked].list.map((item: any, index: any) => (
                  <View key={item.name} className={styles.itemBox}>
                    <Image className={styles.images} src={`http://qiniu.smallbook.cn/type_${type}_${index + 1}.png`} />
                    <View className={styles.text}>{item.name}</View>
                  </View>
                ))
              }
              <View className={styles.itemBox} onClick={() => Taro.navigateTo({ url: '/pages/more/index?type=' + type })}>
                <Image className={styles.images} src={'http://qiniu.smallbook.cn/more-icon.png'} />
                <View className={styles.text}>更多</View>
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

