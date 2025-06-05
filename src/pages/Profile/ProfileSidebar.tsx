import React from 'react';
import { User, Mail, Phone, Lock, Save } from 'lucide-react';

interface ProfileFormData {
  username: string;
  email: string;
  phone?: string;
  avatar?: string;
}

interface ProfileSidebarProps {
  formData: ProfileFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  isSaving: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  setChangePassword: (value: boolean) => void;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  formData,
  handleChange,
  isEditing,
  setIsEditing,
  isSaving,
  handleSubmit,
  setChangePassword
}) => {
  return (
    <div className="md:w-1/4 bg-red-800 text-white p-6">
      <div className="flex flex-col items-center mb-8">
        <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-4">
          {formData.avatar ? (
            <img src={formData.avatar} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <User className="w-16 h-16 text-gray-400" />
          )}
        </div>
        
        {!isEditing ? (
          <h3 className="text-xl font-bold text-center">{formData.username}</h3>
        ) : (
          <div className="w-full mt-2">
            <label className="block text-white text-sm mb-1">Ім'я користувача</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-red-400 rounded-md bg-red-700 text-white"
            />
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex items-center text-red-200 mb-1">
            <Mail className="w-4 h-4 mr-2" /> E-mail
          </div>
          {!isEditing ? (
            <div className="pl-6">{formData.email}</div>
          ) : (
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-red-400 rounded-md bg-red-700 text-white"
            />
          )}
        </div>
        
        <div>
          <div className="flex items-center text-red-200 mb-1">
            <Phone className="w-4 h-4 mr-2" /> Телефон
          </div>
          {!isEditing ? (
            <div className="pl-6">{formData.phone || '—'}</div>
          ) : (
            <input
              type="tel"
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-red-400 rounded-md bg-red-700 text-white"
            />
          )}
        </div>
        
        <div className="pt-4">
          {isEditing ? (
            <div className="flex flex-col space-y-2">
              <button
                type="button"
                onClick={(e) => handleSubmit(e)}
                className="bg-white text-red-800 px-4 py-2 rounded-md hover:bg-red-100 w-full flex items-center justify-center"
                disabled={isSaving}
              >
                {isSaving ? "Збереження..." : <><Save className="w-4 h-4 mr-2" /> Зберегти</>}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-900 w-full"
              >
                Скасувати
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="bg-white text-red-800 px-4 py-2 rounded-md hover:bg-red-100 w-full"
            >
              Редагувати профіль
            </button>
          )}
        </div>
        
        {!isEditing && (
          <button
            type="button"
            onClick={() => setChangePassword(true)}
            className="bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-900 w-full flex items-center justify-center"
          >
            <Lock className="w-4 h-4 mr-2" /> Змінити пароль
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileSidebar;