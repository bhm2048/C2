import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Student, Group } from '../types';
import { Download, Users } from 'lucide-react';
import Papa from 'papaparse';

interface GroupingToolProps {
  students: Student[];
}

export const GroupingTool: React.FC<GroupingToolProps> = ({ students }) => {
  const [groupSize, setGroupSize] = useState(4);
  const [groups, setGroups] = useState<Group[]>([]);

  const generateGroups = () => {
    if (students.length === 0) return;

    const shuffled = [...students].sort(() => Math.random() - 0.5);
    const newGroups: Group[] = [];
    const numGroups = Math.ceil(shuffled.length / groupSize);

    for (let i = 0; i < numGroups; i++) {
      newGroups.push({
        id: `group-${i}`,
        name: `第 ${i + 1} 組`,
        members: shuffled.slice(i * groupSize, (i + 1) * groupSize),
      });
    }

    setGroups(newGroups);
  };

  const exportToCSV = () => {
    const data = groups.flatMap(group => 
      group.members.map(member => ({
        '組別': group.name,
        '姓名': member.name
      }))
    );

    const csv = Papa.unparse(data);
    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `分組結果_${new Date().toLocaleDateString()}.csv`;
    link.click();
  };

  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="flex flex-wrap items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-2">
          <label className="text-slate-600 font-medium">每組人數：</label>
          <input
            type="number"
            min="2"
            max={students.length}
            value={groupSize}
            onChange={(e) => setGroupSize(parseInt(e.target.value) || 2)}
            className="w-20 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <button
          onClick={generateGroups}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <Users size={20} />
          開始自動分組
        </button>
        {groups.length > 0 && (
          <button
            onClick={exportToCSV}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-emerald-700 transition-colors flex items-center gap-2 ml-auto"
          >
            <Download size={20} />
            下載 CSV
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((group, idx) => (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100"
          >
            <h4 className="font-bold text-indigo-600 mb-3 flex items-center justify-between">
              {group.name}
              <span className="text-xs bg-indigo-50 px-2 py-1 rounded-full">{group.members.length} 人</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {group.members.map((member) => (
                <span
                  key={member.id}
                  className="bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg text-sm border border-slate-100"
                >
                  {member.name}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {groups.length === 0 && students.length > 0 && (
        <div className="text-center py-20 text-slate-400 italic">
          設定每組人數後點擊「開始自動分組」
        </div>
      )}
    </div>
  );
};
