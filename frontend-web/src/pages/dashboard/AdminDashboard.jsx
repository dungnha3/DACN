import { useEffect, useMemo, useState } from 'react'

export default function AdminDashboard() {
  const [active, setActive] = useState('dept')
  const user = useMemo(() => ({ name: 'admin', role: 'Admin' }), [])

  const sections = useMemo(
    () => ({
      dept: {
        title: 'Nhân viên theo phòng ban',
        pageTitle: 'Phòng ban',
        subtitle: 'Chọn phòng ban để xem danh sách nhân viên',
        action: { label: 'Thêm mới' }
      },
      position: {
        title: 'Chức vụ',
        pageTitle: 'Chức vụ',
        subtitle: 'Quản lý các chức vụ và xem nhân viên theo chức vụ',
        action: { label: 'Thêm mới' }
      },
      contract: {
        title: 'Hợp đồng',
        pageTitle: 'Hợp đồng lao động',
        subtitle: 'Quản lý hợp đồng theo phòng ban',
        action: { label: 'Thêm hợp đồng', tone: 'success' }
      },
      timesheet: {
        title: 'Chấm công',
        pageTitle: 'Chấm công',
        subtitle: 'Quản lý chấm công theo phòng ban',
        action: { label: 'Xem lịch', icon: CalendarIcon }
      },
      leave: {
        title: 'Duyệt nghỉ phép',
        pageTitle: 'Nghỉ phép',
        subtitle: '',
        action: null
      },
      payroll: {
        title: 'Bảng lương',
        pageTitle: 'Bảng lương',
        subtitle: '',
        action: null
      }
    }),
    []
  )

  // Position (ChucVu) integration
  const [positions, setPositions] = useState([])
  const [posLoading, setPosLoading] = useState(false)
  const [posQuery, setPosQuery] = useState('')
  const [posModalOpen, setPosModalOpen] = useState(false)
  const [posEditing, setPosEditing] = useState(null) // ChucVuDTO or null
  const [posForm, setPosForm] = useState({ tenChucVu: '', moTa: '', level: '' })

  const loadPositions = async () => {
    setPosLoading(true)
    try {
      const res = await fetch('/chuc-vu', { headers: { 'Content-Type': 'application/json', ...authHeaders() } })
      if (!res.ok) throw new Error('Tải chức vụ thất bại')
      const data = await res.json()
      setPositions(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error(e)
    } finally {
      setPosLoading(false)
    }
  }

  useEffect(() => {
    if (active === 'position') loadPositions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  const openCreatePos = () => {
    setPosEditing(null)
    setPosForm({ tenChucVu: '', moTa: '', level: '' })
    setPosModalOpen(true)
  }
  const openEditPos = (pos) => {
    setPosEditing(pos)
    setPosForm({ tenChucVu: pos.tenChucVu || '', moTa: pos.moTa || '', level: pos.level ?? '' })
    setPosModalOpen(true)
  }
  const closePosModal = () => setPosModalOpen(false)

  const submitPosForm = async (e) => {
    e?.preventDefault?.()
    const body = {
      tenChucVu: posForm.tenChucVu?.trim(),
      moTa: posForm.moTa?.trim() || null,
      level: posForm.level === '' ? null : Number(posForm.level)
    }
    try {
      const opts = {
        method: posEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(body)
      }
      const url = posEditing ? `/chuc-vu/${posEditing.chucvuId}` : '/chuc-vu'
      const res = await fetch(url, opts)
      if (!res.ok) throw new Error('Lưu chức vụ thất bại')
      closePosModal()
      await loadPositions()
    } catch (err) {
      alert(err.message || 'Lưu thất bại')
    }
  }

  const deletePosition = async (pos) => {
    if (!confirm(`Xóa chức vụ "${pos.tenChucVu}"?`)) return
    try {
      const res = await fetch(`/chuc-vu/${pos.chucvuId}`, { method: 'DELETE', headers: { ...authHeaders() } })
      if (!res.ok) throw new Error('Xóa thất bại')
      await loadPositions()
    } catch (err) {
      alert(err.message || 'Xóa thất bại')
    }
  }

  // Contract (HopDong) integration
  const [contracts, setContracts] = useState([])
  const [contractLoading, setContractLoading] = useState(false)
  const [contractQuery, setContractQuery] = useState('')
  const [contractModalOpen, setContractModalOpen] = useState(false)
  const [contractEditing, setContractEditing] = useState(null)
  const [contractForm, setContractForm] = useState({
    nhanvienId: '',
    loaiHopDong: 'XAC_DINH',
    ngayBatDau: '',
    ngayKetThuc: '',
    luongCoBan: '',
    noiDung: ''
  })

  const loadContracts = async () => {
    setContractLoading(true)
    try {
      const res = await fetch('/hop-dong', { headers: { 'Content-Type': 'application/json', ...authHeaders() } })
      if (!res.ok) throw new Error('Tải hợp đồng thất bại')
      const data = await res.json()
      setContracts(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error(e)
    } finally {
      setContractLoading(false)
    }
  }

  useEffect(() => {
    if (active === 'contract') loadContracts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  const openCreateContract = () => {
    setContractEditing(null)
    setContractForm({
      nhanvienId: '',
      loaiHopDong: 'XAC_DINH',
      ngayBatDau: '',
      ngayKetThuc: '',
      luongCoBan: '',
      noiDung: ''
    })
    setContractModalOpen(true)
  }

  const openEditContract = (contract) => {
    setContractEditing(contract)
    setContractForm({
      nhanvienId: contract.nhanvienId || '',
      loaiHopDong: contract.loaiHopDong || 'XAC_DINH',
      ngayBatDau: contract.ngayBatDau || '',
      ngayKetThuc: contract.ngayKetThuc || '',
      luongCoBan: contract.luongCoBan || '',
      noiDung: contract.noiDung || ''
    })
    setContractModalOpen(true)
  }

  const closeContractModal = () => setContractModalOpen(false)

  const submitContractForm = async (e) => {
    e?.preventDefault?.()
    const body = {
      nhanvienId: Number(contractForm.nhanvienId),
      loaiHopDong: contractForm.loaiHopDong,
      ngayBatDau: contractForm.ngayBatDau,
      ngayKetThuc: contractForm.ngayKetThuc || null,
      luongCoBan: Number(contractForm.luongCoBan),
      noiDung: contractForm.noiDung?.trim() || null
    }
    try {
      const opts = {
        method: contractEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(body)
      }
      const url = contractEditing ? `/hop-dong/${contractEditing.hopdongId}` : '/hop-dong'
      const res = await fetch(url, opts)
      if (!res.ok) throw new Error('Lưu hợp đồng thất bại')
      closeContractModal()
      await loadContracts()
    } catch (err) {
      alert(err.message || 'Lưu thất bại')
    }
  }

  const deleteContract = async (contract) => {
    if (!confirm(`Xóa hợp đồng của "${contract.hoTenNhanVien}"?`)) return
    try {
      const res = await fetch(`/hop-dong/${contract.hopdongId}`, { method: 'DELETE', headers: { ...authHeaders() } })
      if (!res.ok) throw new Error('Xóa thất bại')
      await loadContracts()
    } catch (err) {
      alert(err.message || 'Xóa thất bại')
    }
  }
  

  // Department (PhongBan) integration
  const [depts, setDepts] = useState([])
  const [deptLoading, setDeptLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null) // PhongBanDTO or null
  const [form, setForm] = useState({ tenPhongBan: '', moTa: '', truongPhongId: '' })
  const authHeaders = () => {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('accessToken') : null
    const type = typeof localStorage !== 'undefined' ? (localStorage.getItem('tokenType') || 'Bearer') : 'Bearer'
    return token ? { Authorization: `${type} ${token}` } : {}
  }

  const loadDepts = async () => {
    setDeptLoading(true)
    try {
      const res = await fetch('/phong-ban', { headers: { 'Content-Type': 'application/json', ...authHeaders() } })
      if (!res.ok) throw new Error('Tải phòng ban thất bại')
      const data = await res.json()
      setDepts(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error(e)
    } finally {
      setDeptLoading(false)
    }
  }

  useEffect(() => {
    if (active === 'dept') loadDepts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  const openCreate = () => {
    setEditing(null)
    setForm({ tenPhongBan: '', moTa: '', truongPhongId: '' })
    setModalOpen(true)
  }
  const openEdit = (dept) => {
    setEditing(dept)
    setForm({
      tenPhongBan: dept.tenPhongBan || '',
      moTa: dept.moTa || '',
      truongPhongId: dept.truongPhongId || ''
    })
    setModalOpen(true)
  }
  const closeModal = () => setModalOpen(false)

  const submitForm = async (e) => {
    e?.preventDefault?.()
    const body = {
      tenPhongBan: form.tenPhongBan?.trim(),
      moTa: form.moTa?.trim() || null,
      truongPhongId: form.truongPhongId ? Number(form.truongPhongId) : null
    }
    try {
      const opts = {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(body)
      }
      const url = editing ? `/phong-ban/${editing.phongbanId}` : '/phong-ban'
      const res = await fetch(url, opts)
      if (!res.ok) throw new Error('Lưu phòng ban thất bại')
      closeModal()
      await loadDepts()
    } catch (err) {
      alert(err.message || 'Lưu thất bại')
    }
  }

  const deleteDept = async (dept) => {
    if (!confirm(`Xóa phòng ban "${dept.tenPhongBan}"?`)) return
    try {
      const res = await fetch(`/phong-ban/${dept.phongbanId}`, {
        method: 'DELETE',
        headers: { ...authHeaders() }
      })
      if (!res.ok) throw new Error('Xóa thất bại')
      await loadDepts()
    } catch (err) {
      alert(err.message || 'Xóa thất bại')
    }
  }

  const meta = sections[active]

  const handleLogout = async () => {
    try {
      const refreshToken = typeof localStorage !== 'undefined' ? localStorage.getItem('refreshToken') : null
      if (refreshToken) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken })
        })
      }
    } catch {}
    finally {
      const ls = typeof localStorage !== 'undefined' ? localStorage : null
      if (ls) {
        ;['accessToken','refreshToken','tokenType','userRole','username','expiresAt','staySignedIn'].forEach(k=> ls.removeItem(k))
      }
      if (typeof window !== 'undefined') window.location.reload()
    }
  }

  return (
    <div style={styles.appShell}>
      <aside style={styles.sidebar}>
        <div style={styles.brand}>QLNS</div>

        <div style={styles.userCard}>
          <div style={styles.userAvatar}>{user.name.slice(0, 1).toUpperCase()}</div>
          <div style={styles.userInfo}>
            <div style={styles.userName}>{user.name}</div>
            <div style={styles.userRole}>Quản trị viên</div>
          </div>
        </div>

        <NavGroup label="Quản lý nhân sự & Tổ chức" icon={PeopleGroupIcon}>
          <NavItem active={active === 'dept'} onClick={() => setActive('dept')}>
            Nhân viên theo phòng ban
          </NavItem>
          <NavItem active={active === 'position'} onClick={() => setActive('position')}>
            Chức vụ
          </NavItem>
          <NavItem active={active === 'contract'} onClick={() => setActive('contract')}>
            Hợp đồng
          </NavItem>
        </NavGroup>

        <NavGroup label="Quản lý công việc" icon={ClockBadgeIcon}>
          <NavItem active={active === 'timesheet'} onClick={() => setActive('timesheet')}>
            Chấm công
          </NavItem>
          <NavItem active={active === 'leave'} onClick={() => setActive('leave')}>
            Duyệt nghỉ phép
          </NavItem>
          <NavItem active={active === 'payroll'} onClick={() => setActive('payroll')}>
            Bảng lương
          </NavItem>
        </NavGroup>

        <NavGroup label="Hệ thống" icon={SettingsIcon}>
          <div style={{ height: 8 }} />
        </NavGroup>

        <button style={styles.logoutBtn} onClick={handleLogout}>
          <span style={{ display: 'inline-flex', gap: 10, alignItems: 'center' }}>
            <ExitIcon /> Đăng xuất
          </span>
        </button>
      </aside>

      <main style={styles.content}>
        <header style={styles.header}>
          <div>
            <div style={styles.pageHeading}>{meta.title}</div>
            <div style={styles.subHeading}>Xin chào, {user.name}</div>
          </div>

          <div style={styles.rightCluster}>
            <RoleBadge role={user.role} />
            {meta.action && active === 'dept' ? (
              <PrimaryButton onClick={openCreate} tone={meta.action.tone} icon={meta.action.icon}>
                {meta.action.label}
              </PrimaryButton>
            ) : meta.action && active === 'position' ? (
              <PrimaryButton onClick={openCreatePos} tone={meta.action.tone} icon={meta.action.icon}>
                {meta.action.label}
              </PrimaryButton>
            ) : meta.action && active === 'contract' ? (
              <PrimaryButton onClick={openCreateContract} tone={meta.action.tone} icon={meta.action.icon}>
                {meta.action.label}
              </PrimaryButton>
            ) : meta.action ? (
              <PrimaryButton tone={meta.action.tone} icon={meta.action.icon}>
                {meta.action.label}
              </PrimaryButton>
            ) : null}
          </div>
        </header>

        <section style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>{meta.pageTitle}</h2>
          {meta.subtitle && <p style={styles.sectionSubtitle}>{meta.subtitle}</p>}
        </section>

        {active === 'dept' && (
          <div>
            <div style={styles.toolbarRow}>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm phòng ban..."
                style={styles.searchInput}
              />
              <button style={styles.secondaryBtn} onClick={loadDepts}>Làm mới</button>
            </div>

            {deptLoading ? (
              <div style={styles.empty}>Đang tải phòng ban...</div>
            ) : depts.length === 0 ? (
              <div style={styles.empty}>Chưa có phòng ban</div>
            ) : (
              <div style={styles.grid}>
                {depts
                  .filter(d => !query || d.tenPhongBan?.toLowerCase().includes(query.toLowerCase()))
                  .map((d) => (
                  <div key={d.phongbanId} style={styles.cardItem}>
                    <div style={styles.cardHead}>
                      <div style={{ fontWeight: 800, color: '#111827' }}>{d.tenPhongBan}</div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button style={styles.iconBtn} title="Sửa" onClick={() => openEdit(d)}>✎</button>
                        <button style={{ ...styles.iconBtn, color: '#b91c1c' }} title="Xóa" onClick={() => deleteDept(d)}>🗑</button>
                      </div>
                    </div>
                    {d.moTa && <div style={styles.cardDesc}>{d.moTa}</div>}
                    <div style={styles.cardMeta}>Trưởng phòng: <b>{d.tenTruongPhong || '—'}</b></div>
                    <div style={styles.cardMeta}>Số NV: <b>{d.soLuongNhanVien ?? 0}</b></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {active === 'position' && (
          <div>
            <div style={styles.toolbarRow}>
              <input
                value={posQuery}
                onChange={(e) => setPosQuery(e.target.value)}
                placeholder="Tìm chức vụ..."
                style={styles.searchInput}
              />
              <button style={styles.secondaryBtn} onClick={loadPositions}>Làm mới</button>
            </div>

            {posLoading ? (
              <div style={styles.empty}>Đang tải chức vụ...</div>
            ) : positions.length === 0 ? (
              <div style={styles.empty}>Chưa có chức vụ</div>
            ) : (
              <div style={styles.grid}>
                {positions
                  .filter(p => !posQuery || p.tenChucVu?.toLowerCase().includes(posQuery.toLowerCase()))
                  .map((p) => (
                  <div key={p.chucvuId} style={styles.cardItem}>
                    <div style={styles.cardHead}>
                      <div style={{ fontWeight: 800, color: '#111827' }}>{p.tenChucVu}</div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button style={styles.iconBtn} title="Sửa" onClick={() => openEditPos(p)}>✎</button>
                        <button style={{ ...styles.iconBtn, color: '#b91c1c' }} title="Xóa" onClick={() => deletePosition(p)}>🗑</button>
                      </div>
                    </div>
                    {p.moTa && <div style={styles.cardDesc}>{p.moTa}</div>}
                    <div style={styles.cardMeta}>Cấp bậc: <b>{p.level ?? '—'}</b></div>
                    <div style={styles.cardMeta}>Số NV: <b>{p.soLuongNhanVien ?? 0}</b></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {active === 'contract' && (
          <div>
            <div style={styles.toolbarRow}>
              <input
                value={contractQuery}
                onChange={(e) => setContractQuery(e.target.value)}
                placeholder="Tìm hợp đồng theo tên nhân viên..."
                style={styles.searchInput}
              />
              <button style={styles.secondaryBtn} onClick={loadContracts}>Làm mới</button>
            </div>

            {contractLoading ? (
              <div style={styles.empty}>Đang tải hợp đồng...</div>
            ) : contracts.length === 0 ? (
              <div style={styles.empty}>Chưa có hợp đồng</div>
            ) : (
              <div style={styles.grid}>
                {contracts
                  .filter(c => !contractQuery || c.hoTenNhanVien?.toLowerCase().includes(contractQuery.toLowerCase()))
                  .map((c) => (
                  <div key={c.hopdongId} style={styles.cardItem}>
                    <div style={styles.cardHead}>
                      <div style={{ fontWeight: 800, color: '#111827' }}>{c.hoTenNhanVien || 'N/A'}</div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button style={styles.iconBtn} title="Sửa" onClick={() => openEditContract(c)}>✎</button>
                        <button style={{ ...styles.iconBtn, color: '#b91c1c' }} title="Xóa" onClick={() => deleteContract(c)}>🗑</button>
                      </div>
                    </div>
                    <div style={styles.cardMeta}>
                      Loại: <b>{c.loaiHopDong === 'THU_VIEC' ? 'Thử việc' : c.loaiHopDong === 'XAC_DINH' ? 'Xác định' : 'Vô thời hạn'}</b>
                    </div>
                    <div style={styles.cardMeta}>
                      Từ: <b>{c.ngayBatDau}</b> → <b>{c.ngayKetThuc || 'Vô thời hạn'}</b>
                    </div>
                    <div style={styles.cardMeta}>
                      Lương CB: <b>{Number(c.luongCoBan || 0).toLocaleString('vi-VN')} VNĐ</b>
                    </div>
                    <div style={styles.cardMeta}>
                      Trạng thái: <b style={{ color: c.trangThai === 'HIEU_LUC' ? '#16a34a' : c.trangThai === 'HET_HAN' ? '#dc2626' : '#6b7280' }}>
                        {c.trangThai === 'HIEU_LUC' ? 'Hiệu lực' : c.trangThai === 'HET_HAN' ? 'Hết hạn' : 'Bị hủy'}
                      </b>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {active === 'leave' && (
          <div style={{ marginTop: 24 }}>
            <Tabs
              tabs={['Tất cả', 'Chờ duyệt', 'Đã duyệt', 'Từ chối']}
              activeIndex={0}
              onChange={() => {}}
            />
          </div>
        )}

        {modalOpen && (
          <div style={styles.modalBackdrop} onClick={closeModal}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>{editing ? 'Sửa phòng ban' : 'Thêm phòng ban'}</div>
              <form onSubmit={submitForm} style={{ display: 'grid', gap: 10 }}>
                <label style={styles.labelSm}>Tên phòng ban</label>
                <input
                  style={styles.input}
                  value={form.tenPhongBan}
                  onChange={(e) => setForm((s) => ({ ...s, tenPhongBan: e.target.value }))}
                  required
                />
                <label style={styles.labelSm}>Mô tả</label>
                <textarea
                  style={{ ...styles.input, minHeight: 80, resize: 'vertical' }}
                  value={form.moTa}
                  onChange={(e) => setForm((s) => ({ ...s, moTa: e.target.value }))}
                />
                <label style={styles.labelSm}>Trưởng phòng (User ID)</label>
                <input
                  style={styles.input}
                  type="number"
                  value={form.truongPhongId}
                  onChange={(e) => setForm((s) => ({ ...s, truongPhongId: e.target.value }))}
                />
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 6 }}>
                  <button type="button" onClick={closeModal} style={styles.secondaryBtn}>Hủy</button>
                  <button type="submit" style={styles.primaryBtn}>{editing ? 'Lưu' : 'Tạo'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {posModalOpen && (
          <div style={styles.modalBackdrop} onClick={closePosModal}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>{posEditing ? 'Sửa chức vụ' : 'Thêm chức vụ'}</div>
              <form onSubmit={submitPosForm} style={{ display: 'grid', gap: 10 }}>
                <label style={styles.labelSm}>Tên chức vụ</label>
                <input
                  style={styles.input}
                  value={posForm.tenChucVu}
                  onChange={(e) => setPosForm((s) => ({ ...s, tenChucVu: e.target.value }))}
                  required
                />
                <label style={styles.labelSm}>Mô tả</label>
                <textarea
                  style={{ ...styles.input, minHeight: 80, resize: 'vertical' }}
                  value={posForm.moTa}
                  onChange={(e) => setPosForm((s) => ({ ...s, moTa: e.target.value }))}
                />
                <label style={styles.labelSm}>Cấp bậc (level)</label>
                <input
                  style={styles.input}
                  type="number"
                  min="1"
                  value={posForm.level}
                  onChange={(e) => setPosForm((s) => ({ ...s, level: e.target.value }))}
                />
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 6 }}>
                  <button type="button" onClick={closePosModal} style={styles.secondaryBtn}>Hủy</button>
                  <button type="submit" style={styles.primaryBtn}>{posEditing ? 'Lưu' : 'Tạo'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {contractModalOpen && (
          <div style={styles.modalBackdrop} onClick={closeContractModal}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>{contractEditing ? 'Sửa hợp đồng' : 'Thêm hợp đồng'}</div>
              <form onSubmit={submitContractForm} style={{ display: 'grid', gap: 10 }}>
                <label style={styles.labelSm}>ID Nhân viên</label>
                <input
                  style={styles.input}
                  type="number"
                  value={contractForm.nhanvienId}
                  onChange={(e) => setContractForm((s) => ({ ...s, nhanvienId: e.target.value }))}
                  required
                />
                <label style={styles.labelSm}>Loại hợp đồng</label>
                <select
                  style={styles.input}
                  value={contractForm.loaiHopDong}
                  onChange={(e) => setContractForm((s) => ({ ...s, loaiHopDong: e.target.value }))}
                  required
                >
                  <option value="THU_VIEC">Thử việc</option>
                  <option value="XAC_DINH">Xác định thời hạn</option>
                  <option value="VO_THOI_HAN">Vô thời hạn</option>
                </select>
                <label style={styles.labelSm}>Ngày bắt đầu</label>
                <input
                  style={styles.input}
                  type="date"
                  value={contractForm.ngayBatDau}
                  onChange={(e) => setContractForm((s) => ({ ...s, ngayBatDau: e.target.value }))}
                  required
                />
                <label style={styles.labelSm}>Ngày kết thúc (để trống nếu vô thời hạn)</label>
                <input
                  style={styles.input}
                  type="date"
                  value={contractForm.ngayKetThuc}
                  onChange={(e) => setContractForm((s) => ({ ...s, ngayKetThuc: e.target.value }))}
                />
                <label style={styles.labelSm}>Lương cơ bản (VNĐ)</label>
                <input
                  style={styles.input}
                  type="number"
                  min="0"
                  value={contractForm.luongCoBan}
                  onChange={(e) => setContractForm((s) => ({ ...s, luongCoBan: e.target.value }))}
                  required
                />
                <label style={styles.labelSm}>Nội dung hợp đồng</label>
                <textarea
                  style={{ ...styles.input, minHeight: 100, resize: 'vertical' }}
                  value={contractForm.noiDung}
                  onChange={(e) => setContractForm((s) => ({ ...s, noiDung: e.target.value }))}
                  placeholder="Mô tả chi tiết về hợp đồng..."
                />
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 6 }}>
                  <button type="button" onClick={closeContractModal} style={styles.secondaryBtn}>Hủy</button>
                  <button type="submit" style={styles.primaryBtnSuccess}>{contractEditing ? 'Lưu' : 'Tạo'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

function NavGroup({ label, icon: Icon, children }) {
  return (
    <div style={styles.navGroup}>
      <div style={styles.navGroupHeader}>
        <Icon />
        <span>{label}</span>
      </div>
      <div>{children}</div>
    </div>
  )
}

function NavItem({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...styles.navItem,
        ...(active ? styles.navItemActive : {})
      }}
    >
      {children}
    </button>
  )
}

function PrimaryButton({ tone = 'default', icon: Icon, children, onClick }) {
  const styleByTone = tone === 'success' ? styles.primaryBtnSuccess : styles.primaryBtn
  return (
    <button style={styleByTone} onClick={onClick}>
      <span style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
        {Icon ? <Icon /> : null}
        {children}
      </span>
    </button>
  )
}

function RoleBadge({ role }) {
  return (
    <div style={styles.roleBadge}>
      <ShieldIcon />
      <span style={{ marginLeft: 6 }}>{role}</span>
    </div>
  )
}

function Tabs({ tabs, activeIndex, onChange }) {
  return (
    <div style={styles.tabsRow}>
      {tabs.map((t, i) => (
        <button
          key={t}
          onClick={() => onChange?.(i)}
          style={{ ...styles.tabBtn, ...(i === activeIndex ? styles.tabBtnActive : {}) }}
        >
          {t}
        </button>
      ))}
    </div>
  )
}

function Spinner({ label }) {
  return (
    <div style={styles.spinnerWrap}>
      <div style={styles.spinner} />
      <div style={{ marginTop: 10, color: '#6b7280' }}>{label}</div>
    </div>
  )
}

// Icons (inline SVG, no deps)
function PeopleGroupIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm-8 3a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm8 1c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4Zm-8-1c-3.33 0-10 1.67-10 5v2h8" stroke="#6b7280" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function ClockBadgeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="#6b7280" strokeWidth="1.6" />
      <path d="M12 7v5l3 2" stroke="#6b7280" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z" stroke="#6b7280" strokeWidth="1.6"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06A2 2 0 1 1 7.04 3.3l.06.06c.47.47 1.15.61 1.76.4.61-.21 1.06-.74 1.14-1.38V2a2 2 0 1 1 4 0v.09c.08.64.53 1.17 1.14 1.38.61.21 1.29.07 1.76-.4l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06c-.47.47-.61 1.15-.4 1.76.21.61.74 1.06 1.38 1.14H22a2 2 0 1 1 0 4h-.09c-.64.08-1.17.53-1.38 1.14Z" stroke="#6b7280" strokeWidth="1.2" fill="none"/>
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3Z" stroke="#111827" strokeWidth="1.6" fill="#fff1"/>
    </svg>
  )
}

function ExitIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 17l5-5-5-5" stroke="#b45309" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15 12H4" stroke="#b45309" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="4" width="18" height="17" rx="2" stroke="#fff" strokeWidth="1.6"/>
      <path d="M8 2v4M16 2v4M3 10h18" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  )
}

const styles = {
  appShell: {
    display: 'grid',
    gridTemplateColumns: '260px 1fr',
    minHeight: '100vh',
    backgroundColor: '#f8fafc'
  },
  sidebar: {
    background: '#ffffff',
    borderRight: '1px solid #e5e7eb',
    padding: '18px 16px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 14
  },
  brand: {
    fontWeight: 900,
    letterSpacing: 1,
    color: '#0b1020',
    marginBottom: 8
  },
  userCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    border: '1px solid #e5e7eb',
    borderRadius: 10,
    background: '#f9fafb'
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 8,
    background: '#111827',
    color: '#fff',
    display: 'grid',
    placeItems: 'center',
    fontWeight: 700
  },
  userInfo: { lineHeight: 1.1 },
  userName: { fontWeight: 700, color: '#111827' },
  userRole: { fontSize: 12, color: '#6b7280' },
  navGroup: { marginTop: 8 },
  navGroupHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    color: '#6b7280',
    fontWeight: 700,
    marginBottom: 8
  },
  navItem: {
    width: '100%',
    textAlign: 'left',
    padding: '10px 12px',
    borderRadius: 10,
    border: '1px solid transparent',
    background: 'transparent',
    color: '#111827',
    cursor: 'pointer'
  },
  navItemActive: {
    background: '#eef2ff',
    border: '1px solid #e0e7ff',
    color: '#111827',
    fontWeight: 700
  },
  logoutBtn: {
    marginTop: 'auto',
    background: '#fff7ed',
    border: '1px solid #fed7aa',
    color: '#b45309',
    padding: '10px 12px',
    borderRadius: 10,
    cursor: 'pointer'
  },
  content: {
    padding: '20px 24px'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: 12
  },
  pageHeading: { fontSize: 18, fontWeight: 800, color: '#111827' },
  subHeading: { fontSize: 13, color: '#6b7280', marginTop: 4 },
  rightCluster: { display: 'flex', gap: 10, alignItems: 'center' },
  roleBadge: {
    display: 'flex',
    alignItems: 'center',
    background: '#fef3c7',
    color: '#111827',
    border: '1px solid #fde68a',
    borderRadius: 999,
    padding: '6px 10px',
    fontSize: 12,
    fontWeight: 700
  },
  primaryBtn: {
    background: '#0f172a',
    color: '#fff',
    border: '1px solid #0b1227',
    padding: '10px 14px',
    borderRadius: 10,
    cursor: 'pointer',
    fontWeight: 700
  },
  primaryBtnSuccess: {
    background: '#10b981',
    color: '#fff',
    border: '1px solid #059669',
    padding: '10px 14px',
    borderRadius: 10,
    cursor: 'pointer',
    fontWeight: 700
  },
  sectionHeader: { paddingTop: 16 },
  sectionTitle: { fontSize: 22, fontWeight: 800, color: '#111827' },
  sectionSubtitle: { color: '#6b7280', marginTop: 6 },
  panel: {
    marginTop: 22,
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: 12,
    height: 260,
    display: 'grid',
    placeItems: 'center'
  },
  spinnerWrap: { display: 'grid', placeItems: 'center' },
  spinner: {
    width: 28,
    height: 28,
    borderRadius: '9999px',
    border: '3px solid #e5e7eb',
    borderTopColor: '#4f46e5',
    animation: 'spin 1s linear infinite'
  },
  tabsRow: { display: 'flex', gap: 10, marginTop: 8 },
  tabBtn: {
    background: '#fff',
    color: '#111827',
    border: '1px solid #e5e7eb',
    padding: '8px 12px',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 600
  },
  tabBtnActive: {
    background: '#111827',
    color: '#fff',
    border: '1px solid #111827'
  },
  // Added for Department UI
  toolbarRow: { display: 'flex', gap: 10, alignItems: 'center', marginTop: 14, marginBottom: 14 },
  searchInput: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    border: '1px solid #e5e7eb',
    background: '#fff',
    padding: '8px 12px',
    outline: 'none'
  },
  secondaryBtn: {
    background: '#fff',
    color: '#111827',
    border: '1px solid #e5e7eb',
    padding: '10px 12px',
    borderRadius: 10,
    cursor: 'pointer',
    fontWeight: 600
  },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 },
  cardItem: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 12 },
  cardHead: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  cardDesc: { color: '#374151', fontSize: 14, marginBottom: 8 },
  cardMeta: { color: '#6b7280', fontSize: 13, marginTop: 2 },
  iconBtn: {
    background: '#f3f4f6',
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    padding: '6px 8px',
    cursor: 'pointer'
  },
  modalBackdrop: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)',
    display: 'grid', placeItems: 'center', zIndex: 50
  },
  modal: { background: '#fff', width: 520, maxWidth: '94%', borderRadius: 14, padding: 16, border: '1px solid #e5e7eb' },
  modalHeader: { fontWeight: 800, fontSize: 18, marginBottom: 10 },
  labelSm: { fontSize: 12, color: '#6b7280' },
  input: { height: 40, borderRadius: 10, border: '1px solid #e5e7eb', padding: '8px 12px', outline: 'none' },
  empty: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, color: '#6b7280', textAlign: 'center' }
}

// keyframes injection for spinner
const styleTag = typeof document !== 'undefined' ? document.createElement('style') : null
if (styleTag) {
  styleTag.innerHTML = '@keyframes spin{to{transform:rotate(360deg)}}'
  document.head.appendChild(styleTag)
}

