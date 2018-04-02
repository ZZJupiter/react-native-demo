import React, {Component} from 'react'
import {
    TabNavigator,
    StackNavigator
} from 'react-navigation';
import {
    StyleSheet,
    ListView,
    View,
    Text,
    TouchableOpacity,
    Dimensions,
} from 'react-native'
import {MapView} from 'react-native-amap3d'
import {RefreshControl} from 'react-native';


const styles = StyleSheet.create({
    body: {
        flex: 1,
    },
    buttons: {
        width: Dimensions.get('window').width,
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    button: {
        padding: 10,
        paddingLeft: 20,
        paddingRight: 20,
        margin: 10,
        borderRadius: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    text: {
        fontSize: 16,
    },
})

//线路列表组件
class LineHomeComponent extends Component {
    static navigationOptions = {
        title: '线路列表',
    }

    // 初始化模拟数据
    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            isLoadingTail: false,
            isRefreshing: false,
            isNoMoreData: false,
            pageNum:1,
            dataSource: ds.cloneWithRows([]),
            loaded: false,
        };
        this._showData = this._showData.bind(this);
        this._endReached = this._endReached.bind(this);
        this._renderFooter = this._renderFooter.bind(this);
        this._getMoviesFromApiAsync = this._getMoviesFromApiAsync.bind(this);
    }


    componentDidMount() {
        //组件加载完成，开始加载网络数据
        this._getMoviesFromApiAsync(this._showData);
    }

    _showData(response) {
        console.warn(response);
        this.setState({
            dataSource: this.state.dataSource.concat(response.result.records),
            loaded: true,
        })
    }


    _endReached() {
        if(this.state.isRefreshing){
            return;
        }
        this.setState({
            pageNum:this.state.pageNum +1,
            isRefreshing:true
        });
        this._getMoviesFromApiAsync(this._showData);
    }

    _renderFooter() {

    }

    _onRefresh() {


    }

    _getMoviesFromApiAsync(callBak) {
        return fetch('http://115.159.159.126:7001/line/list', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: 1,
                lineName: null,
                startCityName: null,
                endCityName: null,
                currentPage: this.state.pageNum,
                pageSize: 10
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                console.warn(responseJson);
                this.setState({
                    isRefreshing:false
                });
                callBak(responseJson);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    render() {
        const {navigate} = this.props.navigation;

        return (
            <View>
                <ListView style={{backgroundColor: '#e3e3e3'}}
                          enableEmptySections={true}
                          dataSource={this.state.dataSource}
                          renderRow={(rowData) =>
                              <TouchableOpacity onPress={(data) => {
                                  navigate('LineMap');
                              }}
                              >
                                  <View style={{
                                      height: 81,
                                      backgroundColor: '#fff',
                                      borderRadius: 8,
                                      marginBottom: 2,
                                  }}>
                                      <Text
                                          style={{
                                              height: 40,
                                              paddingLeft: 10,
                                              fontSize: 15,
                                              textAlignVertical: 'center'
                                          }}
                                      >
                                          线路：{rowData.lineName}
                                      </Text>
                                      <Text
                                          style={{
                                              height: 40,
                                              paddingLeft: 10,
                                              fontSize: 15,
                                              marginBottom: 1,
                                              textAlignVertical: 'center'

                                          }}>
                                          {rowData.startCityName}-->{rowData.endCityName}
                                      </Text>
                                  </View>

                              </TouchableOpacity>
                          }
                          renderFooter={() => this._renderFooter()}
                          onEndReached={() => this._endReached()}
                          onEndReachedThreshold={20}
                          refreshControl={
                              <RefreshControl
                                  refreshing={this.state.isRefreshing}
                                  onRefresh={() => this._onRefresh()}/>
                          }
                />
            </View>
        );
    }
}

//线路图
class LineMap extends React.Component {
    static navigationOptions = {
        title: '线路图',
    }

    _animatedToZGC = () => {
        this.mapView.animateTo({
            tilt: 45,
            rotation: 90,
            zoomLevel: 18,
            coordinate: {
                latitude: 39.97837,
                longitude: 116.31363,
            },
        })
    }

    _animatedToTAM = () => {
        this.mapView.animateTo({
            tilt: 0,
            rotation: 0,
            zoomLevel: 16,
            coordinate: {
                latitude: 39.90864,
                longitude: 116.39745,
            },
        })
    }

    render() {
        return (
            <View style={styles.body}>
                <MapView ref={ref => this.mapView = ref} style={styles.body}/>
                <View style={styles.buttons}>
                    <View style={styles.button}>
                        <TouchableOpacity onPress={this._animatedToZGC}>
                            <Text style={styles.text}>中关村</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.button}>
                        <TouchableOpacity onPress={this._animatedToTAM}>
                            <Text style={styles.text}>天安门</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}

class SettingsScreen extends React.Component {
    static navigationOptions = {
        title: '线路',
    }

    render() {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text>Settings!</Text>
            </View>
        );
    }
}

class MyHome extends React.Component {
    static navigationOptions = {
        title: '我的首页',
    }

    render() {
        const {navigate} = this.props.navigation;
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <TouchableOpacity onPress={(data) => {
                    navigate('MyDetail', {user: 'Lucy'});
                }}
                >
                    <Text style={{width: 100, height: 100, fontSize: 32}}>我的首页!</Text>
                </TouchableOpacity>
            </View>

        );
    }
}

class MyDetail extends React.Component {
    static navigationOptions = {
        title: '我的详情',
    }

    render() {
        const {params} = this.props.navigation.state;
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text>我的详情!{params.user}</Text>
            </View>
        );
    }
}


const LineStack = StackNavigator({
    LineHome: {screen: LineHomeComponent},
    LineMap: {screen: LineMap},
}, {
    // headerMode:'none',
    mode: 'modal',
    navigationOptions: {
        gesturesEnabled: false,

        headerStyle: {
            height: 45,
            backgroundColor: '#2B97EF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontSize: 13,
        }
    }
});

const MyStack = StackNavigator({
    MyHome: {screen: MyHome},
    MyDetail: {screen: MyDetail},
}, {
    // headerMode:'none',
    mode: 'modal',
    navigationOptions: {
        gesturesEnabled: false,

        headerStyle: {
            height: 45,
            backgroundColor: '#2B97EF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontSize: 14,
        }
    }
});

export default TabNavigator(
    {
        LineStack: {screen: LineStack},
        MyStack: {screen: MyStack},
        // Hidden:{screen:HiddenPage,hidden:true}
    },
    {
        animationEnabled: false, // 切换页面时是否有动画效果
        tabBarPosition: 'bottom', // 显示在底端，android 默认是显示在页面顶端的
        swipeEnabled: false, // 是否可以左右滑动切换tab
        backBehavior: 'none', // 按 back 键是否跳转到第一个Tab(首页)， none 为不跳转
        tabBarOptions: {
            // activeTintColor: '#030102', // 文字和图片选中颜色
            // inactiveTintColor: '#FCFCFC', // 文字和图片未选中颜色
            // showIcon: true, // android 默认不显示 icon, 需要设置为 true 才会显示
            indicatorStyle: {
                height: 0  // 如TabBar下面显示有一条线，可以设高度为0后隐藏
            },
            style: {
                backgroundColor: '#2B97EF', // TabBar 背景色
            },
            labelStyle: {
                fontSize: 14,
                fontWeight: 'bold'
            },
        },
    }
);
