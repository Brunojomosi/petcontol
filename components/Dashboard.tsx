import React from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { getCategoryColor } from '../constants';
import { TrendingUp, Calendar, ChevronRight } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { getMetrics, currency } = useApp();
  const navigate = useNavigate();
  const metrics = getMetrics();

  // Sort metrics for better visualization
  const categoryData = metrics.byCategory.sort((a, b) => b.value - a.value);
  const petData = metrics.byPet;

  // Format currency helper
  const fmt = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: currency }).format(val);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Visão Geral</h1>
        <button 
          onClick={() => navigate('/expenses')}
          className="text-primary text-sm font-semibold flex items-center hover:underline"
        >
          Ver histórico <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Gasto no Mês</p>
            <p className="text-3xl font-bold text-primary mt-1">{fmt(metrics.totalMonth)}</p>
          </div>
          <div className="bg-green-50 p-3 rounded-full">
            <Calendar className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total no Ano</p>
            <p className="text-3xl font-bold text-blue-600 mt-1">{fmt(metrics.totalYear)}</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-full">
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category Breakdown */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Por Categoria</h3>
          <div className="h-64 w-full">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getCategoryColor(entry.name)} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => fmt(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                Sem dados ainda
              </div>
            )}
          </div>
        </div>

        {/* Pet Breakdown */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Por Pet</h3>
          <div className="h-64 w-full">
            {petData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={petData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 12}} />
                  <Tooltip formatter={(value: number) => fmt(value)} cursor={{fill: 'transparent'}} />
                  <Bar dataKey="value" fill="#2196F3" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                Sem dados ainda
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};