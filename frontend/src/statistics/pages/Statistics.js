import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';

// Create an axios instance with baseURL and auth token
const api = axios.create({
  baseURL: 'http://localhost:5000',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')).token : null;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const Statistics = (props) => {
  const [statusStats, setStatusStats] = useState([]);
  const [technicianStats, setTechnicianStats] = useState([]);
  const [equipmentStats, setEquipmentStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statusResponse = await api.get('/api/maintance/statistics/status');
        const technicianResponse = await api.get('/api/maintance/statistics/technician');
        const equipmentResponse = await api.get('/api/maintance/statistics/equipment');

        console.log(equipmentResponse.data)
        setStatusStats(statusResponse.data);
        setTechnicianStats(technicianResponse.data);
        setEquipmentStats(equipmentResponse.data);
      } catch (err) {
        setError('Помилка при завантаженні статистики');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Завантаження...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  console.log(equipmentStats)
  return (
    <div style={{ backgroundColor: "white" }}>
      <h1>Статистика технічного обслуговування</h1>

      <h2>Статистика за статусом робіт з обслуговування</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={statusStats}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="_id" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>

      <h2>Розподіл обслуговування за техніками</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={technicianStats}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="technicianName" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>

      <h2>Розподіл обслуговування за обладнанням</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={equipmentStats}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="equipmentName" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#ffc658">
            Кількість
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Statistics;
