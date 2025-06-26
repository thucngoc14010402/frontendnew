import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({ phoneNumber: '', password: '' });
  const [forgotMode, setForgotMode] = useState(false);
  const [resetCode, setResetCode] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8081/api/v1/members/login', formData);
      alert("Login successful!");
      navigate('/home');
    } catch (error) {
      console.error("Login error:", error.response ? error.response.data : error.message);
      setError("Đăng nhập thất bại! Kiểm tra thông tin hoặc console.");
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setError('Đang xử lý...');
    try {
      const response = await axios.post('http://localhost:8081/api/v1/members/forgot-password', { phoneNumber: formData.phoneNumber });
      let newResetCode = '';
      if (response.data && typeof response.data === 'string') {
        newResetCode = response.data.trim();
      } else if (response.data) {
        newResetCode = String(response.data).trim();
      }
      setResetCode(newResetCode);
      console.log('Received reset code:', newResetCode);
      if (newResetCode) {
        setError(`Mã xác nhận đã được tạo: ${newResetCode}. Vui lòng nhập mã để tiếp tục.`);
      } else {
        setError('Không nhận được mã xác nhận hợp lệ từ server!');
      }
    } catch (error) {
      console.error("Forgot password error:", error.response ? error.response.data : error.message);
      setError("Yêu cầu thất bại! Kiểm tra số điện thoại hoặc console.");
    }
  };

  const handleVerify = () => {
    console.log('Verify code:', verifyCode, 'Reset code:', resetCode);
    if (verifyCode && resetCode && typeof resetCode === 'string' && verifyCode.trim() === resetCode.trim()) {
      setError('Xác nhận mã thành công! Vui lòng đặt mật khẩu mới.');
    } else {
      setError('Mã xác nhận không đúng! Vui lòng kiểm tra lại hoặc yêu cầu mã mới.');
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu mới và xác nhận không khớp!');
      return;
    }
    try {
      await axios.post('http://localhost:8081/api/v1/members/reset-password', {
        phoneNumber: formData.phoneNumber,
        resetCode: resetCode,
        newPassword: newPassword,
      });
      setError('Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.');
      setForgotMode(false); // Quay lại chế độ đăng nhập
      setResetCode('');
      setVerifyCode('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error("Reset password error:", error.response ? error.response.data : error.message);
      setError("Đặt lại mật khẩu thất bại! Kiểm tra mã hoặc console.");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px', background: '#f0f0f0', padding: '20px', borderRadius: '10px' }}>
      <h2 className="text-primary text-center mb-4">{forgotMode ? 'Quên Mật Khẩu' : 'Member Login'}</h2>
      <form onSubmit={forgotMode ? handleForgotSubmit : handleLoginSubmit}>
        <div className="mb-3">
          <label className="form-label">Số Điện Thoại *</label>
          <input
            type="tel"
            className="form-control"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            pattern="\d{10}"
            title="Số điện thoại phải có đúng 10 chữ số"
          />
        </div>
        {!forgotMode && (
          <div className="mb-3">
            <label className="form-label">Mật Khẩu *</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
        )}
        {forgotMode && (
          <div>
            {!resetCode && (
              <button type="submit" className="btn btn-warning w-100 mb-3">Gửi Mã Xác Nhận</button>
            )}
            {resetCode && !verifyCode && (
              <div className="mb-3">
                <label className="form-label">Mã Xác Nhận *</label>
                <input
                  type="text"
                  className="form-control"
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value)}
                  required
                />
                <button type="button" className="btn btn-secondary mt-2 w-100" onClick={handleVerify}>Xác Nhận Mã</button>
              </div>
            )}
            {resetCode && verifyCode && verifyCode.trim() === resetCode.trim() && (
              <div>
                <div className="mb-3">
                  <label className="form-label">Mật Khẩu Mới *</label>
                  <input
                    type="password"
                    className="form-control"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Xác Nhận Mật Khẩu *</label>
                  <input
                    type="password"
                    className="form-control"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="button" className="btn btn-success w-100 mb-3" onClick={handleResetPassword}>Đặt Lại Mật Khẩu</button>
              </div>
            )}
            {error && <div className={resetCode && !error.includes('thất bại') ? 'alert alert-success' : 'alert alert-danger'}>{error}</div>}
          </div>
        )}
        {!forgotMode && (
          <button type="submit" className="btn btn-warning w-100 mb-3">Đăng Nhập</button>
        )}
        <p className="text-center">
          {forgotMode ? (
            <a href="#" onClick={() => { setForgotMode(false); setError(''); setResetCode(''); setVerifyCode(''); setNewPassword(''); setConfirmPassword(''); }}>Quay lại Đăng Nhập</a>
          ) : (
            <a href="#" onClick={() => { setForgotMode(true); setError(''); setResetCode(''); setVerifyCode(''); setNewPassword(''); setConfirmPassword(''); }}>Quên Mật Khẩu?</a>
          )}
        </p>
        <p className="text-center">
          {!forgotMode && "Don’t have an account?"} <a href="/">Register now</a>
        </p>
      </form>
    </div>
  );
}

export default Login;