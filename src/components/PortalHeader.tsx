import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, 
  MapPin, 
  Clock, 
  LogIn, 
  LogOut, 
  Key, 
  UserPlus, 
  X, 
  ShieldAlert, 
  Check, 
  Eye, 
  EyeOff,
  User as UserIcon
} from 'lucide-react';
import { User, UserRole } from '../types';

interface PortalHeaderProps {
  currentUser: User | null;
  onLogin: (user: User) => void;
  onLogout: () => void;
  accounts: User[];
  onSaveAccounts: (newAccounts: User[]) => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export default function PortalHeader({
  currentUser,
  onLogin,
  onLogout,
  accounts,
  onSaveAccounts,
  showToast
}: PortalHeaderProps) {
  // Clock state
  const [timeStr, setTimeStr] = useState('Đang đồng bộ thời gian...');
  
  // Modals state
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showChangePassModal, setShowChangePassModal] = useState(false);
  const [isForcedChange, setIsForcedChange] = useState(false);

  // Form states
  const [loginTab, setLoginTab] = useState<'general' | 'admin'>('general');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123');
  const [showPassword, setShowPassword] = useState(false);

  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('Học sinh');
  const [regExtra, setRegExtra] = useState('');
  const [regError, setRegError] = useState('');

  const [forgotUsername, setForgotUsername] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [changePassError, setChangePassError] = useState('');

  // Password rules validation
  const isLengthValid = newPass.length >= 6;
  const hasUppercase = /[A-Z]/.test(newPass);
  const hasNumber = /\d/.test(newPass);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPass);
  const isPasswordStrong = isLengthValid && hasUppercase && hasNumber && hasSpecial;

  // Live ticking clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const dayNames = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
      const dayName = dayNames[now.getDay()];
      const dateStr = String(now.getDate()).padStart(2, '0');
      const monthStr = String(now.getMonth() + 1).padStart(2, '0');
      const yearStr = now.getFullYear();
      const hourStr = String(now.getHours()).padStart(2, '0');
      const minStr = String(now.getMinutes()).padStart(2, '0');
      const secStr = String(now.getSeconds()).padStart(2, '0');
      setTimeStr(`${dayName}, ${dateStr}/${monthStr}/${yearStr} - ${hourStr}:${minStr}:${secStr}`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Force password change on first login / default '123' password
  useEffect(() => {
    if (currentUser && (currentUser.isFirstLogin || currentUser.password === '123')) {
      setIsForcedChange(true);
      setShowChangePassModal(true);
    }
  }, [currentUser]);

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matched = accounts.find(
      a => a.username === username.trim() && (a.password || '123') === password
    );

    if (!matched) {
      showToast("Sai tên đăng nhập hoặc mật khẩu!", "error");
      return;
    }

    if (loginTab === 'admin' && matched.role !== 'Admin') {
      showToast("Tài khoản này không có quyền truy cập Admin!", "error");
      return;
    }

    setShowLoginModal(false);
    onLogin(matched);
    showToast(`Đăng nhập thành công! Xin chào ${matched.name}`, "success");
  };

  // Handle Register
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regUsername.trim() || !regPassword) {
      setRegError("Vui lòng điền đầy đủ các thông tin!");
      return;
    }

    // Check password requirements
    const isWeak = regPassword.length < 6 || !/[A-Z]/.test(regPassword) || !/\d/.test(regPassword) || !/[!@#$%^&*(),.?":{}|<>]/.test(regPassword);
    if (isWeak) {
      setRegError("Mật khẩu yếu! Cần ít nhất 6 ký tự, gồm 1 chữ hoa, 1 số và 1 ký tự đặc biệt.");
      return;
    }

    // Check duplicate username
    if (accounts.some(a => a.username === regUsername.trim())) {
      setRegError("Tên tài khoản này đã được sử dụng!");
      return;
    }

    const newUser: User = {
      id: Date.now(),
      name: regName.trim(),
      username: regUsername.trim(),
      password: regPassword,
      role: regRole,
      extra: regExtra.trim() || (regRole === 'Học sinh' ? '6A' : 'Tự do'),
      isFirstLogin: false,
      canPostNews: false
    };

    onSaveAccounts([...accounts, newUser]);
    setShowRegisterModal(false);
    
    // Clear form
    setRegName('');
    setRegUsername('');
    setRegPassword('');
    setRegExtra('');
    setRegError('');

    showToast("Đăng ký tài khoản mới thành công! Bạn có thể đăng nhập ngay.", "success");
  };

  // Handle Forgot Password
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matched = accounts.find(a => a.username === forgotUsername.trim());
    if (matched) {
      const updated = accounts.map(a => 
        a.id === matched.id ? { ...a, password: '123', isFirstLogin: true } : a
      );
      onSaveAccounts(updated);
      setForgotSuccess("Mật khẩu đã được khôi phục về mặc định: '123'. Vui lòng đăng nhập và đổi mật khẩu mới.");
      showToast("Khôi phục thành công mật khẩu mặc định!", "success");
    } else {
      showToast("Không tìm thấy tên tài khoản trong hệ thống!", "error");
    }
  };

  // Handle Password Change
  const handleChangePassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (!oldPass || !newPass || !confirmPass) {
      setChangePassError("Vui lòng điền đầy đủ các trường.");
      return;
    }

    if (oldPass !== currentUser.password && currentUser.password !== '123') {
      setChangePassError("Mật khẩu hiện tại không chính xác.");
      return;
    }

    if (newPass === '123') {
      setChangePassError("Không được sử dụng mật khẩu mặc định '123'.");
      return;
    }

    if (newPass !== confirmPass) {
      setChangePassError("Nhập lại mật khẩu mới không khớp.");
      return;
    }

    if (!isPasswordStrong) {
      setChangePassError("Mật khẩu mới chưa đạt tiêu chuẩn bảo mật.");
      return;
    }

    const updatedAccounts = accounts.map(a => 
      a.id === currentUser.id ? { ...a, password: newPass, isFirstLogin: false } : a
    );
    onSaveAccounts(updatedAccounts);
    
    // update current user in parent state
    onLogin({ ...currentUser, password: newPass, isFirstLogin: false });

    // reset fields
    setOldPass('');
    setNewPass('');
    setConfirmPass('');
    setChangePassError('');
    setIsForcedChange(false);
    setShowChangePassModal(false);

    showToast("Đổi mật khẩu thành công!", "success");
  };

  return (
    <>
      {/* Visual Header Banner */}
      <header className="bg-gradient-to-r from-brandBlue-dark via-brandBlue to-brandBlue-dark text-white shadow-xl relative overflow-hidden border-b-4 border-brandOrange">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" stroke-width="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            {/* School Emblem Emblem SVG */}
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl shadow-lg p-2 flex items-center justify-center border-2 border-brandOrange/50 transform hover:scale-105 transition-transform duration-300">
              <svg className="w-full h-full text-brandBlue" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 5L15 25V55C15 72.5 50 90 50 90C50 90 85 72.5 85 55V25L50 5Z" fill="#1e3a8a" stroke="#ea580c" stroke-width="4"/>
                <path d="M30 45L50 30L70 45V65C70 70 50 80 50 80C50 80 30 70 30 65V45Z" fill="#ea580c"/>
                <path d="M42 42V55H47V42H42ZM53 42V55H58V42H53Z" fill="white"/>
                <path d="M50 15L25 28L50 41L75 28L50 15Z" fill="#f59e0b"/>
                <circle cx="50" cy="55" r="5" fill="white"/>
              </svg>
            </div>
            
            <div className="text-center md:text-left">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold tracking-tight uppercase bg-clip-text text-transparent bg-gradient-to-r from-white via-orange-100 to-white">
                Trường THCS Hòa Phú
              </h1>
              <p className="text-[11px] md:text-xs text-orange-300 font-bold tracking-wider mt-1 uppercase flex items-center justify-center md:justify-start gap-1">
                <GraduationCap className="w-3.5 h-3.5" /> CỔNG THÔNG TIN ĐIỆN TỬ & CHUYỂN ĐỔI SỐ
              </p>
              <p className="text-[10px] md:text-xs text-slate-300 font-medium tracking-wide mt-0.5">
                <MapPin className="w-3 h-3 inline mr-1 text-brandOrange-light" /> Địa chỉ: Xã Hòa Xá, Thành phố Hà Nội.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Sub-bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between py-2 md:py-0">
          <div className="flex flex-wrap gap-1 py-1 font-bold text-xs md:text-sm text-brandBlue">
            <div className="px-4 py-3 bg-blue-50/50 border-b-4 border-brandBlue flex items-center gap-2">
              <GraduationCap className="w-4 h-4" /> Cổng Học Tập Trực Tuyến THCS Hòa Phú
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-xs py-2 md:py-0">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold px-3 py-1.5 rounded-full text-[11px] flex items-center gap-1.5 shadow-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  {currentUser.role}: {currentUser.name}
                </span>
                
                <button 
                  onClick={() => {
                    setIsForcedChange(false);
                    setShowChangePassModal(true);
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition shadow-sm border border-slate-200 cursor-pointer"
                >
                  <Key className="w-3.5 h-3.5" /> Đổi MK
                </button>
                
                <button 
                  onClick={onLogout}
                  className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" /> Đăng xuất
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="bg-slate-100 text-slate-600 font-bold px-3 py-1.5 rounded-full text-[11px] flex items-center gap-1.5 shadow-sm border border-slate-200">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span> Khách
                </span>
                
                <button 
                  onClick={() => setShowLoginModal(true)}
                  className="bg-brandBlue hover:bg-brandBlue-dark text-white px-4 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" /> Đăng nhập
                </button>
                
                <button 
                  onClick={() => setShowRegisterModal(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" /> Đăng ký
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Marquee & Live Clock Bar */}
      <div className="bg-brandOrange text-white py-2 px-4 shadow-inner text-xs font-bold border-b border-orange-700">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="whitespace-nowrap flex items-center gap-1.5 shrink-0 bg-orange-950/40 px-3.5 py-1 rounded-full shadow-sm border border-orange-400/30">
            <Clock className="w-3.5 h-3.5 animate-pulse text-orange-200" />
            <span className="font-mono text-[11px]">{timeStr}</span>
          </div>
          
          <div className="marquee-container flex-1 overflow-hidden">
            <div className="marquee-content">
              🚀 Chào mừng quý thầy cô, phụ huynh và các em học sinh đến với Cổng thông tin điện tử & Chuyển đổi số học tập Trường THCS Hòa Phú - Ứng Hòa - Hà Nội!
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modals */}
      <AnimatePresence>
        {/* LOGIN MODAL */}
        {showLoginModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 relative"
            >
              <button 
                onClick={() => setShowLoginModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="border-b pb-3 mb-4">
                <h4 className="font-black text-sm text-brandBlue uppercase tracking-wider flex items-center gap-1.5">
                  <LogIn className="w-4 h-4 text-brandOrange" /> Đăng nhập cổng học vụ
                </h4>
              </div>

              {/* Tabs */}
              <div className="flex mb-4 border-b">
                <button 
                  type="button"
                  onClick={() => setLoginTab('general')}
                  className={`flex-1 text-xs font-bold pb-2 transition-colors ${
                    loginTab === 'general' ? 'text-brandBlue border-b-2 border-brandBlue' : 'text-slate-400'
                  }`}
                >
                  CHUNG
                </button>
                <button 
                  type="button"
                  onClick={() => setLoginTab('admin')}
                  className={`flex-1 text-xs font-bold pb-2 transition-colors ${
                    loginTab === 'admin' ? 'text-brandBlue border-b-2 border-brandBlue' : 'text-slate-400'
                  }`}
                >
                  QUẢN TRỊ (ADMIN)
                </button>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[10px] font-bold mb-1 text-slate-500 uppercase">Tài khoản</label>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full text-xs p-3 border rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brandBlue outline-none font-medium"
                    placeholder="Ví dụ: admin hoặc hs1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold mb-1 text-slate-500 uppercase">Mật khẩu</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full text-xs p-3 pr-10 border rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brandBlue outline-none font-medium font-mono"
                      placeholder="Mật khẩu của bạn"
                      required
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <button 
                    type="button"
                    onClick={() => {
                      setShowLoginModal(false);
                      setShowForgotModal(true);
                    }}
                    className="text-[10px] text-brandBlue font-bold hover:underline"
                  >
                    Quên mật khẩu?
                  </button>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-brandBlue hover:bg-brandBlue-dark text-white font-bold py-3 rounded-xl transition shadow"
                >
                  ĐĂNG NHẬP NGAY
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* REGISTER MODAL */}
        {showRegisterModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 relative max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <button 
                onClick={() => setShowRegisterModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="border-b pb-3 mb-4">
                <h4 className="font-black text-sm text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
                  <UserPlus className="w-4 h-4" /> Đăng ký thành viên mới
                </h4>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Họ và tên</label>
                  <input 
                    type="text" 
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Ví dụ: Nguyễn Minh Hằng"
                    className="w-full text-xs p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Tên tài khoản</label>
                  <input 
                    type="text" 
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="Tên đăng nhập không dấu, viết liền"
                    className="w-full text-xs p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Mật khẩu bảo mật</label>
                  <input 
                    type="password" 
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Nhập mật khẩu an toàn"
                    className="w-full text-xs p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white font-mono"
                    required
                  />
                  <p className="text-[9px] text-slate-400 mt-1 italic leading-relaxed">
                    Yêu cầu: Độ dài tối thiểu 6 ký tự, bao gồm ít nhất 1 chữ hoa, 1 chữ số, và 1 ký tự đặc biệt.
                  </p>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Vai trò thành viên</label>
                  <select 
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as UserRole)}
                    className="w-full text-xs p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="Học sinh">Học sinh</option>
                    <option value="Phụ huynh">Phụ huynh</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">
                    {regRole === 'Học sinh' ? 'Lớp đang học' : 'Số điện thoại & Tên con'}
                  </label>
                  <input 
                    type="text" 
                    value={regExtra}
                    onChange={(e) => setRegExtra(e.target.value)}
                    placeholder={regRole === 'Học sinh' ? 'Ví dụ: 9A, 6B...' : 'Ví dụ: 0984.. - Phụ huynh em Nguyễn Văn A'}
                    className="w-full text-xs p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                    required
                  />
                </div>

                {regError && (
                  <div className="text-[10px] bg-rose-50 border border-rose-200 text-rose-600 p-2.5 rounded-lg font-semibold flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                    <span>{regError}</span>
                  </div>
                )}

                <button 
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition shadow text-xs"
                >
                  ĐĂNG KÝ NGAY TÀI KHOẢN
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* FORGOT PASSWORD MODAL */}
        {showForgotModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 relative"
            >
              <button 
                onClick={() => {
                  setShowForgotModal(false);
                  setForgotSuccess('');
                  setForgotUsername('');
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="border-b pb-3 mb-4">
                <h4 className="font-black text-sm text-brandOrange uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-brandOrange animate-pulse" /> Khôi phục mật khẩu học vụ
                </h4>
              </div>

              <form onSubmit={handleForgotSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Tên tài khoản</label>
                  <input 
                    type="text" 
                    value={forgotUsername}
                    onChange={(e) => setForgotUsername(e.target.value)}
                    placeholder="Nhập chính xác tên tài khoản cần khôi phục..."
                    className="w-full text-xs p-3 border rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brandOrange outline-none font-mono font-bold"
                    required
                  />
                </div>

                {forgotSuccess && (
                  <div className="text-[10px] bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl leading-relaxed">
                    <Check className="w-4 h-4 inline text-emerald-600 mr-1 shrink-0" />
                    <span>{forgotSuccess}</span>
                  </div>
                )}

                <button 
                  type="submit"
                  className="w-full bg-brandOrange hover:bg-brandOrange-dark text-white font-bold py-3 rounded-xl transition shadow text-xs"
                >
                  YÊU CẦU KHÔI PHỤC MẬT KHẨU
                </button>
                
                <div className="text-center pt-2">
                  <button 
                    type="button"
                    onClick={() => {
                      setShowForgotModal(false);
                      setShowLoginModal(true);
                      setForgotSuccess('');
                    }}
                    className="text-brandBlue font-bold hover:underline"
                  >
                    Quay lại Đăng nhập
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* CHANGE/FORCED PASSWORD MODAL */}
        {showChangePassModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 relative"
            >
              {!isForcedChange && (
                <button 
                  onClick={() => setShowChangePassModal(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}

              <div className="border-b pb-3 mb-4">
                <h4 className="font-black text-sm text-brandBlue uppercase tracking-wider flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-brandOrange animate-pulse" /> Cập nhật mật khẩu bảo mật
                </h4>
              </div>

              {isForcedChange && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-3 text-[11px] font-semibold mb-4 leading-relaxed flex gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>
                    <b>Yêu cầu đổi mật khẩu bắt buộc!</b><br />
                    Tài khoản của bạn đang sử dụng mật khẩu mặc định hoặc yếu (Ví dụ: '123'). Bạn cần thiết lập mật khẩu mạnh mới để tiếp tục sử dụng hệ thống.
                  </span>
                </div>
              )}

              <form onSubmit={handleChangePassSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Mật khẩu hiện tại</label>
                  <input 
                    type="password" 
                    value={oldPass}
                    onChange={(e) => setOldPass(e.target.value)}
                    placeholder="Mật khẩu cũ của bạn (mặc định: 123)"
                    className="w-full text-xs p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-brandBlue bg-slate-50 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Mật khẩu mới</label>
                  <input 
                    type="password" 
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="Nhập mật khẩu mới an toàn"
                    className="w-full text-xs p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-brandBlue bg-slate-50 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Xác nhận lại mật khẩu mới</label>
                  <input 
                    type="password" 
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    placeholder="Nhập lại chính xác mật khẩu mới"
                    className="w-full text-xs p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-brandBlue bg-slate-50 font-mono"
                    required
                  />
                </div>

                {/* Password Strength Checklist */}
                <div className="bg-slate-50 p-3 rounded-xl border text-[10px] space-y-1 font-semibold text-slate-600">
                  <span className="block font-black text-slate-700 text-[10px] mb-1.5 uppercase">Độ mạnh mật khẩu tiêu chuẩn:</span>
                  <div className={`flex items-center gap-1.5 ${isLengthValid ? 'text-emerald-600' : 'text-rose-500'}`}>
                    <Check className={`w-3.5 h-3.5 ${isLengthValid ? 'opacity-100' : 'opacity-30'}`} />
                    <span>Dài tối thiểu 6 ký tự</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasUppercase ? 'text-emerald-600' : 'text-rose-500'}`}>
                    <Check className={`w-3.5 h-3.5 ${hasUppercase ? 'opacity-100' : 'opacity-30'}`} />
                    <span>Có chứa ít nhất 1 chữ cái HOA (A-Z)</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-600' : 'text-rose-500'}`}>
                    <Check className={`w-3.5 h-3.5 ${hasNumber ? 'opacity-100' : 'opacity-30'}`} />
                    <span>Có chứa ít nhất 1 chữ số (0-9)</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasSpecial ? 'text-emerald-600' : 'text-rose-500'}`}>
                    <Check className={`w-3.5 h-3.5 ${hasSpecial ? 'opacity-100' : 'opacity-30'}`} />
                    <span>Có chứa ít nhất 1 ký tự đặc biệt (!@#$%^&*)</span>
                  </div>
                </div>

                {changePassError && (
                  <div className="text-[10px] bg-rose-50 border border-rose-200 text-rose-600 p-2.5 rounded-lg font-semibold flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                    <span>{changePassError}</span>
                  </div>
                )}

                <button 
                  type="submit"
                  className="w-full bg-brandBlue hover:bg-brandBlue-dark text-white font-bold py-3 rounded-xl transition shadow text-xs"
                >
                  XÁC NHẬN CẬP NHẬT MẬT KHẨU
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
