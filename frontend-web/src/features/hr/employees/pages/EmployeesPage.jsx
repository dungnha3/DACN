import { useState, useEffect } from 'react';
import { employeesService, departmentsService, positionsService } from '@/features/hr/shared/services';
import { apiService } from '@/shared/services/api.service';
import { usePermissions, useErrorHandler } from '@/shared/hooks';
import { validateEmployee } from '@/shared/utils/validation';
import {
  PageContainer,
  PageHeader,
  PageTitle,
  Breadcrumb,
  FilterBar,
  SearchInput,
  Button,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Modal,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
  FormGroup,
  FormLabel,
  FormInput,
  FormSelect,
  LoadingState,
  ErrorState,
  EmptyState,
  PermissionDenied,
  IconButton
} from '@/shared/components/ui';
import Pagination from '@/shared/components/table/Pagination';

const ITEMS_PER_PAGE = 10;

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [createMode, setCreateMode] = useState('existing'); // 'existing' hoặc 'new'
  const [isEditing, setIsEditing] = useState(false);
  const [selectedEmpId, setSelectedEmpId] = useState(null);
  
  // Filter state
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterDept, setFilterDept] = useState('ALL');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  const { isHRManager, isProjectManager, isAccountingManager, currentUser } = usePermissions();
  const { handleError } = useErrorHandler();
  
  // PM self-view mode: only show own profile
  const isSelfViewMode = isProjectManager && !isHRManager;

  const [newEmp, setNewEmp] = useState({
    userId: '',
    hoTen: '',
    cccd: '',
    ngaySinh: '',
    gioiTinh: 'Nam',
    diaChi: '',
    ngayVaoLam: new Date().toISOString().split('T')[0],
    phongbanId: '',
    chucvuId: '',
    luongCoBan: '',
    phuCap: '',
    // Fields cho tạo user mới
    username: '',
    password: '',
    role: 'EMPLOYEE',
    email: '',
    soDienThoai: ''
  });

  // Load dữ liệu từ API
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load employees, departments, positions
      const [empData, deptData, posData] = await Promise.all([
        employeesService.getAll(),
        departmentsService.getAll(),
        positionsService.getAll()
      ]);
      
      setEmployees(empData);
      setDepartments(deptData);
      setPositions(posData);

      // Load users (for dropdown)
      try {
        const usersData = await apiService.get('/api/users');
        setUsers(usersData || []);
      } catch (err) {
        console.warn('Could not load users list', err);
        setUsers([]);
      }
    } catch (err) {
      const errorMessage = handleError(err, { context: 'load_employees_data' });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmp({ ...newEmp, [name]: value });
  };

  const handleEdit = (emp) => {
    setIsEditing(true);
    setCreateMode('existing');
    setSelectedEmpId(emp.nhanvienId);
    setNewEmp({
      userId: emp.userId || '',
      hoTen: emp.hoTen || '',
      cccd: emp.cccd || '',
      ngaySinh: emp.ngaySinh || '',
      gioiTinh: emp.gioiTinh || 'Nam',
      diaChi: emp.diaChi || '',
      ngayVaoLam: emp.ngayVaoLam || '',
      phongbanId: emp.phongbanId || '',
      chucvuId: emp.chucvuId || '',
      luongCoBan: emp.luongCoBan || '',
      phuCap: emp.phuCap || '',
      // Fields user/contact cần load khi edit
      username: emp.username || '',
      password: '', // Không load password
      role: 'EMPLOYEE',
      email: emp.email || '',
      soDienThoai: emp.sdt || emp.soDienThoai || ''
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    setFormErrors({});

    try {
      setLoading(true);
      
      if (isEditing) {
        // Cập nhật nhân viên
        console.log('Validating update data:', newEmp);
        let validationErrors = validateEmployee(newEmp);
        
        // Khi edit, bỏ qua validate các trường user/contact vì API update không xử lý
        if (validationErrors) {
          delete validationErrors.email;
          delete validationErrors.soDienThoai;
          // Nếu object rỗng sau khi xóa thì coi như không có lỗi
          if (Object.keys(validationErrors).length === 0) {
            validationErrors = null;
          }
        }

        if (validationErrors) {
          console.error('Validation errors:', validationErrors);
          setFormErrors(validationErrors);
          alert('Vui lòng kiểm tra lại thông tin!');
          setLoading(false);
          return;
        }

        await employeesService.update(selectedEmpId, {
          userId: Number(newEmp.userId),
          hoTen: newEmp.hoTen,
          cccd: newEmp.cccd || null,
          ngaySinh: newEmp.ngaySinh,
          gioiTinh: newEmp.gioiTinh,
          diaChi: newEmp.diaChi || null,
          ngayVaoLam: newEmp.ngayVaoLam,
          phongbanId: newEmp.phongbanId ? Number(newEmp.phongbanId) : null,
          chucvuId: newEmp.chucvuId ? Number(newEmp.chucvuId) : null,
          luongCoBan: newEmp.luongCoBan ? Number(newEmp.luongCoBan) : 0,
          phuCap: newEmp.phuCap ? Number(newEmp.phuCap) : 0
        });
        alert('✅ Cập nhật nhân viên thành công!');
      } else if (createMode === 'new') {
        // Tạo tài khoản và nhân viên cùng lúc
        if (!newEmp.username || !newEmp.password || !newEmp.email) {
          alert('Vui lòng điền đầy đủ: Username, Password, Email!');
          setLoading(false);
          return;
        }
        
        await apiService.post('/api/accounts/with-employee', {
          username: newEmp.username,
          password: newEmp.password,
          role: newEmp.role,
          hoTen: newEmp.hoTen,
          email: newEmp.email,
          gioiTinh: newEmp.gioiTinh,
          diaChi: newEmp.diaChi || null,
          ngaySinh: newEmp.ngaySinh,
          ngayVaoLam: newEmp.ngayVaoLam,
          soDienThoai: newEmp.soDienThoai || null,
          cccd: newEmp.cccd || null,
          phongBanId: newEmp.phongbanId ? Number(newEmp.phongbanId) : null,
          chucVuId: newEmp.chucvuId ? Number(newEmp.chucvuId) : null
        });
        alert('✅ Tạo tài khoản và nhân viên thành công!');
      } else {
        // Chỉ tạo nhân viên (user đã có sẵn)
        const validationErrors = validateEmployee(newEmp);
        if (validationErrors) {
          setFormErrors(validationErrors);
          alert('Vui lòng kiểm tra lại thông tin!');
          setLoading(false);
          return;
        }
        
        await employeesService.create({
          userId: Number(newEmp.userId),
          hoTen: newEmp.hoTen,
          cccd: newEmp.cccd || null,
          ngaySinh: newEmp.ngaySinh,
          gioiTinh: newEmp.gioiTinh,
          diaChi: newEmp.diaChi || null,
          ngayVaoLam: newEmp.ngayVaoLam,
          phongbanId: newEmp.phongbanId ? Number(newEmp.phongbanId) : null,
          chucvuId: newEmp.chucvuId ? Number(newEmp.chucvuId) : null,
          luongCoBan: newEmp.luongCoBan ? Number(newEmp.luongCoBan) : 0,
          phuCap: newEmp.phuCap ? Number(newEmp.phuCap) : 0
        });
        alert('✅ Thêm nhân viên thành công!');
      }
      
      await loadData();
      setShowModal(false);
      setCreateMode('existing');
      setIsEditing(false);
      setSelectedEmpId(null);
      setNewEmp({
        userId: '',
        hoTen: '',
        cccd: '',
        ngaySinh: '',
        gioiTinh: 'Nam',
        diaChi: '',
        ngayVaoLam: new Date().toISOString().split('T')[0],
        phongbanId: '',
        chucvuId: '',
        luongCoBan: '',
        phuCap: '',
        username: '',
        password: '',
        role: 'EMPLOYEE',
        email: '',
        soDienThoai: ''
      });
    } catch (err) {
      const errorMessage = handleError(err, { context: isEditing ? 'update_employee' : (createMode === 'new' ? 'create_account_with_employee' : 'create_employee') });
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Bạn chắc chắn muốn xóa nhân viên này?')) {
      try {
        setLoading(true);
        await employeesService.delete(id);
        await loadData();
        alert('✅ Xóa nhân viên thành công!');
      } catch (err) {
        const errorMessage = handleError(err, { context: 'delete_employee' });
        alert(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, filterDept]);

  // Filter employees
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.hoTen?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.maNhanVien?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = filterStatus === 'ALL' || emp.trangThai === filterStatus;
    const matchesDept = filterDept === 'ALL' || (emp.phongbanId && String(emp.phongbanId) === String(filterDept));
    
    return matchesSearch && matchesStatus && matchesDept;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Format currency
  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  // Get status badge
  const getStatusBadge = (status) => {
    const config = {
      DANG_LAM_VIEC: { color: '#16a34a', bg: '#dcfce7', text: 'Đang làm' },
      NGHI_VIEC: { color: '#dc2626', bg: '#fee2e2', text: 'Nghỉ việc' },
      TAM_NGHI: { color: '#d97706', bg: '#fef3c7', text: 'Tạm nghỉ' }
    };
    const style = config[status] || config.DANG_LAM_VIEC;
    return (
      <span style={{
        background: style.bg, color: style.color,
        padding: '4px 8px', borderRadius: '6px',
        fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', 
        display: 'inline-block', whiteSpace: 'nowrap'
      }}>
        {style.text}
      </span>
    );
  };

  // Permission guard - Allow HR full access, PM self-view only
  if (!isHRManager && !isProjectManager) {
    return (
      <PageContainer>
        <PermissionDenied 
          message="Không có quyền truy cập"
          description="Chỉ HR Manager hoặc Project Manager mới có quyền xem thông tin nhân viên"
        />
      </PageContainer>
    );
  }

  if (loading) {
    return (
      <PageContainer>
        <LoadingState message="Đang tải dữ liệu nhân viên..." />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <ErrorState message={error} onRetry={loadData} />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Header */}
      <PageHeader>
        <div>
          <Breadcrumb>Quản lý nhân sự / Nhân viên</Breadcrumb>
          <PageTitle>Danh sách Nhân viên</PageTitle>
          <div style={{ fontSize: 14, color: '#7b809a', marginTop: 4 }}>
            Tổng số: {employees.length} nhân viên
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button variant="secondary">📥 Xuất Excel</Button>
          {isHRManager && (
            <Button variant="warning" onClick={() => {
              setIsEditing(false);
              setCreateMode('existing');
              setNewEmp({
                userId: '',
                hoTen: '',
                cccd: '',
                ngaySinh: '',
                gioiTinh: 'Nam',
                diaChi: '',
                ngayVaoLam: new Date().toISOString().split('T')[0],
                phongbanId: '',
                chucvuId: '',
                luongCoBan: '',
                phuCap: '',
                username: '',
                password: '',
                role: 'EMPLOYEE',
                email: '',
                soDienThoai: ''
              });
              setShowModal(true);
            }}>
              + Thêm mới
            </Button>
          )}
        </div>
      </PageHeader>

      {/* PM Self-view Notice */}
      {isSelfViewMode && (
        <div style={{
          background: '#eff6ff', 
          padding: 16, 
          borderRadius: 12, 
          border: '1px solid #bfdbfe',
          display: 'flex', 
          gap: 12, 
          alignItems: 'flex-start', 
          marginBottom: 24
        }}>
          <span style={{fontSize: 18}}>ℹ️</span>
          <div>
            <div style={{fontWeight: 600, color: '#3b82f6'}}>Chế độ xem cá nhân</div>
            <div style={{fontSize: 13, color: '#6b7280', marginTop: 4}}>
              Project Manager chỉ có thể xem thông tin nhân viên. Để quản lý, liên hệ HR Manager.
            </div>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <FilterBar>
        <SearchInput 
          placeholder="Tìm kiếm..." 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <FormSelect 
          style={{ minWidth: 150 }}
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
        >
          <option value="ALL">Tất cả trạng thái</option>
          <option value="DANG_LAM_VIEC">Đang làm việc</option>
          <option value="TAM_NGHI">Tạm nghỉ</option>
          <option value="NGHI_VIEC">Nghỉ việc</option>
        </FormSelect>
        <FormSelect 
          style={{ minWidth: 150 }}
          value={filterDept}
          onChange={e => setFilterDept(e.target.value)}
        >
          <option value="ALL">Tất cả phòng ban</option>
          {departments.map(dept => (
            <option key={dept.phongbanId} value={dept.phongbanId}>
              {dept.tenPhongBan}
            </option>
          ))}
        </FormSelect>
      </FilterBar>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead width={isAccountingManager ? "20%" : "25%"}>Nhân viên</TableHead>
            <TableHead width={isAccountingManager ? "20%" : "25%"}>Liên hệ</TableHead>
            <TableHead width={isAccountingManager ? "15%" : "20%"}>Vị trí</TableHead>
            {isAccountingManager && <TableHead width="15%">Lương CB</TableHead>}
            <TableHead width="10%">Ngày vào</TableHead>
            <TableHead width="10%">Trạng thái</TableHead>
            {isHRManager && <TableHead width="10%" align="right">Thao tác</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedEmployees.length === 0 ? (
            <TableRow>
              <TableCell colSpan={isHRManager ? 7 : 6} align="center">
                <EmptyState 
                  icon="👥" 
                  title="Không có nhân viên"
                  message="Chưa có nhân viên nào được thêm vào hệ thống"
                />
              </TableCell>
            </TableRow>
          ) : (
            paginatedEmployees.map(emp => (
              <TableRow key={emp.nhanvienId}>
                <TableCell>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 10, 
                      background: 'linear-gradient(195deg, #42424a, #191919)',
                      color: '#fff', display: 'grid', placeItems: 'center', 
                      fontSize: 18, boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                      {emp.avatar || '👤'}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{emp.hoTen}</div>
                      <div style={{ fontSize: 12, color: '#7b809a' }}>
                        {emp.maNhanVien || `NV${emp.nhanvienId}`}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ fontSize: 13, color: '#344767' }} title={emp.email}>
                      📧 {emp.email || 'Chưa cập nhật'}
                    </span>
                    <span style={{ fontSize: 13, color: '#7b809a' }}>
                      📞 {emp.sdt || 'Chưa cập nhật'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div style={{ fontWeight: 600, color: '#344767' }}>
                    {emp.tenPhongBan || emp.phongban?.tenPhongBan || 'N/A'}
                  </div>
                  <div style={{ fontSize: 12, color: '#7b809a' }}>
                    {emp.tenChucVu || emp.chucvu?.tenChucVu || 'N/A'}
                  </div>
                </TableCell>
                {isAccountingManager && (
                  <TableCell>
                    <div style={{ fontWeight: 700, color: '#344767' }}>
                      {emp.luongCoBan ? formatCurrency(emp.luongCoBan) : '---'}
                    </div>
                  </TableCell>
                )}
                <TableCell>{emp.ngayVaoLam}</TableCell>
                <TableCell>{getStatusBadge(emp.trangThai)}</TableCell>
                {isHRManager && (
                  <TableCell align="right">
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <IconButton 
                        title="Sửa" 
                        style={{ 
                          color: '#3b82f6', 
                          background: '#eff6ff',
                          border: 'none',
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s'
                        }}
                        onClick={() => handleEdit(emp)}
                      >
                        ✏️
                      </IconButton>
                      <IconButton 
                        title="Xóa"
                        style={{ 
                          color: '#ef4444', 
                          background: '#fef2f2',
                          border: 'none',
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s'
                        }}
                        onClick={() => handleDelete(emp.nhanvienId)}
                      >
                        🗑️
                      </IconButton>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      {filteredEmployees.length > 0 && (
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Modal thêm nhân viên */}
      {showModal && (
        <Modal isOpen={true} onClose={() => setShowModal(false)} size="medium-large">
          <ModalHeader onClose={() => setShowModal(false)}>
            <ModalTitle>{isEditing ? 'Cập nhật thông tin nhân viên' : 'Thêm nhân viên mới'}</ModalTitle>
          </ModalHeader>
          
          <ModalBody style={{ 
            maxHeight: 'calc(100vh - 200px)', 
            overflowY: 'auto', 
            overflowX: 'hidden',
            padding: '24px 32px' // Tăng padding ngang lên 32px
          }}>
            {/* Toggle Mode - Only show when NOT editing */}
            {!isEditing && (
              <div style={{ 
                marginBottom: 24, 
                padding: 12, 
                background: '#f8fafc', 
                borderRadius: 8,
                border: '1px solid #e2e8f0',
                position: 'sticky',
                top: -24,
                zIndex: 10,
                marginTop: -24,
                marginLeft: -32, // Căn chỉnh lại margin âm theo padding mới
                marginRight: -32,
                paddingLeft: 32,
                paddingRight: 32,
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' // Thêm shadow nhẹ để tách biệt
              }}>
                <div style={{ fontWeight: 600, marginBottom: 10, color: '#334155', fontSize: 13 }}>Chế độ tạo</div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    type="button"
                    onClick={() => setCreateMode('existing')}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: 6,
                      border: createMode === 'existing' ? '2px solid #3b82f6' : '1px solid #cbd5e1',
                      background: createMode === 'existing' ? '#eff6ff' : '#fff',
                      color: createMode === 'existing' ? '#1e40af' : '#64748b',
                      fontWeight: createMode === 'existing' ? 600 : 400,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontSize: 13
                    }}
                  >
                    👤 Chọn tài khoản có sẵn
                  </button>
                  <button
                    type="button"
                    onClick={() => setCreateMode('new')}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: 6,
                      border: createMode === 'new' ? '2px solid #10b981' : '1px solid #cbd5e1',
                      background: createMode === 'new' ? '#ecfdf5' : '#fff',
                      color: createMode === 'new' ? '#047857' : '#64748b',
                      fontWeight: createMode === 'new' ? 600 : 400,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontSize: 13
                    }}
                  >
                    ➕ Tạo tài khoản mới
                  </button>
                </div>
              </div>
            )}

            {/* Section: Thông tin tài khoản - Chỉ hiện khi tạo mới và chọn mode new */}
            {!isEditing && createMode === 'new' && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ 
                  fontWeight: 600, 
                  fontSize: 14, 
                  color: '#334155', 
                  marginBottom: 12,
                  paddingBottom: 8,
                  borderBottom: '2px solid #e2e8f0'
                }}>
                  🔐 Thông tin tài khoản
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <FormGroup>
                    <FormLabel required>Username</FormLabel>
                    <FormInput 
                      name="username" 
                      value={newEmp.username} 
                      onChange={handleInputChange} 
                      placeholder="vd: nguyen_van_a"
                      error={formErrors.username}
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <FormLabel required>Password</FormLabel>
                    <FormInput 
                      type="password"
                      name="password" 
                      value={newEmp.password} 
                      onChange={handleInputChange} 
                      placeholder="Tối thiểu 6 ký tự"
                      error={formErrors.password}
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <FormLabel required>Email</FormLabel>
                    <FormInput 
                      type="email"
                      name="email" 
                      value={newEmp.email} 
                      onChange={handleInputChange} 
                      placeholder="email@example.com"
                      error={formErrors.email}
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <FormLabel required>Role</FormLabel>
                    <FormSelect 
                      name="role" 
                      value={newEmp.role} 
                      onChange={handleInputChange}
                    >
                      <option value="EMPLOYEE">Nhân viên</option>
                      <option value="MANAGER_PROJECT">Quản lý dự án</option>
                      <option value="MANAGER_HR">Quản lý nhân sự</option>
                      <option value="MANAGER_ACCOUNTING">Quản lý kế toán</option>
                      <option value="ADMIN">Admin</option>
                    </FormSelect>
                  </FormGroup>
                  
                  <FormGroup style={{ gridColumn: '1 / -1' }}>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormInput 
                      name="soDienThoai" 
                      value={newEmp.soDienThoai} 
                      onChange={handleInputChange} 
                      placeholder="0901234567"
                    />
                  </FormGroup>
                </div>
              </div>
            )}

            {/* Section: Thông tin cơ bản */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ 
                fontWeight: 600, 
                fontSize: 14, 
                color: '#334155', 
                marginBottom: 12,
                paddingBottom: 8,
                borderBottom: '2px solid #e2e8f0'
              }}>
                👤 Thông tin cơ bản
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {!isEditing && createMode === 'existing' && (
                  <FormGroup style={{ gridColumn: '1 / -1' }}>
                    <FormLabel required>Tài khoản</FormLabel>
                    <FormSelect 
                      name="userId" 
                      value={newEmp.userId} 
                      onChange={handleInputChange}
                      error={formErrors.userId}
                    >
                      <option value="">-- Chọn tài khoản --</option>
                      {users.map(user => (
                        <option key={user.userId} value={user.userId}>
                          {user.username} ({user.email})
                        </option>
                      ))}
                    </FormSelect>
                  </FormGroup>
                )}
              
              <FormGroup>
                <FormLabel required>Họ và tên</FormLabel>
                <FormInput 
                  name="hoTen" 
                  value={newEmp.hoTen} 
                  onChange={handleInputChange} 
                  placeholder="Nguyễn Văn A"
                  error={formErrors.hoTen}
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel>CCCD</FormLabel>
                <FormInput 
                  name="cccd" 
                  value={newEmp.cccd} 
                  onChange={handleInputChange} 
                  placeholder="001234567890"
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel required>Ngày sinh</FormLabel>
                <FormInput 
                  type="date" 
                  name="ngaySinh" 
                  value={newEmp.ngaySinh} 
                  onChange={handleInputChange}
                  error={formErrors.ngaySinh}
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel required>Giới tính</FormLabel>
                <FormSelect 
                  name="gioiTinh" 
                  value={newEmp.gioiTinh} 
                  onChange={handleInputChange}
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </FormSelect>
              </FormGroup>
              
                <FormGroup style={{ gridColumn: '1 / -1' }}>
                  <FormLabel>Địa chỉ</FormLabel>
                  <FormInput 
                    name="diaChi" 
                    value={newEmp.diaChi} 
                    onChange={handleInputChange} 
                    placeholder="123 Nguyễn Trãi, Q1"
                  />
                </FormGroup>
              </div>
            </div>

            {/* Section: Công việc */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ 
                fontWeight: 600, 
                fontSize: 14, 
                color: '#334155', 
                marginBottom: 12,
                paddingBottom: 8,
                borderBottom: '2px solid #e2e8f0'
              }}>
                💼 Thông tin công việc
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <FormGroup>
                  <FormLabel required>Ngày vào làm</FormLabel>
                  <FormInput 
                    type="date" 
                    name="ngayVaoLam" 
                    value={newEmp.ngayVaoLam} 
                    onChange={handleInputChange}
                  />
                </FormGroup>
                
                <FormGroup>
                  <FormLabel>Phòng ban</FormLabel>
                  <FormSelect 
                    name="phongbanId" 
                    value={newEmp.phongbanId} 
                    onChange={handleInputChange}
                    error={formErrors.phongbanId}
                  >
                    <option value="">-- Chọn phòng ban --</option>
                    {departments.map(dept => (
                      <option key={dept.phongbanId} value={dept.phongbanId}>
                        {dept.tenPhongBan}
                      </option>
                    ))}
                  </FormSelect>
                </FormGroup>
                
                <FormGroup>
                  <FormLabel>Chức vụ</FormLabel>
                  <FormSelect 
                    name="chucvuId" 
                    value={newEmp.chucvuId} 
                    onChange={handleInputChange}
                    error={formErrors.chucvuId}
                  >
                    <option value="">-- Chọn chức vụ --</option>
                    {positions.map(pos => (
                      <option key={pos.chucvuId} value={pos.chucvuId}>
                        {pos.tenChucVu}
                      </option>
                    ))}
                  </FormSelect>
                </FormGroup>
              
                {isAccountingManager && (
                  <>
                    <FormGroup>
                      <FormLabel>Lương cơ bản</FormLabel>
                      <FormInput 
                        type="number" 
                        name="luongCoBan" 
                        value={newEmp.luongCoBan} 
                        onChange={handleInputChange} 
                        placeholder="VD: 10000000"
                      />
                    </FormGroup>
                    
                    <FormGroup>
                      <FormLabel>Phụ cấp</FormLabel>
                      <FormInput 
                        type="number" 
                        name="phuCap" 
                        value={newEmp.phuCap} 
                        onChange={handleInputChange} 
                        placeholder="VD: 2000000"
                      />
                    </FormGroup>
                  </>
                )}
              </div>
            </div>
          </ModalBody>
          
          <ModalFooter>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Hủy bỏ
            </Button>
            <Button variant="success" onClick={handleSave}>
              {isEditing ? 'Cập nhật' : 'Lưu nhân viên'}
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </PageContainer>
  );
}
