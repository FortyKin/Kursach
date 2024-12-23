import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTransaction } from '../store/financeSlice';
import { v4 as uuidv4 } from 'uuid';
import { PlusCircle, CreditCard, ShoppingBag } from 'lucide-react';
import { Transaction } from '../types';

type FormType = 'installment' | 'credit';

const calculateLoanPayments = (
  amount: number,
  interestRate: number,
  loanTerm: number
) => {
  const monthlyRate = interestRate / 100 / 12;
  const monthlyPayment =
    (amount * monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) /
    (Math.pow(1 + monthlyRate, loanTerm) - 1);
  const totalPayment = monthlyPayment * loanTerm;
  const totalInterest = totalPayment - amount;

  return {
    monthlyPayment,
    totalPayment,
    totalInterest,
  };
};

const TransactionModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState<FormType | null>(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [storeName, setStoreName] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [initialPayment, setInitialPayment] = useState('');
  const [hasInsurance, setHasInsurance] = useState(false);
  const [insuranceCost, setInsuranceCost] = useState('');
  
  const dispatch = useDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedForm) return;

    let transactionData: Partial<Transaction> = {};

    if (selectedForm === 'installment') {
      const totalAmount = parseFloat(amount);
      const initial = parseFloat(initialPayment) || 0;
      const insurance = hasInsurance ? parseFloat(insuranceCost) || 0 : 0;
      
      const installmentAmount = totalAmount - initial + insurance;
      
      const calculations = calculateLoanPayments(
        installmentAmount,
        parseFloat(interestRate),
        parseInt(loanTerm)
      );

      transactionData = {
        paymentDate,
        interestRate: parseFloat(interestRate),
        loanTerm: parseInt(loanTerm),
        monthlyPayment: calculations.monthlyPayment,
        totalPayment: calculations.totalPayment + initial,
        totalInterest: calculations.totalInterest,
        remainingPayments: parseInt(loanTerm),
        storeName,
        productCategory,
        initialPayment: initial,
        hasInsurance,
        insuranceCost: insurance
      };
    } else if (selectedForm === 'credit' && amount && interestRate && loanTerm) {
      const loanCalculations = calculateLoanPayments(
        parseFloat(amount),
        parseFloat(interestRate),
        parseInt(loanTerm)
      );

      transactionData = {
        paymentDate,
        interestRate: parseFloat(interestRate),
        loanTerm: parseInt(loanTerm),
        monthlyPayment: loanCalculations.monthlyPayment,
        totalPayment: loanCalculations.totalPayment,
        totalInterest: loanCalculations.totalInterest,
        remainingPayments: parseInt(loanTerm)
      };
    }

    const newTransaction: Transaction = {
      id: uuidv4(),
      amount: parseFloat(amount),
      description: `${selectedForm.toUpperCase()}: ${description}`,
      date: new Date().toISOString(),
      type: 'expense',
      transactionType: selectedForm,
      isNew: true,
      ...transactionData
    };
    
    dispatch(addTransaction(newTransaction));
    handleReset();
  };

  const handleReset = () => {
    setAmount('');
    setDescription('');
    setPaymentDate('');
    setInterestRate('');
    setLoanTerm('');
    setStoreName('');
    setProductCategory('');
    setInitialPayment('');
    setHasInsurance(false);
    setInsuranceCost('');
    setSelectedForm(null);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
      >
        <PlusCircle className="h-8 w-8" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg p-6 w-full max-w-md my-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {selectedForm 
              ? `Add ${selectedForm === 'installment' ? 'Installment / Рассрочка' : 'Credit / Кредит'}` 
              : 'Choose Transaction Type / Выберите тип транзакции'}
          </h2>
          <button
            onClick={handleReset}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {!selectedForm ? (
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setSelectedForm('installment')}
              className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-colors"
            >
              <ShoppingBag className="h-12 w-12 mb-2 text-purple-600" />
              <span className="text-lg font-medium">Installment / Рассрочка</span>
              <span className="text-sm text-gray-500 text-center mt-2">
                Buy now, pay later / Покупка в рассрочку
              </span>
            </button>
            <button
              onClick={() => setSelectedForm('credit')}
              className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-colors"
            >
              <CreditCard className="h-12 w-12 mb-2 text-blue-600" />
              <span className="text-lg font-medium">Credit / Кредит</span>
              <span className="text-sm text-gray-500 text-center mt-2">
                Bank credit / Банковский кредит
              </span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Amount / Общая сумма
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2"
                  placeholder="Enter amount / Введите сумму"
                  required
                />
              </div>

              {selectedForm === 'installment' && (
                <>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Store Name / Магазин
                    </label>
                    <input
                      type="text"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      className="w-full rounded-md border border-gray-300 p-2"
                      placeholder="Enter store name / Введите название магазина"
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Category / Категория товара
                    </label>
                    <select
                      value={productCategory}
                      onChange={(e) => setProductCategory(e.target.value)}
                      className="w-full rounded-md border border-gray-300 p-2"
                      required
                    >
                      <option value="">Select category / Выберите категорию</option>
                      <option value="electronics">Electronics / Электроника</option>
                      <option value="furniture">Furniture / Мебель</option>
                      <option value="appliances">Appliances / Бытовая техника</option>
                      <option value="other">Other / Другое</option>
                    </select>
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Initial Payment / Первоначальный взнос
                    </label>
                    <input
                      type="number"
                      value={initialPayment}
                      onChange={(e) => setInitialPayment(e.target.value)}
                      className="w-full rounded-md border border-gray-300 p-2"
                      placeholder="Enter initial payment"
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <div className="h-full flex items-end">
                      <label className="flex items-center space-x-2 mb-2">
                        <input
                          type="checkbox"
                          checked={hasInsurance}
                          onChange={(e) => setHasInsurance(e.target.checked)}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm text-gray-700">Add Insurance / Страховка</span>
                      </label>
                    </div>
                  </div>

                  {hasInsurance && (
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Insurance Cost / Стоимость страховки
                      </label>
                      <input
                        type="number"
                        value={insuranceCost}
                        onChange={(e) => setInsuranceCost(e.target.value)}
                        className="w-full rounded-md border border-gray-300 p-2"
                        placeholder="Enter insurance cost"
                        required
                      />
                    </div>
                  )}
                </>
              )}

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interest Rate (%) / Процентная ставка
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2"
                  placeholder="Enter rate"
                  required
                />
              </div>

              <div className="col-span-2 sm:col-span-1 mt-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Term (months) / Срок
                </label>
                <input
                  type="number"
                  min="1"
                  max="360"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2"
                  placeholder="Enter term"
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Payment Date / Дата первого платежа
                </label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2"
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description / Описание
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2"
                  placeholder="Enter description"
                  required
                />
              </div>
            </div>

            {amount && interestRate && loanTerm && (
              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <h3 className="font-medium mb-2">Payment Summary / Сводка по платежам</h3>
                <div className="space-y-2 text-sm">
                  {(() => {
                    const principal = selectedForm === 'installment'
                      ? parseFloat(amount) - (parseFloat(initialPayment) || 0) + (hasInsurance ? parseFloat(insuranceCost) || 0 : 0)
                      : parseFloat(amount);
                    
                    const { monthlyPayment, totalPayment, totalInterest } = calculateLoanPayments(
                      principal,
                      parseFloat(interestRate),
                      parseInt(loanTerm)
                    );
                    
                    return (
                      <>
                        {selectedForm === 'installment' && parseFloat(initialPayment) > 0 && (
                          <div>
                            <span className="text-gray-500">Initial Payment / Первый взнос:</span>
                            <span className="float-right font-medium">
                              ${parseFloat(initialPayment).toFixed(2)}
                            </span>
                          </div>
                        )}
                        <div>
                          <span className="text-gray-500">Monthly Payment / Ежемесячный платеж:</span>
                          <span className="float-right font-medium">
                            ${monthlyPayment.toFixed(2)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Total Payment / Общая сумма выплат:</span>
                          <span className="float-right font-medium">
                            ${(totalPayment + (parseFloat(initialPayment) || 0)).toFixed(2)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Total Interest / Сумма процентов:</span>
                          <span className="float-right font-medium text-amber-600">
                            ${totalInterest.toFixed(2)}
                          </span>
                        </div>
                        {hasInsurance && (
                          <div>
                            <span className="text-gray-500">Insurance Cost / Стоимость страховки:</span>
                            <span className="float-right font-medium text-red-600">
                              ${parseFloat(insuranceCost).toFixed(2)}
                            </span>
                          </div>
                        )}
                        <div className="pt-2 mt-2 border-t border-gray-200">
                          <span className="text-gray-700 font-medium">Final Cost / Итоговая стоимость:</span>
                          <span className="float-right font-bold text-blue-600">
                            ${(totalPayment + (parseFloat(initialPayment) || 0) + (hasInsurance ? parseFloat(insuranceCost) : 0)).toFixed(2)}
                          </span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}
    
            <div className="flex justify-end space-x-2 mt-6">
              <button
                type="button"
                onClick={() => setSelectedForm(null)}
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Back / Назад
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Add {selectedForm === 'installment' ? 'Installment / Рассрочку' : 'Credit / Кредит'}
              </button>
            </div>
            </form>
          )}
          </div>
        </div>
      );
    };
    
    export default TransactionModal;
                  