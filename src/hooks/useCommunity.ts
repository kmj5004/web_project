import { useState, useEffect } from 'react';
import { Post, Comment } from '../types';

// 커뮤니티 관련 상태 관리 훅 - 게시글, 댓글 관리
export const useCommunity = () => {
  // 게시글 목록 상태
  const [posts, setPosts] = useState<Post[]>([]);
  
  // 댓글 목록 상태
  const [comments, setComments] = useState<Comment[]>([]);
  
  // 로딩 상태 관리
  const [loading, setLoading] = useState(true);

  // 컴포넌트 마운트 시 로컬스토리지에서 커뮤니티 데이터 복원
  useEffect(() => {
    // 저장된 게시글 데이터 복원
    const storedPosts = localStorage.getItem('communityPosts');
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts));
    } else {
      const samplePosts: Post[] = [
        {
          id: '1',
          title: '현대 아반떼 구매 후기',
          content: '현대 아반떼를 구매한 지 3개월이 되었습니다. 연비가 정말 좋고 주차도 편해서 만족스럽습니다. 특히 도심 주행에서의 편의성이 뛰어나네요.',
          category: 'review',
          authorId: '1',
          authorName: '김철수',
          likes: 12,
          views: 156,
          likedBy: ['2', '3'],
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
        },
        {
          id: '2',
          title: '중고차 구매 시 주의사항',
          content: '중고차 구매할 때 꼭 확인해야 할 사항들을 정리해봤습니다. 사고 이력, 정비 기록, 실제 주행거리 등을 꼼꼼히 체크하세요.',
          category: 'tip',
          authorId: '2',
          authorName: '박영희',
          likes: 8,
          views: 89,
          likedBy: ['1'],
          createdAt: '2024-01-14T14:30:00Z',
          updatedAt: '2024-01-14T14:30:00Z',
        },
        {
          id: '3',
          title: '전기차 충전소 추천',
          content: '서울 지역 전기차 충전소 중에서 이용하기 편한 곳들을 추천합니다. 특히 야간 충전이 가능한 곳들을 중심으로 정리했습니다.',
          category: 'tip',
          authorId: '3',
          authorName: '이민준',
          likes: 15,
          views: 234,
          likedBy: ['1', '2', '4'],
          createdAt: '2024-01-13T09:15:00Z',
          updatedAt: '2024-01-13T09:15:00Z',
        },
        {
          id: '4',
          title: '차량 보험 비교 후기',
          content: '다양한 보험사들의 차량보험을 비교해봤습니다. 보험료, 보장 범위, 사고 처리 속도 등을 종합적으로 평가했습니다.',
          category: 'review',
          authorId: '4',
          authorName: '최지영',
          likes: 6,
          views: 67,
          likedBy: ['1', '3'],
          createdAt: '2024-01-12T11:00:00Z',
          updatedAt: '2024-01-12T11:00:00Z',
        },
        {
          id: '5',
          title: '자동차 세금 절약 방법',
          content: '자동차 관련 세금을 절약할 수 있는 방법들을 알려드립니다. 환경친화적 차량 구매, 연료 효율성 등을 고려해보세요.',
          category: 'tip',
          authorId: '5',
          authorName: '정우진',
          likes: 11,
          views: 123,
          likedBy: ['2', '4'],
          createdAt: '2024-01-11T16:45:00Z',
          updatedAt: '2024-01-11T16:45:00Z',
        },
      ];

      setPosts(samplePosts);
      localStorage.setItem('communityPosts', JSON.stringify(samplePosts));
    }

    // 저장된 댓글 데이터 복원
    const storedComments = localStorage.getItem('communityComments');
    if (storedComments) {
      setComments(JSON.parse(storedComments));
    } else {
      const sampleComments: Comment[] = [
        {
          id: '1',
          postId: '1',
          authorId: '2',
          authorName: '박영희',
          content: '정말 좋은 후기네요! 저도 아반떼를 고려하고 있었는데 도움이 많이 되었습니다.',
          likes: 3,
          likedBy: ['1'],
          createdAt: '2024-01-15T11:00:00Z',
          updatedAt: '2024-01-15T11:00:00Z',
        },
        {
          id: '2',
          postId: '1',
          authorId: '3',
          authorName: '이민준',
          content: '연비가 정말 좋다고 하시네요. 혹시 주행거리는 얼마나 되나요?',
          likes: 1,
          likedBy: ['1'],
          createdAt: '2024-01-15T12:00:00Z',
          updatedAt: '2024-01-15T12:00:00Z',
        },
        {
          id: '3',
          postId: '2',
          authorId: '1',
          authorName: '김철수',
          content: '정말 유용한 정보입니다. 특히 사고 이력 확인 방법이 도움이 되었어요.',
          likes: 2,
          likedBy: ['2'],
          createdAt: '2024-01-14T15:00:00Z',
          updatedAt: '2024-01-14T15:00:00Z',
        },
      ];

      setComments(sampleComments);
      localStorage.setItem('communityComments', JSON.stringify(sampleComments));
    }

    setLoading(false);
  }, []);

  // 게시글 데이터가 변경될 때마다 로컬스토리지에 저장
  useEffect(() => {
    localStorage.setItem('communityPosts', JSON.stringify(posts));
  }, [posts]);

  // 댓글 데이터가 변경될 때마다 로컬스토리지에 저장
  useEffect(() => {
    localStorage.setItem('communityComments', JSON.stringify(comments));
  }, [comments]);

  // 새 게시글 작성 함수
  const addPost = (postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'likedBy' | 'views'>) => {
    // 새 게시글 객체 생성
    const newPost: Post = {
      ...postData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 0,
      likedBy: [],
      views: 0,
    };

    setPosts(prev => [newPost, ...prev]);
  };

  // 게시글 수정 함수
  const updatePost = (id: string, updates: Partial<Omit<Post, 'id' | 'createdAt' | 'likes' | 'likedBy' | 'views'>>) => {
    setPosts(prev => prev.map(post => 
      post.id === id 
        ? { ...post, ...updates, updatedAt: new Date().toISOString() }
        : post
    ));
  };

  // 게시글 삭제 함수
  const deletePost = (id: string) => {
    setPosts(prev => prev.filter(post => post.id !== id));
    // 해당 게시글의 댓글도 함께 삭제
    setComments(prev => prev.filter(comment => comment.postId !== id));
  };

  // 게시글 좋아요/취소 함수
  const likePost = (postId: string, userId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const isLiked = post.likedBy.includes(userId);
        return {
          ...post,
          likes: isLiked ? post.likes - 1 : post.likes + 1,
          likedBy: isLiked 
            ? post.likedBy.filter(id => id !== userId)
            : [...post.likedBy, userId],
        };
      }
      return post;
    }));
  };

  // 게시글 조회수 증가 함수
  const incrementViews = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, views: post.views + 1 }
        : post
    ));
  };

  // 새 댓글 작성 함수
  const addComment = (commentData: Omit<Comment, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'likedBy'>) => {
    // 새 댓글 객체 생성
    const newComment: Comment = {
      ...commentData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 0,
      likedBy: [],
    };

    setComments(prev => [...prev, newComment]);
  };

  // 댓글 수정 함수
  const updateComment = (id: string, updates: Partial<Omit<Comment, 'id' | 'createdAt' | 'likes' | 'likedBy'>>) => {
    setComments(prev => prev.map(comment => 
      comment.id === id 
        ? { ...comment, ...updates, updatedAt: new Date().toISOString() }
        : comment
    ));
  };

  // 댓글 삭제 함수
  const deleteComment = (id: string) => {
    setComments(prev => prev.filter(comment => comment.id !== id));
  };

  // 댓글 좋아요/취소 함수
  const likeComment = (commentId: string, userId: string) => {
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        const isLiked = comment.likedBy.includes(userId);
        return {
          ...comment,
          likes: isLiked ? comment.likes - 1 : comment.likes + 1,
          likedBy: isLiked 
            ? comment.likedBy.filter(id => id !== userId)
            : [...comment.likedBy, userId],
        };
      }
      return comment;
    }));
  };

  // 특정 게시글의 댓글 목록 조회 함수
  const getCommentsByPostId = (postId: string): Comment[] => {
    return comments
      .filter(comment => comment.postId === postId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  };

  return {
    posts,
    comments,
    loading,
    addPost,
    updatePost,
    deletePost,
    likePost,
    incrementViews,
    addComment,
    updateComment,
    deleteComment,
    likeComment,
    getCommentsByPostId,
  };
};