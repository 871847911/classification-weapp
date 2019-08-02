import Taro, { Component } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import './style.less';

interface PageOwnProps {
  content?: string;
  showImage?: boolean;
}
export default class EmptyData extends Component<PageOwnProps, any> {
  render() {
    const { content, showImage = false } = this.props;
    const emptyImg = require('../../../images/no_pass_image.png');
    return (
      <View className="emptyData">
        {showImage ? <Image mode="widthFix" src={emptyImg} className="image" /> : null}
        <View className="content">{content || '暂无内容哦~'}</View>
      </View>
    );
  }
}
