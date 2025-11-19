# 🔐 KIỂM TRA BẢO MẬT FRONTEND

**Ngày:** 2025-11-19  
**Audit:** Frontend React Application

---

## ✅ ROUTING - AN TOÀN

### **RoleRoute.jsx** - Line 4-22
```javascript
export default function RoleRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (!allowedRoles.includes(user.role)) {  // ✅ Check role
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
}
```

**✅ ĐÚNG:** Routes được bảo vệ theo role

### **index.jsx** - Routes mapping
```javascript
// Admin routes
<Route path="/admin/*" element={
  <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>  // ✅
    <AdminDashboard />
  </RoleRoute>
} />

// HR Manager routes  
<Route path="/hr/*" element={
  <RoleRoute allowedRoles={[USER_ROLES.MANAGER_HR]}>  // ✅
    <HrManagerDashboard />
  </RoleRoute>
} />

// Accounting Manager routes
<Route path="/accounting/*" element={
  <RoleRoute allowedRoles={[USER_ROLES.MANAGER_ACCOUNTING]}>  // ✅
    <AccountingManagerDashboard />
  </RoleRoute>
} />
```

**✅ KẾT LUẬN:** Routing đúng, phân quyền rõ ràng

---

## ❌ EMPLOYEES PAGE - VIOLATION NGHIÊM TRỌNG!

### **EmployeesPage.jsx**

#### 🔴 Vấn đề 1: HR NHÌN THẤY LƯƠNG (Line 241)
```javascript
<td style={{...s.td, fontWeight: 700, color: '#344767'}}>
  {formatCurrency(emp.luongCoBan)}  // ❌ HR ĐANG XEM!
</td>
```

**❌ SAI:** HR không được xem `luongCoBan` nhưng đang hiển thị

#### 🔴 Vấn đề 2: Form tạo nhân viên có trường lương (Line 322-328)
```javascript
<div style={s.formGroup}>
  <label style={s.label}>Lương cơ bản</label>
  <input 
    type="number" 
    name="luongCoBan" 
    value={newEmp.luongCoBan}   // ❌ HR nhập được
    onChange={handleInputChange} 
  />
</div>
<div style={s.formGroup}>
  <label style={s.label}>Phụ cấp</label>
  <input 
    type="number" 
    name="phuCap" 
    value={newEmp.phuCap}  // ❌ HR nhập được
  />
</div>
```

**❌ SAI:** 
- HR có thể nhập lương khi tạo nhân viên
- Backend sẽ lưu giá trị này
- **Backend đã cho phép HR SET lương** (Line 85-86 NhanVienService)

#### 🔴 Vấn đề 3: HR có thể NHÌN THẤY lương trong table
```javascript
// Line 213: Cột "Lương CB" trong table header
<th style={{...s.th, width: '15%'}}>Lương CB</th>

// Line 241: Data cell hiển thị lương
<td>{formatCurrency(emp.luongCoBan)}</td>
```

**❌ VI PHẠM:** HR không được xem lương nhưng UI đang hiển thị!

---

## ❌ PAYROLL PAGE - CHỈ MOCK DATA

### **PayrollPage.jsx** - Line 1-107

```javascript
const mockPayroll = [  // ❌ Fake data, không gọi API
  { id: 1, nhanVien: 'Nguyễn Văn A', luongCoBan: 15000000, ... }
];

export default function PayrollPage() {
  const [payrolls, setPayrolls] = useState(mockPayroll);  // ❌ Hardcoded
  
  // Không có API call nào!
  // Không có permission check!
```

**⚠️ VẤN ĐỀ:**
- Sử dụng mock data thay vì API thật
- Không gọi Backend `/api/bang-luong`
- **KHÔNG TUÂN THỦ phân quyền Backend!**

---

## 📊 PHÁT HIỆN CHI TIẾT

### 1. **EmployeesPage.jsx** (c:\DACN\frontend-web\src\features\hr\employees\pages\)

| Line | Code | Vấn đề | Severity |
|------|------|--------|----------|
| 25-26 | `luongCoBan: '', phuCap: ''` | Form state có lương | 🔴 CRITICAL |
| 104-105 | `luongCoBan: Number(newEmp.luongCoBan)` | HR gửi lương lên API | 🔴 CRITICAL |
| 213 | `<th>Lương CB</th>` | Table header có cột lương | 🔴 CRITICAL |
| 241 | `{formatCurrency(emp.luongCoBan)}` | HR xem được lương | 🔴 CRITICAL |
| 322-328 | Form inputs cho lương | HR nhập lương | 🔴 CRITICAL |

### 2. **PayrollPage.jsx** (c:\DACN\frontend-web\src\features\hr\payroll\pages\)

| Line | Code | Vấn đề | Severity |
|------|------|--------|----------|
| 3-7 | `const mockPayroll = [...]` | Mock data, không dùng API | 🟠 HIGH |
| 10 | `useState(mockPayroll)` | Không fetch từ Backend | 🟠 HIGH |
| Toàn file | Không có API call | Không tuân thủ phân quyền BE | 🟠 HIGH |

---

## 🎯 GIẢI PHÁP BẮT BUỘC

### **Fix 1: EmployeesPage.jsx - Ẩn lương cho HR**

#### Thêm role check:
```javascript
import { useAuth } from '@/features/auth/hooks/useAuth';
import { USER_ROLES } from '@/shared/constants/roles.constants';

export default function EmployeesPage() {
  const { user } = useAuth();  // Get current user
  const isAccounting = user?.role === USER_ROLES.MANAGER_ACCOUNTING;
  
  // ... existing code
  
  return (
    <div style={s.container}>
      {/* Table */}
      <table style={s.table}>
        <thead>
          <tr>
            <th>Nhân viên</th>
            <th>Liên hệ</th>
            <th>Vị trí</th>
            
            {/* CHỈ Accounting thấy cột lương */}
            {isAccounting && <th>Lương CB</th>}
            
            <th>Ngày vào</th>
            <th>Trạng thái</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map(emp => (
            <tr key={emp.nhanvienId}>
              <td>...</td>
              <td>...</td>
              <td>...</td>
              
              {/* CHỈ Accounting thấy data lương */}
              {isAccounting && (
                <td style={{fontWeight: 700}}>
                  {formatCurrency(emp.luongCoBan || 0)}
                </td>
              )}
              
              <td>...</td>
              <td>...</td>
              <td>...</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

#### Ẩn form fields lương cho HR:
```javascript
{/* Form modal */}
<div style={s.formGrid}>
  {/* ... các fields khác ... */}
  
  {/* CHỈ Accounting nhập lương */}
  {isAccounting && (
    <>
      <div style={s.formGroup}>
        <label style={s.label}>Lương cơ bản</label>
        <input 
          type="number" 
          name="luongCoBan" 
          value={newEmp.luongCoBan} 
          onChange={handleInputChange} 
        />
      </div>
      <div style={s.formGroup}>
        <label style={s.label}>Phụ cấp</label>
        <input 
          type="number" 
          name="phuCap" 
          value={newEmp.phuCap} 
          onChange={handleInputChange} 
        />
      </div>
    </>
  )}
</div>
```

#### Không gửi lương nếu không phải Accounting:
```javascript
const handleSave = async () => {
  // ... validation
  
  const payload = {
    userId: Number(newEmp.userId),
    hoTen: newEmp.hoTen,
    cccd: newEmp.cccd || null,
    ngaySinh: newEmp.ngaySinh,
    gioiTinh: newEmp.gioiTinh,
    diaChi: newEmp.diaChi || null,
    ngayVaoLam: newEmp.ngayVaoLam,
    phongbanId: newEmp.phongbanId ? Number(newEmp.phongbanId) : null,
    chucvuId: newEmp.chucvuId ? Number(newEmp.chucvuId) : null,
  };
  
  // CHỈ Accounting gửi lương
  if (isAccounting) {
    payload.luongCoBan = newEmp.luongCoBan ? Number(newEmp.luongCoBan) : 0;
    payload.phuCap = newEmp.phuCap ? Number(newEmp.phuCap) : 0;
  }
  // HR không gửi luongCoBan/phuCap → Backend sẽ set = 0
  
  await employeesService.create(payload);
  // ...
};
```

---

### **Fix 2: PayrollPage.jsx - Gọi API thật**

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
  
  // CHECK PERMISSION
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
  }, []);
  
  const loadPayrolls = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // GỌI API THẬT
      const data = await payrollService.getAll();
      setPayrolls(data);
    } catch (err) {
      setError(err.message);
      console.error('Load payroll error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // ... rest of component
}
```

---

### **Fix 3: Tạo Accounting-only routes**

#### **frontend-web/src/features/dashboard/accounting-manager/routes.jsx**
```javascript
import { Route, Routes } from 'react-router-dom';
import PayrollPage from '@/features/hr/payroll/pages/PayrollPage';

export default function AccountingRoutes() {
  return (
    <Routes>
      <Route path="/payroll" element={<PayrollPage />} />
      {/* Other accounting routes */}
    </Routes>
  );
}
```

---

## 📋 CHECKLIST SỬA LỖI FRONTEND

### MUST FIX (Priority HIGH):

- [ ] **EmployeesPage.jsx**
  - [ ] Add `useAuth()` hook
  - [ ] Add `isAccounting` check
  - [ ] Ẩn cột "Lương CB" cho HR
  - [ ] Ẩn form inputs lương cho HR
  - [ ] Không gửi `luongCoBan/phuCap` nếu không phải Accounting
  
- [ ] **PayrollPage.jsx**
  - [ ] Xóa mock data
  - [ ] Gọi API `payrollService.getAll()`
  - [ ] Add permission check đầu component
  - [ ] Handle loading/error states
  
- [ ] **ContractsPage.jsx** (cần kiểm tra tương tự)
  - [ ] Ẩn trường `luongCoBan` trong hợp đồng cho HR

### RECOMMENDED:

- [ ] Tạo component `<SalaryField>` với built-in permission check
- [ ] Tạo HOC `withAccountingOnly()` để wrap các trang lương
- [ ] Add unit tests cho permission logic
- [ ] Add E2E tests với Playwright

---

## 🔒 MA TRẬN PHÂN QUYỀN FRONTEND

| Feature | HR | Accounting | Backend Enforcement |
|---------|-----|-----------|-------------------|
| Xem danh sách nhân viên | ✅ (no salary) | ✅ (full) | ✅ Mapper mask |
| Tạo nhân viên | ✅ (no salary input) | ✅ (với lương) | ⚠️ HR có thể gửi |
| Xem bảng lương | ❌ | ✅ | ✅ Permission check |
| Tạo bảng lương | ❌ | ✅ | ✅ Permission check |
| Dashboard với số tiền | ❌ | ✅ | ✅ Masked |

### Hiện trạng:

| Feature | Frontend | Backend | Sync? |
|---------|----------|---------|-------|
| Xem nhân viên | ❌ HR thấy lương | ✅ Mask lương | ❌ KHÔNG |
| Tạo nhân viên | ❌ HR nhập lương | ⚠️ Cho phép SET | ❌ KHÔNG |
| Xem bảng lương | ❌ Mock data | ✅ Check permission | ❌ KHÔNG |

---

## ⚠️ RỦI RO BẢO MẬT

### **Rủi ro 1: HR có thể xem lương trong DevTools**
- Frontend hiển thị lương → HR mở DevTools/Network → thấy API response
- **Giải pháp:** Backend đã mask → OK, nhưng Frontend nên ẩn luôn

### **Rủi ro 2: HR có thể inspect form và unhide input**
- Nếu chỉ dùng CSS `display: none`
- **Giải pháp:** Không render component thay vì hide

### **Rủi ro 3: PayrollPage dùng mock data**
- Không sync với Backend
- Dữ liệu giả lập, không phản ánh thực tế
- **Giải pháp:** Integrate API ngay

---

## ✅ KẾT LUẬN

### Frontend CHƯA TUÂN THỦ phân quyền Backend:

1. ❌ **EmployeesPage** hiển thị lương cho HR
2. ❌ **EmployeesPage** cho phép HR nhập lương
3. ❌ **PayrollPage** dùng mock data thay vì API

### Action Items:

**URGENT (Trong 2 giờ):**
1. Fix EmployeesPage - Ẩn lương cho HR
2. Fix PayrollPage - Gọi API thật + check permission

**HIGH (Trong 1 ngày):**
3. Audit ContractsPage
4. Audit tất cả dashboards
5. Test với tất cả roles

---

**Status:** 🔴 CRITICAL - Frontend leaking salary data  
**Priority:** P0 - Fix immediately  
**Estimated fix time:** 2-4 hours
