import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { reviewService } from '@/shared/services/review.service';
import { profileService } from '@/shared/services/profile.service';

export default function MyReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  
  const { user: authUser } = useAuth();

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get employee ID from profile
      const profile = await profileService.getProfile();
      const empId = profile?.nhanvienId || profile?.employeeId || authUser?.nhanvienId;
      
      if (!empId) {
        setError('Không tìm thấy thông tin nhân viên');
        setLoading(false);
        return;
      }
      
      const data = await reviewService.getByEmployee(empId);
      setReviews(data || []);
      setLoading(false);
    } catch (err) {
      console.error('Error loading reviews:', err);
      setError(err.message || 'Không thể tải dữ liệu đánh giá');
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8) return { bg: '#f0fdf4', color: '#15803d', label: 'Xuất sắc' };
    if (score >= 6) return { bg: '#eff6ff', color: '#2563eb', label: 'Tốt' };
    if (score >= 4) return { bg: '#fef3c7', color: '#d97706', label: 'Trung bình' };
    return { bg: '#fef2f2', color: '#b91c1c', label: 'Cần cải thiện' };
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  if (loading) {
    return (
      <div style={{ padding: '24px 32px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
          <div style={{ fontSize: 18, color: '#7b809a' }}>Đang tải đánh giá...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '24px 32px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fef2f2', borderRadius: 16 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>❌</div>
          <div style={{ fontSize: 18, color: '#b91c1c', marginBottom: 16 }}>{error}</div>
          <button 
            onClick={loadReviews}
            style={{
              background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 8,
              padding: '10px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer'
            }}
          >
            🔄 Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Calculate average score
  const avgScore = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + (r.diemSo || 0), 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div style={{ padding: '24px 32px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: '#7b809a', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase' }}>
          Cá nhân / Đánh giá hiệu suất
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, color: '#344767' }}>
            Đánh giá hiệu suất của tôi
          </h1>
          <button 
            onClick={loadReviews}
            style={{
              background: '#f8f9fa', color: '#6b7280', border: '1px solid #e5e7eb',
              borderRadius: 8, padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer'
            }}
          >
            🔄 Làm mới
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 24 }}>
        <div style={{
          padding: 20, borderRadius: 16, border: '1px solid #3b82f640',
          background: '#eff6ff', display: 'flex', flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#67748e', textTransform: 'uppercase' }}>
              Tổng đánh giá
            </span>
            <span style={{ fontSize: 18, color: '#3b82f6' }}>📊</span>
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#3b82f6' }}>
            {reviews.length}
          </div>
        </div>

        <div style={{
          padding: 20, borderRadius: 16, border: '1px solid #10b98140',
          background: '#f0fdf4', display: 'flex', flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#67748e', textTransform: 'uppercase' }}>
              Điểm trung bình
            </span>
            <span style={{ fontSize: 18, color: '#10b981' }}>⭐</span>
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#10b981' }}>
            {avgScore}/10
          </div>
        </div>

        <div style={{
          padding: 20, borderRadius: 16, border: '1px solid #f59e0b40',
          background: '#fff7ed', display: 'flex', flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#67748e', textTransform: 'uppercase' }}>
              Xếp loại
            </span>
            <span style={{ fontSize: 18, color: '#f59e0b' }}>🏆</span>
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#f59e0b' }}>
            {avgScore >= 8 ? 'A' : avgScore >= 6 ? 'B' : avgScore >= 4 ? 'C' : 'D'}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div style={{
          background: '#fff', borderRadius: 16, padding: 60, textAlign: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.02)'
        }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>📋</div>
          <div style={{ fontSize: 20, fontWeight: 600, color: '#344767', marginBottom: 12 }}>
            Chưa có đánh giá nào
          </div>
          <div style={{ fontSize: 14, color: '#7b809a', lineHeight: 1.6 }}>
            Các đánh giá hiệu suất của bạn sẽ hiển thị ở đây sau khi được quản lý đánh giá.
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {reviews.map((review, index) => {
            const scoreInfo = getScoreColor(review.diemSo || 0);
            return (
              <div 
                key={review.danhgiaId || index}
                style={{
                  background: '#fff', borderRadius: 16, padding: 24,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                  border: '1px solid rgba(0,0,0,0.02)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => setSelectedReview(selectedReview === review.danhgiaId ? null : review.danhgiaId)}
              >
                {/* Review Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: '#344767', margin: 0, marginBottom: 4 }}>
                      Kỳ đánh giá: {review.ky || 'N/A'}
                    </h3>
                    <div style={{ fontSize: 13, color: '#7b809a' }}>
                      Ngày đánh giá: {formatDate(review.createdAt || review.ngayDanhGia)}
                    </div>
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 12
                  }}>
                    <div style={{
                      background: scoreInfo.bg,
                      color: scoreInfo.color,
                      padding: '8px 16px',
                      borderRadius: 8,
                      fontWeight: 700,
                      fontSize: 14
                    }}>
                      {scoreInfo.label}
                    </div>
                    <div style={{
                      background: '#f8f9fa',
                      padding: '8px 16px',
                      borderRadius: 8,
                      fontWeight: 700,
                      fontSize: 18,
                      color: '#344767'
                    }}>
                      {review.diemSo || 0}/10
                    </div>
                  </div>
                </div>

                {/* Score Bar */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{
                    width: '100%', height: 8, background: '#f0f2f5', borderRadius: 4, overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${(review.diemSo || 0) * 10}%`,
                      height: '100%',
                      background: scoreInfo.color,
                      borderRadius: 4,
                      transition: 'width 0.5s ease'
                    }} />
                  </div>
                </div>

                {/* Reviewer Info */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16,
                  padding: '12px 16px', background: '#f8f9fa', borderRadius: 8
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: '#3b82f6', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, fontWeight: 600
                  }}>
                    {(review.nguoiDanhGia?.username || review.nguoiDanhGia?.hoTen || 'N')?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#344767' }}>
                      {review.nguoiDanhGia?.hoTen || review.nguoiDanhGia?.username || 'Người đánh giá'}
                    </div>
                    <div style={{ fontSize: 12, color: '#7b809a' }}>
                      {review.nguoiDanhGia?.chucVu || 'Quản lý'}
                    </div>
                  </div>
                </div>

                {/* Expandable Content */}
                {selectedReview === review.danhgiaId && review.nhanXet && (
                  <div style={{
                    padding: '16px', background: '#f8f9fa', borderRadius: 8,
                    borderLeft: `4px solid ${scoreInfo.color}`
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#67748e', marginBottom: 8, textTransform: 'uppercase' }}>
                      Nhận xét
                    </div>
                    <div style={{ fontSize: 14, color: '#344767', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                      {review.nhanXet}
                    </div>
                  </div>
                )}

                {/* Expand indicator */}
                <div style={{ textAlign: 'center', marginTop: 12, color: '#7b809a', fontSize: 12 }}>
                  {selectedReview === review.danhgiaId ? '🔼 Thu gọn' : '🔽 Xem nhận xét chi tiết'}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
