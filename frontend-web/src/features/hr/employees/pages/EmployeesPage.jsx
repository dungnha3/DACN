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

  const { isHRManager, isProjectManager, currentUser } = usePermissions();
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
    phuCap: ''
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

      // Load users (for dropdown) - Try both /users and /api/users
      try {
        const usersData = await apiService.get('/users');
        setUsers(usersData || []);
      } catch (err) {
        console.log('Could not load users from /users, trying /api/users:', err.message);
        try {
          const usersData = await apiService.get('/api/users');
          setUsers(usersData || []);
        } catch (err2) {
          console.error('Could not load users from both endpoints:', err2);
          setUsers([]);
        }
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

  const handleSave = async () => {
    // Validation with validateEmployee
    const validationErrors = validateEmployee(newEmp);
    if (validationErrors) {
      setFormErrors(validationErrors);
      alert('Vui lòng kiểm tra lại thông tin!');
      return;
    }

    setFormErrors({});

    try {
      setLoading(true);
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
      await loadData();
      setShowModal(false);
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
        phuCap: ''
      });
      alert('✅ Thêm nhân viên thành công!');
    } catch (err) {
      const errorMessage = handleError(err, { context: 'create_employee' });
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

  // Filter employees by search term
  const filteredEmployees = employees.filter(emp => 
    emp.hoTen?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.maNhanVien?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <Button variant="warning" onClick={() => setShowModal(true)}>
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
        <FormSelect style={{ minWidth: 150 }}>
          <option>Tất cả trạng thái</option>
        </FormSelect>
        <FormSelect style={{ minWidth: 150 }}>
          <option>Tất cả phòng ban</option>
        </FormSelect>
      </FilterBar>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead width="25%">Nhân viên</TableHead>
            <TableHead width="20%">Liên hệ</TableHead>
            <TableHead width="15%">Vị trí</TableHead>
            <TableHead width="15%">Lương CB</TableHead>
            <TableHead width="10%">Ngày vào</TableHead>
            <TableHead width="10%">Trạng thái</TableHead>
            {isHRManager && <TableHead width="5%" align="right">Thao tác</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredEmployees.length === 0 ? (
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
            filteredEmployees.map(emp => (
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
                    {emp.phongban?.tenPhongBan || 'N/A'}
                  </div>
                  <div style={{ fontSize: 12, color: '#7b809a' }}>
                    {emp.chucvu?.tenChucVu || 'N/A'}
                  </div>
                </TableCell>
                <TableCell>
                  <div style={{ fontWeight: 700, color: '#344767' }}>
                    {formatCurrency(emp.luongCoBan)}
                  </div>
                </TableCell>
                <TableCell>{emp.ngayVaoLam}</TableCell>
                <TableCell>{getStatusBadge(emp.trangThai)}</TableCell>
                {isHRManager && (
                  <TableCell align="right">
                    <div style={{ display: 'flex', gap: 4 }}>
                      <IconButton title="Sửa">✏️</IconButton>
                      <IconButton 
                        title="Xóa"
                        style={{ color: '#ef4444', background: '#fef2f2' }}
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

      {/* Modal thêm nhân viên */}
      {showModal && (
        <Modal isOpen={true} onClose={() => setShowModal(false)}>
          <ModalHeader onClose={() => setShowModal(false)}>
            <ModalTitle>Thêm nhân viên mới</ModalTitle>
          </ModalHeader>
          
          <ModalBody>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <FormGroup>
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
              
              <FormGroup>
                <FormLabel>Địa chỉ</FormLabel>
                <FormInput 
                  name="diaChi" 
                  value={newEmp.diaChi} 
                  onChange={handleInputChange} 
                  placeholder="123 Nguyễn Trãi, Q1"
                />
              </FormGroup>
              
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
                >
                  <option value="">-- Chọn chức vụ --</option>
                  {positions.map(pos => (
                    <option key={pos.chucvuId} value={pos.chucvuId}>
                      {pos.tenChucVu}
                    </option>
                  ))}
                </FormSelect>
              </FormGroup>
              
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
            </div>
          </ModalBody>
          
          <ModalFooter>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Hủy bỏ
            </Button>
            <Button variant="success" onClick={handleSave}>
              Lưu nhân viên
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </PageContainer>
  );
}
