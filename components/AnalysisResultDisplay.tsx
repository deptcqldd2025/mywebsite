
import React from 'react';
import { AnalysisResult, SafetyCheck } from '../types';

const CheckIcon = () => (
  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
);

const CrossIcon = () => (
  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
);

interface ResultRowProps {
  label: string;
  check: SafetyCheck;
}

const ResultRow: React.FC<ResultRowProps> = ({ label, check }) => (
  <li className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 px-5 bg-white hover:bg-gray-50 transition-colors duration-200">
    <div className="flex items-center mb-2 sm:mb-0">
      {check.compliant ? <CheckIcon /> : <CrossIcon />}
      <span className="ml-3 font-semibold text-gray-700">{label}</span>
    </div>
    <div className="flex flex-col sm:items-end sm:text-right pl-9 sm:pl-0">
        <span className={`font-bold ${check.compliant ? 'text-green-600' : 'text-red-600'}`}>
            {check.compliant ? 'Tuân thủ' : 'Không tuân thủ'}
        </span>
        <p className="text-sm text-gray-500 mt-1">{check.reason}</p>
    </div>
  </li>
);

interface AnalysisResultDisplayProps {
  result: AnalysisResult;
}

export const AnalysisResultDisplay: React.FC<AnalysisResultDisplayProps> = ({ result }) => {
  return (
    <div className="w-full mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Kết Quả Phân Tích</h2>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <ul className="divide-y divide-gray-200">
          <ResultRow label="Mũ bảo hộ màu trắng" check={result.whiteHelmet} />
          <ResultRow label="Cài quai mũ" check={result.helmetStrapFastened} />
          <ResultRow label="Quần áo bảo hộ màu cam" check={result.orangeSuit} />
          <ResultRow label="Cài nút tay áo" check={result.sleeveButtonsFastened} />
          <ResultRow label="Giày bảo hộ" check={result.safetyShoes} />
        </ul>
      </div>
    </div>
  );
};
