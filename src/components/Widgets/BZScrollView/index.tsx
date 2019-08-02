import Taro, { Component } from '@tarojs/taro';
import { View, ScrollView, Text } from '@tarojs/components';
import './style.less'

type PageOwnProps = {}
type PageState = {}

export default class BZScrollView extends Component<PageOwnProps, PageState>{
  startX = 0;
  startY = 0;
  preY = 0;  // 上次移动的距离
  isMoveDown = false;  // 是否在下拉
  startTop = 0;
  downHight = 0;
  constructor(props: PageOwnProps) {
    super(props)
    this.state = {
      headerStyle: { //下拉刷新的样式
        height: 0 + 'px'
      },
      headerText: '下拉刷新',
      footerStyle: { //上拉图标样式
        height: 0 + 'px'
      },
      footerText: '上拉加载更多',
      startPoint: {},
      // scrollY: true,
      refreshStatus: 0 //刷新状态 0不做操作 1刷新 -1加载更多
    }
  }

  componentDidMount() { }

  onTouchStart = (e) => {
    let self = this;
    self.setState({
      startPoint: e.touches[0]
    })
  }

  onTouchMove = (e) => {
    let movePoint = e.touches[0], //移动时的位置
      deviationX = 0.30, //左右偏移量(超过这个偏移量不执行下拉操作)
      deviationY = 40, //拉动长度（低于这个值的时候不执行）
      maxY = 50; //拉动的最大高度

    let startPointX = this.state.startPoint.clientX,
      startPointY = this.state.startPoint.clientY,
      movePointX = movePoint.clientX,
      movePointY = movePoint.clientY;
    //得到偏移数值
    let offset = Math.abs(movePointX - startPointX) / Math.abs(movePointY - startPointY);
    if (offset < deviationX) { //当偏移数值大于设置的偏移数值时则不执行操作
      let dragRatio = Math.abs(movePointY - startPointY) / 3.5; //拖动倍率（使拖动的时候有粘滞的感觉--试了很多次 这个倍率刚好）
      if (movePointY - startPointY > 0) { //下拉操作
        if (dragRatio >= deviationY) {
          this.setState({
            refreshStatus: 1,
            headerText: '释放刷新'
          });
        } else {
          this.setState({
            refreshStatus: 0,
            headerText: '下拉刷新'
          });
        }
        if (dragRatio >= maxY) {
          dragRatio = maxY;
        }
        this.setState({
          headerStyle: {
            height: dragRatio + 'px'
          },
          scrollY: false //拖动的时候禁用
        });
      }
      if (startPointY - movePointY > 0) { //上拉操作
        if (dragRatio >= deviationY) {
          this.setState({
            refreshStatus: -1,
            footerText: '释放加载更多'
          });
        } else {
          this.setState({
            refreshStatus: 0,
            footerText: '上拉加载更多'
          })
        }
        if (dragRatio >= maxY) {
          dragRatio = maxY
        }
        this.setState({
          footerStyle: {
            height: dragRatio + 'px'
          },
          scrollY: false //拖动的时候禁用
        })
      }
    }
  }

  onTouchEnd = (e) => {
    let self = this;
    const {
      onScrollToUpper,
      onScrollToLower
    } = this.props
    if (this.state.refreshStatus === 1) {
      let onScrollUpper = new Promise((resolve, reject) => {
        onScrollToUpper && onScrollToUpper();
        resolve();
      })
      onScrollUpper.then(result => {
        let date = new Date();
        let value = "最后更新时间 今天";
        value += date.getHours() + ':' + date.getMinutes();
        this.setState({
          headerText: value
        })
        setTimeout(function () {
          self.reduction()
        }, 1000);
      })
    } else if (this.state.refreshStatus === -1) {
      let onScrollLower = new Promise((resolve, reject) => {
        onScrollToLower && onScrollToLower();
        resolve();
      })
      onScrollLower.then(result => {
        this.reduction()
      })
    } else {
      self.reduction()
    }
  }

  reduction = (e) => { //还原初始设置
    // return;
    const time = 0.5;
    this.setState({
      footerStyle: { //上拉图标样式
        height: 0 + 'px',
        transition: `all ${time}s`
      },
      refreshStatus: 0,
      headerStyle: {
        height: 0 + 'px',
        transition: `all ${time}s`
      },
      scrollY: true
    })
    setTimeout(() => {
      this.setState({
        footerStyle: { //上拉图标样式
          height: 0 + 'px'
        },
        footerText: '上拉加载更多',
        headerText: '下拉刷新'
      })
    }, time * 1000);
  }

  render() {
    let { headerStyle, headerText, footerStyle, footerText } = this.state;
    return (
      <ScrollView
        className="bz-scroll-view pull-down-refresh-loading"
        scrollY
        scrollWithAnimation
        // onScrollToUpper={() => console.log('onScrollToUpper')}
        // onScrollToLower={() => console.log('onScrollToLower')}
        onTouchStart={this.onTouchStart.bind(this)}
        onTouchMove={this.onTouchMove.bind(this)}
        onTouchEnd={this.onTouchEnd.bind(this)}
      >
        {/* <View className="pull-down-content">
          <View className="ball-beat">
            <View className="dot" />
            <View className="dot" />
            <View className="dot" />
          </View>
        </View> */}
        <View className="scroll-header-view" style={headerStyle}>
          <Text className='scroll-header-text'>{headerText}</Text>
        </View>
        <View className="bz-scroll-view-content">
          {this.props.children}
        </View>
        <View className="scroll-footer-view" style={footerStyle}>
          <Text className='headerText'> {footerText} </Text>
        </View>
      </ScrollView>
    )
  }
}
