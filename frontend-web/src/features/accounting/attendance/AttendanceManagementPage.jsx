import { useState, useEffect } from 'react'
import { PageLayout, DataTable, FilterBar, StatusBadge, FormModal, FormField, DatePicker, Loading, ErrorMessage } from '@/shared/components'
import { attendanceService } from '@/shared/services'

export default function AttendanceManagementPage() {
  const [attendances, setAttendances] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [formData, setFormData] = useState({
    nhanvienId: '',
    ngayCham: '',
    gioVao: '08:30',
    gioRa: '17:30'
  })

  useEffect(() => {
    loadAttendances()
  }, [month])

  const loadAttendances = async () => {
    try {
      setLoading(true)
      const data = await attendanceService.getAll()
      setAttendances(data || [])
      setError(null)
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải chấm công')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    if (!formData.nhanvienId || !formData.ngayCham) {
      alert('Vui lòng điền đầy đủ thông tin!')
      return
    }

    try {
      await attendanceService.create(formData)
      setShowModal(false)
      setFormData({ nhanvienId: '', ngayCham: '', gioVao: '08:30', gioRa: '17:30' })
      loadAttendances()
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || err.message))
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Xóa bản ghi chấm công này?')) return

    try {
      await attendanceService.delete(id)
      loadAttendances()
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || err.message))
    }
  }

  const columns = [
    { header: 'Mã NV', key: 'nhanvienId', width: '80px' },
    { header: 'Họ tên', key: 'tenNhanVien' },
    { header: 'Ngày', key: 'ngayCham', render: (val) => new Date(val).toLocaleDateString('vi-VN') },
    { header: 'Giờ vào', key: 'gioVao' },
    { header: 'Giờ ra', key: 'gioRa' },
    { header: 'Tổng giờ', key: 'tongGio', render: (val) => `${val} giờ` },
    { header: 'Trạng thái', key: 'trangThai', render: (val) => <StatusBadge status={val?.toLowerCase()} /> },
    {
      header: 'Hành động',
      key: 'actions',
      render: (_, row) => (
        <button onClick={() => handleDelete(row.id)} style={styles.deleteBtn}>
          🗑️ Xóa
        </button>
      )
    }
  ]

  const monthOptions = Array.from({length: 12}, (_, i) => ({ label: `Tháng ${i + 1}`, value: i + 1 }))

  if (loading) return <Loading />
  if (error) return <ErrorMessage error={error} onRetry={loadAttendances} />

  return (
    <>
      <PageLayout
        title="Quản lý Chấm công"
        subtitle="Quản lý toàn bộ chấm công - Accounting có quyền CRUD tất cả"
        actions={
          <button onClick={() => setShowModal(true)} style={styles.addBtn}>
            ➕ Thêm chấm công
          </button>
        }
        filters={
          <FilterBar
            filters={[
              { value: month, onChange: (val) => setMonth(Number(val)), options: monthOptions }
            ]}
          />
        }
      >
        <DataTable columns={columns} data={attendances} emptyMessage="Chưa có dữ liệu chấm công" />
      </PageLayout>

      {showModal && (
        <FormModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Thêm chấm công thủ công"
          onSubmit={handleCreate}
          submitText="Thêm"
        >
          <FormField
            label="Mã nhân viên"
            type="number"
            value={formData.nhanvienId}
            onChange={(val) => setFormData({...formData, nhanvienId: val})}
            required
          />
          <DatePicker
            label="Ngày chấm"
            value={formData.ngayCham}
            onChange={(val) => setFormData({...formData, ngayCham: val})}
            required
          />
          <FormField
            label="Giờ vào"
            type="time"
            value={formData.gioVao}
            onChange={(val) => setFormData({...formData, gioVao: val})}
            required
          />
          <FormField
            label="Giờ ra"
            type="time"
            value={formData.gioRa}
            onChange={(val) => setFormData({...formData, gioRa: val})}
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
  deleteBtn: {
    padding: '4px 12px',
    fontSize: '12px',
    backgroundColor: '#ef4444',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  }
}
