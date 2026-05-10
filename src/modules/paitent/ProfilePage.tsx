import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../shared/components/AuthContext';
import logo from '@/images/logo.png';
import { userService } from './service/userService';

interface UserProfile {
    id: string;
    full_name: string;
    email: string;
    phone: string | null;
    avatar_url: string | null;
    role: string;
    profile: {
        id: string;
        date_of_birth: string | null;
        gender: string | null;
        user_id: string;
        created_at: string;
    };
}

const TABS = [
    { id: 'personal', label: 'Thông tin cá nhân', icon: '👤' },
    { id: 'medical', label: 'Hồ sơ y tế', icon: '🫀' },
    { id: 'documents', label: 'Giấy tờ', icon: '📄' },
    { id: 'insurance', label: 'Bảo hiểm', icon: '💳' },
];

export default function PatientProfilePage() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [activeTab, setActiveTab] = useState('personal');
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [userInfo, setUserInfo] = useState<UserProfile | null>(null);
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        date_of_birth: '',
        gender: '',
        address: '',
        id_number: '',
        insurance_number: 'DN1234567890',
        blood_type: 'A+',
        allergies: 'Penicillin, Hải sản',
        chronic_conditions: 'Cao huyết áp',
        emergency_contact: '',
    });

    const headerRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        const handleScroll = () => {
            if (!headerRef.current) return;
            if (window.scrollY > 10) {
                headerRef.current.classList.add('scrolled');
            } else {
                headerRef.current.classList.remove('scrolled');
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const res = await userService.getUserInfo();
            if (res?.data) {
                const u: UserProfile = res.data;
                setUserInfo(u);
                setFormData(prev => ({
                    ...prev,
                    full_name: u.full_name || '',
                    email: u.email || '',
                    phone: u.phone || '',
                    date_of_birth: u.profile?.date_of_birth || '',
                    gender: u.profile?.gender || '',
                }));
            }
        } catch (e) {
            console.error('Lỗi tải thông tin:', e);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const payload = new FormData();
            payload.append('full_name', formData.full_name);
            if (formData.phone) payload.append('phone', formData.phone);
            if (formData.date_of_birth) payload.append('date_of_birth', formData.date_of_birth);
            if (formData.gender) payload.append('gender', formData.gender);
            await userService.updateUserInfo(payload);
            await fetchProfile();
            setIsEditing(false);
        } catch (e) {
            console.error('Lỗi lưu:', e);
        } finally {
            setSaving(false);
        }
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const payload = new FormData();
        payload.append('avatar', file);
        try {
            await userService.updateUserInfo(payload);
            await fetchProfile();
        } catch (err) {
            console.error('Lỗi upload avatar:', err);
        }
    };

    const displayName = userInfo?.full_name || currentUser?.full_name || 'Người dùng';
    const displayEmail = userInfo?.email || currentUser?.email || '';
    const displayGender = formData.gender === 'FEMALE' ? 'Nữ' : formData.gender === 'MALE' ? 'Nam' : 'Khác';

    /* ---- STYLES ---- */
    const s = {
        page: { fontFamily: "'Segoe UI', sans-serif", minHeight: '100vh', backgroundColor: '#f8f9fb' } as React.CSSProperties,
        header: { backgroundColor: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 40px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' } as React.CSSProperties,
        logoBox: { width: 36, height: 36, borderRadius: 8, backgroundColor: '#1a4f6e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 16 } as React.CSSProperties,
        content: { maxWidth: 1200, margin: '0 auto', padding: '32px 24px' } as React.CSSProperties,
        grid: { display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24 } as React.CSSProperties,
        sidebar: { backgroundColor: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: 28, textAlign: 'center' as const, height: 'fit-content' },
        mainCard: { backgroundColor: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: 28 } as React.CSSProperties,
        tabBar: { display: 'flex', gap: 0, marginBottom: 20, backgroundColor: '#fff', borderRadius: 10, border: '1px solid #e5e7eb', padding: 4, width: '100%' } as React.CSSProperties,
        input: (editing: boolean): React.CSSProperties => ({ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 14, color: '#111', backgroundColor: editing ? '#fff' : '#fafafa', outline: 'none', boxSizing: 'border-box' }),
        label: { fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 } as React.CSSProperties,
        btnPrimary: { padding: '9px 22px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer' } as React.CSSProperties,
        btnSecondary: { padding: '9px 18px', borderRadius: 8, border: '1px solid #e5e7eb', backgroundColor: '#fff', color: '#555', fontWeight: 500, fontSize: 14, cursor: 'pointer' } as React.CSSProperties,
    };

    if (loading) return (
        <div style={s.page}>
            <div style={s.header}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={s.logoBox}>M</div>
                    <span style={{ fontWeight: 700, fontSize: 17 }}>MediCare</span>
                </div>
            </div>
            <div style={{ textAlign: 'center', padding: 80, color: '#6b7280' }}>Đang tải...</div>
        </div>
    );

    return (
        <div style={s.page}>
            {/* Header */}
            <div className="doctor-header py-3 shadow-sm bg-white" ref={headerRef}>
                <div className="container d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                        <img src={logo} className="header-logo" alt="logo" />
                        <h5 className="mb-0 fw-bold">MediGo</h5>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                        <i className="fas fa-bell text-secondary"></i>
                        <div
                            className="d-flex align-items-center gap-2"
                            style={{ cursor: 'pointer' }}
                            onClick={() => navigate('/profile')}
                        >
                            <div className="doctor-avatar-mini">
                                {currentUser?.avatar_url ? (
                                    <img src={currentUser.avatar_url} alt="avatar" />
                                ) : (
                                    <div className="avatar-fallback">
                                        <i className="fas fa-user-md"></i>
                                    </div>
                                )}
                            </div>
                            <span>{currentUser?.full_name || 'User'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div style={s.content}>
                <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4, color: '#111' }}>Hồ sơ cá nhân</h1>
                <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 28 }}>Quản lý thông tin cá nhân và hồ sơ y tế của bạn</p>

                <div style={s.grid}>
                    {/* Sidebar */}
                    <div style={s.sidebar}>
                        <div style={{ position: 'relative', display: 'inline-block', marginBottom: 16 }}>
                            <img
                                src={userInfo?.avatar_url || 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=128&h=128&fit=crop'}
                                alt="Avatar"
                                style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', border: '3px solid #e5e7eb' }}
                            />
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                style={{ position: 'absolute', bottom: 2, right: 2, width: 28, height: 28, borderRadius: '50%', backgroundColor: '#1a4f6e', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px solid #fff' }}
                            >
                                <span style={{ fontSize: 13, color: '#fff' }}>📷</span>
                            </div>
                            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
                        </div>
                        <div style={{ fontWeight: 700, fontSize: 16, color: '#111', marginBottom: 4 }}>{displayName}</div>
                        <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 12 }}>{displayEmail}</div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, backgroundColor: '#f0fdf4', color: '#16a34a', borderRadius: 20, padding: '5px 14px', fontSize: 13, fontWeight: 500, marginBottom: 20 }}>
                            <span>✓</span> Đã xác thực
                        </div>
                        <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 16, textAlign: 'left' }}>
                            {[
                                { icon: '🫀', label: 'Nhóm máu', value: formData.blood_type },
                                { icon: '💳', label: 'Số BHYT', value: formData.insurance_number },
                                { icon: '⚠️', label: 'Dị ứng', value: formData.allergies },
                            ].map(item => (
                                <div key={item.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 14 }}>
                                    <span style={{ fontSize: 16, marginTop: 2 }}>{item.icon}</span>
                                    <div>
                                        <div style={{ fontSize: 12, color: '#9ca3af' }}>{item.label}</div>
                                        <div style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>{item.value}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Panel */}
                    <div>
                        {/* Tabs */}
                        <div style={s.tabBar}>
                            {TABS.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => { setActiveTab(tab.id); setIsEditing(false); }}
                                    style={{
                                        flex: 1, padding: '9px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500,
                                        background: activeTab === tab.id ? 'linear-gradient(135deg, var(--primary), var(--primary-dark))' : 'transparent',
                                        color: activeTab === tab.id ? '#fff' : '#6b7280',
                                        transition: 'all 0.2s',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                    }}
                                >
                                    <span>{tab.icon}</span> {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div style={s.mainCard}>
                            {/* === THÔNG TIN CÁ NHÂN === */}
                            {activeTab === 'personal' && (
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: 17, color: '#111' }}>Thông tin cá nhân</div>
                                            <div style={{ fontSize: 13, color: '#6b7280' }}>Cập nhật thông tin cá nhân của bạn</div>
                                        </div>
                                        {!isEditing ? (
                                            <button onClick={() => setIsEditing(true)} style={s.btnPrimary}>Chỉnh sửa</button>
                                        ) : (
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                <button onClick={() => setIsEditing(false)} style={s.btnSecondary}>Hủy</button>
                                                <button onClick={handleSave} disabled={saving} style={s.btnPrimary}>{saving ? 'Đang lưu...' : 'Lưu thay đổi'}</button>
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                                        {/* Họ và tên */}
                                        <div>
                                            <label style={s.label}><span>👤</span> Họ và tên</label>
                                            <input type="text" value={formData.full_name} disabled={!isEditing}
                                                onChange={e => setFormData(p => ({ ...p, full_name: e.target.value }))}
                                                style={s.input(isEditing)} placeholder="Nguyễn Thị Hương" />
                                        </div>
                                        {/* Email */}
                                        <div>
                                            <label style={s.label}><span>✉️</span> Email</label>
                                            <input type="email" value={formData.email} disabled
                                                style={{ ...s.input(false), color: '#9ca3af' }} placeholder="email@example.com" />
                                        </div>
                                        {/* SĐT */}
                                        <div>
                                            <label style={s.label}><span>📞</span> Số điện thoại</label>
                                            <input type="text" value={formData.phone} disabled={!isEditing}
                                                onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                                                style={s.input(isEditing)} placeholder="0912 345 678" />
                                        </div>
                                        {/* Ngày sinh */}
                                        <div>
                                            <label style={s.label}><span>📅</span> Ngày sinh</label>
                                            <input type={isEditing ? 'date' : 'text'} value={formData.date_of_birth || ''} disabled={!isEditing}
                                                onChange={e => setFormData(p => ({ ...p, date_of_birth: e.target.value }))}
                                                style={s.input(isEditing)} placeholder="15-May-1990" />
                                        </div>
                                        {/* Giới tính */}
                                        <div>
                                            <label style={s.label}>Giới tính</label>
                                            {isEditing ? (
                                                <select value={formData.gender} onChange={e => setFormData(p => ({ ...p, gender: e.target.value }))} style={s.input(true)}>
                                                    <option value="">-- Chọn --</option>
                                                    <option value="MALE">Nam</option>
                                                    <option value="FEMALE">Nữ</option>
                                                    <option value="OTHER">Khác</option>
                                                </select>
                                            ) : (
                                                <input type="text" value={displayGender} disabled style={s.input(false)} />
                                            )}
                                        </div>
                                        {/* CMND */}
                                        <div>
                                            <label style={s.label}>Số CMND/CCCD</label>
                                            <input type="text" value={formData.id_number} disabled={!isEditing}
                                                onChange={e => setFormData(p => ({ ...p, id_number: e.target.value }))}
                                                style={s.input(isEditing)} placeholder="079090012345" />
                                        </div>
                                        {/* Địa chỉ */}
                                        <div style={{ gridColumn: '1 / -1' }}>
                                            <label style={s.label}><span>📍</span> Địa chỉ</label>
                                            <textarea value={formData.address} disabled={!isEditing}
                                                onChange={e => setFormData(p => ({ ...p, address: e.target.value }))}
                                                rows={3} placeholder="123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh"
                                                style={{ ...s.input(isEditing), resize: 'vertical' }} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* === HỒ SƠ Y TẾ === */}
                            {activeTab === 'medical' && (
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                                        <div style={{ fontWeight: 700, fontSize: 17, color: '#111' }}>Hồ sơ y tế</div>
                                        {!isEditing ? (
                                            <button onClick={() => setIsEditing(true)} style={s.btnPrimary}>Chỉnh sửa</button>
                                        ) : (
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                <button onClick={() => setIsEditing(false)} style={s.btnSecondary}>Hủy</button>
                                                <button onClick={() => setIsEditing(false)} style={s.btnPrimary}>Lưu thay đổi</button>
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                                        <div>
                                            <label style={s.label}>Nhóm máu</label>
                                            <select value={formData.blood_type} disabled={!isEditing} onChange={e => setFormData(p => ({ ...p, blood_type: e.target.value }))} style={s.input(isEditing)}>
                                                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(b => <option key={b}>{b}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label style={s.label}>Liên hệ khẩn cấp</label>
                                            <input type="text" value={formData.emergency_contact} disabled={!isEditing}
                                                onChange={e => setFormData(p => ({ ...p, emergency_contact: e.target.value }))}
                                                style={s.input(isEditing)} placeholder="Họ tên - SĐT (Quan hệ)" />
                                        </div>
                                        <div style={{ gridColumn: '1 / -1' }}>
                                            <label style={s.label}><span style={{ color: '#f59e0b' }}>⚠️</span> Dị ứng</label>
                                            <textarea value={formData.allergies} disabled={!isEditing}
                                                onChange={e => setFormData(p => ({ ...p, allergies: e.target.value }))}
                                                rows={2} style={{ ...s.input(isEditing), resize: 'vertical' }} />
                                        </div>
                                        <div style={{ gridColumn: '1 / -1' }}>
                                            <label style={s.label}>Bệnh mãn tính</label>
                                            <textarea value={formData.chronic_conditions} disabled={!isEditing}
                                                onChange={e => setFormData(p => ({ ...p, chronic_conditions: e.target.value }))}
                                                rows={2} style={{ ...s.input(isEditing), resize: 'vertical' }} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* === GIẤY TỜ === */}
                            {activeTab === 'documents' && (
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                        <div style={{ fontWeight: 700, fontSize: 17, color: '#111' }}>Giấy tờ y tế</div>
                                        <button style={s.btnPrimary}>+ Thêm giấy tờ</button>
                                    </div>
                                    <div style={{ border: '2px dashed #e5e7eb', borderRadius: 10, padding: 40, textAlign: 'center', marginBottom: 20 }}>
                                        <div style={{ fontSize: 36, marginBottom: 8 }}>☁️</div>
                                        <p style={{ color: '#9ca3af', fontSize: 14, marginBottom: 10 }}>Kéo thả hoặc nhấn để tải lên giấy tờ</p>
                                        <button style={s.btnSecondary}>Chọn file</button>
                                    </div>
                                    {[
                                        { name: 'Kết quả xét nghiệm máu', date: '15/03/2024', size: '245 KB', icon: '📕' },
                                        { name: 'Đơn thuốc tim mạch', date: '10/03/2024', size: '128 KB', icon: '📘' },
                                    ].map(doc => (
                                        <div key={doc.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #f3f4f6' }}>
                                            <span style={{ fontSize: 14 }}>{doc.icon} {doc.name}</span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                <span style={{ color: '#9ca3af', fontSize: 13 }}>{doc.date} - {doc.size}</span>
                                                <button style={{ color: '#1a4f6e', fontSize: 14, border: 'none', background: 'none', cursor: 'pointer', fontWeight: 500 }}>Xem</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* === BẢO HIỂM === */}
                            {activeTab === 'insurance' && (
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                        <div style={{ fontWeight: 700, fontSize: 17, color: '#111' }}>Thông tin bảo hiểm</div>
                                        <button style={s.btnPrimary}>Thêm thẻ BHYT</button>
                                    </div>
                                    <div style={{ background: 'linear-gradient(135deg, #1a4f6e, #0a3652)', borderRadius: 12, padding: 24, color: '#fff', marginBottom: 20 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div>
                                                <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>Bảo hiểm y tế</div>
                                                <div style={{ fontSize: 20, fontWeight: 700 }}>{formData.insurance_number}</div>
                                            </div>
                                            <span style={{ fontSize: 32, opacity: 0.5 }}>🛡️</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
                                            <div><div style={{ fontSize: 11, opacity: 0.7 }}>Họ tên</div><div style={{ fontWeight: 600 }}>{displayName}</div></div>
                                            <div><div style={{ fontSize: 11, opacity: 0.7 }}>Hiệu lực đến</div><div style={{ fontWeight: 600 }}>31/12/2025</div></div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, textAlign: 'center' }}>
                                        {[{ val: '80%', label: 'Mức hưởng' }, { val: '15', label: 'Lượt khám' }, { val: 'Còn hiệu lực', label: 'Trạng thái', green: true }].map(item => (
                                            <div key={item.label} style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 16 }}>
                                                <div style={{ fontSize: 22, fontWeight: 700, color: item.green ? '#16a34a' : '#1a4f6e' }}>{item.val}</div>
                                                <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>{item.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}