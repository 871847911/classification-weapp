import Taro, { Component } from '@tarojs/taro';
import classNames from 'classnames'
import { View } from '@tarojs/components';
import BzComponent from '../Common/Component'
import './style.less'

interface PageOwnProps {
  className?: any;
}
export default class List extends Component<PageOwnProps, any> {
  static options = {
    addGlobalClass: true
  }
  render() {
    const rootClass = classNames(
      'bz-list',
      this.props.className
    )
    return (
      <View className={rootClass}>
        {this.props.children}
      </View>
    );
  }
}
