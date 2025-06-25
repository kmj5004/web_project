import React, { useState } from 'react';
import { useCommunity } from '../hooks/useCommunity';
import { useAuth } from '../hooks/useAuth';
import { Post, Comment } from '../types';
import { 
  Plus, 
  Heart, 
  MessageCircle, 
  Eye, 
  Calendar,
  User,
  Search,
  Filter,
  TrendingUp,
  Star,
  HelpCircle,
  Lightbulb,
  X
} from 'lucide-react';

// 커뮤니티 페이지 컴포넌트 - 사용자 간 소통 공간
const CommunityPage: React.FC = () => {
  // 인증 훅 사용 (현재 로그인한 사용자 정보)
  const { user } = useAuth();
  
  // 커뮤니티 훅 사용 (게시글, 댓글 관리)
  const { 
    posts, 
    comments, 
    loading, 
    addPost, 
    addComment, 
    likePost, 
    likeComment, 
    incrementViews,
    getCommentsByPostId 
  } = useCommunity();

  // 선택된 카테고리 상태 관리 (전체, 구매후기, 질문, 팁/노하우, 자유게시판)
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'review' | 'question' | 'tip' | 'general'>('all');
  
  // 검색어 상태 관리
  const [searchTerm, setSearchTerm] = useState('');
  
  // 새 게시글 작성 모달 표시 상태
  const [showNewPost, setShowNewPost] = useState(false);
  
  // 선택된 게시글 상태 (상세보기용)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  
  // 새 댓글 입력 상태
  const [newComment, setNewComment] = useState('');

  // 새 게시글 데이터 상태
  const [newPostData, setNewPostData] = useState({
    title: '',
    content: '',
    category: 'general' as const,
  });

  // 카테고리 목록 정의
  const categories = [
    { id: 'all', name: '전체', icon: Filter, color: 'text-gray-600' },
    { id: 'review', name: '구매후기', icon: Star, color: 'text-yellow-600' },
    { id: 'question', name: '질문', icon: HelpCircle, color: 'text-blue-600' },
    { id: 'tip', name: '팁/노하우', icon: Lightbulb, color: 'text-green-600' },
    { id: 'general', name: '자유게시판', icon: MessageCircle, color: 'text-purple-600' },
  ];

  // 카테고리와 검색어에 따라 게시글 필터링
  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // 새 게시글 작성 핸들러
  const handleCreatePost = () => {
    if (!user || !newPostData.title.trim() || !newPostData.content.trim()) return;

    addPost({
      ...newPostData,
      authorId: user.id,
      authorName: user.name,
    });

    // 폼 초기화 및 모달 닫기
    setNewPostData({ title: '', content: '', category: 'general' });
    setShowNewPost(false);
  };

  // 새 댓글 작성 핸들러
  const handleAddComment = () => {
    if (!user || !selectedPost || !newComment.trim()) return;

    addComment({
      postId: selectedPost.id,
      authorId: user.id,
      authorName: user.name,
      content: newComment,
    });

    setNewComment('');
  };

  // 게시글 클릭 핸들러 (상세보기 모달 열기)
  const handlePostClick = (post: Post) => {
    incrementViews(post.id);
    setSelectedPost(post);
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.icon : MessageCircle;
  };

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.color : 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">커뮤니티</h1>
        <p className="text-gray-600">중고차 구매/판매 경험을 공유하고 소통해보세요</p>
      </div>

      
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="게시글 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={() => setShowNewPost(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-emerald-700 transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>글쓰기</span>
          </button>
        </div>

        
        <div className="flex flex-wrap gap-2 mt-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id as any)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <category.icon className="w-4 h-4" />
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      
      <div className="space-y-4">
        {filteredPosts.map((post) => {
          const CategoryIcon = getCategoryIcon(post.category);
          const postComments = getCommentsByPostId(post.id);
          
          return (
            <div
              key={post.id}
              onClick={() => handlePostClick(post)}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`p-1 rounded ${getCategoryColor(post.category)} bg-opacity-10`}>
                      <CategoryIcon className={`w-4 h-4 ${getCategoryColor(post.category)}`} />
                    </div>
                    <span className={`text-xs font-medium ${getCategoryColor(post.category)}`}>
                      {categories.find(c => c.id === post.category)?.name}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {post.content}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{post.authorName}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(post.createdAt).toLocaleDateString('ko-KR')}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{post.views}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{postComments.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <MessageCircle className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">게시글이 없습니다</h3>
            <p className="text-gray-500">첫 번째 게시글을 작성해보세요!</p>
          </div>
        )}
      </div>

      
      {showNewPost && (
        <div className="fixed inset-0 h-screen bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden mx-4">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-bold text-gray-800">새 게시글 작성</h3>
              <button
                onClick={() => setShowNewPost(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
                <select
                  value={newPostData.category}
                  onChange={(e) => setNewPostData(prev => ({ ...prev, category: e.target.value as any }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="general">자유게시판</option>
                  <option value="review">구매후기</option>
                  <option value="question">질문</option>
                  <option value="tip">팁/노하우</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
                <input
                  type="text"
                  value={newPostData.title}
                  onChange={(e) => setNewPostData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="제목을 입력하세요"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">내용</label>
                <textarea
                  value={newPostData.content}
                  onChange={(e) => setNewPostData(prev => ({ ...prev, content: e.target.value }))}
                  rows={8}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="내용을 입력하세요"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 p-6 border-t">
              <button
                onClick={() => setShowNewPost(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleCreatePost}
                className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-emerald-700 transition-all duration-200"
              >
                게시
              </button>
            </div>
          </div>
        </div>
      )}

      
      {selectedPost && (
        <div 
          className="fixed inset-0 h-screen bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedPost(null)}
        >
          <div 
            className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden mx-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center space-x-3">
                <div className={`p-1 rounded ${getCategoryColor(selectedPost.category)} bg-opacity-10`}>
                  {React.createElement(getCategoryIcon(selectedPost.category), {
                    className: `w-4 h-4 ${getCategoryColor(selectedPost.category)}`
                  })}
                </div>
                <span className={`text-sm font-medium ${getCategoryColor(selectedPost.category)}`}>
                  {categories.find(c => c.id === selectedPost.category)?.name}
                </span>
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{selectedPost.title}</h2>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{selectedPost.authorName}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(selectedPost.createdAt).toLocaleDateString('ko-KR')}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{selectedPost.views}</span>
                    </div>
                    <button
                      onClick={() => user && likePost(selectedPost.id, user.id)}
                      className={`flex items-center space-x-1 px-2 py-1 rounded transition-colors ${
                        user && selectedPost.likedBy.includes(user.id)
                          ? 'text-red-600 bg-red-50'
                          : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
                      }`}
                    >
                      <Heart className="w-4 h-4" fill={user && selectedPost.likedBy.includes(user.id) ? 'currentColor' : 'none'} />
                      <span>{selectedPost.likes}</span>
                    </button>
                  </div>
                </div>
                
                <div className="prose max-w-none mb-8">
                  <p className="text-gray-700 whitespace-pre-line">{selectedPost.content}</p>
                </div>
                
                
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    댓글 {getCommentsByPostId(selectedPost.id).length}개
                  </h3>
                  
                  
                  <div className="mb-6">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="댓글을 입력하세요..."
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={handleAddComment}
                        className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-emerald-700 transition-all duration-200"
                      >
                        댓글 작성
                      </button>
                    </div>
                  </div>
                  
                  
                  <div className="space-y-4">
                    {getCommentsByPostId(selectedPost.id).map((comment) => (
                      <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-gray-500" />
                            <span className="font-medium text-gray-800">{comment.authorName}</span>
                            <span className="text-sm text-gray-500">
                              {new Date(comment.createdAt).toLocaleDateString('ko-KR')}
                            </span>
                          </div>
                          <button
                            onClick={() => user && likeComment(comment.id, user.id)}
                            className={`flex items-center space-x-1 px-2 py-1 rounded text-sm transition-colors ${
                              user && comment.likedBy.includes(user.id)
                                ? 'text-red-600 bg-red-100'
                                : 'text-gray-500 hover:text-red-600 hover:bg-red-100'
                            }`}
                          >
                            <Heart className="w-3 h-3" fill={user && comment.likedBy.includes(user.id) ? 'currentColor' : 'none'} />
                            <span>{comment.likes}</span>
                          </button>
                        </div>
                        <p className="text-gray-700">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityPage;