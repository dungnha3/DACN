import { useState } from 'react'
import { PageLayout, DataTable } from '@/shared/components'

export default function MyDocumentsPage() {
  const [documents] = useState([
    { id: 1, ten: 'Hop dong lao dong 2024', loai: 'Hop dong', ngayTao: '2024-01-15', kichThuoc: '2.3 MB' },
    { id: 2, ten: 'Bang luong thang 10', loai: 'Bang luong', ngayTao: '2024-10-31', kichThuoc: '1.2 MB' }
  ])

  const handleDownload = (doc) => {
    alert('Chuc nang download dang phat trien. File: ' + doc.ten)
  }

  const columns = [
    { header: 'Ten tai lieu', key: 'ten' },
    { header: 'Loai', key: 'loai' },
    { header: 'Ngay tao', key: 'ngayTao' },
    { header: 'Kich thuoc', key: 'kichThuoc' },
    {
      header: 'Hanh dong',
      key: 'actions',
      render: (_, row) => (
        <button onClick={() => handleDownload(row)} style={{ padding: '4px 12px', fontSize: '12px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Tai xuong
        </button>
      )
    }
  ]

  return (
    <PageLayout title="Tai lieu cua toi" subtitle="Hop dong, bang luong va cac tai lieu lien quan">
      <DataTable columns={columns} data={documents} emptyMessage="Chua co tai lieu nao" />
    </PageLayout>
  )
}
