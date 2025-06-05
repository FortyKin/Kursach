import React, { useState } from 'react';

interface PasswordChangeFormProps {
  setChangePassword: (value: boolean) => void;
  setError: (value: string) => void;
  currentUser: {
    id: number;
    email: string;
    username: string;
  };
  onUserUpdate?: (updatedUser: any) => void;
}

const PasswordChangeForm: React.FC<PasswordChangeFormProps> = ({
  setChangePassword,
  setError,
  currentUser,
  onUserUpdate
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    username: currentUser.username,
  });
  
  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setSuccessMessage('');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setSuccessMessage('');
  };

  const handleProfileSubmit = async () => {
    setIsSaving(true);
    setError('');
    setSuccessMessage('');

    if (profileData.username.trim().length < 2) {
      setError('Ім\'я користувача повинно містити принаймні 2 символи');
      setIsSaving(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: profileData.username.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Профіль успішно оновлено!');
        if (onUserUpdate) {
          onUserUpdate(data.user);
        }
      } else {
        setError(data.error || 'Помилка при оновленні профілю');
      }
    } catch (err) {
      setError('Помилка підключення до сервера');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async () => {
    setIsSaving(true);
    setError('');
    setSuccessMessage('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Нові паролі не співпадають');
      setIsSaving(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Новий пароль повинен містити принаймні 6 символів');
      setIsSaving(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Пароль успішно змінено!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        setError(data.error || 'Помилка при зміні паролю');
      }
    } catch (err) {
      setError('Помилка підключення до сервера');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="md:w-3/4 p-6">
      <div className="py-4 max-w-md mx-auto">
        <h3 className="text-xl font-semibold mb-4">Налаштування профілю</h3>
        
        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {successMessage}
          </div>
        )}
        
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'profile'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => {
              setActiveTab('profile');
              setError('');
              setSuccessMessage('');
            }}
          >
            Особисті дані
          </button>
          <button
            className={`py-2 px-4 font-medium ml-4 ${
              activeTab === 'password'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => {
              setActiveTab('password');
              setError('');
              setSuccessMessage('');
            }}
          >
            Зміна паролю
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <input
                type="email"
                value={currentUser.email}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
              />
              <p className="text-xs text-gray-500 mt-1">Email не можна змінити</p>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Ім'я користувача
              </label>
              <input
                type="text"
                name="username"
                value={profileData.username}
                onChange={handleProfileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setChangePassword(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Скасувати
              </button>
              <button
                onClick={handleProfileSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                disabled={isSaving}
              >
                {isSaving ? 'Збереження...' : 'Зберегти зміни'}
              </button>
            </div>
          </div>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && (
          <div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Поточний пароль
              </label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Новий пароль
              </label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Мінімум 6 символів</p>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Підтвердження нового паролю
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setChangePassword(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Скасувати
              </button>
              <button
                onClick={handlePasswordSubmit}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
                disabled={isSaving}
              >
                {isSaving ? 'Збереження...' : 'Змінити пароль'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordChangeForm;