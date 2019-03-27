<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 轮播图管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-table :data="tableData" @selection-change="handleSelectionChange" border class="table"
                      ref="multipleTable">
                <el-table-column prop="headId" v-if="false"/>
                <el-table-column prop="newsId" v-if="false"/>
                <el-table-column label="对应新闻" prop="title">
                </el-table-column>
                <el-table-column label="图片" prop="imgUrl">
                    <template slot-scope="scope">
                        <img :src="scope.row.imgUrl" width="400px" height="240px"/>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <el-button @click="handleEdit(scope.$index, scope.row)" icon="el-icon-edit" type="text">编辑
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
        <el-dialog :visible.sync="editVisible" title="编辑" width="30%">
            <el-form :model="form" label-width="100px" ref="form">
                <el-form-item v-if="false">
                    <el-input v-model="form.headId"></el-input>
                </el-form-item>
                <el-form-item label="对应新闻">
                    <el-select v-model="form.news" value-key="newsId">
                        <el-option :key="c.newsId" :label="c.title" :value="c" v-for="c in newsData">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="图片" prop="imgUrl">
                    <el-upload
                            class="avatar-uploader"
                            action="http://localhost:8010/file/uploadFile"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                        <img v-if="form.imgUrl" :src="form.imgUrl" class="avatar" width="200px" height="120px">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
            </el-form>
            <span class="dialog-footer" slot="footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button @click="saveEdit" type="primary">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    import ElSelectDropdown from "element-ui/packages/select/src/select-dropdown";

    export default {
        name: 'userTable',
        components: {ElSelectDropdown},
        data() {
            return {
                tableData: [],
                newsData: [],
                size: 10,
                current: 0,
                total: 0,
                pages: 0,
                selectUser: '',
                editVisible: false,
                delVisible: false,
                addVisible: false,
                form: {
                    news: {},
                    imgUrl: '',
                    headId: ''
                },
                idx: -1
            }
        },
        created() {
            this.getData();
        },
        methods: {
            handleCurrentChange(val) {
                this.current = val;
                this.getData();
            },
            getData() {
                this.axiosProxy.headImgList().then(response => {
                    this.tableData = response.data;
                })
            },
            getNewsData() {
                let queryParams = {
                    current: 0,
                    size: 1000,
                    t: {}
                };
                this.axiosProxy.getNewsList(queryParams).then(response => {
                    this.newsData = response.data.records;
                })
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleEdit(index, row) {
                this.idx = index;
                this.getNewsData();
                const item = this.tableData[index];
                this.form = {
                    news: {
                        'newsId': item.newsId,
                        'title': item.title
                    },
                    imgUrl: item.imgUrl,
                    headId: item.headId,
                };
                this.editVisible = true;
            },
            saveEdit() {
                this.axiosProxy.sendHeadImg(this.form).then(response => {
                    this.$set(this.tableData, this.idx, this.form);
                    this.editVisible = false;
                    this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                })
            },
            handleAvatarSuccess(res, file) {
                if (res.error == '0') {
                    this.form.imgUrl = res.url;
                }
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isPNG = file.type === 'image/png';

                if (!isJPG && !isPNG) {
                    this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!');
                }
                return isJPG || isPNG;
            }
        }
    }

</script>

<style>
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

    .del-dialog-cnt {
        font-size: 16px;
        text-align: center
    }

    .table {
        width: 100%;
        font-size: 14px;
    }

    .el-upload--text {
        width: 200px;
        height: 120px;
    }
</style>
