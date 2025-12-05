import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { storageApi } from '@/features/project/storage/api/storageApi';

// Modern SaaS Storage Page Component
export default function SharedStoragePage({
    title = "Quản lý file",
    breadcrumb = "Cá nhân / File của tôi",
    viewMode = "personal",
    projectId = null
}) {
    const [files, setFiles] = useState([]);
    const [folders, setFolders] = useState([]);
    const [currentFolderId, setCurrentFolderId] = useState(null);
    const [currentFolderName, setCurrentFolderName] = useState('');
    const [folderPath, setFolderPath] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [hoveredRow, setHoveredRow] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;
    const [storageStats, setStorageStats] = useState({
        totalFiles: 0,
        totalFolders: 0,
        totalSize: 0,
        quotaLimit: 5 * 1024 * 1024 * 1024,
        usagePercentage: 0,
        fileTypes: 0
    });

    const { user: authUser } = useAuth();

    useEffect(() => {
        loadStorageData();
        loadStorageStats();
        setSelectedItems([]);
        setCurrentPage(1); // Reset to first page when folder changes
    }, [currentFolderId, viewMode, projectId]);

    // Reset to page 1 when search term changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const navigateToFolder = (folderId, folderName) => {
        setCurrentFolderId(folderId);
        setCurrentFolderName(folderName);
        setFolderPath(prev => [...prev, { id: folderId, name: folderName }]);
    };

    const navigateToPath = (index) => {
        if (index === -1) {
            setCurrentFolderId(null);
            setCurrentFolderName('');
            setFolderPath([]);
        } else {
            const targetFolder = folderPath[index];
            setCurrentFolderId(targetFolder.id);
            setCurrentFolderName(targetFolder.name);
            setFolderPath(folderPath.slice(0, index + 1));
        }
    };

    const loadStorageStats = async () => {
        try {
            const stats = await storageApi.getStorageStats();
            if (stats) {
                setStorageStats({
                    totalFiles: stats.totalFiles || 0,
                    totalFolders: stats.totalFolders || 0,
                    totalSize: stats.totalSize || 0,
                    quotaLimit: stats.quotaLimit || 5 * 1024 * 1024 * 1024,
                    usagePercentage: stats.usagePercentage || 0,
                    fileTypes: stats.fileTypes || 0
                });
            }
        } catch (err) {
            console.log('Could not load storage stats:', err);
        }
    };

    const loadStorageData = async () => {
        try {
            setLoading(true);
            setError(null);

            let loadedFolders = [];
            let loadedFiles = [];

            if (currentFolderId) {
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
                if (viewMode === "project" && projectId) {
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
            setError(err.message || 'Không thể tải dữ liệu');
            setLoading(false);
        }
    };

    const handleFileUpload = async (event) => {
        const uploadedFiles = Array.from(event.target.files);
        if (uploadedFiles.length === 0) return;

        try {
            setUploading(true);
            for (const file of uploadedFiles) {
                await storageApi.uploadFile(file, currentFolderId);
            }
            alert(`✅ Đã upload ${uploadedFiles.length} file thành công!`);
            loadStorageData();
            loadStorageStats();
        } catch (err) {
            alert('❌ Lỗi upload file: ' + (err.response?.data?.message || err.message));
        } finally {
            setUploading(false);
            event.target.value = '';
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
            alert('❌ Lỗi tạo thư mục: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleDownload = async (fileId, filename) => {
        try {
            const blob = await storageApi.downloadFile(fileId);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            alert('❌ Lỗi tải file: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleDelete = async (fileId, filename) => {
        if (!window.confirm(`Bạn có chắc muốn xóa file "${filename}"?`)) return;

        try {
            await storageApi.deleteFile(fileId, false);
            loadStorageData();
            loadStorageStats();
        } catch (err) {
            alert('❌ Lỗi xóa file: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleDeleteFolder = async (folderId, folderName) => {
        if (!window.confirm(`Bạn có chắc muốn xóa thư mục "${folderName}"?`)) return;

        try {
            await storageApi.deleteFolder(folderId);
            loadStorageData();
        } catch (err) {
            alert('❌ Lỗi xóa thư mục: ' + (err.response?.data?.message || err.message));
        }
    };

    const formatFileSize = (bytes) => {
        if (!bytes || bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    const getFileExtension = (filename) => {
        const ext = filename.split('.').pop().toUpperCase();
        return ext.length > 4 ? ext.substring(0, 4) : ext;
    };

    const getFileColor = (mimeType) => {
        if (!mimeType) return { bg: '#64748b', light: '#f1f5f9' };
        if (mimeType.includes('pdf')) return { bg: '#ef4444', light: '#fee2e2' };
        if (mimeType.includes('word') || mimeType.includes('document')) return { bg: '#3b82f6', light: '#dbeafe' };
        if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return { bg: '#22c55e', light: '#dcfce7' };
        if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return { bg: '#f97316', light: '#ffedd5' };
        if (mimeType.includes('image')) return { bg: '#a855f7', light: '#f3e8ff' };
        if (mimeType.includes('video')) return { bg: '#ec4899', light: '#fce7f3' };
        if (mimeType.includes('audio')) return { bg: '#f59e0b', light: '#fef3c7' };
        if (mimeType.includes('zip') || mimeType.includes('compressed')) return { bg: '#6366f1', light: '#e0e7ff' };
        return { bg: '#64748b', light: '#f1f5f9' };
    };

    const filteredFiles = files.filter(file =>
        file.originalFilename?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredFolders = folders.filter(folder =>
        folder.folderName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Combine folders and files for pagination
    const allItems = [
        ...filteredFolders.map(f => ({ type: 'folder', data: f })),
        ...filteredFiles.map(f => ({ type: 'file', data: f }))
    ];

    // Pagination logic
    const totalItems = allItems.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedItems = allItems.slice(startIndex, endIndex);

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
            // Only select items on current page
            const pageItems = paginatedItems.map(item =>
                item.type === 'folder'
                    ? `folder-${item.data.folderId}`
                    : `file-${item.data.fileId}`
            );
            setSelectedItems(pageItems);
        } else {
            setSelectedItems([]);
        }
    };

    const isAllSelected = paginatedItems.length > 0 &&
        paginatedItems.every(item =>
            selectedItems.includes(
                item.type === 'folder'
                    ? `folder-${item.data.folderId}`
                    : `file-${item.data.fileId}`
            )
        );

    // Stats from Backend API (total across all folders)
    const totalSize = storageStats.totalSize;
    const fileCount = storageStats.totalFiles;
    const folderCount = storageStats.totalFolders;
    const usagePercent = storageStats.usagePercentage;
    const fileTypes = storageStats.fileTypes;

    // ===================== STYLES =====================
    const styles = {
        container: {
            padding: '32px',
            minHeight: '100vh',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        },
        header: {
            marginBottom: '32px'
        },
        breadcrumb: {
            fontSize: '12px',
            color: '#64748b',
            marginBottom: '8px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
        },
        titleRow: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
        },
        title: {
            fontSize: '28px',
            fontWeight: 700,
            color: '#0f172a',
            margin: 0
        },
        buttonGroup: {
            display: 'flex',
            gap: '12px'
        },
        primaryBtn: {
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
            transition: 'all 0.2s ease'
        },
        secondaryBtn: {
            background: '#fff',
            color: '#6366f1',
            border: '2px solid #e0e7ff',
            borderRadius: '12px',
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease'
        },
        statsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px',
            marginBottom: '28px'
        },
        statCard: {
            background: '#fff',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
            border: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '16px',
            transition: 'all 0.2s ease'
        },
        statIconWrapper: {
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            flexShrink: 0
        },
        statContent: {
            flex: 1
        },
        statValue: {
            fontSize: '28px',
            fontWeight: 700,
            color: '#0f172a',
            lineHeight: 1.2,
            marginBottom: '4px'
        },
        statLabel: {
            fontSize: '13px',
            color: '#64748b',
            fontWeight: 500
        },
        progressBar: {
            height: '6px',
            background: '#f1f5f9',
            borderRadius: '3px',
            overflow: 'hidden',
            marginTop: '12px'
        },
        progressFill: {
            height: '100%',
            background: 'linear-gradient(90deg, #6366f1 0%, #a855f7 100%)',
            borderRadius: '3px',
            transition: 'width 0.3s ease'
        },
        toolbar: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '24px',
            flexWrap: 'wrap'
        },
        searchWrapper: {
            position: 'relative',
            flex: '1',
            maxWidth: '400px'
        },
        searchIcon: {
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#94a3b8',
            fontSize: '18px',
            pointerEvents: 'none'
        },
        searchInput: {
            width: '100%',
            padding: '12px 16px 12px 48px',
            fontSize: '14px',
            border: '2px solid #e2e8f0',
            borderRadius: '12px',
            background: '#fff',
            color: '#334155',
            outline: 'none',
            transition: 'all 0.2s ease',
            boxSizing: 'border-box'
        },
        pathNav: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px',
            flexWrap: 'wrap'
        },
        pathBtn: {
            padding: '6px 14px',
            fontSize: '13px',
            fontWeight: 500,
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            background: '#fff',
            color: '#475569',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.15s ease'
        },
        pathBtnActive: {
            background: '#6366f1',
            color: '#fff',
            border: '1px solid #6366f1'
        },
        table: {
            background: '#fff',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
            border: '1px solid #f1f5f9'
        },
        tableHeader: {
            display: 'grid',
            gridTemplateColumns: '48px 48px 1fr 180px 120px 140px',
            padding: '14px 20px',
            background: '#fafafa',
            borderBottom: '1px solid #f1f5f9',
            fontSize: '11px',
            fontWeight: 600,
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
        },
        tableRow: {
            display: 'grid',
            gridTemplateColumns: '48px 48px 1fr 180px 120px 140px',
            padding: '16px 20px',
            borderBottom: '1px solid #f8fafc',
            alignItems: 'center',
            cursor: 'pointer',
            transition: 'background 0.15s ease'
        },
        tableRowHover: {
            background: '#f8fafc'
        },
        fileIcon: {
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: 700,
            color: '#fff'
        },
        folderIcon: {
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            boxShadow: '0 2px 8px rgba(251, 191, 36, 0.3)'
        },
        fileName: {
            fontSize: '14px',
            fontWeight: 500,
            color: '#1e293b',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        },
        fileMeta: {
            fontSize: '13px',
            color: '#64748b'
        },
        actionBtns: {
            display: 'flex',
            gap: '8px',
            opacity: 0,
            transition: 'opacity 0.15s ease'
        },
        actionBtnsVisible: {
            opacity: 1
        },
        actionBtn: {
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            border: 'none',
            background: '#f1f5f9',
            color: '#475569',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            transition: 'all 0.15s ease'
        },
        actionBtnDanger: {
            background: '#fee2e2',
            color: '#dc2626'
        },
        emptyState: {
            textAlign: 'center',
            padding: '64px 32px',
            color: '#64748b'
        },
        emptyIcon: {
            fontSize: '64px',
            marginBottom: '16px',
            opacity: 0.5
        },
        modal: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        },
        modalContent: {
            background: '#fff',
            borderRadius: '20px',
            padding: '32px',
            width: '100%',
            maxWidth: '420px',
            boxShadow: '0 25px 50px rgba(0,0,0,0.2)'
        },
        modalTitle: {
            fontSize: '20px',
            fontWeight: 700,
            color: '#0f172a',
            marginBottom: '20px'
        },
        modalInput: {
            width: '100%',
            padding: '14px 16px',
            fontSize: '14px',
            border: '2px solid #e2e8f0',
            borderRadius: '12px',
            outline: 'none',
            marginBottom: '20px',
            boxSizing: 'border-box',
            transition: 'border-color 0.2s ease'
        },
        modalBtns: {
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end'
        },
        checkbox: {
            width: '18px',
            height: '18px',
            cursor: 'pointer',
            accentColor: '#6366f1'
        },
        bulkBar: {
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: '12px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)'
        },
        bulkBtn: {
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: '#fff',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'background 0.15s ease'
        }
    };

    // ===================== RENDER =====================
    if (loading) {
        return (
            <div style={styles.container}>
                <div style={{ textAlign: 'center', padding: '80px 0' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
                    <div style={{ fontSize: '16px', color: '#64748b' }}>Đang tải dữ liệu...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.container}>
                <div style={{ textAlign: 'center', padding: '80px 0' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
                    <div style={{ fontSize: '16px', color: '#ef4444', marginBottom: '20px' }}>{error}</div>
                    <button onClick={loadStorageData} style={styles.primaryBtn}>🔄 Thử lại</button>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <div style={styles.breadcrumb}>{breadcrumb}</div>
                <div style={styles.titleRow}>
                    <h1 style={styles.title}>{title}</h1>
                    <div style={styles.buttonGroup}>
                        <button
                            style={styles.secondaryBtn}
                            onClick={() => setShowCreateFolderModal(true)}
                        >
                            📁 Tạo thư mục
                        </button>
                        <label style={styles.primaryBtn}>
                            {uploading ? '⏳ Đang upload...' : '📤 Upload file'}
                            <input
                                type="file"
                                multiple
                                onChange={handleFileUpload}
                                disabled={uploading}
                                style={{ display: 'none' }}
                            />
                        </label>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                    <div style={{ ...styles.statIconWrapper, background: '#dbeafe' }}>
                        <span style={{ color: '#3b82f6' }}>📎</span>
                    </div>
                    <div style={styles.statContent}>
                        <div style={styles.statValue}>{fileCount}</div>
                        <div style={styles.statLabel}>Tổng số file</div>
                    </div>
                </div>

                <div style={styles.statCard}>
                    <div style={{ ...styles.statIconWrapper, background: '#fef3c7' }}>
                        <span style={{ color: '#f59e0b' }}>📁</span>
                    </div>
                    <div style={styles.statContent}>
                        <div style={styles.statValue}>{folderCount}</div>
                        <div style={styles.statLabel}>Thư mục</div>
                    </div>
                </div>

                <div style={styles.statCard}>
                    <div style={{ ...styles.statIconWrapper, background: '#f3e8ff' }}>
                        <span style={{ color: '#a855f7' }}>💾</span>
                    </div>
                    <div style={styles.statContent}>
                        <div style={styles.statValue}>{formatFileSize(totalSize)}</div>
                        <div style={styles.statLabel}>Dung lượng đã dùng</div>
                        <div style={styles.progressBar}>
                            <div style={{ ...styles.progressFill, width: `${usagePercent}%` }} />
                        </div>
                        <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px' }}>
                            {formatFileSize(totalSize)} / {formatFileSize(storageStats.quotaLimit)}
                        </div>
                    </div>
                </div>

                <div style={styles.statCard}>
                    <div style={{ ...styles.statIconWrapper, background: '#dcfce7' }}>
                        <span style={{ color: '#22c55e' }}>📋</span>
                    </div>
                    <div style={styles.statContent}>
                        <div style={styles.statValue}>{fileTypes}</div>
                        <div style={styles.statLabel}>Loại file</div>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div style={styles.toolbar}>
                <div style={styles.searchWrapper}>
                    <span style={styles.searchIcon}>🔍</span>
                    <input
                        type="text"
                        placeholder="Tìm kiếm file hoặc thư mục..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={styles.searchInput}
                    />
                </div>
            </div>

            {/* Breadcrumb Navigation */}
            {folderPath.length > 0 && (
                <div style={styles.pathNav}>
                    <button
                        style={styles.pathBtn}
                        onClick={() => navigateToPath(-1)}
                    >
                        🏠 Thư mục gốc
                    </button>
                    {folderPath.map((folder, index) => (
                        <div key={folder.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: '#cbd5e1' }}>→</span>
                            <button
                                onClick={() => navigateToPath(index)}
                                style={{
                                    ...styles.pathBtn,
                                    ...(index === folderPath.length - 1 ? styles.pathBtnActive : {})
                                }}
                            >
                                📁 {folder.name}
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Bulk Action Bar */}
            {selectedItems.length > 0 && (
                <div style={styles.bulkBar}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{ fontWeight: 600 }}>Đã chọn: {selectedItems.length}</span>
                        <button
                            onClick={() => setSelectedItems([])}
                            style={{ ...styles.bulkBtn, background: 'transparent', padding: '4px 8px' }}
                        >
                            ✕
                        </button>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={async () => {
                                const fileIds = selectedItems.filter(i => i.startsWith('file-')).map(i => parseInt(i.replace('file-', '')));
                                for (const id of fileIds) {
                                    const file = files.find(f => f.fileId === id);
                                    if (file) await handleDownload(id, file.originalFilename);
                                }
                            }}
                            style={styles.bulkBtn}
                        >
                            ⬇️ Tải về
                        </button>
                        <button
                            onClick={async () => {
                                if (!window.confirm(`Xóa ${selectedItems.length} item?`)) return;
                                const fileIds = selectedItems.filter(i => i.startsWith('file-')).map(i => parseInt(i.replace('file-', '')));
                                const folderIds = selectedItems.filter(i => i.startsWith('folder-')).map(i => parseInt(i.replace('folder-', '')));
                                for (const id of fileIds) await storageApi.deleteFile(id, false);
                                for (const id of folderIds) await storageApi.deleteFolder(id);
                                setSelectedItems([]);
                                loadStorageData();
                            }}
                            style={{ ...styles.bulkBtn, background: '#dc2626' }}
                        >
                            🗑️ Xóa
                        </button>
                    </div>
                </div>
            )}

            {/* Files Table */}
            <div style={styles.table}>
                <div style={styles.tableHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <input
                            type="checkbox"
                            style={styles.checkbox}
                            checked={isAllSelected}
                            onChange={(e) => handleSelectAll(e.target.checked)}
                        />
                    </div>
                    <div></div>
                    <div>Tên</div>
                    <div>Ngày sửa đổi</div>
                    <div>Kích thước</div>
                    <div>Thao tác</div>
                </div>

                {/* Empty State */}
                {allItems.length === 0 && (
                    <div style={styles.emptyState}>
                        <div style={styles.emptyIcon}>📂</div>
                        <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>Chưa có file nào</div>
                        <div style={{ fontSize: '14px' }}>Hãy upload file hoặc tạo thư mục mới</div>
                    </div>
                )}

                {/* Paginated Items (Folders & Files) */}
                {paginatedItems.map(item => {
                    if (item.type === 'folder') {
                        const folder = item.data;
                        return (
                            <div
                                key={`folder-${folder.folderId}`}
                                style={{
                                    ...styles.tableRow,
                                    ...(hoveredRow === `folder-${folder.folderId}` ? styles.tableRowHover : {})
                                }}
                                onMouseEnter={() => setHoveredRow(`folder-${folder.folderId}`)}
                                onMouseLeave={() => setHoveredRow(null)}
                                onClick={() => navigateToFolder(folder.folderId, folder.folderName)}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <input
                                        type="checkbox"
                                        style={styles.checkbox}
                                        checked={selectedItems.includes(`folder-${folder.folderId}`)}
                                        onChange={() => handleToggleItem('folder', folder.folderId)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <div style={styles.folderIcon}>📁</div>
                                </div>
                                <div style={styles.fileName}>{folder.folderName}</div>
                                <div style={styles.fileMeta}>
                                    {folder.createdDate ? new Date(folder.createdDate).toLocaleDateString('vi-VN') : '—'}
                                </div>
                                <div style={styles.fileMeta}>{folder.fileCount} file</div>
                                <div style={{
                                    ...styles.actionBtns,
                                    ...(hoveredRow === `folder-${folder.folderId}` ? styles.actionBtnsVisible : {})
                                }}>
                                    <button
                                        style={{ ...styles.actionBtn, ...styles.actionBtnDanger }}
                                        onClick={(e) => { e.stopPropagation(); handleDeleteFolder(folder.folderId, folder.folderName); }}
                                        title="Xóa"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        );
                    } else {
                        const file = item.data;
                        const color = getFileColor(file.mimeType);
                        return (
                            <div
                                key={`file-${file.fileId}`}
                                style={{
                                    ...styles.tableRow,
                                    ...(hoveredRow === `file-${file.fileId}` ? styles.tableRowHover : {})
                                }}
                                onMouseEnter={() => setHoveredRow(`file-${file.fileId}`)}
                                onMouseLeave={() => setHoveredRow(null)}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <input
                                        type="checkbox"
                                        style={styles.checkbox}
                                        checked={selectedItems.includes(`file-${file.fileId}`)}
                                        onChange={() => handleToggleItem('file', file.fileId)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <div style={{ ...styles.fileIcon, background: color.bg }}>
                                        {getFileExtension(file.originalFilename)}
                                    </div>
                                </div>
                                <div style={styles.fileName}>{file.originalFilename}</div>
                                <div style={styles.fileMeta}>
                                    {file.createdAt ? new Date(file.createdAt).toLocaleDateString('vi-VN') : '—'}
                                </div>
                                <div style={styles.fileMeta}>{formatFileSize(file.fileSize)}</div>
                                <div style={{
                                    ...styles.actionBtns,
                                    ...(hoveredRow === `file-${file.fileId}` ? styles.actionBtnsVisible : {})
                                }}>
                                    <button
                                        style={styles.actionBtn}
                                        onClick={(e) => { e.stopPropagation(); handleDownload(file.fileId, file.originalFilename); }}
                                        title="Tải về"
                                    >
                                        ⬇️
                                    </button>
                                    <button
                                        style={{ ...styles.actionBtn, ...styles.actionBtnDanger }}
                                        onClick={(e) => { e.stopPropagation(); handleDelete(file.fileId, file.originalFilename); }}
                                        title="Xóa"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        );
                    }
                })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '20px',
                    padding: '16px 20px',
                    background: '#fff',
                    borderRadius: '12px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                }}>
                    <div style={{ fontSize: '14px', color: '#64748b' }}>
                        Hiển thị {startIndex + 1} - {Math.min(endIndex, totalItems)} trong tổng số {totalItems} mục
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                            style={{
                                padding: '8px 12px',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                background: currentPage === 1 ? '#f1f5f9' : '#fff',
                                color: currentPage === 1 ? '#94a3b8' : '#475569',
                                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                fontSize: '13px',
                                fontWeight: 500
                            }}
                        >
                            ⏮️
                        </button>
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            style={{
                                padding: '8px 14px',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                background: currentPage === 1 ? '#f1f5f9' : '#fff',
                                color: currentPage === 1 ? '#94a3b8' : '#475569',
                                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                fontSize: '13px',
                                fontWeight: 500
                            }}
                        >
                            ◀ Trước
                        </button>

                        <div style={{ display: 'flex', gap: '4px' }}>
                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter(page =>
                                    page === 1 ||
                                    page === totalPages ||
                                    Math.abs(page - currentPage) <= 1
                                )
                                .map((page, idx, arr) => (
                                    <div key={page} style={{ display: 'flex', alignItems: 'center' }}>
                                        {idx > 0 && arr[idx - 1] !== page - 1 && (
                                            <span style={{ padding: '0 8px', color: '#94a3b8' }}>...</span>
                                        )}
                                        <button
                                            onClick={() => setCurrentPage(page)}
                                            style={{
                                                width: '36px',
                                                height: '36px',
                                                border: page === currentPage ? '2px solid #6366f1' : '1px solid #e2e8f0',
                                                borderRadius: '8px',
                                                background: page === currentPage ? '#6366f1' : '#fff',
                                                color: page === currentPage ? '#fff' : '#475569',
                                                cursor: 'pointer',
                                                fontSize: '14px',
                                                fontWeight: page === currentPage ? 600 : 500
                                            }}
                                        >
                                            {page}
                                        </button>
                                    </div>
                                ))
                            }
                        </div>

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            style={{
                                padding: '8px 14px',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                background: currentPage === totalPages ? '#f1f5f9' : '#fff',
                                color: currentPage === totalPages ? '#94a3b8' : '#475569',
                                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                                fontSize: '13px',
                                fontWeight: 500
                            }}
                        >
                            Sau ▶
                        </button>
                        <button
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}
                            style={{
                                padding: '8px 12px',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                background: currentPage === totalPages ? '#f1f5f9' : '#fff',
                                color: currentPage === totalPages ? '#94a3b8' : '#475569',
                                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                                fontSize: '13px',
                                fontWeight: 500
                            }}
                        >
                            ⏭️
                        </button>
                    </div>
                </div>
            )}

            {/* Create Folder Modal */}
            {showCreateFolderModal && (
                <div style={styles.modal} onClick={() => setShowCreateFolderModal(false)}>
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h3 style={styles.modalTitle}>📁 Tạo thư mục mới</h3>
                        <input
                            type="text"
                            placeholder="Nhập tên thư mục..."
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            style={styles.modalInput}
                            autoFocus
                            onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
                        />
                        <div style={styles.modalBtns}>
                            <button
                                style={styles.secondaryBtn}
                                onClick={() => { setShowCreateFolderModal(false); setNewFolderName(''); }}
                            >
                                Hủy
                            </button>
                            <button
                                style={styles.primaryBtn}
                                onClick={handleCreateFolder}
                            >
                                ✓ Tạo thư mục
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
