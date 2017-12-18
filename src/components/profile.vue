<template>
<div class="profile">
    <form action="">
        <div class="profile-header">
            <div class="username">Elian_爽爽</div>
            <div class="email">elian_ying@163.com</div>
        </div>
        <div class="profile-body">
            <div class="form-content clearfix">
                <div class="col-xs-12 col-md-5 col-lg-4 register-info">
                    <h1 class="title">{{$t('profile.registerInfo')}}</h1>
                    <div class="content">
                        <div class="form-group">
                            <label class="label-control">{{$t('profile.name')}}：</label>
                            <input type="text" class="form-control" name="name">
                        </div>
                        <div class="form-group">
                            <label class="label-control">{{$t('profile.phone')}}：</label>
                            <input type="text" class="form-control" name="phone">
                        </div>
                        <div class="form-group">
                            <label class="label-control">QQ：</label>
                            <input type="text" class="form-control" name="qq">
                        </div>
                        <div class="form-group">
                            <label class="label-control">{{$t('profile.address')}}：</label>
                            <input type="text" class="form-control" name="address">
                        </div>
                    </div>
                </div>
                <div class="col-xs-12 col-md-5 col-lg-4 password-info">
                    <h1 class="title">{{$t('profile.passwordModify')}}</h1>
                     <div class="content">
                        <div class="form-group">
                            <label class="label-control">{{$t('profile.oldpwd')}}：</label>
                            <input type="password" class="form-control" name="oldpwd">
                        </div>
                        <div class="form-group">
                            <label class="label-control">{{$t('profile.newpwd')}}：</label>
                            <input type="password" class="form-control" name="newpwd">
                        </div>
                        <div class="form-group">
                            <label class="label-control">{{$t('profile.chkpwd')}}：</label>
                            <input type="password" class="form-control" name="checkpwd">
                        </div>
                    </div>
                </div>
            </div>
            <div class="button-content col-md-offset-3 col-sm-offset-3">
                <button type="reset" class="btn btn-fff">{{$t('button.cancel')}}</button>
                <button type="button" class="btn btn-orange">{{$t('button.ok')}}</button>
            </div>
        </div>
    </form>
</div>
</template>

<script>
export default {
    
}
</script>

<style lang="scss">
.profile{
    padding: 15px 0;
    margin: 0 15px;
    .profile-header{
        padding-bottom: 15px;
        font-size: 0;
        border-bottom: 1px dashed #ccc;
        .username, .email{
            display: inline-block;
            vertical-align: bottom;
            font-size: 30px;
            @media (max-width: 768px) {
                font-size: 16px;
                font-weight: 600px;
            }
        }
        .username{
            margin-right: 30px;
            &::after{
                display: inline-block;
                content: '';
                height: 35px;
                margin-left: 30px;     
                vertical-align: bottom;           
                border-right: 2px solid #646464;
                @media (max-width: 768px) {
                    height: 18px;
                }
            }
        }
    }
    .profile-body{
        margin-top: 40px;
        .form-content{
            margin: 15px 0;
            font-size: 0;
            >div[class$="-info"]{
                position: relative;
                display: inline-block;
                min-height: 250px;
                padding: 30px 15px 20px;
                border: 1px solid #ccc;
                border-radius: 4px;
                vertical-align: bottom;
                .title{
                    position: absolute;
                    top: -8px;
                    left: 15px;
                    padding: 0 5px;
                    font-size: 16px;
                    font-weight: 600;
                    background-color: #fff;
                }
                .content{
                    .form-group{
                        font-size: 0;
                        margin-bottom: 15px;
                        .label-control{
                            display: inline-block;
                            width: 70px;
                            font-size: 14px;
                            font-weight: 400;
                            vertical-align: bottom;
                            @media (max-width: 768px) {
                                display: block;
                            }
                        }
                        .form-control{
                            display: inline-block;
                            width: 280px;
                            width: -webkit-calc(100% - 80px);
                            width: -moz-calc(100% - 80px);
                            width: -ms-calc(100% - 80px);
                            width: calc(100% - 80px);
                            font-size: 14px;
                            vertical-align: bottom;
                            @media (max-width: 768px) {
                                display: block;
                                width: 100%;
                            }
                        }
                    }
                }
                @media (min-width: 1650px) {
                    width: 30%;
                }
            }
            .register-info{
                margin-right: 30px;
                 @media (max-width: 990px) {
                    margin-right: 0;
                    margin-bottom: 30px;
                }
            }
            .password-info .form-group{
                @media (min-width: 769px) {
                    margin: 20px 0;
                }
            }
        }
        .button-content{
            margin-top: 50px;
            :first-child{
                margin-right: 60px;
            }
        }
    }
}
</style>