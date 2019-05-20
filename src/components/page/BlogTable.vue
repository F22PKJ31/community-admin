<template>
	<div class="table">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 博客管理</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="handle-box">
				分类:
				<el-select class="handle-select mr10" placeholder="分类" v-model="selectCategory">
					<el-option label="全部" value=""></el-option>
					<el-option :key="category.categoryId" :label="category.categoryName" :value="category.categoryId"
					           v-for="category in categoryData"></el-option>
				</el-select>
				状态:
				<el-select class="handle-select mr10" placeholder="状态" v-model="selectState">
					<el-option label="全部" value=""></el-option>
					<el-option label="未审核" value="0"></el-option>
					<el-option label="已通过" value="1"></el-option>
					<el-option label="不通过" value="-1"></el-option>
				</el-select>
				<el-input class="handle-input mr10" placeholder="筛选发博人" v-model="selectUser"></el-input>
				<el-input class="handle-input mr10" placeholder="筛选博客" v-model="selectBlog"></el-input>
				<el-button @click="search" icon="search" type="primary">搜索</el-button>
			</div>
			<el-table :data="data" @selection-change="handleSelectionChange" border class="table" ref="multipleTable">
				<el-table-column prop="blogId" v-if="false"/>
				<el-table-column prop="userId" v-if="false"/>
				<el-table-column label="博客题目" prop="title">
				</el-table-column>
				<el-table-column label="发博人" prop="userName">
				</el-table-column>
				<el-table-column label="分类" prop="categoryName">
				</el-table-column>
				<el-table-column prop="categoryId" v-if="false">
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
		<el-dialog :visible.sync="delVisible" center title="提示" width="300px">
			<div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
			<span class="dialog-footer" slot="footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button @click="deleteRow" type="primary">确 定</el-button>
            </span>
		</el-dialog>
	</div>
</template>

<script>
    import ElSelectDropdown from "element-ui/packages/select/src/select-dropdown";

    export default {
        name: 'blogTable',
        components: {ElSelectDropdown},
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
                reason: '',
                selectBlog: '',
                selectCategory: '',
                editVisible: false,
                delVisible: false,
                selectState: '',
                approvalVisible: false,
                form: {
                    blogId: '',
                    title: '',
                    categoryName: '',
                    categoryId: '',
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
                        title: this.selectBlog,
                        categoryId: this.selectCategory
                    }
                };
                this.axiosProxy.getAllBlogList(queryParams).then(response => {
                    response.data.records.filter(record => {
                        if (record.content.length > 30) {
                            record.content = record.content.substring(0, 27) + '...';
                        }
                    })
                    this.tableData = response.data.records;
                    this.total = response.data.total;
                    this.pages = response.data.pages;
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
                        title: this.selectBlog,
                        categoryId: this.selectCategory,
                        state: this.selectState
                    }
                };
                this.axiosProxy.getAllBlogList(queryParams).then(response => {
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
                    id: this.tableData[this.idx].blogId
                };
                this.axiosProxy.deleteBlog(queryParams).then(response => {
                    if (!response.data) {
                        this.$message.success('删除失败');
                    } else {
                        this.tableData.splice(this.idx, 1);
                        this.$message.success('删除成功');
                    }
                    this.delVisible = false;
                });
            },
            handleApproval(index, row) {
                this.reason = '';
                this.idx = index;
                this.approvalVisible = true;
            },
            handleDetail(index, row) {
                this.idx = index;
                this.$router.push({name: 'blogDetail', query: {'blogId': this.tableData[this.idx].blogId}})
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
                    blogId: this.tableData[this.idx].blogId,
                    reason: this.reason,
                    state: flag
                };
                this.axiosProxy.updateBlog(queryParams).then(response => {
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
	
	.del-dialog-cnt {
		font-size: 16px;
		text-align: center
	}
	
	.table {
		width: 100%;
		font-size: 14px;
	}
	
	.red {
		color: #ff0000;
	}
	
	.mr10 {
		margin-right: 10px;
	}
</style>
