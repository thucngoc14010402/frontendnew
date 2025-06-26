import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const [formData, setFormData] = useState({ phoneNumber: '' });
  const [error, setError] = useState('');
  const [resetCode, setResetCode] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8081/api/v1/members/forgot-password', formData);
      setResetCode(response.data); // Lưu mã xác nhận từ server
      setError(`Mã xác nhận đã được tạo: ${response.data}. Vui lòng ghi nhớ để đặt lại mật khẩu.`);
    } catch (error) {
      console.error("Forgot password error:", error.response ? error.response.data : error.message);
      setError("Yêu cầu thất bại! Kiểm tra số điện thoại hoặc console.");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px', background: '#f0f0f0', padding: '20px', borderRadius: '10px' }}>
      <h2 className="text-primary text-center mb-4">Quên Mật Khẩu</h2>
      <form onSubmit={handleSubmit}>
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
        {error && <div className={resetCode ? 'alert alert-success' : 'alert alert-danger'}>{error}</div>}
        <button type="submit" className="btn btn-warning w-100 mb-3">Gửi Mã Xác Nhận</button>
        <p className="text-center">
          <a href="/login">Quay lại Đăng Nhập</a>
        </p>
      </form>
    </div>
  );
}

export default ForgotPassword;