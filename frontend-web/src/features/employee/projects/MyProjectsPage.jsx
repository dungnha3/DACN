import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function MyProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  
  const { user: authUser } = useAuth();
  const username = authUser?.username || localStorage.getItem('username') || 'Employee';

  useEffect(() => {
    loadMyProjects();
  }, []);

  const loadMyProjects = async () => {
    try {
      setLoading(true);
      // Simulate loading projects where employee is assigned
      setTimeout(() => {
        setProjects([
          {
            id: 1,
            tenDuAn: 'Website QLNS',
            moTa: 'Phát triển hệ thống quản lý nhân sự',
            trangThai: 'DANG_THUC_HIEN',
            ngayBatDau: '2024-01-15',
            ngayKetThuc: '2024-12-31',
            tieuDe: 'Frontend Development',
            vaiTro: 'Developer',
            issues: [
              { id: 1, title: 'Tạo giao diện đăng nhập', status: 'HOAN_THANH', priority: 'HIGH' },
              { id: 2, title: 'Thiết kế dashboard', status: 'DANG_LAM', priority: 'MEDIUM' },
              { id: 3, title: 'Tích hợp API', status: 'TODO', priority: 'HIGH' }
            ]
          },
          {
            id: 2,
            tenDuAn: 'Mobile App',
            moTa: 'Ứng dụng di động cho nhân viên',
            trangThai: 'DANG_THUC_HIEN',
            ngayBatDau: '2024-06-01',
            ngayKetThuc: '2024-11-30',
            tieuDe: 'UI/UX Design',
            vaiTro: 'Designer',
            issues: [
              { id: 4, title: 'Thiết kế wireframe', status: 'HOAN_THANH', priority: 'HIGH' },
              { id: 5, title: 'Tạo prototype', status: 'DANG_LAM', priority: 'MEDIUM' }
            ]
          }
        ]);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      TODO: { bg: '#fff7ed', color: '#c2410c', label: '📋 Chưa làm' },
      DANG_LAM: { bg: '#fef3c7', color: '#d97706', label: '⏳ Đang làm' },
      HOAN_THANH: { bg: '#f0fdf4', color: '#15803d', label: '✅ Hoàn thành' },
      DANG_THUC_HIEN: { bg: '#eff6ff', color: '#2563eb', label: '🚀 Đang thực hiện' }
    };
    const s = config[status] || config.TODO;
    return (
      <span style={{
        background: s.bg, color: s.color, padding: '4px 8px', borderRadius: 6,
        fontSize: 11, fontWeight: 700, textTransform: 'uppercase', whiteSpace: 'nowrap'
      }}>
        {s.label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const config = {
      HIGH: { bg: '#fef2f2', color: '#b91c1c', label: '🔥 Cao' },
      MEDIUM: { bg: '#fff7ed', color: '#c2410c', label: '⚡ Trung bình' },
      LOW: { bg: '#f0fdf4', color: '#15803d', label: '📝 Thấp' }
    };
    const p = config[priority] || config.MEDIUM;
    return (
      <span style={{
        background: p.bg, color: p.color, padding: '2px 6px', borderRadius: 4,
        fontSize: 10, fontWeight: 600
      }}>
        {p.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div style={{ padding: '24px 32px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: 18, color: '#7b809a', marginBottom: 16 }}>Đang tải dự án...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px 32px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: '#7b809a', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase' }}>
          Cá nhân / Dự án của tôi
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, color: '#344767' }}>
            Dự án của tôi
          </h1>
          <div style={{
            background: '#f8f9fa', color: '#6b7280', border: '1px solid #e5e7eb',
            borderRadius: 8, padding: '10px 20px', fontSize: 13, fontWeight: 600
          }}>
            👁️ Chỉ xem (Employee)
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 24 }}>
        {[
          { title: 'Dự án tham gia', value: projects.length, icon: '🏭', color: '#3b82f6', bg: '#eff6ff' },
          { title: 'Tasks hoàn thành', value: projects.reduce((sum, p) => sum + p.issues.filter(i => i.status === 'HOAN_THANH').length, 0), icon: '✅', color: '#10b981', bg: '#f0fdf4' },
          { title: 'Tasks đang làm', value: projects.reduce((sum, p) => sum + p.issues.filter(i => i.status === 'DANG_LAM').length, 0), icon: '⏳', color: '#f59e0b', bg: '#fff7ed' },
          { title: 'Tasks chưa làm', value: projects.reduce((sum, p) => sum + p.issues.filter(i => i.status === 'TODO').length, 0), icon: '📋', color: '#ef4444', bg: '#fef2f2' }
        ].map((stat, i) => (
          <div key={i} style={{
            padding: 20, borderRadius: 16, border: '1px solid', borderColor: stat.color + '40',
            background: stat.bg, display: 'flex', flexDirection: 'column'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#67748e', textTransform: 'uppercase' }}>
                {stat.title}
              </span>
              <span style={{ fontSize: 18, color: stat.color }}>{stat.icon}</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: stat.color }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Projects Grid */}
      <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
        {projects.map(project => (
          <div key={project.id} style={{
            background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            border: '1px solid rgba(0,0,0,0.02)', cursor: 'pointer',
            transition: 'all 0.2s ease', ':hover': { transform: 'translateY(-2px)' }
          }}
          onClick={() => setSelectedProject(selectedProject === project.id ? null : project.id)}
          >
            {/* Project Header */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#344767', margin: 0 }}>
                  {project.tenDuAn}
                </h3>
                {getStatusBadge(project.trangThai)}
              </div>
              <p style={{ fontSize: 14, color: '#7b809a', margin: 0, lineHeight: 1.5 }}>
                {project.moTa}
              </p>
            </div>

            {/* Project Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#7b809a', marginBottom: 4 }}>VAI TRÒ</div>
                <div style={{ fontSize: 14, color: '#344767', fontWeight: 600 }}>{project.vaiTro}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#7b809a', marginBottom: 4 }}>THỜI GIAN</div>
                <div style={{ fontSize: 14, color: '#344767' }}>{project.ngayBatDau} → {project.ngayKetThuc}</div>
              </div>
            </div>

            {/* Tasks Summary */}
            <div style={{ borderTop: '1px solid #f0f2f5', paddingTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#344767' }}>
                  Tasks ({project.issues.length})
                </span>
                <span style={{ fontSize: 12, color: '#7b809a' }}>
                  {selectedProject === project.id ? '🔽 Thu gọn' : '🔽 Xem chi tiết'}
                </span>
              </div>

              {/* Tasks List (Expandable) */}
              {selectedProject === project.id && (
                <div style={{ space: '8px' }}>
                  {project.issues.map(issue => (
                    <div key={issue.id} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '8px 12px', background: '#f8f9fa', borderRadius: 8, marginBottom: 8
                    }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#344767' }}>
                          {issue.title}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        {getPriorityBadge(issue.priority)}
                        {getStatusBadge(issue.status)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div style={{
          background: '#fff', borderRadius: 16, padding: 60, textAlign: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.02)'
        }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>🏭</div>
          <div style={{ fontSize: 20, fontWeight: 600, color: '#344767', marginBottom: 12 }}>
            Chưa có dự án nào
          </div>
          <div style={{ fontSize: 14, color: '#7b809a', lineHeight: 1.6 }}>
            Bạn chưa được phân công vào dự án nào. 
            Liên hệ Project Manager để được thêm vào dự án.
          </div>
        </div>
      )}
    </div>
  );
}
