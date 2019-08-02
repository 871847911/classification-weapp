import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import styles from './style.module.less'
import { AtSearchBar } from 'taro-ui'
interface PageOwnProps { }
export default class Search extends Component<PageOwnProps, any> {
  constructor(props: PageOwnProps) {
    super(props);
    this.state = {};
  }
  config: Config = {
    navigationBarTitleText: '垃圾搜索'
  }

  componentWillReceiveProps(nextProps: any) {
    console.log(this.props, nextProps)
  }
  componentDidMount() {

  }
  componentWillUnmount() { }

  componentDidShow() {
    console.log(this.$router.params);
  }

  componentDidHide() { }
  onChange = () => {

  }
  render() {
    const { type } = this.state
    return (
      <View className='qw-page'>
        <View className='qw-page-main'>
          <AtSearchBar
            value={''}
            onChange={this.onChange.bind(this)}
          />
        </View>
      </View>
    )
  }
}

