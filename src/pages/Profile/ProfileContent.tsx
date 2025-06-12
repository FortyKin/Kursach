import React, { useState, useEffect } from 'react';
import { CreditCard, RefreshCw, CheckCircle, XCircle, BarChart2, Calendar, Filter, RotateCcw, Trash2 } from 'lucide-react';
import MonobankCharts, { Transactions, ExpenseCategory } from './MonobankCharts';
import { mccCategories, DEFAULT_CATEGORY } from './mccCategories';

interface ProfileContentProps {
  user: any; // Replace with proper user type from your auth state
}

interface Transaction {
  id: string;
  time: number;
  description: string;
  mcc: number;
  amount: number;
  operationAmount: number;
  currencyCode: number;
  commissionRate: number;
  cashbackAmount: number;
  balance: number;
  hold: boolean;
}

interface Account {
  id: string;
  currencyCode: number;
  cashbackType: string;
  balance: number;
  creditLimit: number;
  maskedPan: string[];
  type: string;
  iban: string;
}

interface TransactionFilters {
  type: 'all' | 'expense' | 'income';
  period: 'all' | 'today' | 'week' | 'month';
  amount: 'all' | 'small' | 'medium' | 'large';
  category: string;
}

const ProfileContent: React.FC<ProfileContentProps> = ({ user }) => {
  const [monobankToken, setMonobankToken] = useState('');
  const [tokenVerified, setTokenVerified] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [transactionError, setTransactionError] = useState('');
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [filters, setFilters] = useState<TransactionFilters>({
    type: 'all',
    period: 'all',
    amount: 'all',
    category: 'all'
  });

  // 1. Загрузка данных из localStorage при монтировании компонента
  useEffect(() => {
    const loadDataFromStorage = () => {
      try {
        // Загружаем токен
        const savedToken = localStorage.getItem(`monobank_token_${user?.id}`);
        if (savedToken) {
          setMonobankToken(savedToken);
          setTokenVerified(true);
        }

        // Загружаем аккаунты
        const savedAccounts = localStorage.getItem(`monobank_accounts_${user?.id}`);
        if (savedAccounts) {
          const parsedAccounts = JSON.parse(savedAccounts);
          setAccounts(parsedAccounts);
        }

        // Загружаем выбранный аккаунт
        const savedSelectedAccount = localStorage.getItem(`monobank_selected_account_${user?.id}`);
        if (savedSelectedAccount) {
          setSelectedAccountId(savedSelectedAccount);
        }

        // Загружаем транзакции
        const savedTransactions = localStorage.getItem(`monobank_transactions_${user?.id}`);
        if (savedTransactions) {
          const parsedData = JSON.parse(savedTransactions);
          // Проверяем актуальность данных (5 минут)
          if (isDataFresh(parsedData.timestamp)) {
            setTransactions(parsedData.transactions);
          }
        }

        // Загружаем фильтры
        const savedFilters = localStorage.getItem(`monobank_filters_${user?.id}`);
        if (savedFilters) {
          const parsedFilters = JSON.parse(savedFilters);
          setFilters(parsedFilters);
        }

        // Загружаем состояние showAllTransactions
        const savedShowAll = localStorage.getItem(`monobank_show_all_${user?.id}`);
        if (savedShowAll !== null) {
          setShowAllTransactions(JSON.parse(savedShowAll));
        }

      } catch (error) {
        console.error('Ошибка при загрузке данных из localStorage:', error);
      }
    };

    if (user?.id) {
      loadDataFromStorage();
    }
  }, [user?.id]);

  // 2. Сохранение токена в localStorage
  useEffect(() => {
    if (user?.id && monobankToken) {
      localStorage.setItem(`monobank_token_${user.id}`, monobankToken);
    }
  }, [monobankToken, user?.id]);

  // 3. Сохранение статуса верификации токена
  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`monobank_token_verified_${user.id}`, JSON.stringify(tokenVerified));
    }
  }, [tokenVerified, user?.id]);

  // 4. Сохранение аккаунтов в localStorage
  useEffect(() => {
    if (user?.id && accounts.length > 0) {
      localStorage.setItem(`monobank_accounts_${user.id}`, JSON.stringify(accounts));
    }
  }, [accounts, user?.id]);

  // 5. Сохранение выбранного аккаунта
  useEffect(() => {
    if (user?.id && selectedAccountId) {
      localStorage.setItem(`monobank_selected_account_${user.id}`, selectedAccountId);
    }
  }, [selectedAccountId, user?.id]);

  // 6. Сохранение транзакций в localStorage
  useEffect(() => {
    if (user?.id && transactions.length > 0) {
      const dataToSave = {
        transactions: transactions,
        timestamp: Date.now(),
        accountId: selectedAccountId
      };
      localStorage.setItem(`monobank_transactions_${user.id}`, JSON.stringify(dataToSave));
    }
  }, [transactions, user?.id, selectedAccountId]);

  // 7. Сохранение фильтров
  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`monobank_filters_${user.id}`, JSON.stringify(filters));
    }
  }, [filters, user?.id]);

  // 8. Сохранение состояния showAllTransactions
  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`monobank_show_all_${user.id}`, JSON.stringify(showAllTransactions));
    }
  }, [showAllTransactions, user?.id]);

  // Функция для проверки актуальности данных
  const isDataFresh = (timestamp: number, maxAge: number = 5 * 60 * 1000) => {
    return Date.now() - timestamp < maxAge; // по умолчанию данные актуальны 5 минут
  };

  // Функция для очистки данных
  const clearStoredData = () => {
    if (user?.id) {
      localStorage.removeItem(`monobank_token_${user.id}`);
      localStorage.removeItem(`monobank_token_verified_${user.id}`);
      localStorage.removeItem(`monobank_accounts_${user.id}`);
      localStorage.removeItem(`monobank_selected_account_${user.id}`);
      localStorage.removeItem(`monobank_transactions_${user.id}`);
      localStorage.removeItem(`monobank_filters_${user.id}`);
      localStorage.removeItem(`monobank_show_all_${user.id}`);
      
      // Сбрасываем состояние
      setMonobankToken('');
      setTokenVerified(false);
      setAccounts([]);
      setSelectedAccountId('');
      setTransactions([]);
      setFilters({
        type: 'all',
        period: 'all', 
        amount: 'all',
        category: 'all'
      });
      setShowAllTransactions(false);
    }
  };

  // Function to get Monobank accounts with token
  const fetchMonobankAccounts = async () => {
    if (!monobankToken.trim()) {
      setError('Please enter a valid token');
      return;
    }
    
    try {
      setIsLoadingAccounts(true);
      setError('');
      
      const response = await fetch('http://localhost:5000/monobank-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: monobankToken.trim() })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setTokenVerified(true);
        // Store accounts from the response
        if (data.clientInfo && data.clientInfo.accounts) {
          setAccounts(data.clientInfo.accounts);
          
          // Select the first account by default if available
          if (data.clientInfo.accounts.length > 0) {
            setSelectedAccountId(data.clientInfo.accounts[0].id);
            // Fetch transactions for the first account
            fetchTransactionsWithCache(data.clientInfo.accounts[0].id);
          }
        }
        
        if (showModal) {
          setShowModal(false);
        }
      } else {
        setTokenVerified(false);
        setError(data.error || 'Failed to verify Monobank token');
        if (data.details) {
          console.error('API Details:', data.details);
        }
      }
    } catch (err) {
      setTokenVerified(false);
      setError('Error connecting to server');
    } finally {
      setIsLoadingAccounts(false);
    }
  };

  // Улучшенная функция загрузки транзакций с проверкой кэша
  const fetchTransactionsWithCache = async (accountId: string, forceRefresh: boolean = false) => {
    // Проверяем кэшированные данные
    if (!forceRefresh && user?.id) {
      const cachedData = localStorage.getItem(`monobank_transactions_${user.id}`);
      if (cachedData) {
        try {
          const parsed = JSON.parse(cachedData);
          if (parsed.accountId === accountId && isDataFresh(parsed.timestamp)) {
            setTransactions(parsed.transactions);
            setSelectedAccountId(accountId);
            return;
          }
        } catch (error) {
          console.error('Ошибка при парсинге кэшированных данных:', error);
        }
      }
    }

    // Если кэш пустой или устарел, загружаем с сервера
    await fetchTransactions(accountId);
  };

  // Function to fetch transactions for selected account
  const fetchTransactions = async (accountId: string) => {
    if (!monobankToken.trim()) {
      setTransactionError('No Monobank token available. Please enter your token first.');
      return;
    }
    
    try {
      setIsLoadingTransactions(true);
      setTransactionError('');
      
      const response = await fetch('http://localhost:5000/monobank-transactions-direct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          token: monobankToken.trim(),
          accountId: accountId 
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setTransactions(data.transactions);
        setSelectedAccountId(accountId);
      } else {
        setTransactionError(data.error || 'Failed to fetch transactions');
        setTransactions([]);
      }
    } catch (err) {
      setTransactionError('Error fetching transactions');
      setTransactions([]);
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  // Format currency codes to proper currency names
  const getCurrencyName = (code: number): string => {
    const currencies: {[key: number]: string} = {
      980: 'UAH',
      840: 'USD',
      978: 'EUR'
    };
    return currencies[code] || `Currency ${code}`;
  };

  // Format account balance with proper decimal places
  const formatAmount = (amount: number, currencyCode: number): string => {
    return (amount / 100).toLocaleString('uk-UA', {
      style: 'currency',
      currency: getCurrencyName(currencyCode)
    });
  };

  // Filter transactions based on current filters
  const getFilteredTransactions = () => {
    let filtered = [...transactions];

    // Filter by type
    if (filters.type === 'expense') {
      filtered = filtered.filter(t => t.amount < 0);
    } else if (filters.type === 'income') {
      filtered = filtered.filter(t => t.amount > 0);
    }

    // Filter by period
    if (filters.period !== 'all') {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() / 1000;
      const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).getTime() / 1000;
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime() / 1000;

      if (filters.period === 'today') {
        filtered = filtered.filter(t => t.time >= startOfDay);
      } else if (filters.period === 'week') {
        filtered = filtered.filter(t => t.time >= startOfWeek);
      } else if (filters.period === 'month') {
        filtered = filtered.filter(t => t.time >= startOfMonth);
      }
    }

    // Filter by amount
    if (filters.amount !== 'all') {
      if (filters.amount === 'small') {
        filtered = filtered.filter(t => Math.abs(t.amount) <= 10000); // До 100₴
      } else if (filters.amount === 'medium') {
        filtered = filtered.filter(t => Math.abs(t.amount) > 10000 && Math.abs(t.amount) <= 100000); // 100-1000₴
      } else if (filters.amount === 'large') {
        filtered = filtered.filter(t => Math.abs(t.amount) > 100000); // Понад 1000₴
      }
    }

    // Filter by category
    if (filters.category !== 'all') {
      filtered = filtered.filter(t => {
        const category = mccCategories[t.mcc] || DEFAULT_CATEGORY;
        return category === filters.category;
      });
    }

    return filtered;
  };

  // Get all available categories from transactions
  const getAvailableCategories = () => {
    const categories = new Set<string>();
    transactions.forEach(t => {
      const category = mccCategories[t.mcc] || DEFAULT_CATEGORY;
      categories.add(category);
    });
    return Array.from(categories).sort();
  };

  // Reset all filters
  const resetFilters = () => {
    const defaultFilters = {
      type: 'all' as const,
      period: 'all' as const,
      amount: 'all' as const,
      category: 'all'
    };
    setFilters(defaultFilters);
    setShowAllTransactions(false);
    
    // Сохраняем в localStorage
    if (user?.id) {
      localStorage.setItem(`monobank_filters_${user.id}`, JSON.stringify(defaultFilters));
      localStorage.setItem(`monobank_show_all_${user.id}`, JSON.stringify(false));
    }
  };

  // Group transactions by category and calculate total expenses
  const getExpensesByCategory = () => {
    // Filter only expense transactions (negative amounts)
    const expenses = transactions.filter(t => t.amount < 0);
    
    // Group by category
    const groupedExpenses: Record<string, {amount: number, currencyCode: number}> = {};
  
    expenses.forEach(transaction => {
      const category = mccCategories[transaction.mcc] || DEFAULT_CATEGORY;
      const amount = Math.abs(transaction.amount);
      
      if (groupedExpenses[category]) {
        groupedExpenses[category].amount += amount;
      } else {
        groupedExpenses[category] = {
          amount: amount,
          currencyCode: transaction.currencyCode
        };
      }
    });
    
    // Convert to array of objects for easier rendering
    return Object.entries(groupedExpenses).map(([category, data]) => ({
      category,
      amount: data.amount,
      currencyCode: data.currencyCode,
      formattedAmount: (data.amount / 100).toLocaleString('uk-UA', {
        style: 'currency',
        currency: getCurrencyName(data.currencyCode)
      })
    }));
  };
  
  // Get total expenses for the period
  const getTotalExpenses = () => {
    const totalExpense = transactions
      .filter(t => t.amount < 0)
      .reduce((total, t) => total + Math.abs(t.amount), 0);
      
    return (totalExpense / 100).toLocaleString('uk-UA', {
      style: 'currency',
      currency: getCurrencyName(980) // Default to UAH
    });
  };

  // Format date from Unix timestamp
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Get transactions for display with filtering and pagination
  const getDisplayTransactions = () => {
    const filteredTransactions = getFilteredTransactions();
    const limit = showAllTransactions ? filteredTransactions.length : 10;
    
    return filteredTransactions
      .slice(0, limit)
      .map(t => ({
        ...t,
        formattedDate: formatDate(t.time),
        formattedAmount: (t.amount / 100).toLocaleString('uk-UA', {
          style: 'currency',
          currency: getCurrencyName(t.currencyCode)
        }),
        category: mccCategories[t.mcc] || DEFAULT_CATEGORY
      }));
  };

  const expensesByCategory = getExpensesByCategory();
  const filteredTransactions = getFilteredTransactions();
  const displayTransactions = getDisplayTransactions();
  const availableCategories = getAvailableCategories();

  // Helper function to format account name
  const getAccountName = (account: Account) => {
    const currency = getCurrencyName(account.currencyCode);
    if (account.maskedPan && account.maskedPan.length > 0) {
      return `Картка ${account.maskedPan[0]} (${currency})`;
    }
    return `Рахунок ${currency}`;
  };

  return (
    <div className="md:w-3/4 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Історія активності</h2>
        <div className="flex space-x-2">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
            onClick={() => setShowModal(true)}
          >
            <CreditCard className="w-4 h-4 mr-2" /> Мої рахунки
          </button>
          {tokenVerified && (
            <button
              onClick={clearStoredData}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center"
            >
              <Trash2 className="w-4 h-4 mr-2" /> Очистити дані
            </button>
          )}
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-md mb-6">
        <div className="flex justify-between mb-2 pb-2 border-b">
          <span className="text-gray-600">Останній вхід</span>
          <span className="font-medium">{new Date().toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between mb-2 pb-2 border-b">
          <span className="text-gray-600">ID користувача</span>
          <span className="font-medium">{user?.id || 'N/A'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Статус Monobank</span>
          <span className={`font-medium ${tokenVerified ? 'text-green-600' : 'text-gray-600'}`}>
            {tokenVerified ? 'Підключено' : 'Не підключено'}
          </span>
        </div>
      </div>
      
      {/* Monobank token input (always visible now) */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Токен Monobank</h3>
        </div>
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="flex space-x-2">
            <input
              type="text"
              className="flex-1 p-2 border rounded-md"
              value={monobankToken}
              onChange={(e) => setMonobankToken(e.target.value)}
              placeholder="Введіть ваш токен Monobank"
            />
            <button
              onClick={fetchMonobankAccounts}
              disabled={isLoadingAccounts || !monobankToken.trim()}
              className={`px-4 py-2 rounded-md ${
                isLoadingAccounts ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              {isLoadingAccounts ? (
                <>
                  <RefreshCw className="inline w-4 h-4 mr-1 animate-spin" /> Перевірка...
                </>
              ) : (
                'Перевірити'
              )}
            </button>
          </div>
          {error && (
            <div className="mt-2 bg-red-50 text-red-600 p-2 rounded-md flex items-start">
              <XCircle className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}
          {tokenVerified && (
            <div className="mt-2 bg-green-50 text-green-600 p-2 rounded-md flex items-start">
              <CheckCircle className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
              <span className="text-sm">Токен успішно перевірено</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Account selection */}
      {tokenVerified && accounts.length > 0 && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">Виберіть рахунок</h3>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex flex-wrap gap-3">
              {accounts.map((account) => (
                <button
                  key={account.id}
                  className={`px-4 py-2 rounded-md ${
                    selectedAccountId === account.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
                  }`}
                  onClick={() => fetchTransactionsWithCache(account.id)}
                >
                  {getAccountName(account)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Monthly Expenses Section */}
      {tokenVerified && transactions.length > 0 && (
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">Витрати за останні 30 днів</h3>
              <button 
                className="flex items-center text-blue-600 hover:text-blue-800"
                onClick={() => selectedAccountId && fetchTransactionsWithCache(selectedAccountId, true)}
                disabled={isLoadingTransactions}
              >
                <RefreshCw className="w-4 h-4 mr-1" /> Оновити
              </button>
            </div>
            
            {transactionError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 flex items-start">
                <XCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>{transactionError}</span>
              </div>
            )}
            
            <div className="bg-gray-50 p-4 rounded-md">
              {isLoadingTransactions ? (
                <div className="text-center py-6">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
                  <p>Завантаження даних...</p>
                </div>
              ) : transactions.length > 0 ? (
                <>
                  {/* Chart/visualization */}
                  <div className="bg-white p-4 rounded-md mb-4">
                    <h4 className="font-medium mb-3 flex items-center">
                      <BarChart2 className="w-4 h-4 mr-2" /> 
                      Розподіл витрат за категоріями
                    </h4>
                    
                    <div className="space-y-2">
                      {expensesByCategory.map((category, index) => (
                        <div key={index}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{category.category}</span>
                            <span>{category.formattedAmount}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-blue-600 h-2.5 rounded-full" 
                              style={{ width: `${Math.min(100, (category.amount / transactions.reduce((acc, t) => acc + Math.abs(Math.min(0, t.amount)), 0)) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  Немає даних про транзакції за останні 30 днів
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {tokenVerified && transactions.length > 0 && (
        <div className="mt-8">
          <MonobankCharts 
            transactions={transactions}
            expensesByCategory={expensesByCategory}
          />
        </div>
      )}

      {/* Transaction Filters */}
      {tokenVerified && transactions.length > 0 && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold flex items-center">
              <Filter className="w-5 h-5 mr-2" /> 
              Фільтри транзакцій
            </h3>
            <button 
              onClick={resetFilters}
              className="flex items-center text-gray-600 hover:text-gray-800 text-sm"
            >
              <RotateCcw className="w-4 h-4 mr-1" /> Скинути
            </button>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Тип</label>
                <select 
                  value={filters.type}
                  onChange={(e) => setFilters({...filters, type: e.target.value as any})}
                  className="w-full p-2 border rounded-md text-sm"
                >
                  <option value="all">Все</option>
                  <option value="expense">Витрати</option>
                  <option value="income">Надходження</option>
                </select>
              </div>
              
              {/* Period Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Період</label>
                <select 
                  value={filters.period}
                  onChange={(e) => setFilters({...filters, period: e.target.value as any})}
                  className="w-full p-2 border rounded-md text-sm"
                >
                  <option value="all">Весь час</option>
                  <option value="today">Сьогодні</option>
                  <option value="week">Тиждень</option>
                  <option value="month">Місяць</option>
                </select>
              </div>
              
              
              {/* Amount Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Сума</label>
                <select 
                  value={filters.amount}
                  onChange={(e) => setFilters({...filters, amount: e.target.value as any})}
                  className="w-full p-2 border rounded-md text-sm"
                >
                  <option value="all">Будь-яка</option>
                  <option value="small">До 100₴</option>
                  <option value="medium">100-1000₴</option>
                  <option value="large">Понад 1000₴</option>
                </select>
              </div>
              
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Категорія</label>
                <select 
                  value={filters.category}
                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                  className="w-full p-2 border rounded-md text-sm"
                >
                  <option value="all">Всі категорії</option>
                  {availableCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Filter Results Summary */}
            <div className="mt-3 pt-3 border-t text-sm text-gray-600">
              Знайдено <span className="font-medium">{filteredTransactions.length}</span> транзакцій
              {filteredTransactions.length !== transactions.length && (
                <span> з {transactions.length} загальних</span>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Transactions Section */}
      {tokenVerified && transactions.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <Calendar className="w-5 h-5 mr-2" /> 
            Транзакції
            {filteredTransactions.length !== transactions.length && (
              <span className="ml-2 text-sm font-normal text-gray-600">
                ({filteredTransactions.length} відфільтровано)
              </span>
            )}
          </h3>
          
          <div className="bg-gray-50 p-4 rounded-md">
            {filteredTransactions.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <Filter className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="text-lg font-medium mb-1">Немає результатів</p>
                <p className="text-sm">Спробуйте змінити фільтри для пошуку транзакцій</p>
              </div>
            ) : (
              <>
                <div className="divide-y max-h-96 overflow-y-auto">
                  {displayTransactions.map((transaction, index) => (
                    <div key={index} className="py-3 first:pt-0 last:pb-0">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">{transaction.description}</span>
                        <span className={`font-medium ${transaction.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {transaction.formattedAmount}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                          {transaction.category}
                        </span>
                        <span>{transaction.formattedDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Show more button */}
                {!showAllTransactions && filteredTransactions.length > 10 && (
                  <div className="mt-4 text-center">
                    <button 
                      onClick={() => setShowAllTransactions(true)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Показати всі ({filteredTransactions.length - 10} залишилось)
                    </button>
                  </div>
                )}
                
                {showAllTransactions && filteredTransactions.length > 10 && (
                  <div className="mt-4 text-center">
                    <button 
                      onClick={() => setShowAllTransactions(false)}
                      className="text-gray-600 hover:text-gray-800 text-sm"
                    >
                      Показати менше
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Info Modal - now used for help text */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Інформація про підключення</h3>
            
            <div className="mb-4">
              <p className="text-gray-600 mb-3">
                Для отримання доступу до інформації про ваші рахунки у Monobank, введіть персональний токен доступу API у поле вище.
              </p>
              <p className="text-gray-600 mb-3">
                Токен можна отримати в додатку {' '}
                <a
                  href="https://api.monobank.ua/docs/index.html"
                  className="text-blue-600 underline hover:text-blue-800"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Monobank
                </a>:
              </p>
              <ol className="list-decimal pl-5 space-y-1 text-gray-600">
                <li>Відкрийте додаток Monobank</li>
                <li>Перейдіть у розділ "Більше"</li>
                <li>Виберіть "Налаштування"</li>
                <li>Натисніть "Розробникам"</li>
                <li>Отримайте токен і скопіюйте його</li>
              </ol>
            </div>
            
            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            >
              Зрозуміло
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileContent;