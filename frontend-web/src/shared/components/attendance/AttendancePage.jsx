import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { usePermissions, useErrorHandler } from '@/shared/hooks';
import { commonStyles } from '@/shared/utils';
import { colors, typography, spacing } from '@/shared/styles/theme';

export default function SharedAttendancePage({ 
  title = "Chấm công",
  breadcrumb = "Cá nhân / Chấm công",
  viewMode = "personal" // "personal" | "management"
}) {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [todayStatus, setTodayStatus] = useState(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState(null);
  
  const { user: authUser } = useAuth();
  const { currentUser, isHRManager, isAccountingManager } = usePermissions();
  const { handleError } = useErrorHandler();

  // Office coordinates (example: TP.HCM)
  const OFFICE_LOCATION = {
    latitude: 10.7756,
    longitude: 106.7019,
    address: '123 Nguyễn Huệ, Quận 1, TP.HCM'
  };
  const MAX_DISTANCE_METERS = 500; // 500m radius

  useEffect(() => {
    loadAttendanceData();
  }, [selectedMonth, selectedYear, viewMode]);

  const loadAttendanceData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate loading attendance data
      setTimeout(() => {
        if (viewMode === "personal") {
          // Personal attendance records
          setAttendanceRecords([
            {
              id: 1,
              ngay: '2024-11-20',
              gioVao: '08:30',
              gioRa: '17:45',
              tongGio: 9.25,
              trangThai: 'BINH_THUONG',
              ghiChu: ''
            },
            {
              id: 2,
              ngay: '2024-11-19',
              gioVao: '08:35',
              gioRa: '17:30',
              tongGio: 8.92,
              trangThai: 'DI_MUON',
              ghiChu: 'Đi muộn 5 phút'
            },
            {
              id: 3,
              ngay: '2024-11-18',
              gioVao: '08:25',
              gioRa: '17:15',
              tongGio: 8.83,
              trangThai: 'VE_SOM',
              ghiChu: 'Về sớm 15 phút'
            }
          ]);
          
          // Today's status
          setTodayStatus({
            daCheckIn: false,
            gioCheckIn: null,
            daCheckOut: false,
            gioCheckOut: null
          });
        } else {
          // Management view - all employees
          setAttendanceRecords([
            {
              id: 1,
              nhanVien: { hoTen: 'Nguyễn Văn A', phongBan: 'IT' },
              ngay: '2024-11-20',
              gioVao: '08:30',
              gioRa: '17:45',
              tongGio: 9.25,
              trangThai: 'BINH_THUONG'
            },
            {
              id: 2,
              nhanVien: { hoTen: 'Trần Thị B', phongBan: 'HR' },
              ngay: '2024-11-20',
              gioVao: '08:35',
              gioRa: '17:30',
              tongGio: 8.92,
              trangThai: 'DI_MUON'
            },
            {
              id: 3,
              nhanVien: { hoTen: 'Lê Văn C', phongBan: 'Marketing' },
              ngay: '2024-11-20',
              gioVao: '08:25',
              gioRa: '17:15',
              tongGio: 8.83,
              trangThai: 'VE_SOM'
            }
          ]);
        }
        
        setLoading(false);
      }, 1000);
    } catch (err) {
      const errorMessage = handleError(err, { context: 'load_attendance' });
      setError(errorMessage);
      setLoading(false);
    }
  };

  // Calculate distance between two GPS coordinates (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return Math.round(R * c); // Distance in meters
  };

  // Get user's GPS location
  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Trình duyệt không hỗ trợ GPS'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          let message = 'Không thể lấy vị trí GPS';
          if (error.code === error.PERMISSION_DENIED) {
            message = 'Bạn đã từ chối quyền truy cập vị trí';
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            message = 'Vị trí không khả dụng';
          } else if (error.code === error.TIMEOUT) {
            message = 'Hết thời gian chờ GPS';
          }
          reject(new Error(message));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  };

  const handleGPSCheckIn = async () => {
    try {
      setGpsLoading(true);
      setGpsError(null);

      // Get GPS location
      const location = await getUserLocation();

      // Calculate distance from office
      const distance = calculateDistance(
        location.latitude,
        location.longitude,
        OFFICE_LOCATION.latitude,
        OFFICE_LOCATION.longitude
      );

      // Validate distance
      if (distance > MAX_DISTANCE_METERS) {
        setGpsError(`Bạn đang cách văn phòng ${distance}m. Vui lòng đến gần hơn (trong bán kính ${MAX_DISTANCE_METERS}m)`);
        setGpsLoading(false);
        return;
      }

      const now = new Date();
      const timeString = now.toLocaleTimeString('vi-VN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      setTodayStatus(prev => ({
        ...prev,
        daCheckIn: true,
        gioCheckIn: timeString,
        viTriCheckIn: {
          latitude: location.latitude,
          longitude: location.longitude,
          distance: distance,
          accuracy: location.accuracy
        }
      }));

      alert(`✅ Check-in thành công!\n🕐 Thời gian: ${timeString}\n📍 Khoảng cách: ${distance}m từ văn phòng`);
      setGpsLoading(false);
    } catch (err) {
      setGpsError(err.message);
      setGpsLoading(false);
    }
  };

  const handleGPSCheckOut = async () => {
    try {
      setGpsLoading(true);
      setGpsError(null);

      // Get GPS location
      const location = await getUserLocation();

      // Calculate distance from office
      const distance = calculateDistance(
        location.latitude,
        location.longitude,
        OFFICE_LOCATION.latitude,
        OFFICE_LOCATION.longitude
      );

      const now = new Date();
      const timeString = now.toLocaleTimeString('vi-VN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      setTodayStatus(prev => ({
        ...prev,
        daCheckOut: true,
        gioCheckOut: timeString,
        viTriCheckOut: {
          latitude: location.latitude,
          longitude: location.longitude,
          distance: distance,
          accuracy: location.accuracy
        }
      }));

      alert(`✅ Check-out thành công!\n🕐 Thời gian: ${timeString}\n📍 Khoảng cách: ${distance}m từ văn phòng`);
      setGpsLoading(false);
    } catch (err) {
      setGpsError(err.message);
      setGpsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      BINH_THUONG: { bg: '#f0fdf4', color: '#15803d', label: '✓ Bình thường' },
      DI_MUON: { bg: '#fff7ed', color: '#c2410c', label: '⏰ Đi muộn' },
      VE_SOM: { bg: '#fef3c7', color: '#d97706', label: '🏃 Về sớm' },
      NGHI_PHEP: { bg: '#eff6ff', color: '#2563eb', label: '📋 Nghỉ phép' },
      VANG_MAT: { bg: '#fef2f2', color: '#b91c1c', label: '❌ Vắng mặt' }
    };
    const s = config[status] || config.BINH_THUONG;
    return (
      <span style={{
        background: s.bg, color: s.color, padding: '4px 8px', borderRadius: 6,
        fontSize: 11, fontWeight: 700, textTransform: 'uppercase', whiteSpace: 'nowrap'
      }}>
        {s.label}
      </span>
    );
  };

  // Calculate stats
  const stats = {
    totalDays: attendanceRecords.length,
    normalDays: attendanceRecords.filter(r => r.trangThai === 'BINH_THUONG').length,
    lateDays: attendanceRecords.filter(r => r.trangThai === 'DI_MUON').length,
    earlyDays: attendanceRecords.filter(r => r.trangThai === 'VE_SOM').length,
    totalHours: attendanceRecords.reduce((sum, r) => sum + (r.tongGio || 0), 0)
  };

  if (loading) {
    return (
      <div style={commonStyles.pageContainer}>
        <div style={{ textAlign: 'center', padding: spacing['6xl'] }}>
          <div style={{ fontSize: typography.xl, color: colors.textSecondary, marginBottom: spacing.lg }}>
            Đang tải dữ liệu chấm công...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={commonStyles.pageContainer}>
        <div style={{ textAlign: 'center', padding: spacing['6xl'] }}>
          <div style={{ fontSize: typography.xl, color: colors.error, marginBottom: spacing.lg }}>
            ❌ {error}
          </div>
          <button 
            onClick={loadAttendanceData}
            style={{
              background: colors.gradientPrimary,
              color: '#fff', border: 'none', borderRadius: spacing.lg, padding: `${spacing.md} ${spacing.xl}`,
              fontSize: typography.sm, fontWeight: typography.bold, cursor: 'pointer'
            }}
          >
            🔄 Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={commonStyles.pageContainer}>
      {/* Header */}
      <div style={{ marginBottom: spacing['2xl'] }}>
        <div style={{ fontSize: typography.sm, color: colors.textSecondary, marginBottom: spacing.sm, fontWeight: typography.semibold, textTransform: 'uppercase' }}>
          {breadcrumb}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={commonStyles.heading1}>
            {title}
          </h1>
          {viewMode === "personal" && (
            <div style={{ display: 'flex', gap: spacing.md }}>
              {!todayStatus?.daCheckIn ? (
                <button 
                  style={{
                    background: gpsLoading ? colors.textMuted : colors.gradientSuccess,
                    color: '#fff', border: 'none', borderRadius: spacing.lg, padding: `${spacing.md} ${spacing.xl}`,
                    fontSize: typography.sm, fontWeight: typography.bold, cursor: gpsLoading ? 'not-allowed' : 'pointer',
                    opacity: gpsLoading ? 0.7 : 1
                  }}
                  onClick={handleGPSCheckIn}
                  disabled={gpsLoading}
                >
                  {gpsLoading ? '⏳ Đang lấy GPS...' : '� Check-in GPS'}
                </button>
              ) : !todayStatus?.daCheckOut ? (
                <button 
                  style={{
                    background: gpsLoading ? colors.textMuted : colors.gradientWarning,
                    color: '#fff', border: 'none', borderRadius: spacing.lg, padding: `${spacing.md} ${spacing.xl}`,
                    fontSize: typography.sm, fontWeight: typography.bold, cursor: gpsLoading ? 'not-allowed' : 'pointer',
                    opacity: gpsLoading ? 0.7 : 1
                  }}
                  onClick={handleGPSCheckOut}
                  disabled={gpsLoading}
                >
                  {gpsLoading ? '⏳ Đang lấy GPS...' : '� Check-out GPS'}
                </button>
              ) : (
                <div style={{
                  background: colors.success, color: '#fff', borderRadius: spacing.lg, padding: `${spacing.md} ${spacing.xl}`,
                  fontSize: typography.sm, fontWeight: typography.bold
                }}>
                  ✅ Đã hoàn thành
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* GPS Error Message */}
      {gpsError && (
        <div style={{
          ...commonStyles.cardBase,
          background: '#fef2f2',
          border: `2px solid ${colors.error}`,
          marginBottom: spacing.xl,
          padding: spacing.lg
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: spacing.md }}>
            <span style={{ fontSize: typography['2xl'] }}>⚠️</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: typography.bold, color: colors.error, marginBottom: spacing.xs }}>
                Lỗi GPS
              </div>
              <div style={{ fontSize: typography.sm, color: '#b91c1c' }}>
                {gpsError}
              </div>
            </div>
            <button
              onClick={() => setGpsError(null)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: typography.xl,
                color: colors.error,
                cursor: 'pointer',
                padding: 0,
                lineHeight: 1
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Today Status (Personal View) */}
      {viewMode === "personal" && todayStatus && (
        <div style={{
          ...commonStyles.cardBase,
          marginBottom: spacing['2xl'],
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#fff'
        }}>
          <h3 style={{ fontSize: typography.xl, fontWeight: typography.bold, margin: 0, marginBottom: spacing.lg }}>
            📅 Hôm nay ({new Date().toLocaleDateString('vi-VN')})
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing['2xl'] }}>
            <div>
              <div style={{ fontSize: typography.sm, opacity: 0.8, marginBottom: spacing.xs }}>Check-in</div>
              <div style={{ fontSize: typography['2xl'], fontWeight: typography.bold, marginBottom: spacing.xs }}>
                {todayStatus.gioCheckIn || '--:--'}
              </div>
              {todayStatus.viTriCheckIn && (
                <div style={{ fontSize: typography.xs, opacity: 0.9, display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                  <span>📍</span>
                  <span>
                    {todayStatus.viTriCheckIn.distance}m từ văn phòng
                    {todayStatus.viTriCheckIn.distance <= 100 && ' 🟢'}
                    {todayStatus.viTriCheckIn.distance > 100 && todayStatus.viTriCheckIn.distance <= 300 && ' 🟡'}
                    {todayStatus.viTriCheckIn.distance > 300 && ' 🔴'}
                  </span>
                </div>
              )}
            </div>
            <div>
              <div style={{ fontSize: typography.sm, opacity: 0.8, marginBottom: spacing.xs }}>Check-out</div>
              <div style={{ fontSize: typography['2xl'], fontWeight: typography.bold, marginBottom: spacing.xs }}>
                {todayStatus.gioCheckOut || '--:--'}
              </div>
              {todayStatus.viTriCheckOut && (
                <div style={{ fontSize: typography.xs, opacity: 0.9, display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                  <span>📍</span>
                  <span>
                    {todayStatus.viTriCheckOut.distance}m từ văn phòng
                    {todayStatus.viTriCheckOut.distance <= 100 && ' 🟢'}
                    {todayStatus.viTriCheckOut.distance > 100 && todayStatus.viTriCheckOut.distance <= 300 && ' 🟡'}
                    {todayStatus.viTriCheckOut.distance > 300 && ' 🔴'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Filter */}
      <div style={{ display: 'flex', gap: spacing.lg, marginBottom: spacing['2xl'] }}>
        <select 
          value={selectedMonth} 
          onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          style={commonStyles.inputBase}
        >
          {Array.from({length: 12}, (_, i) => (
            <option key={i+1} value={i+1}>Tháng {i+1}</option>
          ))}
        </select>
        <select 
          value={selectedYear} 
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          style={commonStyles.inputBase}
        >
          <option value={2024}>2024</option>
          <option value={2025}>2025</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: spacing.xl, marginBottom: spacing['2xl'] }}>
        {[
          { title: 'Tổng ngày làm', value: stats.totalDays, icon: '📅', color: colors.info },
          { title: 'Ngày bình thường', value: stats.normalDays, icon: '✅', color: colors.success },
          { title: 'Ngày đi muộn', value: stats.lateDays, icon: '⏰', color: colors.warning },
          { title: 'Tổng giờ làm', value: `${stats.totalHours.toFixed(1)}h`, icon: '🕐', color: colors.primary }
        ].map((stat, i) => (
          <div key={i} style={{
            ...commonStyles.cardBase,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: typography['3xl'], marginBottom: spacing.md }}>{stat.icon}</div>
            <div style={{ fontSize: typography['2xl'], fontWeight: typography.bold, color: stat.color, marginBottom: spacing.xs }}>
              {stat.value}
            </div>
            <div style={{ fontSize: typography.sm, color: colors.textSecondary }}>
              {stat.title}
            </div>
          </div>
        ))}
      </div>

      {/* Attendance Table */}
      <div style={commonStyles.cardBase}>
        <h3 style={{ ...commonStyles.heading3, marginBottom: spacing.xl }}>
          📊 Lịch sử chấm công tháng {selectedMonth}/{selectedYear}
        </h3>
        
        {attendanceRecords.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ padding: spacing.lg, textAlign: 'left', fontSize: typography.sm, fontWeight: typography.bold, color: colors.textSecondary, borderBottom: `1px solid ${colors.borderLight}` }}>
                    Ngày
                  </th>
                  {viewMode === "management" && (
                    <th style={{ padding: spacing.lg, textAlign: 'left', fontSize: typography.sm, fontWeight: typography.bold, color: colors.textSecondary, borderBottom: `1px solid ${colors.borderLight}` }}>
                      Nhân viên
                    </th>
                  )}
                  <th style={{ padding: spacing.lg, textAlign: 'center', fontSize: typography.sm, fontWeight: typography.bold, color: colors.textSecondary, borderBottom: `1px solid ${colors.borderLight}` }}>
                    Giờ vào
                  </th>
                  <th style={{ padding: spacing.lg, textAlign: 'center', fontSize: typography.sm, fontWeight: typography.bold, color: colors.textSecondary, borderBottom: `1px solid ${colors.borderLight}` }}>
                    Giờ ra
                  </th>
                  <th style={{ padding: spacing.lg, textAlign: 'center', fontSize: typography.sm, fontWeight: typography.bold, color: colors.textSecondary, borderBottom: `1px solid ${colors.borderLight}` }}>
                    Tổng giờ
                  </th>
                  <th style={{ padding: spacing.lg, textAlign: 'center', fontSize: typography.sm, fontWeight: typography.bold, color: colors.textSecondary, borderBottom: `1px solid ${colors.borderLight}` }}>
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.map(record => (
                  <tr key={record.id} style={{ borderBottom: `1px solid ${colors.borderLight}` }}>
                    <td style={{ padding: spacing.lg, fontSize: typography.base, color: colors.textPrimary }}>
                      {new Date(record.ngay).toLocaleDateString('vi-VN')}
                    </td>
                    {viewMode === "management" && (
                      <td style={{ padding: spacing.lg, fontSize: typography.base, color: colors.textPrimary }}>
                        <div>
                          <div style={{ fontWeight: typography.semibold }}>{record.nhanVien.hoTen}</div>
                          <div style={{ fontSize: typography.sm, color: colors.textSecondary }}>{record.nhanVien.phongBan}</div>
                        </div>
                      </td>
                    )}
                    <td style={{ padding: spacing.lg, fontSize: typography.base, color: colors.textPrimary, textAlign: 'center' }}>
                      {record.gioVao}
                    </td>
                    <td style={{ padding: spacing.lg, fontSize: typography.base, color: colors.textPrimary, textAlign: 'center' }}>
                      {record.gioRa}
                    </td>
                    <td style={{ padding: spacing.lg, fontSize: typography.base, color: colors.textPrimary, textAlign: 'center', fontWeight: typography.semibold }}>
                      {record.tongGio}h
                    </td>
                    <td style={{ padding: spacing.lg, textAlign: 'center' }}>
                      {getStatusBadge(record.trangThai)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: spacing['6xl'] }}>
            <div style={{ fontSize: typography['4xl'], marginBottom: spacing.xl }}>📅</div>
            <div style={{ fontSize: typography.xl, fontWeight: typography.semibold, color: colors.textPrimary, marginBottom: spacing.md }}>
              Chưa có dữ liệu chấm công
            </div>
            <div style={{ fontSize: typography.base, color: colors.textSecondary }}>
              {viewMode === "personal" 
                ? "Bạn chưa có bản ghi chấm công nào trong tháng này"
                : "Chưa có dữ liệu chấm công của nhân viên trong tháng này"
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
