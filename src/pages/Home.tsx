// pages/Home.tsx
import { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/authSlice';
import { Calculator, CreditCard, PieChart, Calendar, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react';

const Home: FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const handleAuthRedirect = (): void => {
    if (isAuthenticated) {
      navigate('/app');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-blue-600 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">Керуйте Своїми Фінансами Розумно</h2>
            <p className="text-xl mb-8">Професійні інструменти для планування кредитів та розстрочок</p>
            <button
              onClick={handleAuthRedirect}
              className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold hover:bg-blue-50 transition-colors"
            >
              Розпочати
            </button>
          </div>
        </section>

        {/* Features Section remains the same */}
        <section className="py-16 container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Наші Можливості</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <Calculator className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">Калькулятор Кредиту</h4>
              <p className="text-gray-600">Розрахунок платежів та відсотків</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <CreditCard className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">Розстрочка</h4>
              <p className="text-gray-600">Гнучкі умови оплати</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <PieChart className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">Аналітика</h4>
              <p className="text-gray-600">Детальна статистика платежів</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <Calendar className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">Графік Платежів</h4>
              <p className="text-gray-600">Помісячний план виплат</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gray-100 py-16">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-3xl font-bold mb-6">Готові Розпочати?</h3>
            <p className="text-xl text-gray-600 mb-8">Приєднуйтесь до тисяч задоволених користувачів</p>
            <button
              onClick={handleAuthRedirect}
              className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition-colors"
            >
              Спробувати Зараз
            </button>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4">Контакти</h4>
              <div className="space-y-2">
                <p className="flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  +380 (44) 123-45-67
                </p>
                <p className="flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  info@financemanager.ua
                </p>
              </div>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Соціальні мережі</h4>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-blue-400">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="#" className="hover:text-blue-400">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href="#" className="hover:text-blue-400">
                  <Twitter className="w-6 h-6" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Швидкі посилання</h4>
              <ul className="space-y-2">
                <li><Link to="/login" className="hover:text-blue-400">Увійти</Link></li>
                <li><Link to="/register" className="hover:text-blue-400">Реєстрація</Link></li>
                <li><Link to="/terms" className="hover:text-blue-400">Умови використання</Link></li>
                <li><Link to="/privacy" className="hover:text-blue-400">Політика конфіденційності</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p>&copy; 2024 ФінансМенеджер. Усі права захищено.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;