import { useEffect, useState } from 'react'
import { styles } from './LeavePage.styles'
import { LeaveStatusBar } from './components/LeaveComponents'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { employeesService } from '@/features/hr/shared/services/employees.service'
import { leavesService } from '@/features/hr/shared/services/leaves.service'

export default function LeavePage() {
  const { user: authUser } = useAuth()
  const [requests, setRequests] = useState([])
  const [employeeId, setEmployeeId] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [formData, setFormData] = useState({ loaiPhep: 'PHEP_NAM', ngayBatDau: '', ngayKetThuc: '', lyDo: '' })

  const mapStatus = (s) => {
    const m = { CHO_DUYET: 'pending', DA_DUYET: 'approved', BI_TU_CHOI: 'rejected' }
    return m[s] || s || 'pending'
  }

  const loadData = async () => {
    try {
      const userId = authUser?.userId
      if (!userId || typeof userId !== 'number') {
        console.warn('Invalid userId:', userId)
        return
      }
      const emp = await employeesService.getByUserId(userId)
      const eid = emp?.nhanvienId || emp?.id || emp?.employeeId
      if (!eid || typeof eid !== 'number') {
        console.warn('No valid employeeId found for userId:', userId)
        return
      }
      setEmployeeId(eid)
      const data = await leavesService.getByEmployee(eid)
      const mapped = (data || []).map((item) => ({
        id: item.nghiphepId || item.id,
        type: item.loaiPhepLabel || item.type || 'Nghỉ phép',
        date: item.ngayTao || item.date || '-',
        approver: item.tenNguoiDuyet || item.approver || 'Giám đốc',
        status: mapStatus(item.trangThai || item.status)
      }))
      setRequests(mapped)
    } catch (err) {
      console.warn('Failed to load leave requests:', err)
      // Don't show alert on initial load
    }
  }

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAddLeave = () => {
    setShowCreateModal(true)
  }

  const handleCreateSubmit = async () => {
    if (!employeeId) return alert('Không tìm thấy mã nhân viên')
    if (!formData.loaiPhep || !formData.ngayBatDau || !formData.ngayKetThuc) return alert('Vui lòng nhập đủ thông tin')
    try {
      const payload = {
        nhanvienId: employeeId,
        loaiPhep: formData.loaiPhep,
        ngayBatDau: formData.ngayBatDau,
        ngayKetThuc: formData.ngayKetThuc,
        lyDo: formData.lyDo || ''
      }
      await leavesService.create(payload)
      setShowCreateModal(false)
      setFormData({ loaiPhep: 'PHEP_NAM', ngayBatDau: '', ngayKetThuc: '', lyDo: '' })
      await loadData()
      alert('Đã tạo đơn nghỉ phép')
    } catch (err) {
      alert('Lỗi tạo đơn: ' + (err.response?.data?.message || err.message))
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Đơn từ & Nghỉ phép</h1>
        <p style={styles.subtitle}>Xin nghỉ phép và xem trạng thái đơn</p>
      </div>

      <div style={styles.pageContent}>
        <div style={styles.leaveLayout}>
          <div style={styles.tableCard}>
            <div style={styles.tableHeader}>
              <h4 style={styles.tableTitle}>Lịch sử đơn từ của tôi</h4>
              <button style={styles.addBtn} onClick={handleAddLeave}>
                + Đăng ký nghỉ phép
              </button>
            </div>
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Loại đơn</th>
                    <th style={styles.th}>Ngày gửi</th>
                    <th style={styles.th}>Người duyệt</th>
                    <th style={styles.th}>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr key={req.id} style={styles.tr}>
                      <td style={styles.td}>{req.type}</td>
                      <td style={styles.td}>{req.date}</td>
                      <td style={styles.td}>{req.approver}</td>
                      <td style={styles.td}>
                        <LeaveStatusBar status={req.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={styles.orderOverview}>
            <h4 style={styles.cardTitle}>Thông báo của tôi</h4>
            <div style={styles.orderList}>
              {requests.map((req) => (
                <div key={req.id} style={styles.orderItem}>
                  <div style={styles.orderIcon(req.status)}>
                    {req.status === 'approved' ? '✓' : req.status === 'pending' ? '⏳' : '✗'}
                  </div>
                  <div style={styles.orderContent}>
                    <div style={styles.orderTitle}>{req.type} {req.date}</div>
                    <div style={styles.orderStatus}>
                      {req.status === 'approved' ? 'Đã duyệt' : req.status === 'pending' ? 'Chờ duyệt' : 'Từ chối'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {showCreateModal && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.3)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000}}>
          <div style={{background:'#fff', borderRadius:12, width:420, boxShadow:'0 8px 24px rgba(0,0,0,0.15)'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 20px', borderBottom:'1px solid #f1f5f9'}}>
              <h3 style={{margin:0, fontSize:18, fontWeight:700, color:'#1e293b'}}>Đăng ký nghỉ phép</h3>
              <button style={{border:'none', background:'transparent', fontSize:20, cursor:'pointer'}} onClick={() => setShowCreateModal(false)}>×</button>
            </div>
            <div style={{padding:20, display:'grid', gap:12}}>
              <div>
                <label style={{display:'block', fontSize:12, color:'#64748b', marginBottom:6}}>Loại phép</label>
                <select value={formData.loaiPhep} onChange={(e)=>setFormData({...formData, loaiPhep:e.target.value})} style={{width:'100%', padding:'10px', border:'1px solid #e2e8f0', borderRadius:8}}>
                  <option value="PHEP_NAM">Phép năm</option>
                  <option value="OM">Nghỉ ốm</option>
                  <option value="KO_LUONG">Không lương</option>
                  <option value="KHAC">Khác</option>
                </select>
              </div>
              <div>
                <label style={{display:'block', fontSize:12, color:'#64748b', marginBottom:6}}>Từ ngày</label>
                <input type="date" value={formData.ngayBatDau} onChange={(e)=>setFormData({...formData, ngayBatDau:e.target.value})} style={{width:'100%', padding:'10px', border:'1px solid #e2e8f0', borderRadius:8}} />
              </div>
              <div>
                <label style={{display:'block', fontSize:12, color:'#64748b', marginBottom:6}}>Đến ngày</label>
                <input type="date" value={formData.ngayKetThuc} onChange={(e)=>setFormData({...formData, ngayKetThuc:e.target.value})} style={{width:'100%', padding:'10px', border:'1px solid #e2e8f0', borderRadius:8}} />
              </div>
              <div>
                <label style={{display:'block', fontSize:12, color:'#64748b', marginBottom:6}}>Lý do</label>
                <textarea value={formData.lyDo} onChange={(e)=>setFormData({...formData, lyDo:e.target.value})} rows={3} style={{width:'100%', padding:'10px', border:'1px solid #e2e8f0', borderRadius:8}} />
              </div>
            </div>
            <div style={{padding:20, display:'flex', justifyContent:'flex-end', gap:12}}>
              <button onClick={()=>setShowCreateModal(false)} style={{padding:'10px 16px', border:'1px solid #e2e8f0', borderRadius:8, background:'#fff', color:'#1e293b', cursor:'pointer'}}>Hủy</button>
              <button onClick={handleCreateSubmit} style={{padding:'10px 16px', border:'none', borderRadius:8, background:'linear-gradient(195deg, #3b82f6 0%, #2563eb 100%)', color:'#fff', cursor:'pointer'}}>Tạo đơn</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
