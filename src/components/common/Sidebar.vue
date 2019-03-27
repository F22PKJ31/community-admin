<template>
	<div class="sidebar">
		<el-menu :collapse="collapse" :default-active="onRoutes" active-text-color="#20a0ff" background-color="#324157"
		         class="sidebar-el-menu" router text-color="#bfcbd9" unique-opened>
			<template v-for="item in items">
				<el-menu-item :index="item.index" :key="item.index">
					<i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
				</el-menu-item>
			</template>
		</el-menu>
	</div>
</template>

<script>
    import bus from '../common/bus';

    export default {
        data() {
            return {
                collapse: false,
                items: [
                    {
                        icon: 'el-icon-lx-cascades',
                        index: 'blog',
                        title: '博客管理'
                    }, {
                        icon: 'el-icon-lx-cascades',
                        index: 'blogCollection',
                        title: '博客收藏管理'
                    }, {
                        icon: 'el-icon-lx-cascades',
                        index: 'blogComment',
                        title: '博客评论管理'
                    }, {
                        icon: 'el-icon-lx-cascades',
                        index: 'post',
                        title: '帖子管理'
                    }, {
                        icon: 'el-icon-lx-cascades',
                        index: 'postCollection',
                        title: '帖子收藏管理'
                    }, {
                        icon: 'el-icon-lx-cascades',
                        index: 'postComment',
                        title: '帖子评论管理'
                    }, {
                        icon: 'el-icon-lx-cascades',
                        index: 'newsTable',
                        title: '新闻管理'
                    }, {
                        icon: 'el-icon-lx-cascades',
                        index: 'newsComment',
                        title: '新闻评论管理'
                    },{
                        icon: 'el-icon-lx-cascades',
                        index: 'newsCollection',
                        title: '新闻收藏管理'
                    }, {
                        icon: 'el-icon-lx-cascades',
                        index: 'categoryTable',
                        title: '新闻分类管理'
                    }, {
                        icon: 'el-icon-lx-cascades',
                        index: 'user',
                        title: '用户管理'
					}, {
                        icon: 'el-icon-lx-cascades',
                        index: 'headImgTable',
                        title: '轮播图管理'
                    }

                ]
            }
        },
        computed: {
            onRoutes() {
                return this.$route.path.replace('/', '');
            }
        },
        created() {
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })
        }
    }
</script>

<style scoped>
	.sidebar {
		display: block;
		position: absolute;
		left: 0;
		top: 70px;
		bottom: 0;
		overflow-y: scroll;
	}
	
	.sidebar::-webkit-scrollbar {
		width: 0;
	}
	
	.sidebar-el-menu:not(.el-menu--collapse) {
		width: 250px;
	}
	
	.sidebar > ul {
		height: 100%;
	}
</style>
