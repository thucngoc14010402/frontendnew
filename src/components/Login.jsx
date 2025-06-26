import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({ phoneNumber: '', password: '' });
  const [forgotMode, setForgotMode] = useState(false);
  const [resetCode, setResetCode] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
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
        newResetCode = response.data.trim(); // Chỉ trim nếu là chuỗi
      } else if (response.data) {
        newResetCode = String(response.data).trim(); // Chuyển đổi thành chuỗi nếu có giá trị
      }
      setResetCode(newResetCode);
      console.log('Received reset code:', newResetCode); // Debug
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
    console.log('Verify code:', verifyCode, 'Reset code:', resetCode); // Debug
    if (verifyCode && resetCode && typeof resetCode === 'string' && verifyCode.trim() === resetCode.trim()) {
      setError('Xác nhận thành công! Vui lòng đặt lại mật khẩu (chưa triển khai).');
    } else {
      setError('Mã xác nhận không đúng! Vui lòng kiểm tra lại hoặc yêu cầu mã mới.');
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
        {forgotMode && resetCode && (
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
        {error && <div className={resetCode && !error.includes('thất bại') ? 'alert alert-success' : 'alert alert-danger'}>{error}</div>}
        <button type="submit" className="btn btn-warning w-100 mb-3">
          {forgotMode ? 'Gửi Mã Xác Nhận' : 'Đăng Nhập'}
        </button>
        <p className="text-center">
          {forgotMode ? (
            <a href="#" onClick={() => { setForgotMode(false); setError(''); setResetCode(''); setVerifyCode(''); }}>Quay lại Đăng Nhập</a>
          ) : (
            <a href="#" onClick={() => { setForgotMode(true); setError(''); setResetCode(''); setVerifyCode(''); }}>Quên Mật Khẩu?</a>
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