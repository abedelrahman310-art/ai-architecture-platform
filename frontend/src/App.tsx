import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { programsApi } from './lib/api';

function App() {
  const [showForm, setShowForm] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '', description: '', location: '', client_name: '',
    total_area: 0, building_type: 'residential' as const,
  });
  const queryClient = useQueryClient();

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => (await programsApi.projects.list()).data,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => programsApi.projects.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['projects'] }); setShowForm(false); },
  });

  const generateMutation = useMutation({
    mutationFn: (id: number) => programsApi.projects.generateAlternatives(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['projects'] }); alert('تم التوليد بنجاح!'); },
  });

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); createMutation.mutate(newProject); };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">منصة العمارة الذكية</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-6 py-3 rounded mb-6">
          {showForm ? 'إخفاء' : '+ مشروع جديد'}
        </button>
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-8">
            <input type="text" placeholder="اسم المشروع" value={newProject.name}
              onChange={(e) => setNewProject({...newProject, name: e.target.value})} className="border p-3 rounded w-full mb-4" required />
            <input type="text" placeholder="الموقع" value={newProject.location}
              onChange={(e) => setNewProject({...newProject, location: e.target.value})} className="border p-3 rounded w-full mb-4" />
            <input type="number" placeholder="المساحة" value={newProject.total_area || ''}
              onChange={(e) => setNewProject({...newProject, total_area: parseFloat(e.target.value)||0})} className="border p-3 rounded w-full mb-4" />
            <button type="submit" className="bg-green-600 text-white px-6 py-3 rounded w-full">إنشاء</button>
          </form>
        )}
        <div className="grid gap-4">
          {projects?.map((p: any) => (
            <div key={p.id} className="bg-white p-6 rounded shadow">
              <h2 className="text-xl font-semibold">{p.name}</h2>
              <p className="text-gray-600">{p.location} • {p.total_area} م2</p>
              <button onClick={() => generateMutation.mutate(p.id)} className="mt-4 bg-purple-600 text-white px-4 py-2 rounded">
                ✨ توليد بدائل
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default App;
