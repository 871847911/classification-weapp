import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import styles from './style.module.less'
import { PulldownRefresh } from '@components/Widgets/BZScrollView'
import { LoadingData, EmptyData } from '@components/Widgets/ExtPage'
import { queryRefuseClassPageByType } from '@actions/common'
interface PageOwnProps { }
export default class More extends Component<PageOwnProps, any> {
  constructor(props: PageOwnProps) {
    super(props);
    this.state = {
      dataSource: [],
      pageNum: 1,
      maxPage: 0
    };
  }
  config: Config = {
    navigationBarTitleText: '更多',
  }

  componentWillReceiveProps(nextProps: any) {
    console.log(this.props, nextProps)
  }
  componentDidMount() {
    this.load()
  }
  load = (query: any = {}) => {
    console.log(query);
    const { type } = this.$router.params
    // Taro.showLoading({ title: '加载中...' })
    const { pageNum, dataSource, maxPage } = this.state;
    if (pageNum !== 1 && pageNum >= maxPage) {
      this.setState({ loading: false });
      return;
    }
    let newPageNum = pageNum + 1
    this.setState({ loading: true });
    const params = {
      limit: 100,
      page: query.pageNum || newPageNum || 1,
      params: {
        type: type,
      }
    }
    queryRefuseClassPageByType(params).then((data: any) => {
      if (data.msg !== 'success') {
        Taro.showToast({ title: data.msg, icon: 'none' });
        return
      }
      Taro.hideLoading()
      const { pages, records } = data.page
      this.setState({
        dataSource: pageNum == 1 ? records : [...dataSource, ...records],
        maxPage: pages,
        pageNum: newPageNum
      })
    })
  }

  componentWillUnmount() { }

  componentDidShow() {
  }

  componentDidHide() {

  }
  render() {
    const { dataSource, loading } = this.state
    return (
      <View className='qw-page'>
        {/* <View className='qw-page-main'> */}
        {
          dataSource.length ? (
            <PulldownRefresh
              scrollY
              className={styles.msgList}
              scrollWithAnimation
              onScrollToUpper={this.load.bind(this, { pageNum: 1 })}
              onScrollToLower={this.load.bind(this)}>
              <View className={styles.More}>
                <View className={styles.listBox}>
                  {
                    dataSource && dataSource.map((item: any, index: any) => (
                      <View key={item.name} className={styles.itemBox}>
                        <View className={styles.text}>{item.lName}</View>
                      </View>
                    ))
                  }
                </View>
              </View>
              <View className="pagination-message">
                {loading ? (
                  '～上拉显示更多哦～'
                ) : (
                    '～已显示全部啦～'
                  )}
              </View>
            </PulldownRefresh>) : ''}
        {/* {loading ? <LoadingData /> : <EmptyData />} */}
      </View>
      // </View>
    )
  }
}

