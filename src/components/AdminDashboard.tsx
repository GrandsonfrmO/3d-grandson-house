import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useStore } from '../store';
import { 
  LayoutDashboard, Package, ShoppingCart, Users, Settings, 
  LogOut, Plus, Search, Edit, Trash2, 
  ArrowUpRight, ArrowDownRight, DollarSign, Activity, Menu, X, Image as ImageIcon, Monitor, UploadCloud, XCircle,
  Eye, CheckCircle, Clock, Truck, Save, Bell, Shield, CreditCard
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const STATS = [
  { title: 'Revenu Total', value: '24 563 000 GNF', change: '+12.5%', isPositive: true, icon: DollarSign },
  { title: 'Commandes Actives', value: '142', change: '+5.2%', isPositive: true, icon: ShoppingCart },
  { title: 'Clients Totaux', value: '1 245', change: '-2.1%', isPositive: false, icon: Users },
  { title: 'Taux de Conversion', value: '3.2%', change: '+1.1%', isPositive: true, icon: Activity },
];

const REVENUE_DATA = [
  { name: 'Mon', revenue: 4000 },
  { name: 'Tue', revenue: 3000 },
  { name: 'Wed', revenue: 2000 },
  { name: 'Thu', revenue: 2780 },
  { name: 'Fri', revenue: 1890 },
  { name: 'Sat', revenue: 2390 },
  { name: 'Sun', revenue: 3490 },
];

const SALES_DATA = [
  { name: 'Hoodies', sales: 400 },
  { name: 'Tees', sales: 300 },
  { name: 'Accessories', sales: 200 },
  { name: 'Posters', sales: 278 },
];

export function AdminDashboard({ products, orders }: { products: any[], orders: any[] }) {
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');

  return (
    <>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {STATS.map((stat, i) => (
          <div key={i} className="bg-white p-5 md:p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">
                <stat.icon size={20} className="text-gray-600" />
              </div>
              <span className={`flex items-center text-sm font-medium ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {stat.isPositive ? <ArrowUpRight size={16} className="mr-1" /> : <ArrowDownRight size={16} className="mr-1" />}
                {stat.change}
              </span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-6">Aperçu des Revenus</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(value) => `${value}`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`${value}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales by Category Chart */}
        <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-6">Ventes par Catégorie</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SALES_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f3f4f6' }}
                />
                <Bar dataKey="sales" fill="#111827" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Orders & Inventory Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 md:p-6 border-b border-gray-200 flex justify-between items-center shrink-0">
            <h3 className="font-bold text-gray-900">Commandes Récentes</h3>
            <select 
              className="text-sm border-gray-200 rounded-lg text-gray-600 focus:ring-cyan-500 outline-none px-2 py-1"
              value={orderStatusFilter}
              onChange={(e) => setOrderStatusFilter(e.target.value)}
            >
              <option value="All">Tous les Statuts</option>
              <option value="Delivered">Livré</option>
              <option value="Processing">En traitement</option>
              <option value="Shipped">Expédié</option>
              <option value="Pending">En attente</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-200">
                  <th className="px-6 py-4 font-medium">ID Commande</th>
                  <th className="px-6 py-4 font-medium">Client</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Total</th>
                  <th className="px-6 py-4 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {orders.filter(o => orderStatusFilter === 'All' || o.status === orderStatusFilter).slice(0, 5).map((order, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{order.id}</td>
                    <td className="px-6 py-4 text-gray-600">{order.customer}</td>
                    <td className="px-6 py-4 text-gray-600">{order.date}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{order.total}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'Shipped' ? 'bg-purple-100 text-purple-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status === 'Delivered' ? 'Livré' :
                         order.status === 'Processing' ? 'En traitement' :
                         order.status === 'Shipped' ? 'Expédié' :
                         'En attente'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Inventory Alerts */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 md:p-6 flex flex-col">
          <h3 className="font-bold text-gray-900 mb-6 shrink-0">Alertes d'Inventaire</h3>
          <div className="space-y-4 overflow-y-auto">
            {products.filter(p => p.stock < 15).map(product => (
              <div key={product.id} className="flex items-center gap-4 p-3 rounded-xl border border-red-100 bg-red-50/50">
                <img src={product.image} alt={product.name} loading="lazy" decoding="async" className="w-10 h-10 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                  <p className="text-xs text-red-600 font-medium">{product.stock} en stock</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
