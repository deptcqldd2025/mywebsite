
import React, { useState, useCallback, ChangeEvent } from 'react';
import { CameraView } from './components/CameraView';
import { AnalysisResultDisplay } from './components/AnalysisResultDisplay';
import { Loader } from './components/Loader';
import { analyzeImageForSafety } from './services/geminiService';
import { AnalysisResult } from './types';

const CameraIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);


function App() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target?.result as string);
        setAnalysisResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleCapture = useCallback((imageDataUrl: string) => {
    setImageSrc(imageDataUrl);
    setAnalysisResult(null);
    setError(null);
    setIsCameraOpen(false);
  }, []);

  const handleAnalyze = async () => {
    if (!imageSrc) {
      setError("Vui lòng chọn hoặc chụp ảnh trước khi phân tích.");
      return;
    }
    setIsLoading(true);
    setAnalysisResult(null);
    setError(null);

    try {
      const result = await analyzeImageForSafety(imageSrc);
      setAnalysisResult(result);
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi không mong muốn.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetState = () => {
      setImageSrc(null);
      setAnalysisResult(null);
      setError(null);
      setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      {isCameraOpen && <CameraView onCapture={handleCapture} onClose={() => setIsCameraOpen(false)} />}
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-800 tracking-tight">
            Kiểm Tra Tuân Thủ An Toàn
          </h1>
          <p className="mt-3 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Tải ảnh lên hoặc dùng camera để AI phân tích trang phục bảo hộ lao động.
          </p>
        </header>

        <main className="w-full bg-white rounded-2xl shadow-xl p-4 sm:p-8 flex flex-col items-center">
            {!imageSrc ? (
                <div className="w-full flex flex-col items-center text-center">
                    <div className="w-full max-w-sm flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => setIsCameraOpen(true)}
                            className="w-full sm:w-auto flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                        >
                            <CameraIcon />
                            Sử dụng Camera
                        </button>
                        <label className="w-full sm:w-auto flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer">
                            <UploadIcon />
                            Tải ảnh lên
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                        </label>
                    </div>
                     <p className="mt-6 text-gray-500">Vui lòng chọn ảnh hoặc dùng camera để bắt đầu.</p>
                </div>
            ) : (
                <div className="w-full flex flex-col items-center">
                    <div className="w-full max-w-lg border-4 border-gray-200 rounded-lg overflow-hidden mb-6 shadow-inner">
                        <img src={imageSrc} alt="Worker for analysis" className="w-full h-auto object-contain" />
                    </div>
                    <div className="w-full max-w-sm flex flex-col sm:flex-row gap-4">
                         <button
                            onClick={handleAnalyze}
                            disabled={isLoading}
                            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-3 px-8 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                        >
                            {isLoading ? 'Đang phân tích...' : 'Phân tích ảnh'}
                        </button>
                        <button
                            onClick={resetState}
                            className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg shadow-md transition duration-300"
                        >
                            Chọn ảnh khác
                        </button>
                    </div>
                </div>
            )}
            
            {error && <p className="mt-6 text-red-600 font-semibold bg-red-100 p-3 rounded-lg">{error}</p>}
            
            <div className="w-full mt-6">
                {isLoading && <Loader message="AI đang phân tích, vui lòng chờ..." />}
                {analysisResult && <AnalysisResultDisplay result={analysisResult} />}
            </div>

        </main>
      </div>
    </div>
  );
}

export default App;
