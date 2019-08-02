import Taro, { Component } from '@tarojs/taro';
import { View, ScrollView, Text } from '@tarojs/components';
import './style.less'

type PageOwnProps = {
  className: any;
  onScrollToUpper: () => void;
  onScrollToLower: () => void;
}
type PageState = {}

export default class PulldownRefresh extends Component<PageOwnProps, PageState>{
  static options = {
    addGlobalClass: true
  }

  startX = 0;
  startY = 0;
  startTop: any = 0;
  isMoveDown = false;
  downLoading = false;
  constructor(props: PageOwnProps) {
    super(props)
    this.state = {}
  }

  componentDidMount() { }

  onTouchStart = (e) => {
    const scrollEle = document.querySelector('.taro-scroll')
    this.startTop = scrollEle ? scrollEle.scrollTop : 0
    this.startY = e.touches ? e.touches[0].pageY : e.clientY;
    // X的作用是用来计算方向，如果是横向，则不进行动画处理，避免误操作
    this.startX = e.touches ? e.touches[0].pageX : e.clientX;
  }

  onTouchMove = (e) => {
    const curY = e.touches ? e.touches[0].pageY : e.clientY;
    const curX = e.touches ? e.touches[0].pageX : e.clientX;
    // 和起点比,移动的距离,大于0向下拉
    const moveY = curY - this.startY;
    const moveX = curX - this.startX;
    // 如果锁定横向滑动并且横向滑动更多，阻止默认事件
    if (Math.abs(moveX) > Math.abs(moveY)) {
      e.preventDefault();
      return;
    }
    if (this.startTop <= 0 && moveY > 0) {
      // 向下拉
      this.isMoveDown = true;
      // 阻止浏览器的默认滚动事件，因为这时候只需要执行动画即可
      e.preventDefault();
      this.downLoading = true
    } else {
      this.downLoading = false
    }
  }

  onTouchEnd = (e) => {
    const { onScrollToUpper } = this.props
    if (this.downLoading) {
      Taro.showLoading()
      let onScrollUpper = new Promise((resolve, reject) => {
        onScrollToUpper && onScrollToUpper();
        resolve();
      })
      onScrollUpper.then(result => {
        setTimeout(function () {
          Taro.hideLoading()
        }, 1000);
      })
    } else {
      Taro.hideLoading()
    }
    this.startTop = undefined;
  }

  render() {
    const { onScrollToLower, className } = this.props
    const _onScrollToLower = e => {
      onScrollToLower && onScrollToLower(e)
    }
    const rootCls = className
    return (
      <ScrollView
        className={rootCls}
        scrollY
        scrollWithAnimation
        // onScrollToUpper={() => console.log('onScrollToUpper')}
        onScrollToLower={_onScrollToLower}
        onTouchStart={this.onTouchStart.bind(this)}
        onTouchMove={this.onTouchMove.bind(this)}
        onTouchEnd={this.onTouchEnd.bind(this)}
      >
        <View className="bz-scroll-view-content">
          {this.props.children}
        </View>
      </ScrollView>
    )
  }
}
