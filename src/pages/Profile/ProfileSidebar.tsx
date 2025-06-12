import React from 'react';
import { User, Mail, Lock } from 'lucide-react';

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
        
        <h3 className="text-xl font-bold text-center">{formData.username}</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex items-center text-red-200 mb-1">
            <Mail className="w-4 h-4 mr-2" /> E-mail
          </div>
          <div className="pl-6">{formData.email}</div>
        </div>
        
        <div className="pt-4">
          <button
            type="button"
            onClick={() => setChangePassword(true)}
            className="bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-900 w-full flex items-center justify-center"
          >
            <Lock className="w-4 h-4 mr-2" /> Змінити пароль
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;