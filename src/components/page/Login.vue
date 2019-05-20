<template>
	<div class="login-wrap">
		<div class="ms-login">
			<div class="ms-title">后台管理系统</div>
			<el-form :model="ruleForm" :rules="rules" class="ms-content" label-width="0px" ref="ruleForm">
				<el-form-item prop="username">
					<el-input placeholder="username" v-model="ruleForm.username">
						<el-button icon="el-icon-lx-people" slot="prepend"></el-button>
					</el-input>
				</el-form-item>
				<el-form-item prop="password">
					<el-input @keyup.enter.native="submitForm('ruleForm')" placeholder="password" type="password"
					          v-model="ruleForm.password">
						<el-button icon="el-icon-lx-lock" slot="prepend"></el-button>
					</el-input>
				</el-form-item>
				<div class="login-btn">
					<el-button @click="submitForm('ruleForm')" type="primary">登录</el-button>
				</div>
			</el-form>
		</div>
	</div>
</template>

<script>
    export default {
        data: function () {
            return {
                ruleForm: {
                    username: '',
                    password: ''
                },
                rules: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.ruleForm.username == 'admin' && this.ruleForm.password == 'admin') {
                            sessionStorage.setItem('ADMIN', "管理员");
                            sessionStorage.setItem('userId', 0);
                            sessionStorage.setItem('userName', "科技新闻");
                            this.$router.push('/');
                        } else {
                            alert('用户名密码错误');
                        }
                    } else {
                        return false;
                    }
                });
            }
        }
    }
</script>

<style scoped>
	.login-wrap {
		position: relative;
		width: 100%;
		height: 100%;
		background-image: url(../../assets/img/login-bg.jpg);
		background-size: 100%;
	}
	
	.ms-title {
		width: 100%;
		line-height: 50px;
		text-align: center;
		font-size: 20px;
		color: #fff;
		border-bottom: 1px solid #ddd;
	}
	
	.ms-login {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 350px;
		margin: -190px 0 0 -175px;
		border-radius: 5px;
		background: rgba(255, 255, 255, 0.3);
		overflow: hidden;
	}
	
	.ms-content {
		padding: 30px 30px;
	}
	
	.login-btn {
		text-align: center;
	}
	
	.login-btn button {
		width: 100%;
		height: 36px;
		margin-bottom: 10px;
	}
	
	.login-tips {
		font-size: 12px;
		line-height: 30px;
		color: #fff;
	}
</style>
