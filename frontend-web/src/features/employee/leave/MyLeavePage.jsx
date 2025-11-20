import { useState, useEffect } from 'react'
import { PageLayout, DataTable, FormModal, FormField, DatePicker, StatusBadge, Loading, ErrorMessage } from '@/shared/components'
import { leaveService } from '@/shared/services'
import { useAuth } from '@/features/auth/hooks/useAuth'

export default function MyLeavePage() {
  const { user } = useAuth()
  const [leaves, setLeaves] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    loaiNghiPhep: 'PHEP_NAM',
    tuNgay: '',
    denNgay: '',
    lyDo: ''
  })

  useEffect(() => {
    loadLeaves()
  }, [])

  const loadLeaves = async () => {
    try {
      setLoading(true)
      const employeeId = user?.employeeId || 1
      const data = await leaveService.getByEmployee(employeeId)
      setLeaves(data || [])
      setError(null)
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải đơn nghỉ phép')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    if (!formData.tuNgay || !formData.denNgay || !formData.lyDo) {
      alert('Vui lòng điền đầy đủ thông tin!')
      return
    }

    try {
      await leaveService.create({
        ...formData,
        nhanvienId: user?.employeeId || 1
      })
      setShowModal(false)
      setFormData({ loaiNghiPhep: 'PHEP_NAM', tuNgay: '', denNgay: '', lyDo: '' })
      loadLeaves()
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || err.message))
    }
  }

  const handleCancel = async (leaveId, status) => {
    if (status !== 'CHO_DUYET') {
      alert('Chỉ có thể hủy đơn đang chờ duyệt!')
      return
    }

    if (!confirm('Bạn có chắc muốn hủy đơn này?')) return

    try {
      await leaveService.delete(leaveId)
      loadLeaves()
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || err.message))
    }
  }

  const columns = [
    {
      header: 'Loại phép',
      key: 'loaiNghiPhep',
      render: (val) => val === 'PHEP_NAM' ? 'Phép năm' : 'Phép bệnh'
    },
    {
      header: 'Từ ngày',
      key: 'tuNgay',
      render: (val) => new Date(val).toLocaleDateString('vi-VN')
    },
    {
      header: 'Đến ngày',
      key: 'denNgay',
      render: (val) => new Date(val).toLocaleDateString('vi-VN')
    },
    {
      header: 'Lý do',
      key: 'lyDo'
    },
    {
      header: 'Trạng thái',
      key: 'trangThai',
      render: (val) => {
        const statusMap = {
          'CHO_DUYET': 'pending',
          'PM_APPROVED': 'info',
          'DA_DUYET': 'approved',
          'BI_TU_CHOI': 'rejected'
        }
        return <StatusBadge status={statusMap[val]} />
      }
    },
    {
      header: 'Hành động',
      key: 'actions',
      render: (_, row) => (
        row.trangThai === 'CHO_DUYET' && (
          <button
            onClick={() => handleCancel(row.nghiphepId || row.id, row.trangThai)}
            style={styles.cancelBtn}
          >
            Hủy đơn
          </button>
        )
      )
    }
  ]

  if (loading) return <Loading />
  if (error) return <ErrorMessage error={error} onRetry={loadLeaves} />

  return (
    <>
      <PageLayout
        title="Đơn nghỉ phép"
        subtitle="Quản lý đơn xin nghỉ phép"
        actions={
          <button onClick={() => setShowModal(true)} style={styles.addBtn}>
            ➕ Tạo đơn mới
          </button>
        }
      >
        <DataTable columns={columns} data={leaves} emptyMessage="Chưa có đơn nghỉ phép nào" />
      </PageLayout>

      {showModal && (
        <FormModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Tạo đơn nghỉ phép"
          onSubmit={handleCreate}
          submitText="Gửi đơn"
        >
          <FormField
            label="Loại phép"
            type="select"
            value={formData.loaiNghiPhep}
            onChange={(val) => setFormData({...formData, loaiNghiPhep: val})}
            options={[
              { label: 'Phép năm', value: 'PHEP_NAM' },
              { label: 'Phép bệnh', value: 'PHEP_BENH' }
            ]}
          />
          <DatePicker
            label="Từ ngày"
            value={formData.tuNgay}
            onChange={(val) => setFormData({...formData, tuNgay: val})}
            required
          />
          <DatePicker
            label="Đến ngày"
            value={formData.denNgay}
            onChange={(val) => setFormData({...formData, denNgay: val})}
            required
          />
          <FormField
            label="Lý do"
            type="textarea"
            value={formData.lyDo}
            onChange={(val) => setFormData({...formData, lyDo: val})}
            required
          />
        </FormModal>
      )}
    </>
  )
}

const styles = {
  addBtn: {
    padding: '10px 20px',
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  cancelBtn: {
    padding: '4px 12px',
    fontSize: '12px',
    backgroundColor: '#ef4444',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  }
}
