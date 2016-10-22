'use strict';
import './index.less';
import React from 'react';
import {
    connect
} from 'react-redux';
import Img from 'common/Img';
import * as actions from 'actions/DetailAction';
import { Rate,Tooltip ,Tabs,Radio,Checkbox} from 'antd';


const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;

function mapStateToProps({
    detailState
}) {
    return {
         ...detailState
    };
}

export class Detail extends React.Component {
    static propTypes = {
        name: React.PropTypes.string,
    };

    constructor(props) {
        super(props);
    }

    componentWillMount=()=>{
        this.props.dispatch
            (actions.getStoreDetail({storeId:'0599e1042d824937aac1997ae0187976'}));

        this.props.dispatch
            (actions.getClassAndGoodsList({storeId:'0599e1042d824937aac1997ae0187976'}));
    }

    renderTooltipTitle=(type,level,num1,num2)=>{
        if(type=='time'){
            return(
                <div>
                    <div className="top-text">
                        餐厅大约在<span>{num1}</span>分钟之内将美食送达
                    </div>
                    <div className="contrast">
                        <i className="fa fa-arrow-up"></i>
                        {level?'快于':'慢于'}周边<span>{num2}</span>%的餐厅
                    </div>
                </div>
            )
        }else if(type=='promptness'){
            return(
                <div>
                    <div className="top-text">
                        <span>{num1}</span>的订单会在45分钟内送达
                    </div>
                    <div className="contrast">
                        <i className="fa fa-arrow-up"></i>
                        {level?'高于':'低于'}周边<span>{num2}</span>%的餐厅
                    </div>
                </div>
            )
        }
    }
    
    tabsChange = (key)=>{
        if(key==2){
            this.props.dispatch(actions.getStoreEvaluatList({storeId:'0599e1042d824937aac1997ae0187976'}));
        }
        console.log(key);
    }
    menuClick = (key)=>{
        console.log(key);
    }
    render() {
        let data = this.props.storeDetail ||{};
        let categoryList = [];
        let classList = this.props.classAndGoodsList.map((item,i)=>{
                        categoryList.push(
                            <Category 
                                key={i}
                                data={item.goodsList}
                                title={item.stcName} 
                                showFilter={i==0}>
                            </Category>
                        );
                            return(
                                    <div
                                        key={i}
                                        className="menu-item" 
                                        onClick={()=>this.menuClick(item.stcId)}
                                    >
                                        {item.stcName}
                                    </div>
                                )
                        })
        return (
            <div className="detail-body">
               <div className="business-top">
                    <div className="content-box">
                        <div className="left-box">
                            <Img className="business-logo" src={data.storeLogo} />
                            <div className="business-box">
                                <div className="business-name">
                                    {data.storeName}
                                    <i className="fa fa-caret-down hide"></i>
                                </div>
                                <Rate value={data.storeScore} /> {data.storeScore}
                                <div className="option">
                                    <span>{data.startPrice+'元起送'}</span>
                                    <span>{data.expressFee+'元配送费'}</span>
                                    <span>{data.shippingMethod=='1'?'由平台费送':'由商家配送'}</span>
                                </div>
                            </div>
                            <div className="buttom-info">
                                <div>{'商家地址：'+data.storeAddress}</div>
                                <div>{'商家电话：'+data.storeTel}</div>
                                <div>
                                    {'营业时间：'+data.startBusinessTime+'-'+data.endBusinessTime}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="right-box">
                        <div className="rate-box">
                            <div className="rate"><span>{data.storeScore}</span>分</div>
                            <div className="rate-text">商家评分</div>
                        </div>
                        <div className="commas"></div>
                        <Tooltip 
                            title={this.renderTooltipTitle('time',true,36,21)} 
                            placement="bottom"
                        >
                            <div className="rate-box">
                                <div className="rate">
                                    <span>{data.storeDeliverycredit||0}</span>分钟
                                </div>
                                <i className="fa fa-caret-down turn"></i>
                                <div className="rate-text">平均送餐时间</div>
                            </div>
                        </Tooltip>
                        <div className="commas"></div>
                        <Tooltip 
                            title={this.renderTooltipTitle('promptness',true,91,36)} 
                            placement="bottom"
                        >
                            <div className="rate-box">
                                <div className="rate"><span>91</span>%</div>
                                <i className="fa fa-caret-down turn"></i>
                                <div className="rate-text">及时送餐率</div>
                            </div>
                        </Tooltip>
                    </div>
                    <div className="fold-3d"></div>
                    <div className="collection">
                        {
                            data.isStoreCollect>1?
                                <i className="fa fa-heart is-conllect"></i>:
                                <i className="fa fa-heart-o"></i>
                        }
                        <span>收藏</span>
                        <div className="collection-num">{(`${data.storeCollect}`)}</div>
                    </div>
               </div>
               <div className="cate-tab">
                <Tabs defaultActiveKey="1" onChange={this.tabsChange}>
                    <TabPane tab="菜单" key="1">
                       {classList}

                    </TabPane>
                    <TabPane tab="评价" key="2">
                        <RatedBox evaluatList={this.props.evaluatList}></RatedBox>
                    </TabPane>
                    <TabPane tab="餐厅资质" key="3">
                        <div className="aptitude">
                            <div className="aptitude-item">
                                <div className="aptitude-title">营业执照</div>
                                <img src='http://p1.meituan.net/xianfu/0936e7e3c04b7e873d14a8edd365743b61440.jpg'></img>
                            </div>
                            <div className="aptitude-item">
                                <div className="aptitude-title">餐饮服务许可证</div>
                                <img src='http://p1.meituan.net/xianfu/18b999daee540d21de9ed40c92a94913184320.jpg'></img>
                            </div>
                        </div>
                    </TabPane>
                </Tabs>
               </div>
               {categoryList}
            </div>
        );
    }
}


/**
 * 评价
 */
export class RatedBox extends React.Component {
    static propTypes = {
        name: React.PropTypes.string,
    };

    constructor(props) {
        super(props);
        this.state = {
            value:1
        }
    }

    filterChange=(e)=>{
        this.setState({
            value:e.target.value
        });
    }

    handleCheck = (e)=>{
        console.log(`checked = ${e.target.checked}`);
    }

    render(){
        return(
            <div className="rated-box">
                <div className="rate-filter">
                    <div className="filter-item">
                        <RadioGroup onChange={this.filterChange} value={this.state.value}>
                            <Radio key="a" value={1}>全部评价<span>(726)</span></Radio>
                            <Radio key="b" value={2}>好评<span>(726)</span></Radio>
                            <Radio key="c" value={3}>中评<span>(726)</span></Radio>
                            <Radio key="d" value={4}>差评<span>(726)</span></Radio>
                        </RadioGroup>
                        <div className="have-content">
                            <Checkbox onChange={this.handleCheck}>有内容的评价</Checkbox>
                        </div>
                    </div>
                </div>
                <div className="content-box">
                    <RateItem></RateItem>
                    <RateItem></RateItem>
                    <RateItem></RateItem>
                    <RateItem></RateItem>
                    <RateItem></RateItem>
                    <RateItem></RateItem>
                    <RateItem></RateItem>

                </div>
            </div>

        )
    }
}

/**
 * 评价Item
 */
export class RateItem extends React.Component {
    static propTypes = {
        name: React.PropTypes.string,
    };

    constructor(props) {
        super(props);
        
    }

    

    render(){
        return(
            <div className="rate-item">
                <div className="rate-info">
                    <span className="user-name">U***8</span>
                    <span className="all-rate">总体评价:</span>
                    <Rate value={4} /> 
                    <span className="feel">好评</span>
                    <span className="rate-time">
                        评价时间
                        <span>2016-10-07</span>
                    </span>
                </div>
                <div className="user-reply">
                    下了订单，没任何异常，等了半个小时，竟然突然打电话问我，还要不要送？
                </div>
            </div>
        )
    }
}

export class CategoryFilter extends React.Component {
    static propTypes = {
        name: React.PropTypes.string,
    };

    constructor(props) {
        super(props);
        
    }
    render(){
        return(
            <div className="category-title">
                <div className="tag-name">{this.props.categoryName}</div>
                <div className="category-filter">
                    <div className="category-all">
                        全部分类
                    </div>
                    <button className="category-btn category-active">
                        默认排序 
                    </button>
                    <button className="category-btn sale">
                        销量
                        <i className="fa fa-long-arrow-up"></i>
                    </button>
                    <button className="category-btn sale">
                        价格
                        <i className="fa fa-long-arrow-down"></i>
                    </button>
                </div>
            </div>
        )
    }
}

/**
 * 菜单列表
 */
export class Category extends React.Component {
    static propTypes = {
        name: React.PropTypes.string,
    };

    constructor(props) {
        super(props);
        
    }

    componentWillMount=()=>{
        
    }

    render(){
        return(
            <div className="category">
                <div className="category-title">
                    <div className="tag-name">{this.props.title}</div>
                    {
                        this.props.showFilter?(
                            <CategoryFilter title=''></CategoryFilter>):undefined
                    }
                </div>
                <div className="category-content clearfix">
                    
                    {
                        this.props.data.map((item,i)=>{
                            return(
                                <CategoryItem data={item} key={i}></CategoryItem>
                            )
                        })
                    }

                </div>
            </div>
        )
    }
}

/**
 * 菜单Item
 */
export class CategoryItem extends React.Component {
    static propTypes = {
        name: React.PropTypes.string,
    };

    constructor(props) {
        super(props);
        
    }

    

    render(){
        let {data} = this.props;
        return(
            <div className="category-box">
                <div className="avatar">
                    <img className='category-img'
                     src="http://p1.meituan.net/210.0/xianfu/d23d1e28afb2b1a6cdb63b3d978e3486167936.jpg" />
                    <div className="description">    销量冠军，招牌馅料，汁多味美，食指大动。豆角具有益气生津功效。
                    </div>
                </div>
                <div className="categroy-name">{data.goodsName}</div>
                <div className="sale-info clearfix">
                    <div className="sold-count">月售315份</div>
                    <div className="zan-count">
                        <i className="fa fa-thumbs-o-up"></i>
                       { `(${data.praise})`}
                    </div>
                </div>
                <div className="labels clearfix">
                    <div className="price">{'￥'+data.goodsStorePrice+data.unitName}</div>
                    <div className="add">
                        <i className="fa fa-plus"></i>
                    </div>
                </div>
            </div>
        )
    }
}


export default connect(
    mapStateToProps,
)(Detail)
