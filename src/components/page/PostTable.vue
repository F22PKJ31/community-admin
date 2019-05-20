<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 帖子管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                状态:
                <el-select class="handle-select mr10" placeholder="状态" v-model="selectState">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="未审核" value="0"></el-option>
                    <el-option label="已通过" value="1"></el-option>
                    <el-option label="不通过" value="-1"></el-option>
                </el-select>
                <el-input class="handle-input mr10" placeholder="筛选作者" v-model="selectUser"></el-input>
                <el-input class="handle-input mr10" placeholder="筛选帖子" v-model="selectPost"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </div>
            <el-table :data="data" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column prop="postId" v-if="false"/>
                <el-table-column prop="userId" v-if="false"/>
                <el-table-column label="帖子题目" prop="title">
                </el-table-column>
                <el-table-column label="作者" prop="userName">
                </el-table-column>
                <el-table-column label="内容" prop="content">
                </el-table-column>
                <el-table-column label="创建时间" prop="createTime">
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-tag type="info" v-if="scope.row.state === 0">未审核</el-tag>
                        <el-tag type="success" v-else-if="scope.row.state === 1">已通过</el-tag>
                        <el-tag type="danger" v-else>不通过</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="原因" prop="reason">
                </el-table-column>
                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <el-button @click="handleDetail(scope.$index, scope.row)" icon="el-icon-edit" type="text">查看
                        </el-button>
                        <el-button @click="handleApproval(scope.$index, scope.row)" icon="el-icon-edit" type="text"
                                   v-if="data[scope.$index].state == 0">审核
                        </el-button>
                        <el-button @click="handleDelete(scope.$index, scope.row)" class="red" icon="el-icon-delete"
                                   type="text">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination :current-page="current" :page-size="size" :total="total"
                               @current-change="handleCurrentChange" background
                               layout="prev, pager, next">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form :model="form" label-width="100px" ref="form">
                <el-form-item v-if="false">
                    <el-input v-model="form.postId"></el-input>
                </el-form-item>
                <el-form-item label="帖子题目">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="创建时间">
                    <el-date-picker type="datetime" value-format="yyyy-MM-dd'T'HH:mm:ss" v-model="form.createTime">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <span class="dialog-footer" slot="footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button @click="saveEdit" type="primary">确 定</el-button>
            </span>
        </el-dialog>
    
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
        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'postTable',
        data() {
            return {
                categoryData: [],
                tableData: [],
                size: 10,
                current: 0,
                total: 0,
                pages: 0,
                multipleSelection: [],
                selectUser: '',
                selectPost: '',
                editVisible: false,
                delVisible: false,
                selectState: '',
                approvalVisible: false,
                reason: '',
                form: {
                    postId: '',
                    title: '',
                    userName: '',
                    content: '',
                    createTime: ''
                },
                idx: -1
            }
        },
        created() {
            this.getData();
            this.getCategory();
        },
        computed: {
            data() {
                return this.tableData;
            }
        },
        methods: {
            handleCurrentChange(val) {
                this.current = val;
                this.getData();
            },
            getData() {
                let queryParams = {
                    current: this.current,
                    size: this.size,
                    t: {
                        userName: this.selectUser,
                        title: this.selectPost,
                    }
                };
                this.axiosProxy.getAllPostList(queryParams).then(response => {
                    response.data.records.filter(record => {
                        if (record.content.length > 30) {
                            record.content = record.content.substring(0, 27) + '...';
                        }
                    })
                    this.tableData = response.data.records;
                    this.total = response.data.total;
                    this.pages = response.data.pages;
                    console.log(response.data);
                })
            },
            getCategory() {
                this.axiosProxy.getCategoryList().then(response => {
                    this.categoryData = response.data;
                    console.log(response.data);
                })
            },
            search() {
                let queryParams = {
                    current: 1,
                    size: this.size,
                    t: {
                        userName: this.selectUser,
                        title: this.selectPost,
                        state: this.selectState
                    }
                };
                this.axiosProxy.getAllPostList(queryParams).then(response => {
                    response.data.records.filter(record => {
                        if (record.content.length > 30) {
                            record.content = record.content.substring(0, 27) + '...';
                        }
                    })
                    this.tableData = response.data.records;
                    this.total = response.data.total;
                    this.pages = response.data.pages;
                    this.current = 1;
                })
            },
            handleDelete(index, row) {
                this.idx = index;
                this.delVisible = true;
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 确定删除
            deleteRow() {
                let queryParams = {
                    id: this.tableData[this.idx].postId
                };
                this.axiosProxy.deletePost(queryParams).then(response => {
                    if (!response.data) {
                        this.$message.success('删除失败');
                    } else {
                        this.tableData.splice(this.idx, 1);
                        this.$message.success('删除成功');
                    }
                    this.delVisible = false;
                });
            },
            handleEdit(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                    title: item.title,
                    userName: item.userName,
                    postId: item.postId,
                    content: item.content,
                    createTime: item.createTime
                };
                this.editVisible = true;
            },
            saveEdit() {
                this.axiosProxy.updatePost(this.form).then(response => {
                    this.$set(this.tableData, this.idx, this.form);
                    this.editVisible = false;
                    this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                })
            }, handleApproval(index, row) {
                this.reason = '';
                this.idx = index;
                this.approvalVisible = true;
            },
            handleDetail(index, row) {
                this.idx = index;
                this.$router.push({name: 'postDetail', query: {'postId': this.tableData[this.idx].postId}})
            },
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
                    postId: this.tableData[this.idx].postId,
                    reason: this.reason,
                    state: flag
                };
                this.axiosProxy.updatePost(queryParams).then(response => {
                    if (!response.data) {
                        this.$message.success('审核失败');
                    } else {
                        this.$message.success('审核成功');
                    }
                    this.getData();
                });
            }
        }
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
    .table{
        width: 100%;
        font-size: 14px;
    }
    .red{
        color: #ff0000;
    }
    .mr10{
        margin-right: 10px;
    }
</style>
