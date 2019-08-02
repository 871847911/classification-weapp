import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import './style.less';

interface PageOwnProps { }
export default class LoadingData extends Component<PageOwnProps, any> {
  render() {
    return <View className="loadingData"><View className="content">数据加载中…</View></View>;
  }
}
