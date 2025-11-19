# 🔍 FRONTEND SECURITY AUDIT - HOÀN CHỈNH

**Ngày:** 2025-11-19  
**Files đã đọc:** 25+ files  
**Status:** Complete

---

## ✅ ROUTING & AUTHENTICATION - AN TOÀN

- ✅ `RoleRoute.jsx` - Check role đúng
- ✅ `index.jsx` - Routes được bảo vệ
- ✅ `PrivateRoute.jsx` - Check authentication
- ✅ `useAuth.js` - Context đúng

**KẾT LUẬN:** Authentication & routing layer AN TOÀN

---

## ❌ PAGES - 3 VI PHẠM NGHIÊM TRỌNG

### 1. **EmployeesPage.jsx** - HR XEM ĐƯỢC LƯƠNG

**File:** `c:\DACN\frontend-web\src\features\hr\employees\pages\EmployeesPage.jsx`

#### Vấn đề 1: Table hiển thị lương (Line 213, 241)
```javascript
<th style={{...s.th, width: '15%'}}>Lương CB</th>  // ❌ Cột lương
// ...
<td>{formatCurrency(emp.luongCoBan)}</td>  // ❌ HR thấy!
```

#### Vấn đề 2: Form có input lương (Line 322-328)
```javascript
<div style={s.formGroup}>
  <label>Lương cơ bản</label>
  <input name="luongCoBan" value={newEmp.luongCoBan} />  // ❌ HR nhập được
</div>
<div style={s.formGroup}>
  <label>Phụ cấp</label>
  <input name="phuCap" value={newEmp.phuCap} />  // ❌ HR nhập được
</div>
```

#### Vấn đề 3: POST request có lương (Line 104-105)
```javascript
luongCoBan: newEmp.luongCoBan ? Number(newEmp.luongCoBan) : 0,
phuCap: newEmp.phuCap ? Number(newEmp.phuCap) : 0
// ❌ HR gửi được lương lên Backend
```

**IMPACT:** HR thấy và có thể nhập lương cho tất cả nhân viên

---

### 2. **ContractsPage.jsx** - HR XEM & NHẬP LƯƠNG

**File:** `c:\DACN\frontend-web\src\features\hr\contracts\pages\ContractsPage.jsx`

#### Vấn đề 1: Form state có lương (Line 18)
```javascript
const [formData, setFormData] = useState({
  nhanvienId: '',
  loaiHopDong: 'THU_VIEC',
  ngayBatDau: new Date().toISOString().split('T')[0],
  ngayKetThuc: '',
  luongCoBan: '',  // ❌ HR nhập được
  noiDung: ''
});
```

#### Vấn đề 2: Validation yêu cầu lương (Line 105-107)
```javascript
if (!formData.luongCoBan || formData.luongCoBan <= 0) {
  return alert('Vui lòng nhập lương cơ bản hợp lệ!');  // ❌ FORCE HR nhập lương
}
```

#### Vấn đề 3: POST hợp đồng với lương (Line 111-115)
```javascript
await contractsService.create({
  ...formData,
  nhanvienId: Number(formData.nhanvienId),
  luongCoBan: Number(formData.luongCoBan)  // ❌ HR gửi lương
});
```

#### Vấn đề 4: Table hiển thị lương (cần kiểm tra)
Có thể có cột hiển thị `luongCoBan` trong table hợp đồng

**IMPACT:** HR buộc phải nhập lương khi tạo hợp đồng

---

### 3. **PayrollPage.jsx** - MOCK DATA, KHÔNG API

**File:** `c:\DACN\frontend-web\src\features\hr\payroll\pages\PayrollPage.jsx`

```javascript
const mockPayroll = [  // ❌ Hardcoded fake data
  { id: 1, nhanVien: 'Nguyễn Văn A', luongCoBan: 15000000, ... }
];

export default function PayrollPage() {
  const [payrolls, setPayrolls] = useState(mockPayroll);  // ❌ Mock
  
  // KHÔNG CÓ API CALL NÀO!
  // KHÔNG CÓ useEffect để loadData
  // KHÔNG CÓ permission check
```

**IMPACT:** 
- Trang lương không kết nối Backend
- Không tuân thủ phân quyền
- Data không thật

---

## ✅ DASHBOARDS - OK NHƯNG KHÔNG CHECK PERMISSION

### **HrManagerDashboard.jsx** - Line 657
```javascript
{active === 'payroll' && <PayrollPage />}
// ✅ Render PayrollPage
// ❌ Nhưng PayrollPage dùng mock data
```

**Vấn đề:** HR Dashboard có menu "Bảng lương" và render `PayrollPage` nhưng:
- PayrollPage không gọi API
- Không có data thật
- Không check permission ở component level

### **AccountingManagerDashboard.jsx** - Dùng mock data

**Line 5, 13:**
```javascript
import { payrollData, payrollSummary } from './components/AccountingManagerDashboard.constants'

const [payroll, setPayroll] = useState(payrollData)  // ❌ Mock data
```

**Line 60-73:** Auto calculate salary (mock)
```javascript
const handleAutoCalculateSalary = async () => {
  setIsCalculating(true)
  
  // Simulate API call  // ❌ Fake, không gọi API thật
  setTimeout(() => {
    // ...
  }, 2000)
}
```

**IMPACT:** Accounting Dashboard cũng dùng mock data thay vì API

---

## 📊 TỔNG KẾT VI PHẠM

| File | Vấn đề | Severity | Phân quyền bị vi phạm |
|------|--------|----------|---------------------|
| **EmployeesPage.jsx** | HR xem & nhập lương | 🔴 CRITICAL | HR → Xem lương |
| **ContractsPage.jsx** | HR BUỘC nhập lương | 🔴 CRITICAL | HR → Xem & set lương |
| **PayrollPage.jsx** | Không dùng API | 🟠 HIGH | HR → Có menu lương |
| **HrManagerDashboard** | Render PayrollPage | 🟠 HIGH | HR → Access payroll |
| **AccountingDashboard** | Mock data | 🟡 MEDIUM | Accounting → Không sync BE |

---

## 🎯 GIẢI PHÁP CHI TIẾT

### **Fix 1: EmployeesPage.jsx**

```javascript
import { useAuth } from '@/features/auth/hooks/useAuth';
import { USER_ROLES } from '@/shared/constants/roles.constants';

export default function EmployeesPage() {
  const { user } = useAuth();
  const isAccounting = user?.role === USER_ROLES.MANAGER_ACCOUNTING;
  
  // ... existing code
  
  return (
    <table>
      <thead>
        <tr>
          <th>Nhân viên</th>
          <th>Liên hệ</th>
          <th>Vị trí</th>
          
          {/* CHỈ Accounting thấy cột lương */}
          {isAccounting && <th>Lương CB</th>}
          
          <th>Ngày vào</th>
          <th>Trạng thái</th>
        </tr>
      </thead>
      <tbody>
        {employees.map(emp => (
          <tr>
            {/* ... các cột khác */}
            
            {/* CHỈ Accounting thấy lương */}
            {isAccounting && (
              <td>{formatCurrency(emp.luongCoBan)}</td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
    
    {/* Modal form */}
    <div style={s.modalBody}>
      {/* ... các fields khác */}
      
      {/* CHỈ Accounting nhập lương */}
      {isAccounting && (
        <>
          <div style={s.formGroup}>
            <label>Lương cơ bản</label>
            <input name="luongCoBan" />
          </div>
          <div style={s.formGroup}>
            <label>Phụ cấp</label>
            <input name="phuCap" />
          </div>
        </>
      )}
    </div>
  );
}

// handleSave: không gửi lương nếu không phải Accounting
const handleSave = async () => {
  const payload = {
    userId: Number(newEmp.userId),
    hoTen: newEmp.hoTen,
    // ... các fields khác
  };
  
  // CHỈ Accounting gửi lương
  if (isAccounting) {
    payload.luongCoBan = newEmp.luongCoBan ? Number(newEmp.luongCoBan) : 0;
    payload.phuCap = newEmp.phuCap ? Number(newEmp.phuCap) : 0;
  }
  
  await employeesService.create(payload);
};
```

---

### **Fix 2: ContractsPage.jsx**

```javascript
import { useAuth } from '@/features/auth/hooks/useAuth';
import { USER_ROLES } from '@/shared/constants/roles.constants';

export default function ContractsPage() {
  const { user } = useAuth();
  const isAccounting = user?.role === USER_ROLES.MANAGER_ACCOUNTING;
  
  // ... existing code
  
  const handleCreateContract = async () => {
    // ... validation khác
    
    // CHỈ Accounting cần nhập lương
    if (isAccounting && (!formData.luongCoBan || formData.luongCoBan <= 0)) {
      return alert('Vui lòng nhập lương cơ bản hợp lệ!');
    }
    
    const payload = {
      nhanvienId: Number(formData.nhanvienId),
      loaiHopDong: formData.loaiHopDong,
      ngayBatDau: formData.ngayBatDau,
      ngayKetThuc: formData.ngayKetThuc,
      noiDung: formData.noiDung
    };
    
    // CHỈ Accounting gửi lương
    if (isAccounting) {
      payload.luongCoBan = Number(formData.luongCoBan);
    }
    
    await contractsService.create(payload);
  };
  
  return (
    <>
      {/* Table - ẩn cột lương cho HR */}
      <table>
        <thead>
          <tr>
            <th>Nhân viên</th>
            <th>Loại HĐ</th>
            <th>Ngày bắt đầu</th>
            <th>Ngày kết thúc</th>
            
            {/* CHỈ Accounting thấy lương */}
            {isAccounting && <th>Lương</th>}
            
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {contracts.map(c => (
            <tr>
              {/* ... */}
              {isAccounting && (
                <td>{formatCurrency(c.luongCoBan)}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Form modal */}
      {showCreateModal && (
        <div>
          {/* ... các fields khác */}
          
          {/* CHỈ Accounting nhập lương */}
          {isAccounting && (
            <div style={s.formGroup}>
              <label>Lương cơ bản <span style={{color:'red'}}>*</span></label>
              <input 
                type="number" 
                name="luongCoBan" 
                value={formData.luongCoBan} 
                onChange={(e) => setFormData({...formData, luongCoBan: e.target.value})}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
}
```

---

### **Fix 3: PayrollPage.jsx - GỌI API THẬT**

```javascript
import { useState, useEffect } from 'react';
import { payrollService } from '@/features/hr/shared/services';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { USER_ROLES } from '@/shared/constants/roles.constants';

export default function PayrollPage() {
  const { user } = useAuth();
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('2024-11');
  
  // PERMISSION CHECK
  if (user?.role !== USER_ROLES.MANAGER_ACCOUNTING) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <h2>🚫 Không có quyền truy cập</h2>
        <p>Chỉ Accounting Manager mới có quyền xem bảng lương</p>
      </div>
    );
  }
  
  useEffect(() => {
    loadPayrolls();
  }, [selectedMonth]);
  
  const loadPayrolls = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [month, year] = selectedMonth.split('-');
      const data = await payrollService.getByPeriod(Number(month), Number(year));
      setPayrolls(data);
    } catch (err) {
      setError(err.message);
      console.error('Load payroll error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCalculateSalary = async () => {
    try {
      setLoading(true);
      await payrollService.calculateAll();
      await loadPayrolls();
      alert('Đã tính lương tự động thành công!');
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {/* UI giữ nguyên, nhưng dùng data từ API */}
      {/* ... */}
    </div>
  );
}
```

---

### **Fix 4: HrManagerDashboard - Xóa menu "Bảng lương"**

```javascript
// Line 148-159: Xóa hoặc comment menu "Bảng lương"
<div style={styles.navGroup}>
  <div style={styles.navGroupLabel}>Chấm công & Lương</div>
  <NavItem active={active === 'attendance'} onClick={() => setActive('attendance')} icon="🕐">
    Chấm công
  </NavItem>
  
  {/* ❌ XÓA MENU NÀY - HR KHÔNG CÓ QUYỀN */}
  {/* <NavItem active={active === 'payroll'} onClick={() => setActive('payroll')} icon="💰">
    Bảng lương
  </NavItem> */}
  
  <NavItem active={active === 'leaves'} onClick={() => setActive('leaves')} icon="📋">
    Nghỉ phép
  </NavItem>
</div>

// Line 657: Xóa render PayrollPage
{/* ❌ XÓA DÒNG NÀY */}
{/* {active === 'payroll' && <PayrollPage />} */}
```

---

## 📋 CHECKLIST SỬA LỖI

### CRITICAL (Phải sửa ngay):

- [ ] **EmployeesPage.jsx**
  - [ ] Line 213: Ẩn cột "Lương CB" cho HR
  - [ ] Line 241: Conditional render `emp.luongCoBan`
  - [ ] Line 322-328: Ẩn form inputs lương cho HR
  - [ ] Line 104-105: Không gửi lương nếu không phải Accounting
  
- [ ] **ContractsPage.jsx**
  - [ ] Line 18: Form state `luongCoBan` optional
  - [ ] Line 105-107: Validation chỉ cho Accounting
  - [ ] Line 114: Conditional send `luongCoBan`
  - [ ] Table: Ẩn cột lương cho HR
  
- [ ] **PayrollPage.jsx**
  - [ ] Xóa mock data (Line 3-7)
  - [ ] Add `useAuth()` + permission check
  - [ ] Implement `loadPayrolls()` với API thật
  - [ ] Implement `handleCalculateSalary()` với API thật

### HIGH (Trong 1 ngày):

- [ ] **HrManagerDashboard.jsx**
  - [ ] Line 153: Xóa menu "Bảng lương"
  - [ ] Line 657: Xóa render `<PayrollPage />`
  
- [ ] **AccountingManagerDashboard.jsx**
  - [ ] Replace mock data với API calls
  - [ ] Line 60-73: Gọi API thật cho tính lương

### RECOMMENDED:

- [ ] Tạo component `<ProtectedField>` với role check
- [ ] Tạo HOC `withRoleCheck()` để wrap components
- [ ] Add loading states cho tất cả API calls
- [ ] Add error boundaries
- [ ] Unit tests cho permission logic

---

## ✅ KẾT LUẬN FINAL

### Frontend CHƯA TUÂN THỦ phân quyền Backend:

1. ❌ **EmployeesPage** - HR xem & nhập lương
2. ❌ **ContractsPage** - HR buộc nhập lương
3. ❌ **PayrollPage** - Mock data, không API
4. ❌ **HrManagerDashboard** - Có menu "Bảng lương"
5. ❌ **AccountingDashboard** - Mock data

### Root Causes:

1. **Không có role check ở component level** - Chỉ check ở routing
2. **Mock data thay vì API** - Không connect Backend
3. **UI không conditional render** - Hiển thị all fields cho all roles
4. **Không có permission guard** - Component không check `user.role`

### Ước tính thời gian sửa:

- **EmployeesPage:** 2 giờ
- **ContractsPage:** 2 giờ
- **PayrollPage:** 3 giờ (cần integrate API)
- **Dashboards:** 1 giờ
- **Testing:** 2 giờ
- **Total:** 10 giờ (1.5 ngày)

---

**Status:** 🔴 CRITICAL  
**Priority:** P0 - Must fix before production  
**Security Risk:** HIGH - Salary data exposed to HR
