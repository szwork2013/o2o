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
  Button,
  Input,
  Icon,
  Checkbox,
  message,
  Modal,
  Upload,
  Row,
  Col
} from 'antd';
import {
    getMemberDetail
} from 'actions/SignPageAction';
import {getRealPath} from 'common/Img'
import {
  Link
} from 'react-router';
import PasswordBox from 'components/user/passwordBox/';
import PaypassBox from 'components/user/paypassBox/'
import Dialog from 'components/common/Dialog/';
import {
    retrieveToLoginpass,
    retrieveToPaypass
} from 'actions/UserAction';
import Cookie from "js-cookie";

function mapStateToProps({
    common
}){
    return {
        userInfo: common.userInfo
    };
}

export class index extends React.Component {
    static propTypes = {
        name: React.PropTypes.string,
    };

    constructor(props) {
        super(props);
        this.state = this.resetState(props.userInfo);
    }
    noop() {
        return false;
    }
    handleChange = (info) => {
        const userInfo = this.props.userInfo || {};
        if (info.file.status === 'done') {
            let file = info.file;
            if(file.response.result==1){
                message.success(`${info.file.name} 上传成功。`);
                this.props.dispatch(getMemberDetail({
                    "memberId": userInfo.memberId
                }));
            }else{
                message.error(`${info.file.name} 上传失败。`);
            }
        } else if (info.file.status === 'error') {
            message.error("上传超时，请重试。");
        }
    }

    beforeUpload = (file) => {
        console.log(file.type);
        let isBoolean = (file.type === 'image/jpeg') || (file.type === 'image/png') || (file.type === 'image/jpg') || (file.type === 'image/gif') || (file.type === 'image/bmp');
        if (!isBoolean) {
            message.error('文件格式不正确，只能上传 JPG/PNG文件哦！');
        }
        return isBoolean;
    }
    resetState(userInfo) {
        return {
            userInfo: userInfo || {},
            dailog_title:"",
            openRevicesPass:false,/*找回密码开启*/
            openRevicesPayPass:false,/*找回支付密码开启*/
            show_dialog:false,/*是否开启Dialog*/
            type2: "findpassword",/* 找回密码操作类型*/
            type: "findPaypassword"/* 找回支付密码操作类型*/
        }
    }
    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(nextProps.userInfo, this.props.userInfo)) {
           this.setState(this.resetState(nextProps.userInfo));
        }
    }
    componentWillMount = () => {
        console.log("componentWillMount");
        this.setState({
            userInfo: this.props.userInfo || {},
        })
    }
    setModalVisible=(modalVisible)=> {
        this.setState({
            show_dialog:modalVisible
        });
    }
    handleOnCancel=()=>{
      this.setModalVisible(false);
      this.setState({
          dailog_title:"",
          openRevicesPass:false,
          openRevicesPayPass:false
      });
    }
    revicesPassword=()=>{
        this.setState({
          dailog_title:"找回登录密码",
          openRevicesPass:true,
          show_dialog:true
        });
    }
    revicesPayPassword=()=>{
        this.setState({
          dailog_title:"找回支付密码",
          openRevicesPayPass:true,
          show_dialog:true
        });
    }
    handleRetrievePayPassword=(errors,values,callback)=>{//找回支付密码
        if (errors) {
          console.log('Retrieve-Paypassword-box表单验证错误!');
          return;
        }
        console.log('Retrieve-Paypassword-box表单验证成功');
        console.log(values);
        this.props.dispatch(retrieveToPaypass({
          "memberId": this.state.userInfo.memberId,
          "validateCode": values.Vcode,
          "newpassword": values.pass
        },(re)=> {
          if(re.result==1){
              message.success(re.msg);
              this.props.dispatch(getMemberDetail({
                "memberId": this.state.userInfo.memberId
              }));
              this.handleOnCancel();
              callback && callback(re);
            }else{
              message.error(re.msg);
              console.log(re.msg);
            }
          }
        )
      );
    }
    handleRetrievePassword=(errors,values,callback)=>{//找回登录密码
      let user_info = Cookie.getJSON('user_info') || undefined;
      console.log(user_info.password+','+user_info.user_id+","+user_info.username);
      if (errors) {
          console.log('Retrieve-password-box表单验证错误!');
          return;
      }
      console.log('Retrieve-password-box表单验证成功');
      console.log(values);
      this.props.dispatch(retrieveToLoginpass({
          "mobile": this.state.userInfo.memberMobile,
          "validateCode": values.Vcode,
          "newpassword": values.pass
        },(re)=> {
          if(re.result==1){
            Cookie.set('user_info', {
                username: user_info.username,
                password:  values.pass,
                user_id: user_info.user_id
            }, { expires: 7 });//cookie存储用户名密码
                message.success(re.msg);
                this.props.dispatch(getMemberDetail({
                    "memberId": this.state.userInfo.memberId
                }));
                this.handleOnCancel();
                callback && callback(re);
            }else{
              message.error(re.msg);
              console.log(re.msg);
            }
          }
        )
      );
    }
    render() {
        const userInfo = this.state.userInfo || {};
        let phone,password,paypass;
        if(userInfo){
            phone=(userInfo.isBind===1)?userInfo.memberMobile.substring(0,3) + "****" + userInfo.memberMobile.substring(8,11) : "尚未绑定手机号码";
            password=(userInfo.isSettingPwd===1)?"******" : "尚未设置密码";
            paypass=(userInfo.payPassword)?"******" : "尚未设置支付密码";
        }
        const props = { //上传请求
            action: '/rest/api/member/updateMemberFace',
            data:{
                memberId: userInfo.memberId
            },
            listType: 'text',
            onChange: this.handleChange,
            multiple: false,
            // fileList: this.state.fileList,
            name: "face",
            accept: "image/*",
            beforeUpload: this.beforeUpload,
    };
    return (
        <div className="personal-center-box">
            <div className="avatar-container">
                <h3>亲爱的{(userInfo.memberTruename?userInfo.memberTruename:userInfo.memberName)||"默认用户"}，来上传一张头像吧</h3>
                <div className="avatar-content">
                    <div className="img-wrap">
                        <Img isShow={true} src={userInfo.memberAvatar} />
                    </div>
                    <Upload {...props} className="upload-list-inline">
                      <Button disabled={!userInfo.memberId?true:false} type="ghost"  id="antBtn">
                        <Icon type="upload" /> 上传新头像
                      </Button>
                    </Upload>
                </div>
                <div className="tips">支持JPG，JPEG，GIF，PNG，BMP，<br/>且小于5M</div>
            </div>
            <div className="userexinfo-form">
                <div className="userexinfo-form__header">
                    <div className="section-div-1">
                        <span>账号：{userInfo.memberName}</span>
                        <span>性别：{userInfo.memberSex===1?"男":"女"}</span>
                    </div>
                    {/*<div className="section-div-1">
                        <span>生日：{userInfo.memberBirthday}</span>
                        <span>qq：{userInfo.memberQq}</span>
                    </div>*/}
                    <div className="section-div-2">
                        <span>已完成订单：{userInfo.finishOrder}</span>
                        <span>未支付订单：{userInfo.noPayOrder}</span>
                        <span>待发货订单：{userInfo.noFilledOrder}</span>
                        <span>待收货订单：{userInfo.noReceiveOrder}</span>
                    </div>
                </div>
                <Row className="userexinfo-form__section">
                    <Col span={4} >
                        <div className="userimg">
                            <i className="fa fa-user"></i>
                        </div>
                    </Col>
                    <Col span={6}>
                        姓名：
                    </Col>
                    <Col span={8} >
                        {userInfo.memberTruename}
                    </Col>
                </Row>
                <Row className="userexinfo-form__section">
                    <Col span={4} >
                        <div className="userimg">
                            <i className="fa fa-key"></i>
                        </div>
                    </Col>
                    <Col span={6}>
                        密码：
                    </Col>
                    <Col span={8} >
                        {password}
                    </Col>
                    {userInfo.isSettingPwd===1?
                        <Col span={6}>
                            <a href='javascript:void(0);' className="btn" onClick={this.revicesPassword}>忘记密码 ？ </a>
                        </Col>
                    :
                        undefined
                    }
                </Row>
                 <Row className="userexinfo-form__section">
                    <Col span={4} >
                        <div className="userimg">
                            <i className="fa fa-key"></i>
                        </div>
                    </Col>
                    <Col span={6}>
                        支付密码：
                    </Col>
                    <Col span={8} >
                        {paypass}
                    </Col>
                    {userInfo.payPassword?
                        <Col span={6}>
                            <a href='javascript:void(0);' className="btn" onClick={this.revicesPayPassword}>忘记支付密码 ？ </a>
                        </Col>
                    :
                        undefined
                    }
                </Row>
                <Row className="userexinfo-form__section">
                    <Col span={4}>
                        <div className="userimg">
                            <i className="fa fa-mobile-phone"></i>
                        </div>
                    </Col>
                    <Col span={6}>
                        手机号：
                    </Col>
                    <Col span={8} >
                        {phone}
                    </Col>
                    {/*<Button className="btn" onClick={this.changePhone}>更换</Button>*/}
                </Row>
                <Row className="userexinfo-form__section">
                    <Col  span={4} >
                        <div className="userimg">
                            <i className="fa fa-credit-card"></i>
                        </div>
                    </Col>
                    <Col span={6}>
                        我的钱包：
                    </Col>
                    <Col span={8} >
                        {userInfo.availablePredeposit}
                    </Col>
                   {/* <Col span={6} >
                        <a href='javascript:void(0);' className="btn" >余额不足 ？ </a>
                    </Col>*/}
                </Row>
                <div className="userexinfo-form__footer">
                    <span>收藏的店铺：{userInfo.favStoreCount}</span>
                    <span>收藏的商品：{userInfo.favGoodsCount}</span>
                   {/* <span>会员积分：{userInfo.memberConsumePoints}</span>*/}
                </div>
            </div>
            <Dialog
              visible={this.state.show_dialog}
              onCancel={this.handleOnCancel}
              title={this.state.dailog_title}
              footer={[
                  <Button key="back" type="ghost" size="large" onClick={this.handleOnCancel}>取消</Button>
              ]}
            >
              {this._dialogForm()}
            </Dialog>
        </div>
        );
    }
    _dialogForm=()=>{
        if(this.state.openRevicesPass){
           return (
                <PasswordBox info={this.state.userInfo} handleSubmit={this.handleRetrievePassword} type={this.state.type2}/>
           );
        }else if(this.state.openRevicesPayPass){
           return (
                <PaypassBox info={this.state.userInfo} handleSubmit={this.handleRetrievePayPassword} type={this.state.type}/>
           );
        }else{
            return false;
        }
    }
}

export default connect(
  mapStateToProps,
// Implement map dispatch to props
)(index)

