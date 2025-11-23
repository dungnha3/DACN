import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { usePermissions, useErrorHandler } from '@/shared/hooks';
import { commonStyles } from '@/shared/utils';
import { colors, typography, spacing } from '@/shared/styles/theme';
import { storageApi } from '@/features/project/storage/api/storageApi';

export default function SharedStoragePage({ 
  title = "Quản lý file",
  breadcrumb = "Cá nhân / File của tôi",
  viewMode = "personal", // "personal" | "project"
  projectId = null // Required when viewMode = "project"
}) {
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [currentFolderName, setCurrentFolderName] = useState('');
  const [folderPath, setFolderPath] = useState([]); // [{id, name}]
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewType, setViewType] = useState('list'); // 'grid' | 'list'
  const [selectedItems, setSelectedItems] = useState([]); // Selected file/folder IDs
  
  const { user: authUser } = useAuth();
  const { currentUser, isProjectManager, isHRManager } = usePermissions();
  const { handleError } = useErrorHandler();

  useEffect(() => {
    loadStorageData();
    setSelectedItems([]); // Clear selection khi navigate
  }, [currentFolderId, viewMode, projectId]);

  // Helper function to navigate to folder
  const navigateToFolder = (folderId, folderName) => {
    setCurrentFolderId(folderId);
    setCurrentFolderName(folderName);
    setFolderPath(prev => [...prev, { id: folderId, name: folderName }]);
  };

  // Helper function to navigate back
  const navigateToPath = (index) => {
    if (index === -1) {
      // Go to root
      setCurrentFolderId(null);
      setCurrentFolderName('');
      setFolderPath([]);
    } else {
      // Go to specific folder in path
      const targetFolder = folderPath[index];
      setCurrentFolderId(targetFolder.id);
      setCurrentFolderName(targetFolder.name);
      setFolderPath(folderPath.slice(0, index + 1));
    }
  };

  const loadStorageData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load folders and files from API
      let loadedFolders = [];
      let loadedFiles = [];
      
      if (currentFolderId) {
        // Load subfolders and files of current folder
        const [subfoldersRes, filesRes] = await Promise.all([
          storageApi.getSubFolders(currentFolderId),
          storageApi.getFolderFiles(currentFolderId)
        ]);
        
        loadedFolders = subfoldersRes.map(f => ({
          folderId: f.folderId,
          folderName: f.name,
          fileCount: f.fileCount || 0,
          createdDate: f.createdAt
        }));
        
        loadedFiles = filesRes;
      } else {
        // Load root level folders and files
        if (viewMode === "project" && projectId) {
          // Load project folders
          const [foldersRes, filesRes] = await Promise.all([
            storageApi.getProjectFolders(projectId),
            storageApi.getMyFiles()
          ]);
          
          loadedFolders = foldersRes.map(f => ({
            folderId: f.folderId,
            folderName: f.name,
            fileCount: f.fileCount || 0,
            createdDate: f.createdAt
          }));
          
          loadedFiles = filesRes.filter(file => !file.folderId && file.projectId === projectId);
        } else {
          // Load personal folders and files
          const [foldersRes, filesRes] = await Promise.all([
            storageApi.getMyFolders(),
            storageApi.getMyFiles()
          ]);
          
          loadedFolders = foldersRes.map(f => ({
            folderId: f.folderId,
            folderName: f.name,
            fileCount: f.fileCount || 0,
            createdDate: f.createdAt
          }));
          
          loadedFiles = filesRes.filter(file => !file.folderId);
        }
      }
      
      setFolders(loadedFolders);
      setFiles(loadedFiles);
      setLoading(false);
    } catch (err) {
      console.error('Error loading storage data:', err);
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
      
      // Upload each file
      for (const file of uploadedFiles) {
        await storageApi.uploadFile(file, currentFolderId);
      }
      
      alert(`✅ Đã upload ${uploadedFiles.length} file thành công!`);
      loadStorageData();
    } catch (err) {
      console.error('Error uploading files:', err);
      alert('❌ Lỗi upload file: ' + (err.response?.data?.message || err.message));
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
      await storageApi.createFolder({
        name: newFolderName,
        parentFolderId: currentFolderId,
        folderType: viewMode === 'project' ? 'PROJECT' : 'PERSONAL',
        projectId: viewMode === 'project' ? projectId : null
      });
      
      alert(`✅ Đã tạo thư mục "${newFolderName}" thành công!`);
      setNewFolderName('');
      setShowCreateFolderModal(false);
      loadStorageData();
    } catch (err) {
      console.error('Error creating folder:', err);
      alert('❌ Lỗi tạo thư mục: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDownload = async (fileId, filename) => {
    try {
      const blob = await storageApi.downloadFile(fileId);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      alert(`✅ Đã tải file: ${filename}`);
    } catch (err) {
      console.error('Error downloading file:', err);
      alert('❌ Lỗi tải file: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (fileId, filename) => {
    if (!window.confirm(`Bạn có chắc muốn xóa file "${filename}"?`)) {
      return;
    }
    
    try {
      await storageApi.deleteFile(fileId, false); // soft delete
      alert(`✅ Đã xóa file "${filename}"`);
      loadStorageData();
    } catch (err) {
      console.error('Error deleting file:', err);
      alert('❌ Lỗi xóa file: ' + (err.response?.data?.message || err.message));
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

  const getFileExtension = (filename) => {
    const ext = filename.split('.').pop().toUpperCase();
    return ext.length > 4 ? ext.substring(0, 4) : ext;
  };

  const getFileIconBackground = (mimeType) => {
    if (mimeType.includes('pdf')) return '#EA4335';
    if (mimeType.includes('word') || mimeType.includes('document')) return '#4285F4';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '#0F9D58';
    if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return '#F4B400';
    if (mimeType.includes('image')) return '#9C27B0';
    if (mimeType.includes('video')) return '#FF5722';
    if (mimeType.includes('audio')) return '#FF9800';
    if (mimeType.includes('zip') || mimeType.includes('compressed')) return '#607D8B';
    return '#757575';
  };

  const filteredFiles = files.filter(file => 
    file.originalFilename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handlers for checkbox selection
  const handleToggleItem = (type, id) => {
    const itemKey = `${type}-${id}`;
    setSelectedItems(prev => 
      prev.includes(itemKey) 
        ? prev.filter(item => item !== itemKey)
        : [...prev, itemKey]
    );
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      const allItems = [
        ...folders.map(f => `folder-${f.folderId}`),
        ...filteredFiles.map(f => `file-${f.fileId}`)
      ];
      setSelectedItems(allItems);
    } else {
      setSelectedItems([]);
    }
  };

  const handleClearSelection = () => {
    setSelectedItems([]);
  };

  const handleBulkDownload = async () => {
    const fileIds = selectedItems
      .filter(item => item.startsWith('file-'))
      .map(item => parseInt(item.replace('file-', '')));
    
    if (fileIds.length === 0) {
      alert('⚠️ Chưa chọn file nào để tải xuống');
      return;
    }

    for (const fileId of fileIds) {
      const file = files.find(f => f.fileId === fileId);
      if (file) {
        await handleDownload(fileId, file.originalFilename);
      }
    }
    alert(`✅ Đã tải ${fileIds.length} file`);
  };

  const handleBulkMoveToTrash = async () => {
    const fileIds = selectedItems
      .filter(item => item.startsWith('file-'))
      .map(item => parseInt(item.replace('file-', '')));
    
    if (fileIds.length === 0) {
      alert('⚠️ Chưa chọn item nào');
      return;
    }

    if (!window.confirm(`Di chuyển ${fileIds.length} item vào thùng rác?`)) {
      return;
    }

    try {
      for (const fileId of fileIds) {
        await storageApi.deleteFile(fileId, false); // soft delete
      }
      alert(`✅ Đã di chuyển ${fileIds.length} item vào thùng rác`);
      setSelectedItems([]);
      loadStorageData();
    } catch (err) {
      alert('❌ Lỗi: ' + err.message);
    }
  };

  const handleBulkDelete = async () => {
    const fileIds = selectedItems
      .filter(item => item.startsWith('file-'))
      .map(item => parseInt(item.replace('file-', '')));
    
    if (fileIds.length === 0) {
      alert('⚠️ Chưa chọn item nào');
      return;
    }

    if (!window.confirm(`XÓA VĨNH VIỄN ${fileIds.length} item? Hành động này không thể hoàn tác!`)) {
      return;
    }

    try {
      for (const fileId of fileIds) {
        await storageApi.deleteFile(fileId, true); // permanent delete
      }
      alert(`✅ Đã xóa vĩnh viễn ${fileIds.length} item`);
      setSelectedItems([]);
      loadStorageData();
    } catch (err) {
      alert('❌ Lỗi: ' + err.message);
    }
  };

  const isAllSelected = selectedItems.length > 0 && 
    selectedItems.length === (folders.length + filteredFiles.length);

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

      {/* Breadcrumb Navigation */}
      {folderPath.length > 0 && (
        <div style={{ marginBottom: spacing.lg, display: 'flex', alignItems: 'center', gap: spacing.sm }}>
          <button
            onClick={() => navigateToPath(-1)}
            style={{
              padding: `${spacing.xs} ${spacing.md}`,
              background: 'transparent',
              color: colors.primary,
              border: `1px solid ${colors.primary}`,
              borderRadius: spacing.md,
              fontSize: typography.sm,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: spacing.xs
            }}
          >
            🏠 Thư mục gốc
          </button>
          {folderPath.map((folder, index) => (
            <div key={folder.id} style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
              <span style={{ color: colors.textSecondary }}>→</span>
              <button
                onClick={() => navigateToPath(index)}
                style={{
                  padding: `${spacing.xs} ${spacing.md}`,
                  background: index === folderPath.length - 1 ? colors.primary : 'transparent',
                  color: index === folderPath.length - 1 ? '#fff' : colors.primary,
                  border: `1px solid ${colors.primary}`,
                  borderRadius: spacing.md,
                  fontSize: typography.sm,
                  cursor: 'pointer'
                }}
              >
                📁 {folder.name}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Bulk Action Toolbar */}
      {selectedItems.length > 0 && (
        <div style={{
          background: '#A855F7',
          color: '#fff',
          padding: spacing.md,
          borderRadius: spacing.lg,
          marginBottom: spacing.md,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(168, 85, 247, 0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.lg }}>
            <span style={{ fontSize: typography.sm, fontWeight: typography.semibold }}>
              Đã chọn: {selectedItems.length}
            </span>
            <button
              onClick={handleClearSelection}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                fontSize: typography.lg,
                padding: spacing.xs
              }}
              title="Hủy chọn"
            >
              ×
            </button>
          </div>
          <div style={{ display: 'flex', gap: spacing.md }}>
            <button
              onClick={handleBulkDownload}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: '#fff',
                padding: `${spacing.sm} ${spacing.lg}`,
                borderRadius: spacing.md,
                fontSize: typography.sm,
                fontWeight: typography.semibold,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: spacing.sm,
                ':hover': { background: 'rgba(255,255,255,0.3)' }
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            >
              ⬇️ TảI VỀ
            </button>
            <button
              onClick={handleBulkMoveToTrash}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: '#fff',
                padding: `${spacing.sm} ${spacing.lg}`,
                borderRadius: spacing.md,
                fontSize: typography.sm,
                fontWeight: typography.semibold,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: spacing.sm
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            >
              🗑️ DI CHUYỂN ĐẾN THÙNG RÁC
            </button>
            <button
              onClick={handleBulkDelete}
              style={{
                background: '#DC2626',
                border: 'none',
                color: '#fff',
                padding: `${spacing.sm} ${spacing.lg}`,
                borderRadius: spacing.md,
                fontSize: typography.sm,
                fontWeight: typography.semibold,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: spacing.sm
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#B91C1C'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#DC2626'}
            >
              ⚠️ XÓa Bỏ
            </button>
          </div>
        </div>
      )}

      {/* Files and Folders List View */}
      <div style={{
        background: '#fff',
        borderRadius: spacing.lg,
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '40px 40px 1fr 200px 120px',
          padding: spacing.md,
          background: colors.background,
          borderBottom: `1px solid ${colors.border}`,
          fontSize: typography.sm,
          fontWeight: typography.semibold,
          color: colors.textSecondary
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <input 
              type="checkbox" 
              style={{ cursor: 'pointer' }}
              checked={isAllSelected}
              onChange={(e) => handleSelectAll(e.target.checked)}
            />
          </div>
          <div></div>
          <div>Tên</div>
          <div>Sửa đổi</div>
          <div>Kích thước</div>
        </div>

        {/* Folders */}
        {folders.map(folder => (
          <div
            key={`folder-${folder.folderId}`}
            onClick={() => navigateToFolder(folder.folderId, folder.folderName)}
            style={{
              display: 'grid',
              gridTemplateColumns: '40px 40px 1fr 200px 120px',
              padding: spacing.md,
              borderBottom: `1px solid ${colors.border}`,
              cursor: 'pointer',
              transition: 'background 0.2s',
              ':hover': { background: colors.background }
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = colors.background}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <input
                type="checkbox"
                checked={selectedItems.includes(`folder-${folder.folderId}`)}
                onChange={() => handleToggleItem('folder', folder.folderId)}
                onClick={(e) => e.stopPropagation()}
                style={{ cursor: 'pointer' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{
                width: '32px',
                height: '32px',
                background: '#4285F4',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: typography.lg
              }}>
                📁
              </div>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: typography.sm,
              color: colors.textPrimary,
              fontWeight: typography.medium
            }}>
              {folder.folderName}
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: typography.sm,
              color: colors.textSecondary
            }}>
              {folder.createdDate ? new Date(folder.createdDate).toLocaleDateString('vi-VN') : '-'}
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: typography.sm,
              color: colors.textSecondary
            }}>
              {folder.fileCount} file
            </div>
          </div>
        ))}

        {/* Files */}
        {filteredFiles.map(file => (
          <div
            key={`file-${file.fileId}`}
            style={{
              display: 'grid',
              gridTemplateColumns: '40px 40px 1fr 200px 120px',
              padding: spacing.md,
              borderBottom: `1px solid ${colors.border}`,
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = colors.background}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <input
                type="checkbox"
                checked={selectedItems.includes(`file-${file.fileId}`)}
                onChange={() => handleToggleItem('file', file.fileId)}
                onClick={(e) => e.stopPropagation()}
                style={{ cursor: 'pointer' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{
                width: '32px',
                height: '32px',
                background: getFileIconBackground(file.mimeType),
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: typography.base,
                color: '#fff',
                fontWeight: typography.bold
              }}>
                {getFileExtension(file.originalFilename)}
              </div>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: typography.sm,
              color: colors.textPrimary,
              gap: spacing.md
            }}>
              <span>{file.originalFilename}</span>
              <div style={{ display: 'flex', gap: spacing.xs }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(file.fileId, file.originalFilename);
                  }}
                  style={{
                    padding: spacing.xs,
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: typography.sm,
                    color: colors.textSecondary,
                    ':hover': { color: colors.primary }
                  }}
                  title="Tải xuống"
                >
                  ⬇️
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(file.fileId, file.originalFilename);
                  }}
                  style={{
                    padding: spacing.xs,
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: typography.sm,
                    color: colors.textSecondary,
                    ':hover': { color: colors.error }
                  }}
                  title="Xóa"
                >
                  🗑️
                </button>
              </div>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: typography.sm,
              color: colors.textSecondary
            }}>
              {file.uploadDate ? new Date(file.uploadDate).toLocaleDateString('vi-VN', { 
                day: '2-digit', 
                month: 'short', 
                hour: '2-digit', 
                minute: '2-digit' 
              }) : '-'}
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: typography.sm,
              color: colors.textSecondary
            }}>
              {formatFileSize(file.fileSize)}
            </div>
          </div>
        ))}

        {/* Empty State */}
        {folders.length === 0 && filteredFiles.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: spacing['6xl'],
            color: colors.textSecondary 
          }}>
            <div style={{ fontSize: typography['5xl'], marginBottom: spacing.lg }}>📁</div>
            <div style={{ fontSize: typography.lg, marginBottom: spacing.sm }}>
              {searchTerm ? 'Không tìm thấy kết quả' : 'Chưa có file hoặc thư mục nào'}
            </div>
            <div style={{ fontSize: typography.sm }}>
              {searchTerm ? 'Thử tìm kiếm với từ khóa khác' : 'Upload file đầu tiên của bạn'}
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
