import React, { useState } from 'react';
import DesignViewer3D from './DesignViewer3D';

const mockProject = { id: 1, name: 'فيلا عائلية', location: 'وهران، الجزائر', total_area: 250, building_type: 'residential' };
const mockAlternatives = [
  { id: 1, name: 'البديل A', layout: [{ x: 0, y: 3, width: 6, depth: 5, name: 'غرفة معيشة', category: 'living', area: 30 }, { x: 6.5, y: 3, width: 5, depth: 4, name: 'مطبخ', category: 'kitchen', area: 20 }, { x: 0, y: 8.5, width: 5, depth: 4, name: 'غرفة نوم 1', category: 'bedroom', area: 20 }, { x: 5.5, y: 8.5, width: 5, depth: 4, name: 'غرفة نوم 2', category: 'bedroom', area: 20 }, { x: 11.5, y: 3, width: 4, depth: 3, name: 'حمام', category: 'bathroom', area: 12 }], metrics: { efficiency_ratio: 0.85, energy_score: 4.2, daylight_score: 3.8 }, compliance: { status: 'compliant', score: 95 } },
  { id: 2, name: 'البديل B', layout: [{ x: 0, y: 3, width: 7, depth: 6, name: 'غرفة معيشة', category: 'living', area: 42 }, { x: 7.5, y: 3, width: 5, depth: 5, name: 'مطبخ', category: 'kitchen', area: 25 }, { x: 0, y: 9.5, width: 6, depth: 4, name: 'غرفة نوم 1', category: 'bedroom', area: 24 }, { x: 6.5, y: 9.5, width: 6, depth: 4, name: 'غرفة نوم 2', category: 'bedroom', area: 24 }], metrics: { efficiency_ratio: 0.78, energy_score: 3.9, daylight_score: 4.1 }, compliance: { status: 'non_compliant', score: 70 } },
];
const mockRisks = [{ type: 'cost_overrun', severity: 'high', description: 'المساحة الكبيرة تزيد خطر تجاوز الميزانية', probability: 0.7 }, { type: 'schedule_delay', severity: 'medium', description: 'تأخير محتمل في الجدول الزمني', probability: 0.6 }];
const mockViolations = [{ type: 'coverage_violation', severity: 'critical', description: 'نسبة التغطية 48% تتجاوز 45% المسموحة', fix: 'تقليل المساحة المبنية' }];

export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'design' | 'compliance' | 'risks'>('overview');
  const [selectedAlternative, setSelectedAlternative] = useState(0);
  const currentAlt = mockAlternatives[selectedAlternative];
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم</h1>
              <p className="text-sm text-gray-500">{mockProject.name} - {mockProject.location}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">{mockProject.total_area}م2</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">{mockProject.building_type === 'residential' ? 'سكني' : 'تجاري'}</span>
            </div>
          </div>
          <nav className="flex gap-4 mt-4 border-t pt-4">
            {[{ id: 'overview', label: '📊 نظرة عامة' }, { id: 'design', label: '🏗️ التصميم' }, { id: 'compliance', label: '✅ الامتثال' }, { id: 'risks', label: '⚠️ المخاطر' }].map((tab) => (
              <button key={tab.id} onClick={() => setSelectedTab(tab.id as any)} className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedTab === tab.id ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{tab.label}</button>
            ))}
          </nav>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        {selectedTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-xl shadow-sm"><p className="text-sm text-gray-500">المساحة الكلية</p><p className="text-3xl font-bold text-gray-900">{mockProject.total_area}م2</p></div>
              <div className="bg-white p-6 rounded-xl shadow-sm"><p className="text-sm text-gray-500">عدد البدائل</p><p className="text-3xl font-bold text-gray-900">{mockAlternatives.length}</p></div>
              <div className="bg-white p-6 rounded-xl shadow-sm"><p className="text-sm text-gray-500">درجة الامتثال</p><p className="text-3xl font-bold text-green-600">{currentAlt.compliance.score}%</p></div>
              <div className="bg-white p-6 rounded-xl shadow-sm"><p className="text-sm text-gray-500">المخاطر</p><p className="text-3xl font-bold text-orange-600">{mockRisks.length}</p></div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-bold mb-4">عرض ثلاثي الأبعاد - {currentAlt.name}</h2>
              <DesignViewer3D layout={currentAlt.layout} />
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-bold mb-4">مقارنة البدائل</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockAlternatives.map((alt, idx) => (
                  <div key={alt.id} onClick={() => setSelectedAlternative(idx)} className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedAlternative === idx ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-lg">{alt.name}</h3>
                      {alt.compliance.status === 'compliant' ? <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">✅ ممتثل</span> : <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">❌ غير ممتثل</span>}
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div><p className="text-gray-500">الكفاءة</p><p className="font-semibold">{alt.metrics.efficiency_ratio * 100}%</p></div>
                      <div><p className="text-gray-500">الطاقة</p><p className="font-semibold">⭐ {alt.metrics.energy_score}/5</p></div>
                      <div><p className="text-gray-500">الإضاءة</p><p className="font-semibold">☀️ {alt.metrics.daylight_score}/5</p></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {selectedTab === 'design' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-bold mb-4">عرض التصميم ثلاثي الأبعاد</h2>
              <DesignViewer3D layout={currentAlt.layout} height={3} />
              <div className="mt-6">
                <h3 className="font-bold mb-3">قائمة الغرف</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentAlt.layout.map((room, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div><p className="font-medium">{room.name}</p><p className="text-sm text-gray-500">{room.category}</p></div>
                      <span className="text-lg font-bold text-blue-600">{room.area}م2</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {selectedTab === 'compliance' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-bold mb-4">حالة الامتثال للوائح</h2>
              <div className="flex items-center gap-6">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#eee" strokeWidth="3" />
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={currentAlt.compliance.score >= 80 ? '#22c55e' : '#ef4444'} strokeWidth="3" strokeDasharray={`${currentAlt.compliance.score}, 100`} />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center"><span className="text-2xl font-bold">{currentAlt.compliance.score}%</span></div>
                </div>
                <div>
                  {currentAlt.compliance.status === 'compliant' ? <p className="text-green-600 font-bold text-lg">✅ التصميم ممتثل للوائح</p> : <p className="text-red-600 font-bold text-lg">❌ هناك انتهاكات للوائح</p>}
                  <p className="text-gray-500">بناءً على RNU (اللوائح الوطنية للبناء)</p>
                </div>
              </div>
            </div>
            {mockViolations.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold mb-4 text-red-600">⚠️ الانتهاكات المكتشفة</h3>
                <div className="space-y-3">
                  {mockViolations.map((v, idx) => (
                    <div key={idx} className="p-4 bg-red-50 border-l-4 border-red-500 rounded">
                      <p className="font-bold text-red-700">{v.description}</p>
                      <p className="text-sm text-red-600 mt-1">💡 الحل: {v.fix}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold mb-4">📋 اللوائح المعمول بها</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[{ rule: 'الارتداد الأمامي', value: '≥ 3.0 متر' }, { rule: 'نسبة التغطية', value: '≤ 45%' }, { rule: 'الارتفاع الأقصى', value: '≤ 12 متر (3 طوابق)' }, { rule: 'المساحات الخضراء', value: '≥ 15% من الموقع' }].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-gray-600">{item.rule}</span>
                    <span className="font-bold text-blue-600">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {selectedTab === 'risks' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-bold mb-4">⚠️ تحليل المخاطر</h2>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center"><span className="text-3xl">⚠️</span></div>
                <div>
                  <p className="text-lg font-bold">مستوى المخاطر: متوسط</p>
                  <p className="text-gray-500">تم تحديد {mockRisks.length} مخاطر محتملة</p>
                </div>
              </div>
              <div className="space-y-3">
                {mockRisks.map((risk, idx) => (
                  <div key={idx} className={`p-4 rounded-lg border-l-4 ${risk.severity === 'high' ? 'bg-red-50 border-red-500' : 'bg-orange-50 border-orange-500'}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-bold">{risk.severity === 'high' ? '🔴' : '🟠'} {risk.description}</p>
                        <p className="text-sm text-gray-600 mt-1">الاحتمالية: {(risk.probability * 100).toFixed(0)}%</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${risk.severity === 'high' ? 'bg-red-200 text-red-800' : 'bg-orange-200 text-orange-800'}`}>{risk.severity === 'high' ? 'عالية' : 'متوسطة'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold mb-4">💡 التوصيات</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2"><span className="text-green-500">✅</span><span>إنشاء احتياطي مالي 15% للطوارئ</span></li>
                <li className="flex items-start gap-2"><span className="text-green-500">✅</span><span>إضافة Buffer 10% للجدول الزمني</span></li>
                <li className="flex items-start gap-2"><span className="text-green-500">✅</span><span>متابعة أسبوعية مع المقاولين</span></li>
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
