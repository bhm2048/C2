import React, { useState, useEffect } from 'react';
import { Student } from '../types';
import { Upload, Trash2, UserPlus, AlertCircle, Info } from 'lucide-react';
import Papa from 'papaparse';

interface NameListManagerProps {
  students: Student[];
  setStudents: (students: Student[]) => void;
}

export const NameListManager: React.FC<NameListManagerProps> = ({ students, setStudents }) => {
  const [inputText, setInputText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const processNames = (names: string[]) => {
    const cleanedNames = names
      .map(n => n.trim())
      .filter(n => n.length > 0);
    
    const newStudents: Student[] = cleanedNames.map((name, index) => ({
      id: `${Date.now()}-${index}`,
      name,
    }));

    // Check for duplicates
    const nameCounts = new Map<string, number>();
    newStudents.forEach(s => {
      nameCounts.set(s.name, (nameCounts.get(s.name) || 0) + 1);
    });

    const validatedStudents = newStudents.map(s => ({
      ...s,
      isDuplicate: (nameCounts.get(s.name) || 0) > 1
    }));

    setStudents(validatedStudents);
    setInputText('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      complete: (results) => {
        const names = results.data.flat().map(String);
        processNames(names);
      },
      error: (err) => {
        setError('CSV 讀取失敗：' + err.message);
      }
    });
  };

  const handlePaste = () => {
    const names = inputText.split(/[\n,， ]+/);
    processNames(names);
  };

  const removeDuplicates = () => {
    const seen = new Set<string>();
    const unique = students.filter(s => {
      if (seen.has(s.name)) return false;
      seen.add(s.name);
      return true;
    }).map(s => ({ ...s, isDuplicate: false }));
    setStudents(unique);
  };

  const loadMockData = () => {
    const mockNames = [
      '王小明', '李小華', '張大衛', '陳美玲', '林志豪', 
      '黃雅婷', '吳建宏', '蔡佩珊', '楊淑芬', '劉冠廷',
      '王小明', '李小華' // Add some duplicates for testing
    ];
    processNames(mockNames);
  };

  const hasDuplicates = students.some(s => s.isDuplicate);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input Section */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <UserPlus size={20} className="text-indigo-500" />
            匯入名單
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">上傳 CSV 檔案</label>
              <div className="relative group">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center group-hover:border-indigo-400 transition-colors">
                  <Upload className="mx-auto text-slate-400 group-hover:text-indigo-500 mb-2" />
                  <p className="text-sm text-slate-500">點擊或拖曳 CSV 檔案至此</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-400">或</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">貼上姓名 (以換行或逗號分隔)</label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="例如：王小明, 李小華, 張大衛..."
                className="w-full h-32 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              />
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handlePaste}
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors"
                >
                  確認匯入
                </button>
                <button
                  onClick={loadMockData}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                >
                  載入模擬名單
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              名單預覽
              <span className="text-sm font-normal text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">
                {students.length} 人
              </span>
            </h3>
            {students.length > 0 && (
              <button
                onClick={() => setStudents([])}
                className="text-rose-500 hover:text-rose-600 text-sm font-medium flex items-center gap-1"
              >
                <Trash2 size={16} />
                清空全部
              </button>
            )}
          </div>

          {hasDuplicates && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-700 text-sm">
                <AlertCircle size={18} />
                發現重複姓名！
              </div>
              <button
                onClick={removeDuplicates}
                className="bg-amber-500 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-amber-600 transition-colors"
              >
                一鍵移除重複
              </button>
            </div>
          )}

          <div className="flex-1 overflow-y-auto max-h-[400px] pr-2 space-y-2">
            {students.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 py-20">
                <Info size={40} className="mb-2 opacity-20" />
                <p>尚未匯入任何名單</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                      student.isDuplicate
                        ? 'bg-amber-50 border-amber-200 text-amber-700 font-medium'
                        : 'bg-slate-50 border-slate-100 text-slate-600'
                    }`}
                  >
                    {student.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
