import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { usePermissions, useErrorHandler } from '@/shared/hooks';
import { commonStyles } from '@/shared/utils';
import { colors, typography, spacing } from '@/shared/styles/theme';

export default function SharedStoragePage({ 
  title = "Quản lý file",
  breadcrumb = "Cá nhân / File của tôi",
  viewMode = "personal", // "personal" | "project"
  projectId = null // Required when viewMode = "project"
}) {
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewType, setViewType] = useState('grid'); // 'grid' | 'list'
  
  const { user: authUser } = useAuth();
  const { currentUser, isProjectManager, isHRManager } = usePermissions();
  const { handleError } = useErrorHandler();

  useEffect(() => {
    loadStorageData();
  }, [currentFolderId, viewMode, projectId]);

  const loadStorageData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate loading files and folders
      setTimeout(() => {
        if (viewMode === "personal") {
          // Personal files
          setFiles([
            {
              fileId: 1,
              filename: 'CV_2024.pdf',
              originalFilename: 'CV_Nguyen_Van_A.pdf',
              fileSize: 2457600,
              mimeType: 'application/pdf',
              uploadDate: '2024-11-20T10:30:00',
              folderId: null
            },
            {
              fileId: 2,
              filename: 'presentation.pptx',
              originalFilename: 'Company_Presentation.pptx',
              fileSize: 5242880,
              mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
              uploadDate: '2024-11-19T14:20:00',
              folderId: null
            },
            {
              fileId: 3,
              filename: 'avatar.jpg',
              originalFilename: 'profile_photo.jpg',
              fileSize: 524288,
              mimeType: 'image/jpeg',
              uploadDate: '2024-11-18T09:15:00',
              folderId: null
            }
          ]);
          
          setFolders([
            { folderId: 1, folderName: 'Tài liệu cá nhân', fileCount: 5, createdDate: '2024-11-01' },
            { folderId: 2, folderName: 'Ảnh', fileCount: 12, createdDate: '2024-10-15' },
            { folderId: 3, folderName: 'Dự án', fileCount: 8, createdDate: '2024-09-20' }
          ]);
        } else if (viewMode === "project" && projectId) {
          // Project-related files
          setFiles([
            {
              fileId: 4,
              filename: 'requirements.docx',
              originalFilename: 'Project_Requirements_v2.docx',
              fileSize: 1048576,
              mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              uploadDate: '2024-11-20T16:45:00',
              uploadedBy: 'Nguyễn Văn A',
              folderId: null
            },
            {
              fileId: 5,
              filename: 'design_mockup.fig',
              originalFilename: 'UI_Design_Mockup.fig',
              fileSize: 3145728,
              mimeType: 'application/octet-stream',
              uploadDate: '2024-11-19T11:30:00',
              uploadedBy: 'Trần Thị B',
              folderId: null
            },
            {
              fileId: 6,
              filename: 'database_schema.sql',
              originalFilename: 'DB_Schema_Final.sql',
              fileSize: 204800,
              mimeType: 'application/sql',
              uploadDate: '2024-11-18T13:20:00',
              uploadedBy: 'Lê Văn C',
              folderId: null
            }
          ]);
          
          setFolders([
            { folderId: 4, folderName: 'Documents', fileCount: 15, createdDate: '2024-11-01' },
            { folderId: 5, folderName: 'Design', fileCount: 8, createdDate: '2024-10-25' },
            { folderId: 6, folderName: 'Source Code', fileCount: 23, createdDate: '2024-10-10' }
          ]);
        }
        
        setLoading(false);
      }, 1000);
    } catch (err) {
      const errorMessage = handleError(err, { context: 'load_storage' });
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const uploadedFiles = Array.from(event.target.files);
    
    if (uploadedFiles.length === 0) return;
    
    try {
      setUploading(true);
      
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert(`✅ Đã upload ${uploadedFiles.length} file thành công!`);
      loadStorageData();
    } catch (err) {
      alert('❌ Lỗi upload file');
    } finally {
      setUploading(false);
      event.target.value = ''; // Reset input
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      alert('⚠️ Vui lòng nhập tên thư mục');
      return;
    }
    
    try {
      // Simulate folder creation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      alert(`✅ Đã tạo thư mục "${newFolderName}" thành công!`);
      setNewFolderName('');
      setShowCreateFolderModal(false);
      loadStorageData();
    } catch (err) {
      alert('❌ Lỗi tạo thư mục');
    }
  };

  const handleDownload = async (fileId, filename) => {
    try {
      alert(`⬇️ Đang tải file: ${filename}`);
      // Simulate download
      // In real app: window.open(`/api/storage/files/${fileId}/download`)
    } catch (err) {
      alert('❌ Lỗi tải file');
    }
  };

  const handleDelete = async (fileId, filename) => {
    if (!confirm(`Bạn có chắc muốn xóa file "${filename}"?`)) return;
    
    try {
      // Simulate delete
      await new Promise(resolve => setTimeout(resolve, 500));
      
      alert(`✅ Đã xóa file "${filename}" thành công!`);
      loadStorageData();
    } catch (err) {
      alert('❌ Lỗi xóa file');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType) => {
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('word') || mimeType.includes('document')) return '📝';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊';
    if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return '📊';
    if (mimeType.includes('video')) return '🎥';
    if (mimeType.includes('audio')) return '🎵';
    if (mimeType.includes('zip') || mimeType.includes('compressed')) return '🗜️';
    if (mimeType.includes('sql')) return '🗄️';
    return '📎';
  };

  const filteredFiles = files.filter(file => 
    file.originalFilename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate storage stats
  const totalSize = files.reduce((sum, file) => sum + file.fileSize, 0);
  const fileCount = files.length;
  const folderCount = folders.length;

  if (loading) {
    return (
      <div style={commonStyles.pageContainer}>
        <div style={{ textAlign: 'center', padding: spacing['6xl'] }}>
          <div style={{ fontSize: typography.xl, color: colors.textSecondary, marginBottom: spacing.lg }}>
            Đang tải dữ liệu...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={commonStyles.pageContainer}>
        <div style={{ textAlign: 'center', padding: spacing['6xl'] }}>
          <div style={{ fontSize: typography.xl, color: colors.error, marginBottom: spacing.lg }}>
            ❌ {error}
          </div>
          <button 
            onClick={loadStorageData}
            style={{
              background: colors.gradientPrimary,
              color: '#fff', border: 'none', borderRadius: spacing.lg, padding: `${spacing.md} ${spacing.xl}`,
              fontSize: typography.sm, fontWeight: typography.bold, cursor: 'pointer'
            }}
          >
            🔄 Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={commonStyles.pageContainer}>
      {/* Header */}
      <div style={{ marginBottom: spacing['2xl'] }}>
        <div style={{ fontSize: typography.sm, color: colors.textSecondary, marginBottom: spacing.sm, fontWeight: typography.semibold, textTransform: 'uppercase' }}>
          {breadcrumb}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={commonStyles.heading1}>
            {title}
          </h1>
          <div style={{ display: 'flex', gap: spacing.md }}>
            <label style={{
              background: colors.gradientSuccess,
              color: '#fff', border: 'none', borderRadius: spacing.lg, padding: `${spacing.md} ${spacing.xl}`,
              fontSize: typography.sm, fontWeight: typography.bold, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: spacing.sm
            }}>
              {uploading ? '⏳ Đang upload...' : '📤 Upload file'}
              <input 
                type="file" 
                multiple 
                onChange={handleFileUpload}
                disabled={uploading}
                style={{ display: 'none' }}
              />
            </label>
            <button 
              style={{
                background: colors.gradientPrimary,
                color: '#fff', border: 'none', borderRadius: spacing.lg, padding: `${spacing.md} ${spacing.xl}`,
                fontSize: typography.sm, fontWeight: typography.bold, cursor: 'pointer'
              }}
              onClick={() => setShowCreateFolderModal(true)}
            >
              📁 Tạo thư mục
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: spacing.xl, marginBottom: spacing['2xl'] }}>
        {[
          { title: 'Tổng file', value: fileCount, icon: '📎', color: colors.primary },
          { title: 'Thư mục', value: folderCount, icon: '📁', color: colors.info },
          { title: 'Dung lượng', value: formatFileSize(totalSize), icon: '💾', color: colors.warning },
          { title: 'Loại file', value: new Set(files.map(f => f.mimeType.split('/')[0])).size, icon: '📋', color: colors.success }
        ].map((stat, i) => (
          <div key={i} style={{
            ...commonStyles.cardBase,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: typography['3xl'], marginBottom: spacing.md }}>{stat.icon}</div>
            <div style={{ fontSize: typography['2xl'], fontWeight: typography.bold, color: stat.color, marginBottom: spacing.xs }}>
              {stat.value}
            </div>
            <div style={{ fontSize: typography.sm, color: colors.textSecondary }}>
              {stat.title}
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xl, gap: spacing.lg }}>
        {/* Search */}
        <div style={{ flex: 1, position: 'relative' }}>
          <span style={{ position: 'absolute', left: spacing.md, top: '50%', transform: 'translateY(-50%)', fontSize: typography.lg }}>
            🔍
          </span>
          <input 
            type="text"
            placeholder="Tìm kiếm file..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              ...commonStyles.inputBase,
              paddingLeft: spacing['3xl']
            }}
          />
        </div>
        
        {/* View Toggle */}
        <div style={{ display: 'flex', gap: spacing.sm }}>
          <button 
            onClick={() => setViewType('grid')}
            style={{
              padding: spacing.md,
              background: viewType === 'grid' ? colors.primary : colors.background,
              color: viewType === 'grid' ? '#fff' : colors.textSecondary,
              border: 'none',
              borderRadius: spacing.md,
              cursor: 'pointer',
              fontSize: typography.lg
            }}
          >
            🔲
          </button>
          <button 
            onClick={() => setViewType('list')}
            style={{
              padding: spacing.md,
              background: viewType === 'list' ? colors.primary : colors.background,
              color: viewType === 'list' ? '#fff' : colors.textSecondary,
              border: 'none',
              borderRadius: spacing.md,
              cursor: 'pointer',
              fontSize: typography.lg
            }}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Folders Section */}
      {folders.length > 0 && (
        <div style={{ marginBottom: spacing['2xl'] }}>
          <h3 style={{ ...commonStyles.heading3, marginBottom: spacing.lg }}>
            📁 Thư mục
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: spacing.lg }}>
            {folders.map(folder => (
              <div 
                key={folder.folderId}
                style={{
                  ...commonStyles.cardBase,
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  ':hover': { transform: 'translateY(-2px)' }
                }}
                onClick={() => setCurrentFolderId(folder.folderId)}
              >
                <div style={{ fontSize: typography['4xl'], marginBottom: spacing.md }}>📁</div>
                <div style={{ fontSize: typography.base, fontWeight: typography.semibold, color: colors.textPrimary, marginBottom: spacing.xs }}>
                  {folder.folderName}
                </div>
                <div style={{ fontSize: typography.sm, color: colors.textSecondary }}>
                  {folder.fileCount} file
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Files Section */}
      <div>
        <h3 style={{ ...commonStyles.heading3, marginBottom: spacing.lg }}>
          📎 File ({filteredFiles.length})
        </h3>
        
        {filteredFiles.length > 0 ? (
          viewType === 'grid' ? (
            // Grid View
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: spacing.lg }}>
              {filteredFiles.map(file => (
                <div key={file.fileId} style={commonStyles.cardBase}>
                  <div style={{ textAlign: 'center', marginBottom: spacing.md }}>
                    <div style={{ fontSize: typography['5xl'], marginBottom: spacing.md }}>
                      {getFileIcon(file.mimeType)}
                    </div>
                    <div style={{ fontSize: typography.sm, fontWeight: typography.semibold, color: colors.textPrimary, marginBottom: spacing.xs, wordBreak: 'break-word' }}>
                      {file.originalFilename}
                    </div>
                    <div style={{ fontSize: typography.xs, color: colors.textSecondary }}>
                      {formatFileSize(file.fileSize)}
                    </div>
                    {viewMode === "project" && file.uploadedBy && (
                      <div style={{ fontSize: typography.xs, color: colors.textMuted, marginTop: spacing.xs }}>
                        Bởi: {file.uploadedBy}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: spacing.sm, justifyContent: 'center' }}>
                    <button 
                      onClick={() => handleDownload(file.fileId, file.originalFilename)}
                      style={{
                        padding: `${spacing.xs} ${spacing.md}`,
                        background: colors.info,
                        color: '#fff',
                        border: 'none',
                        borderRadius: spacing.md,
                        fontSize: typography.xs,
                        cursor: 'pointer'
                      }}
                    >
                      ⬇️
                    </button>
                    <button 
                      onClick={() => handleDelete(file.fileId, file.originalFilename)}
                      style={{
                        padding: `${spacing.xs} ${spacing.md}`,
                        background: colors.error,
                        color: '#fff',
                        border: 'none',
                        borderRadius: spacing.md,
                        fontSize: typography.xs,
                        cursor: 'pointer'
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // List View
            <div style={commonStyles.cardBase}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${colors.borderLight}` }}>
                    <th style={{ padding: spacing.lg, textAlign: 'left', fontSize: typography.sm, fontWeight: typography.bold, color: colors.textSecondary }}>Tên file</th>
                    <th style={{ padding: spacing.lg, textAlign: 'left', fontSize: typography.sm, fontWeight: typography.bold, color: colors.textSecondary }}>Kích thước</th>
                    <th style={{ padding: spacing.lg, textAlign: 'left', fontSize: typography.sm, fontWeight: typography.bold, color: colors.textSecondary }}>Ngày upload</th>
                    {viewMode === "project" && (
                      <th style={{ padding: spacing.lg, textAlign: 'left', fontSize: typography.sm, fontWeight: typography.bold, color: colors.textSecondary }}>Người upload</th>
                    )}
                    <th style={{ padding: spacing.lg, textAlign: 'center', fontSize: typography.sm, fontWeight: typography.bold, color: colors.textSecondary }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFiles.map(file => (
                    <tr key={file.fileId} style={{ borderBottom: `1px solid ${colors.borderLight}` }}>
                      <td style={{ padding: spacing.lg }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
                          <span style={{ fontSize: typography['2xl'] }}>{getFileIcon(file.mimeType)}</span>
                          <span style={{ fontSize: typography.sm, fontWeight: typography.medium }}>{file.originalFilename}</span>
                        </div>
                      </td>
                      <td style={{ padding: spacing.lg, fontSize: typography.sm, color: colors.textSecondary }}>
                        {formatFileSize(file.fileSize)}
                      </td>
                      <td style={{ padding: spacing.lg, fontSize: typography.sm, color: colors.textSecondary }}>
                        {new Date(file.uploadDate).toLocaleDateString('vi-VN')}
                      </td>
                      {viewMode === "project" && (
                        <td style={{ padding: spacing.lg, fontSize: typography.sm, color: colors.textSecondary }}>
                          {file.uploadedBy || '-'}
                        </td>
                      )}
                      <td style={{ padding: spacing.lg }}>
                        <div style={{ display: 'flex', gap: spacing.sm, justifyContent: 'center' }}>
                          <button 
                            onClick={() => handleDownload(file.fileId, file.originalFilename)}
                            style={{
                              padding: `${spacing.xs} ${spacing.md}`,
                              background: colors.info,
                              color: '#fff',
                              border: 'none',
                              borderRadius: spacing.md,
                              fontSize: typography.xs,
                              cursor: 'pointer'
                            }}
                          >
                            ⬇️ Tải
                          </button>
                          <button 
                            onClick={() => handleDelete(file.fileId, file.originalFilename)}
                            style={{
                              padding: `${spacing.xs} ${spacing.md}`,
                              background: colors.error,
                              color: '#fff',
                              border: 'none',
                              borderRadius: spacing.md,
                              fontSize: typography.xs,
                              cursor: 'pointer'
                            }}
                          >
                            🗑️ Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <div style={{ ...commonStyles.cardBase, textAlign: 'center', padding: spacing['6xl'] }}>
            <div style={{ fontSize: typography['5xl'], marginBottom: spacing.xl }}>📁</div>
            <div style={{ fontSize: typography.xl, fontWeight: typography.semibold, color: colors.textPrimary, marginBottom: spacing.md }}>
              Chưa có file nào
            </div>
            <div style={{ fontSize: typography.base, color: colors.textSecondary }}>
              {searchTerm ? 'Không tìm thấy file nào khớp với tìm kiếm' : 'Upload file đầu tiên của bạn'}
            </div>
          </div>
        )}
      </div>

      {/* Create Folder Modal */}
      {showCreateFolderModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }}
        onClick={() => setShowCreateFolderModal(false)}
        >
          <div 
            style={{
              background: colors.white,
              borderRadius: spacing.xl,
              padding: spacing['3xl'],
              maxWidth: '400px',
              width: '90%'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ ...commonStyles.heading3, marginBottom: spacing.xl }}>
              📁 Tạo thư mục mới
            </h3>
            <input 
              type="text"
              placeholder="Tên thư mục..."
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
              style={{
                ...commonStyles.inputBase,
                marginBottom: spacing.xl
              }}
              autoFocus
            />
            <div style={{ display: 'flex', gap: spacing.md, justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setShowCreateFolderModal(false)}
                style={{
                  padding: `${spacing.md} ${spacing.xl}`,
                  background: colors.background,
                  color: colors.textSecondary,
                  border: 'none',
                  borderRadius: spacing.lg,
                  fontSize: typography.sm,
                  fontWeight: typography.semibold,
                  cursor: 'pointer'
                }}
              >
                Hủy
              </button>
              <button 
                onClick={handleCreateFolder}
                style={{
                  padding: `${spacing.md} ${spacing.xl}`,
                  background: colors.gradientSuccess,
                  color: '#fff',
                  border: 'none',
                  borderRadius: spacing.lg,
                  fontSize: typography.sm,
                  fontWeight: typography.semibold,
                  cursor: 'pointer'
                }}
              >
                Tạo thư mục
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
