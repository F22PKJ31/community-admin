var blogHost = 'http://127.0.0.1:8011';
var newsHost = 'http://127.0.0.1:8012';
var postHost = 'http://127.0.0.1:8013';
var userHost = 'http://127.0.0.1:8014';
var categoryHost = 'http://127.0.0.1:8015';

export default {
    getAllBlogList: {url: blogHost + '/blog/allBlogList'}    //获取博客列表
    , getBlogCollectionList: {url: blogHost + '/blog/collectionList'}        //获取博客收藏列表
    , deleteBlogCollection: {url: blogHost + '/blog/deleteCollection'}                       //删除博客收藏
    , getBlogCommentList: {url: blogHost + '/blog/commentList'}                      //获取角色
    , deleteBlogComment: {url: blogHost + '/blog/deleteComment'}
    , getCategoryList: {url: categoryHost + '/category/categoryList'}
    , updateBlog: {url: blogHost + '/blog/updateBlog'}
    , deleteBlog: {url: blogHost + '/blog/deleteBlog'}
    , getBlogById: {url: blogHost + '/blog/blogDetail'}//获取角色

    , updateNews: {url: newsHost + '/news/updateNews'}
    , deleteNews: {url: newsHost + '/news/deleteNews'}
    , getNewsById: {url: newsHost + '/news/newsDetail'}
    , getNewsCollectionList: {url: blogHost + '/news/collectionList'}        //获取博客收藏列表
    , deleteNewsCollection: {url: blogHost + '/news/deleteCollection'}
    , getAllNewsList: {url: newsHost + '/news/allNewsList'}
    , getNewsCommentList: {url: newsHost + '/news/commentList'}
    , deleteNewsComment: {url: newsHost + '/news/deleteComment'}

    , updatePost: {url: postHost + '/post/updatePost'}
    , deletePost: {url: postHost + '/post/deletePost'}
    , getPostCollectionList: {url: blogHost + '/post/collectionList'}        //获取博客收藏列表
    , deletePostCollection: {url: blogHost + '/post/deleteCollection'}
    , getAllPostList: {url: postHost + '/post/allPostList'}
    , getPostCommentList: {url: postHost + '/post/commentList'}
    , getPostById: {url: postHost + '/post/postDetail'}
    , deletePostComment: {url: postHost + '/post/deleteComment'}

    , addUser: {url: userHost + '/user/addUser'}
    , updateUser: {url: userHost + '/user/updateUser'}
    , deleteUser: {url: userHost + '/user/deleteUser'}
    , getUserList: {url: userHost + '/user/userList'}

    , addCategory: {url: categoryHost + '/category/addCategory'}
    , updateCategory: {url: categoryHost + '/category/updateCategory'}
    , deleteCategory: {url: categoryHost + '/category/deleteCategory'}
    , getCategoryListByPage: {url: categoryHost + '/category/categoryListByPage'}
    , headImgList: {url: newsHost + '/news/headImgList'}
    , sendHeadImg: {url: newsHost + '/news/sendHeadImg'}
    // , deleteComment: {url: blogHost + '/blog/deleteComment'}
}
