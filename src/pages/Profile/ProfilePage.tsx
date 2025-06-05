import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import ProfileSidebar from './ProfileSidebar';
import ProfileContent from './ProfileContent';
import PasswordChangeForm from './PasswordChangeForm';
import { setCredentials } from '../../store/authSlice';

interface User {
  id: number;
  username: string;
  email: string;
}

interface ProfileFormData {
  username: string;
  email: string;
  phone?: string;
  avatar?: string;
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user, token } = useSelector((state: RootState) => state.auth);
  
  const [formData, setFormData] = useState<ProfileFormData>({
    username: '',
    email: '',
    phone: '',
    avatar: '',
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Проверяем авторизацию
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Если есть пользователь из Redux, используем его данные
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        phone: '',
        avatar: '',
      });
      setIsLoading(false);
      return;
    }

    // Если пользователя нет в Redux, но есть токен, попробуем получить данные из localStorage
    if (token && !user) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser) as User;
          setFormData({
            username: userData.username || '',
            email: userData.email || '',
          });
          
          // Обновляем Redux состояние
          dispatch(setCredentials({ user: userData, token }));
          setIsLoading(false);
        } catch (e) {
          console.error('Failed to parse user data from localStorage');
          setIsLoading(false);
        }
      } else {
        // Если нет данных в localStorage, делаем запрос к серверу для проверки токена
        checkAuthStatus();
      }
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, user, token, navigate, dispatch]);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/check-auth', {
        headers: {
          'Authorization': `Bearer ${token || ''}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json() as User;
        setFormData({
          username: userData.username || '',
          email: userData.email || '',
          phone: '',
          avatar: '',
        });
        
        // Обновляем Redux состояние
        dispatch(setCredentials({ user: userData, token: token || '' }));
      } else {
        // Токен недействителен, перенаправляем на логин
        navigate('/login');
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    
    try {
      
      const response = await fetch('http://localhost:5000/update-profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token || ''}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.user) {
          const updatedUser = result.user as User;
          // Обновляем Redux состояние
          dispatch(setCredentials({ user: updatedUser, token: token || '' }));
          
          // Обновляем localStorage
          localStorage.setItem('user', JSON.stringify(updatedUser));
          
          setIsEditing(false);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Помилка при оновленні профілю');
      }
    } catch (err) {
      setError('Помилка при оновленні профілю');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUserUpdate = (updatedUser: User) => {
    if (token) {
      dispatch(setCredentials({ user: updatedUser, token }));
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setFormData({
        username: updatedUser.username || '',
        email: updatedUser.email || '',
        phone: formData.phone || '',
        avatar: formData.avatar || '',
      });
    }
  };

  // Показываем загрузку пока проверяем авторизацию
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="text-center">Завантаження...</div>
      </div>
    );
  }
  
  // Перенаправляем только если точно не авторизован
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16">
        Перенаправлення на сторінку входу...
      </div>
    );
  }

  // Создаем временный объект пользователя из formData если user еще не загружен
  const currentUser: User = user || {
    id: 1, // временный ID
    username: formData.username,
    email: formData.email,
  };
  
  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-4 rounded relative">
          {error}
        </div>
      )}
      
      <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden">
        <ProfileSidebar 
          formData={formData}
          handleChange={handleChange}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          isSaving={isSaving}
          handleSubmit={handleSubmit}
          setChangePassword={setChangePassword}
        />
        
        {changePassword ? (
          <PasswordChangeForm 
            setChangePassword={setChangePassword}
            setError={setError}
            currentUser={currentUser}
            onUserUpdate={handleUserUpdate}
          />
        ) : (
          <ProfileContent user={currentUser} />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;