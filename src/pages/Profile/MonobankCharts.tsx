import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  Legend 
} from 'recharts';
import { TrendingUp, PieChart as PieChartIcon, BarChart3, Calendar } from 'lucide-react';

// Типы данных
interface Transactions {
  id: string;
  time: number; // Unix timestamp
  amount: number; // Amount in kopecks
  description: string;
  mcc?: number;
  originalMcc?: number;
  hold?: boolean;
  [key: string]: any;
}

interface ExpenseCategory {
  category: string;
  amount: number; // Amount in kopecks
  count?: number;
}

interface MonobankChartsProps {
  transactions: Transactions[];
  expensesByCategory: ExpenseCategory[];
}

interface ExpensesPieChartProps {
  expensesByCategory: ExpenseCategory[];
}

interface ExpensesBarChartProps {
  expensesByCategory: ExpenseCategory[];
}

interface ExpensesTrendChartProps {
  transactions: Transactions[];
}

interface ExpensesStatsProps {
  transactions: Transactions[];
  expensesByCategory: ExpenseCategory[];
}

// Типы для данных графиков
interface PieChartData {
  name: string;
  value: number;
  color: string;
}

interface BarChartData {
  category: string;
  amount: number;
}

interface LineChartData {
  date: string;
  dateFormatted: string;
  expenses: number;
  income: number;
}

interface StatsData {
  title: string;
  value: string;
  color: string;
  bgColor: string;
}

// Компонент круговой диаграммы для категорий расходов
const ExpensesPieChart: React.FC<ExpensesPieChartProps> = ({ expensesByCategory }) => {
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];
  
  const data: PieChartData[] = expensesByCategory.map((item, index) => ({
    name: item.category,
    value: item.amount / 100, // Convert to proper currency format
    color: COLORS[index % COLORS.length]
  }));

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null; // Don't show labels for very small slices
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="12" fontWeight="bold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center mb-4">
        <PieChartIcon className="w-5 h-5 mr-2 text-blue-600" />
        <h3 className="text-lg font-semibold">Розподіл витрат за категоріями</h3>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [`${value.toLocaleString('uk-UA')} ₴`, 'Сума']}
              labelFormatter={(label: string) => `Категорія: ${label}`}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Компонент столбчатой диаграммы для категорий
const ExpensesBarChart: React.FC<ExpensesBarChartProps> = ({ expensesByCategory }) => {
  const data: BarChartData[] = expensesByCategory.map(item => ({
    category: item.category,
    amount: item.amount / 100
  })).sort((a, b) => b.amount - a.amount);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center mb-4">
        <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
        <h3 className="text-lg font-semibold">Витрати за категоріями</h3>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="category" 
              angle={-45} 
              textAnchor="end" 
              height={80}
              fontSize={12}
            />
            <YAxis 
              tickFormatter={(value: number) => `${value.toLocaleString('uk-UA')} ₴`}
            />
            <Tooltip 
              formatter={(value: number) => [`${value.toLocaleString('uk-UA')} ₴`, 'Витрати']}
              labelFormatter={(label: string) => `Категорія: ${label}`}
            />
            <Bar dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Компонент линейного графика для трендов по дням
const ExpensesTrendChart: React.FC<ExpensesTrendChartProps> = ({ transactions }) => {
  // Group transactions by date
  const groupedByDate = transactions.reduce((acc: Record<string, { date: string; expenses: number; income: number }>, transaction) => {
    const date = new Date(transaction.time * 1000);
    const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    if (!acc[dateKey]) {
      acc[dateKey] = { date: dateKey, expenses: 0, income: 0 };
    }
    
    if (transaction.amount < 0) {
      acc[dateKey].expenses += Math.abs(transaction.amount) / 100;
    } else {
      acc[dateKey].income += transaction.amount / 100;
    }
    
    return acc;
  }, {});

  const data: LineChartData[] = Object.values(groupedByDate)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(item => ({
      ...item,
      dateFormatted: new Date(item.date).toLocaleDateString('uk-UA', { 
        day: '2-digit', 
        month: '2-digit' 
      })
    }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center mb-4">
        <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
        <h3 className="text-lg font-semibold">Динаміка витрат і доходів</h3>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="dateFormatted"
              fontSize={12}
            />
            <YAxis 
              tickFormatter={(value: number) => `${value.toLocaleString('uk-UA')} ₴`}
            />
            <Tooltip 
              formatter={(value: number, name: string) => [
                `${value.toLocaleString('uk-UA')} ₴`, 
                name === 'expenses' ? 'Витрати' : 'Доходи'
              ]}
              labelFormatter={(label: string) => `Дата: ${label}`}
            />
            <Legend 
              formatter={(value: string) => value === 'expenses' ? 'Витрати' : 'Доходи'}
            />
            <Line 
              type="monotone" 
              dataKey="expenses" 
              stroke="#EF4444" 
              strokeWidth={2}
              dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="income" 
              stroke="#10B981" 
              strokeWidth={2}
              dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Компонент со статистикой
const ExpensesStats: React.FC<ExpensesStatsProps> = ({ transactions, expensesByCategory }) => {
  const totalExpenses = transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0) / 100;
    
  const totalIncome = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0) / 100;
    
  const dates = transactions.map(t => new Date(t.time * 1000).toDateString());
  const uniqueDates = [...new Set(dates)];
  const actualDays = Math.max(uniqueDates.length, 1);
  
  const avgExpensePerDay = totalExpenses / actualDays;
  const topCategory = expensesByCategory.sort((a, b) => b.amount - a.amount)[0];
  
  const stats: StatsData[] = [
    {
      title: 'Загальні витрати',
      value: `${totalExpenses.toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₴`,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Загальні доходи',
      value: `${totalIncome.toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₴`,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Середні витрати за день',
      value: `${avgExpensePerDay.toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₴`,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Топ категорія',
      value: topCategory?.category || 'Немає даних',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"> {/* Повернули назад lg:grid-cols-4 */}
      {stats.map((stat, index) => (
        <div key={index} className={`${stat.bgColor} p-4 rounded-lg border`}>
          <h4 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h4>
          <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

// Главный компонент с графиками
const MonobankCharts: React.FC<MonobankChartsProps> = ({ transactions, expensesByCategory }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-gray-50 p-8 rounded-lg text-center">
        <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-600 mb-2">Немає даних для відображення</h3>
        <p className="text-gray-500">Підключіть Monobank та завантажте транзакції</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <h2 className="text-2xl font-bold">Аналітика витрат</h2>
      </div>
      
      {/* Statistics Cards */}
      <ExpensesStats transactions={transactions} expensesByCategory={expensesByCategory} />
      
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpensesPieChart expensesByCategory={expensesByCategory} />
        <ExpensesBarChart expensesByCategory={expensesByCategory} />
      </div>
      
      {/* Trend Chart - Full Width */}
      <ExpensesTrendChart transactions={transactions} />
    </div>
  );
};

export default MonobankCharts;

// Экспорт типов для использования в других файлах
export type { Transactions, ExpenseCategory, MonobankChartsProps };