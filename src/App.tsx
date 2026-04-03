import React, { useState } from 'react';
import { Student } from './types';
import { NameListManager } from './components/NameListManager';
import { Wheel } from './components/Wheel';
import { GroupingTool } from './components/GroupingTool';
import { LayoutDashboard, Users, RotateCw, Settings2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type View = 'list' | 'draw' | 'group';

export default function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [view, setView] = useState<View>('list');
  const [allowRepeat, setAllowRepeat] = useState(false);
  const [drawHistory, setDrawHistory] = useState<Student[]>([]);

  const handleWinner = (winner: Student) => {
    setDrawHistory(prev => [winner, ...prev]);
    if (!allowRepeat) {
      setStudents(prev => prev.filter(s => s.id !== winner.id));
    }
  };

  const resetStudents = (newList: Student[]) => {
    setStudents(newList);
    setDrawHistory([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
              <LayoutDashboard size={24} />
            </div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">班級小助手</h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                view === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              名單管理
            </button>
            <button
              onClick={() => setView('draw')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                view === 'draw' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              轉盤抽籤
            </button>
            <button
              onClick={() => setView('group')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                view === 'group' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              自動分組
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
              {students.length} 人在名單中
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {view === 'list' && (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <NameListManager students={students} setStudents={resetStudents} />
            </motion.div>
          )}

          {view === 'draw' && (
            <motion.div
              key="draw"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <RotateCw className="text-indigo-500" />
                    轉盤抽籤
                  </h2>
                  <div className="h-6 w-px bg-slate-100 mx-2 hidden sm:block" />
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={allowRepeat}
                      onChange={(e) => setAllowRepeat(e.target.checked)}
                      className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900">允許重複抽中</span>
                  </label>
                </div>
                
                {drawHistory.length > 0 && (
                  <button
                    onClick={() => setDrawHistory([])}
                    className="text-xs font-bold text-slate-400 hover:text-slate-600 underline"
                  >
                    清除中獎紀錄
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                  <Wheel 
                    students={students} 
                    onWinner={handleWinner} 
                    allowRepeat={allowRepeat} 
                  />
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Settings2 size={18} className="text-slate-400" />
                    中獎紀錄
                  </h3>
                  <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                    {drawHistory.length === 0 ? (
                      <p className="text-slate-400 text-sm italic py-10 text-center">尚未有中獎者</p>
                    ) : (
                      drawHistory.map((s, i) => (
                        <motion.div
                          key={`${s.id}-${i}`}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100"
                        >
                          <span className="font-bold text-slate-700">{s.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            #{drawHistory.length - i}
                          </span>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'group' && (
            <motion.div
              key="group"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4 mb-2">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Users className="text-indigo-500" />
                  自動分組
                </h2>
                <span className="text-sm text-slate-400">將名單隨機分配到不同小組</span>
              </div>
              <GroupingTool students={students} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2 flex justify-around items-center z-30">
        <button
          onClick={() => setView('list')}
          className={`flex flex-col items-center gap-1 p-2 ${view === 'list' ? 'text-indigo-600' : 'text-slate-400'}`}
        >
          <LayoutDashboard size={20} />
          <span className="text-[10px] font-bold">名單</span>
        </button>
        <button
          onClick={() => setView('draw')}
          className={`flex flex-col items-center gap-1 p-2 ${view === 'draw' ? 'text-indigo-600' : 'text-slate-400'}`}
        >
          <RotateCw size={20} />
          <span className="text-[10px] font-bold">抽籤</span>
        </button>
        <button
          onClick={() => setView('group')}
          className={`flex flex-col items-center gap-1 p-2 ${view === 'group' ? 'text-indigo-600' : 'text-slate-400'}`}
        >
          <Users size={20} />
          <span className="text-[10px] font-bold">分組</span>
        </button>
      </div>
    </div>
  );
}
