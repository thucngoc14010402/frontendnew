import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Registration() {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    provinceCity: '',
    districtWard: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'provinceCity') {
      setFormData((prev) => ({ ...prev, districtWard: '' })); // Reset district when province changes
    }
    setError(''); // Clear error when user types
  };

  const validatePhoneNumber = (phone) => {
    const digitRegex = /^\d{10}$/;
    if (!digitRegex.test(phone)) {
      return 'Số điện thoại phải có đúng 10 chữ số.';
    }
    const validPrefixes = ['09', '03', '07', '08', '05', '02']; // Vietnamese mobile and fixed-line prefixes
    const prefix = phone.substring(0, 2);
    if (!validPrefixes.includes(prefix)) {
      return 'Số điện thoại phải bắt đầu bằng mã hợp lệ (09x, 03x, 07x, 08x, 05x, 02x).';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    const phoneError = validatePhoneNumber(formData.phoneNumber);
    if (phoneError) {
      setError(phoneError);
      return;
    }

    if (!formData.provinceCity) {
      setError("Please select a Province/City.");
      return;
    }
    if (!formData.districtWard) {
      setError("Please select a District/Ward.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:8081/api/v1/members/register', {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        provinceCity: formData.provinceCity,
        districtWard: formData.districtWard
      });
      alert("Registration successful!");
      navigate('/login');
    } catch (error) {
      console.error("Registration error:", error.response ? error.response.data : error.message);
      setError("Registration failed! Check console for details.");
    }
  };

  const provinces = [
    'Cao Bằng', 'Điện Biên', 'Hà Tĩnh', 'Lai Châu', 'Lạng Sơn', 'Nghệ An', 'Quảng Ninh', 'Thanh Hóa', 'Sơn La',
    'Hà Nội', 'Huế', 'Tuyên Quang', 'Lào Cai', 'Thái Nguyên', 'Phú Thọ', 'Bắc Ninh', 'Hưng Yên', 'Hải Phòng',
    'Ninh Bình', 'Quảng Trị', 'Đà Nẵng', 'Quảng Ngãi', 'Gia Lai', 'Khánh Hòa', 'Lâm Đồng', 'Đắk Lắk',
    'Hồ Chí Minh', 'Đồng Nai', 'Tây Ninh', 'Cần Thơ', 'Vĩnh Long', 'Đồng Tháp', 'Cà Mau', 'An Giang'
  ];

  const districtMap = {
    'Hà Nội': [
      'Ba Đình', 'Cầu Giấy', 'Đống Đa', 'Hai Bà Trưng', 'Hoàn Kiếm', 'Thanh Xuân', 'Hoàng Mai', 'Long Biên',
      'Hà Đông', 'Tây Hồ', 'Nam Từ Liêm', 'Bắc Từ Liêm', 'Sơn Tây', 'Ba Vì', 'Chương Mỹ', 'Đan Phượng',
      'Đông Anh', 'Gia Lâm', 'Hoài Đức', 'Mê Linh', 'Mỹ Đức', 'Phú Xuyên', 'Phúc Thọ', 'Quốc Oai',
      'Sóc Sơn', 'Thạch Thất', 'Thanh Oai', 'Thanh Trì', 'Thường Tín', 'Ứng Hòa'
    ],
    'Hồ Chí Minh': [
      'Thành phố Thủ Đức', 'Quận 1', 'Quận 3', 'Quận 4', 'Quận 5', 'Quận 6', 'Quận 7', 'Quận 8',
      'Quận 10', 'Quận 11', 'Quận 12', 'Bình Tân', 'Bình Thạnh', 'Gò Vấp', 'Phú Nhuận', 'Tân Bình',
      'Tân Phú', 'Bình Chánh', 'Cần Giờ', 'Củ Chi', 'Hóc Môn', 'Nhà Bè'
    ],
    'Hải Phòng': [
      'Hồng Bàng', 'Lê Chân', 'Ngô Quyền', 'Kiến An', 'Hải An', 'Dương Kinh', 'An Dương', 'An Lão',
      'Kiến Thụy', 'Thủy Nguyên', 'Tiên Lãng', 'Vĩnh Bảo', 'Cát Hải', 'Bạch Long Vĩ', 'Đồ Sơn'
    ],
    'Đà Nẵng': ['Hải Châu', 'Thanh Khê', 'Liên Chiểu', 'Ngũ Hành Sơn', 'Sơn Trà', 'Cẩm Lệ', 'Hoà Vang', 'Hoàng Sa'],
    'Cần Thơ': ['Ninh Kiều', 'Cái Răng', 'Bình Thủy', 'Phong Điền', 'Thốt Nốt', 'Vĩnh Thạnh', 'Cờ Đỏ', 'Thới Lai', 'Ô Môn'],
    'Huế': ['Thành phố Huế', 'Phong Điền', 'Quảng Điền', 'Phú Vang', 'Phú Lộc', 'A Lưới', 'Nam Đông', 'Hương Thủy', 'Hương Trà'],
    // Placeholder for other provinces
    ...provinces.filter(p => !['Hà Nội', 'Hồ Chí Minh', 'Hải Phòng', 'Đà Nẵng', 'Cần Thơ', 'Huế'].includes(p)).reduce((acc, p) => ({ ...acc, [p]: ['Please select a district/ward'] }), {})
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px', background: '#f0f0f0', padding: '20px', borderRadius: '10px' }}>
      <h2 className="text-primary text-center mb-4">Member Registration</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Full Name *</label>
          <input type="text" className="form-control" name="fullName" value={formData.fullName} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Phone Number *</label>
          <input type="tel" className="form-control" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Password *</label>
          <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Confirm Password *</label>
          <input type="password" className="form-control" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Province/City *</label>
          <select className="form-select" name="provinceCity" value={formData.provinceCity} onChange={handleChange} required>
            <option value="">Select a Province/City</option>
            {provinces.map((province, index) => (
              <option key={index} value={province}>{province}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">District/Ward *</label>
          <select className="form-select" name="districtWard" value={formData.districtWard} onChange={handleChange} required>
            <option value="">Select a District/Ward</option>
            {formData.provinceCity && districtMap[formData.provinceCity].map((district, index) => (
              <option key={index} value={district}>{district}</option>
            ))}
          </select>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-warning w-100 mb-3">Register</button>
        <p className="text-center">
          Already have an account? <a href="/login">Login now</a>
        </p>
      </form>
    </div>
  );
}

export default Registration;