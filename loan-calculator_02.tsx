import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const LoanCalculator = () => {
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [schedule, setSchedule] = useState([]);
  const [showSchedule, setShowSchedule] = useState(false);

  const calculateLoan = () => {
    const principal = parseFloat(loanAmount);
    const annualRate = parseFloat(interestRate) / 100;
    const monthlyRate = annualRate / 12;
    const months = parseFloat(loanTerm) * 12;

    // 월 상환금 계산
    const monthlyPmt = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / 
                      (Math.pow(1 + monthlyRate, months) - 1);

    const totalPmt = monthlyPmt * months;
    const totalInt = totalPmt - principal;

    setMonthlyPayment(Math.round(monthlyPmt));
    setTotalPayment(Math.round(totalPmt));
    setTotalInterest(Math.round(totalInt));

    // 상환 스케줄 계산
    let remainingBalance = principal;
    let newSchedule = [];

    for (let month = 1; month <= months; month++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = monthlyPmt - interestPayment;
      remainingBalance -= principalPayment;

      newSchedule.push({
        month,
        payment: Math.round(monthlyPmt),
        principalPayment: Math.round(principalPayment),
        interestPayment: Math.round(interestPayment),
        remainingBalance: Math.max(0, Math.round(remainingBalance))
      });
    }

    setSchedule(newSchedule);
    setShowSchedule(true);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">대출 계산기</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">대출금액 (원)</label>
            <Input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              placeholder="예: 50000000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">연이자율 (%)</label>
            <Input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              placeholder="예: 3.5"
              step="0.1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">대출기간 (년)</label>
            <Input
              type="number"
              value={loanTerm}
              onChange={(e) => setLoanTerm(e.target.value)}
              placeholder="예: 30"
            />
          </div>
        </div>
        
        <Button 
          onClick={calculateLoan}
          className="w-full mt-4"
        >
          계산하기
        </Button>

        {monthlyPayment > 0 && (
          <div className="mt-6 space-y-2 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between">
              <span className="font-medium">월 상환금액:</span>
              <span>{monthlyPayment.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">총 상환금액:</span>
              <span>{totalPayment.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">총 이자금액:</span>
              <span>{totalInterest.toLocaleString()}원</span>
            </div>
          </div>
        )}

        {showSchedule && schedule.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">월별 상환 스케줄</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left border">회차</th>
                    <th className="px-4 py-2 text-left border">월 상환금</th>
                    <th className="px-4 py-2 text-left border">원금</th>
                    <th className="px-4 py-2 text-left border">이자</th>
                    <th className="px-4 py-2 text-left border">남은 원금</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((month) => (
                    <tr key={month.month} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border">{month.month}회차</td>
                      <td className="px-4 py-2 border">{month.payment.toLocaleString()}원</td>
                      <td className="px-4 py-2 border">{month.principalPayment.toLocaleString()}원</td>
                      <td className="px-4 py-2 border">{month.interestPayment.toLocaleString()}원</td>
                      <td className="px-4 py-2 border">{month.remainingBalance.toLocaleString()}원</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LoanCalculator;
