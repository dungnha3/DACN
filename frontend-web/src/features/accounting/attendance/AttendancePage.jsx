import { SharedAttendancePage } from '@/shared/components/attendance';

export function AttendancePage() {
    return (
        <div className="accounting-animate-fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* 
        SharedAttendancePage is a complex component. 
        We rely on its internal styling but wrap it to ensure it fits the layout.
        If SharedAttendancePage has a white background hardcoded, we might need to override it via specific props or CSS if supported.
        Assuming it is "card-like".
      */}
            <div className="glass-card" style={{ flex: 1, padding: '20px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <SharedAttendancePage
                    title="Quản lý chấm công"
                    breadcrumb="Kế toán / Quản lý chấm công"
                    viewMode="management"
                />
            </div>
        </div>
    );
}
