<template>
	<el-container style="margin: 30px 60px">
		<el-header>
			<h2>{{post.title}}</h2>
			<div style="text-align: right">
				<span>{{ post.userName }} </span>
				发表于
				{{post.createTime}}
			</div>
		</el-header>
		<el-main>
			<div class="content" v-html="post.content"></div>
		</el-main>
		<!-- 审批提示框 -->
		<el-dialog :visible.sync="approvalVisible" center title="审核" width="500px">
			审核原因:
			<el-input :autosize="{ minRows: 2}"
			          placeholder="请输入内容"
			          type="textarea"
			          v-model="reason">
			</el-input>
			<span class="dialog-footer" slot="footer">
                <el-button @click="approvalVisible = false">取 消</el-button>
                <el-button @click="noPassRow" type="danger">不 通 过</el-button>
                <el-button @click="passRow" type="primary">通 过</el-button>
            </span>
		</el-dialog>
		<el-footer>
			<el-button @click="approvalVisible = true" icon="el-icon-edit" type="primary"
			           v-if="post.state == 0">审核
			</el-button>
		</el-footer>
	</el-container>
</template>

<script>

    export default {
        components: {},
        data() {
            return {
                post: '',
                reason: '',
                approvalVisible: false,
                loading: true
            }
        },
        created() {
            this.axiosProxy.getPostById({'id': this.$route.query.postId}).then(response => {
                this.post = response.data;
            });
        },
        methods: {
            noPassRow() {
                this.approval(-1);
                this.approvalVisible = false;
            },
            passRow() {
                this.approval(1);
                this.approvalVisible = false;
            },
            approval(flag) {
                let queryParams = {
                    postId: this.post.postId,
                    reason: this.reason,
                    state: flag
                };
                this.axiosProxy.updatePost(queryParams).then(response => {
                    if (!response.data) {
                        this.$message.success('审核失败');
                    } else {
                        this.$message.success('审核成功');
                        this.post.state = flag;
                    }
                });
            }
        },
        watch: {
            '$route'(to, from) {
                this.axiosProxy.getPostById({'id': this.$route.query.postId}).then(response => {
                    this.post = response.data;
                });
            }
        }
    };
</script>

<style scoped>
	h1, h2 {
		font-weight: normal;
	}
	
	ul {
		list-style-type: none;
		padding: 0;
	}
	
	li {
		display: inline-block;
		margin: 0 10px;
	}
	
	a {
		color: inherit;
		text-decoration: none;
	}
	
	.author {
		color: gray;
	}
	
	.content {
		white-space: pre-wrap;
		background-color: #ffffff;
		border: 1px;
		line-height: 25px;
		font-size: 14px;
		padding: 30px;
	}


</style>
<style>
	frame {
		width: 800px;
		height: 600px;
		margin: 0 auto;
	}
	
	img {
		max-width: 100%;
	}
</style>
