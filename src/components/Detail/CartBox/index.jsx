/*
 * @Author: pengzhen
 * @Date:   2016-10-22 12:37:44
 * @Desc: this_is_desc
 * @Last Modified by:   pengzhen
 * @Last Modified time: 2016-10-22 23:40:48
 */

'use strict';
import './index.less';
import React from 'react';
import {
    connect
} from 'react-redux';
import NumInput from 'components/common/NumInput';

function mapStateToProps(state) {
    return {

    };
}

export class CartBox extends React.Component {
    static propTypes = {
        onChange: React.PropTypes.func,
        startPrice: React.PropTypes.number
    };
    static defaultProps = {
        onChange: function(){},
        startPrice: 0
    };
    constructor(props) {
        super(props);
        this.state = {
            open: true,
        };
    }
    toggleOpen=()=>{
        this.setState({
            open: !this.state.open
        });
    }
    clearCart=()=>{
        this.props.onChange({});
    }
    changeItem(id,num){
        const data = {...this.props.data};
        if(num){
            data[id].num = num;
        }else{
            delete data[id];
        }
        this.props.onChange(data);
    }
    parseData(){
        const data = this.props.data || {};
        let totalNum = 0 ,totalPrice = 0, orderList=[];
        Object.keys(data).forEach((id)=>{
            let { num,data:goods } = data[id];
            totalNum+=num;
            totalPrice+=(num*goods.goodsStorePrice);
            orderList.push(
                <div key={id} className='order-item'>
                    <span>
                        <div>{goods.goodsName}</div>
                    </span>
                    <span>
                        <NumInput value={num} onChange={this.changeItem.bind(this,id)} />
                    </span>
                    <span>￥{goods.goodsStorePrice}</span>
                </div>
            );
        });
        return {
            totalNum,
            totalPrice,
            orderList,
        }
    }
    render() {
        let { open } = this.state;
        const { startPrice } = this.props;
        const {
            totalNum,
            totalPrice,
            orderList,
        } = this.parseData();
        open = totalNum && open;
        return (
            <div className="cart-box">
                <div className={"order-box"+(open?' open':'')}>
                    <div className="notice">
                        <span className="fl">电脑下单不享优惠了哦，优惠活动手机专享~</span>
                    </div>
                    <div className="order-table">
                        <div className="title">
                            <span className="dishes">
                                菜品<a onClick={this.clearCart} className="clear-cart">[清空]</a>
                            </span>
                            <span className="count">份数</span>
                            <span className="price">价格</span>
                        </div>
                        {orderList}
                    </div>
                    <div className="total">
                        共<span className="totalnumber">{totalNum}</span>份，
                        总计<span className="bill">¥{totalPrice}</span>
                    </div>
                </div>
                <div className="btn-box">
                    <div className="icon" onClick={!!totalNum && this.toggleOpen}>
                        <i className="fa fa-shopping-cart"></i>
                    </div>
                    {!open && !!totalNum &&
                        <div className="count">{totalNum}份&nbsp;&nbsp;¥{totalPrice}</div>}
                    {totalPrice >= startPrice?
                        <button className="submit">去下单</button>:
                        <button disabled className="submit">
                            还差{startPrice-totalPrice}元起送
                        </button>
                    }
                </div>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    // Implement map dispatch to props
)(CartBox)
