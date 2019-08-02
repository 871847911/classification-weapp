import Taro, { Component, Config } from '@tarojs/taro'
import { View, Input, Picker, Text, Image } from '@tarojs/components'
import styles from './style.module.less'
import { List, Item } from '@components/Widgets/BZList'
import { updateUserById } from '@actions/common'
interface PageOwnProps { }
export default class Edit extends Component<PageOwnProps, any> {
  constructor(props: PageOwnProps) {
    super(props);
    this.state = {
      checked: 1,
      list: [
        {
          id: 1,
          url: 'http://qiniu.smallbook.cn/boy.png',
          urlNone: 'http://qiniu.smallbook.cn/boy-none.png'
        },
        {
          id: 2,
          url: 'http://qiniu.smallbook.cn/girl.png',
          urlNone: 'http://qiniu.smallbook.cn/girl-none.png'
        }
      ]
    };
  }
  config: Config = {
    navigationBarTitleText: '完善信息'
  }

  componentWillReceiveProps(nextProps: any) {
    console.log(this.props, nextProps)
  }
  componentDidMount() {

  }
  componentWillUnmount() { }

  componentDidShow() {

    Taro.getStorage({ key: 'userInfo' })
      .then(res => {
        console.log(res.data);
        const { gender = 1, birthday = '', nickName, mobile = '', career = '', province = '', city = '', area = '' } = res.data
        this.setState({
          checked: gender,
          birthday,
          nickName,
          phone: mobile,
          zhiye: career,
          adress: [province, city, area]
        })
      })
  }

  componentDidHide() { }
  onChange = () => {

  }
  handleClick = () => {
    const { userId } = this.$router.params
    const { checked, nickName, birthday, phone, zhiye, adress } = this.state
    if (!nickName) {
      Taro.showToast({ title: '请输入您的姓名', icon: 'none' })
      return
    }
    if (!birthday) {
      Taro.showToast({ title: '请选择您的出生日期', icon: 'none' })
      return
    }
    if (!phone) {
      Taro.showToast({ title: '请输入您的手机号', icon: 'none' })
      return
    }
    if (!adress) {
      Taro.showToast({ title: '请选择您的所在地', icon: 'none' })
      return
    }
    const param = {
      gender: checked,
      birthday,
      nickName,
      mobile: phone,
      career: zhiye,
      province: adress[0],
      city: adress[1],
      area: adress[2],
      userId
    }
    updateUserById(param).then((data: any) => {
      if (data.msg !== 'success') {
        Taro.showToast({ title: data.msg, icon: 'none' });
        return
      }
      Taro.showToast({ title: '保存成功～', icon: 'success' }).then((res) => {
        // setTimeout(() => {
        //   Taro.navigateBack()
        // }, 2000)
      })

    })
  }
  render() {
    const { birthday, list, checked, adress, nickName, phone, zhiye } = this.state
    return (
      <View className='qw-page'>
        <View className='qw-page-main'>
          <View className={styles.Edit}>
            <View className={styles.title}>完善资料</View>
            <View className={styles.sexBox}>
              {
                list && list.map((item: any, index: any) => (
                  <View key={item.id} className={styles.sex} onClick={() => this.setState({ checked: item.id })}>
                    <Image className={styles.image} src={checked == item.id ? item.url : item.urlNone} />
                  </View>
                ))
              }
            </View>
            <View className={styles.formBox}>
              <List className={styles.inputList}>
                <Item
                  renderExtra={<Input
                    // value={addressCopy || null}
                    type='text'
                    placeholder='请输入'
                    maxLength={10}
                    value={nickName}
                    onInput={event => {
                      const value = event.detail.value;
                      this.setState({
                        nickName: value
                      })

                    }}
                    onBlur={event => {
                      const value = event.detail.value;
                    }}
                  />}
                >
                  您的姓名
              </Item>
                <Picker
                  className={styles.listItemPicker}
                  mode='date'
                  rangeKey="label"
                  onChange={event => {
                    const value = event.detail.value;
                    this.setState({ birthday: value })
                    console.log(value);
                  }}
                >
                  <Item arrow="right" renderExtra={<Text>{birthday ? birthday : '请选择'}</Text>}>您的生日</Item>
                </Picker>
                <Item
                  renderExtra={<Input
                    // value={addressCopy || null}
                    type='text'
                    placeholder='请输入'
                    value={phone}
                    maxLength={11}
                    onInput={event => {
                      const value = event.detail.value;
                      this.setState({
                        phone: value
                      })

                    }}
                    onBlur={event => {
                      const value = event.detail.value;
                      console.log('失去焦点了，开始校验手机号：' + value)
                    }}
                  />}
                >
                  您的手机号
              </Item>
              </List>
            </View>
            <View className={styles.formBox}>
              <List className={styles.inputList}>
                <Item
                  renderExtra={<Input
                    value={zhiye}
                    type='text'
                    placeholder='请输入'
                    maxLength={10}
                    onInput={event => {
                      const value = event.detail.value;
                      this.setState({
                        zhiye: value
                      })

                    }}
                    onBlur={event => {
                      const value = event.detail.value;
                    }}
                  />}
                >
                  您的职业
              </Item>
                <Picker
                  className={styles.listItemPicker}
                  mode='region'
                  onChange={event => {
                    const value = event.detail.value;
                    this.setState({ adress: value })
                    console.log(value);
                  }}
                >
                  <Item arrow="right" renderExtra={<Text>{adress ? adress[0] + adress[1] + adress[2] : '请选择'}</Text>}>所在地区</Item>
                </Picker>
              </List>
            </View>
            <View className={styles.btnBox_b} onClick={() => this.handleClick()}>
              <Image className={styles.image} src={'http://qiniu.smallbook.cn/save-btn.png'} />
            </View>
          </View>
        </View>
      </View>
    )
  }
}

