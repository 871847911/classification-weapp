import Taro, { Component } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import classNames from 'classnames'
import '@styles/components/icon.less';
import './style.less'

interface PageOwnProps {
  className?: any;
  arrow?: string;  // 箭头方向 [left,right,up,down]
  iconInfo?: any;
  thumb?: any;  // 缩略图地址
  extra?: string;  // 右边内容
  subtitle?: string;  // 副标题
  disabled?: boolean;
  onClick?: (...args) => void;
  renderExtra?: any;  // 自定义右边内容【和extra二选一】
}
export default class Item extends Component<PageOwnProps, any> {
  static options = {
    addGlobalClass: true
  }
  static defaultProps = {
    iconInfo: {}
  };
  handleClick = (...args) => {
    if (this.props.onClick && !this.props.disabled) {
      this.props.onClick(...args)
    }
  }
  render() {
    const { iconInfo, thumb, extra, subtitle, arrow } = this.props
    const prefixCls = 'bz-list-item'
    const rootClass = classNames(
      'bz-list-item',
      this.props.className
    )
    const iconClass = classNames(
      'bz-list-item-thumb-icon',
      iconInfo.className
    )
    const arrowClass = classNames(
      'bz-list-item-arrow',
      'bozfont',
      `icon-arrow-${arrow}`
    )
    return (
      <View className={rootClass} onClick={this.handleClick.bind(this)}>
        {
          iconInfo.className ? <View className={iconClass} /> : ''
        }
        {
          thumb ? <Image src={thumb} className="bz-list-item-thumb" /> : ''
        }
        <View className="bz-list-item-content">
          <View className="bz-list-item-content-info">
            <View className="bz-list-item-title">{this.props.children}</View>
            {subtitle && <View className="bz-list-item-subtitle">{subtitle}</View>}
          </View>
          {!extra && <View className="bz-list-item-control">{this.props.renderExtra}</View>}
          {extra && <View className="bz-list-item-extra">{extra}</View>}
          {arrow && <View className={arrowClass} />}
        </View>
      </View>
    );
  }
}
