/*
 * @Author: MoCheng
 */
'use strict';
import React from 'react';
import './index.less';

import {
    connect
} from 'react-redux';
import Img from 'common/Img';
import {
  Form,
  Button,
  Input,
  Icon,
  Checkbox,
  message,
  Modal,
  Progress,
  Row,
  Col
} from 'antd';
import { Link } from 'react-router';
function mapStateToProps({
    common
}){
    return {
        userInfo: common.userInfo
    };
}
export class Account extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.resetState(props.userInfo);
    }
    resetState(userInfo) {
        return {
            userInfo: userInfo || {},
            progress_percent: 25
        }
    }
    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(nextProps.userInfo, this.props.userInfo)) {
           this.setState(this.resetState(nextProps.userInfo));
        }
    }
    componentDidMount() {
      let tips=document.getElementsByClassName("tips");
      let percent=this.state.progress_percent;
      if(percent>=35){
        if(percent>=65){
          tips[0].style.color="#87d068";
        }else{
          let text=document.getElementsByClassName("ant-progress-text");
          text[0].style.color="#30b9f5";
          tips[0].style.color="#30b9f5";
        }
      }else{
        tips[0].style.color="#f50";
      }
    }
    render=()=>{
      let userInfo=this.props.userInfo||{};
      let phone="";
      let password="";
      if(userInfo){
        phone=userInfo.isBind==1?userInfo.memberMobile.substring(0,3) + "****" + userInfo.memberMobile.substring(8,11) : "尚未绑定手机号码";
        password=userInfo.isSettingPwd==1?"******" : "尚未设置密码";
      }
      let percent=this.state.progress_percent;
      let status="active"//success exception active
      status=percent>=35?percent>=65?"success":"active":"exception";
      return (
        <div className="account-center-box">
          <div className="avatar-container">
              <h3>您的安全等级</h3>
              <div className="avatar-content">
                  <Progress type="circle" percent={this.state.progress_percent} status={status} format={(percent) =>{
                    return percent + '%'
                  }} />
              </div>
              <div className="tips">{percent>=35?percent>=65?"安全级别高，感觉棒棒哒":"安全级别中，支付需谨慎":"安全级别低，都是耍流氓"}</div>
          </div>
          <div className="userexinfo-form">
              <form >
                  <div className="userexinfo-form__section">
                    <Row>
                      <Col span={2}><i className="fa fa-exclamation-circle"></i></Col>{/*fa-exclamation-circle fa-check-circle*/}
                      <Col span={4}><span>登录密码</span></Col>
                      <Col span={6}><span>等级中</span></Col>
                      <Col span={6}><p>提升密码安全程度到强，获得成长值</p></Col>
                      <Col span={6}> <Button className="btn"><Link to="/personal_center">修改</Link></Button></Col>
                    </Row>
                  </div>
                  <div className="userexinfo-form__section">
                    <Row>
                      <Col span={2}><i className="fa fa-check-circle"></i></Col>
                      <Col span={4}><span>手机号</span></Col>
                      <Col span={6}><span>已设置</span></Col>
                      <Col span={6}><p>您验证的手机：186****8164</p></Col>
                      <Col span={6}><Button className="btn"><Link to="/personal_center"> 换绑</Link></Button></Col>
                    </Row>
                  </div>
                  <div className="userexinfo-form__section">
                    <Row>
                      <Col span={2}><i className="fa fa-exclamation-circle"></i></Col>
                      <Col span={4}><span>支付密码</span></Col>
                      <Col span={6}><span>未设置</span></Col>
                      <Col span={6}><p>保护账号安全，在余额支付时使用，现在设置赚取成长值</p></Col>
                      <Col span={6}><Button className="btn"><Link to="/personal_center"> 设置</Link></Button></Col>
                    </Row>
                  </div>
                  <div className="userexinfo-form__section">
                    <Row>
                      <Col span={2}><i className="fa fa-exclamation-circle"></i></Col>
                      <Col span={4}><span>邮箱</span></Col>
                      <Col span={6}><span>未设置</span></Col>
                      <Col span={6}><p>绑定邮箱，帮助您找回密码，现在设置赚取成长值</p></Col>
                      <Col span={6}><Button className="btn"><Link to="/personal_center"> 设置</Link></Button></Col>
                    </Row>
                  </div>
              </form>
          </div>
      </div>
      );
    }
}

export default connect(
    mapStateToProps
)(Account)