'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, db } from '@/firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  collection, query, where, orderBy, onSnapshot, 
  addDoc, updateDoc, deleteDoc, doc 
} from 'firebase/firestore';
import { 
  format, startOfMonth, endOfMonth, eachDayOfInterval, 
  isSameDay, addMonths, subMonths, isToday, startOfWeek, endOfWeek 
} from 'date-fns';
import { 
  Lock, ShieldCheck, Clock, LayoutGrid, Plus, Trash2, 
  CheckCircle2, AlertCircle, Zap, Layers, Users, Wind, 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, Edit3, FileText 
} from 'lucide-react';

// --- Constants & Types ---
const SPRINT_END_DATE = new Date('2026-04-27T00:00:00');

type Task = {
  id: string;
  title: string;
  description?: string;
  dueDate?: number;
  urgent: boolean;
  important: boolean;
  completed: boolean;
  createdAt: number;
  dependencies: string[];
  isMandate: boolean;
};

// --- Sub-Components ---
const CountdownEngine = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, complete: false });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = SPRINT_END_DATE.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft(prev => ({ ...prev, complete: true }));
        clearInterval(timer);
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds, complete: false });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (timeLeft.complete) {
    return (
      <div className="bg-amber-600/10 border border-amber-500/20 rounded-xl p-6 text-center">
        <h3 className="text-amber-500 font-bold tracking-widest uppercase text-xl">Sprint Complete. Execute.</h3>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      {[
        { label: 'Days', value: timeLeft.days },
        { label: 'Hours', value: timeLeft.hours },
        { label: 'Mins', value: timeLeft.minutes },
        { label: 'Secs', value: timeLeft.seconds },
      ].map((item) => (
        <div key={item.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-white tracking-tighter mb-1">{item.value.toString().padStart(2, '0')}</div>
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium">{item.label}</div>
        </div>
      ))}
    </div>
  );
};

const TaskCard = ({ task, allTasks, onToggle, onDelete, onSelect }: any) => {
  // Check if dependencies are blocking this task
  const blockedBy = useMemo(() => {
    if (!task.dependencies) return [];
    return task.dependencies
      .map((depId: string) => allTasks.find((t: any) => t.id === depId))
      .filter((t: any) => t && !t.completed); // If dependency is NOT completed
  }, [task.dependencies, allTasks]);

  const isBlocked = blockedBy.length > 0;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`group flex items-center justify-between p-3 rounded-lg border transition-all ${
        task.completed 
          ? 'bg-zinc-900/50 border-zinc-800/50 opacity-50' 
          : isBlocked
          ? 'bg-zinc-900/30 border-zinc-800/50'
          : 'bg-black border-zinc-900 hover:border-amber-500/30'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer" onClick={() => onSelect(task)}>
        {/* Checkbox */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            if (isBlocked && !task.completed) return;
            onToggle(task.id, task.completed); // Pass the current boolean state
          }}
          disabled={isBlocked && !task.completed}
          className={`flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${
            task.completed 
              ? 'bg-emerald-500 border-emerald-500' 
              : isBlocked 
              ? 'border-zinc-800 bg-zinc-950 cursor-not-allowed'
              : 'border-zinc-700 hover:border-amber-500'
          }`}
        >
          {task.completed && <CheckCircle2 className="w-3 h-3 text-black" />}
          {isBlocked && !task.completed && <Lock className="w-2.5 h-2.5 text-zinc-700" />}
        </button>

        {/* Task Name & Meta */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold uppercase tracking-tight block truncate ${task.completed ? 'line-through text-zinc-600' : 'text-zinc-300'}`}>
              {task.title}
            </span>
            {isBlocked && !task.completed && (
              <span className="flex-shrink-0 text-[8px] font-bold uppercase tracking-widest text-rose-500/50 bg-rose-500/5 px-1.5 py-0.5 rounded border border-rose-500/10">
                Blocked
              </span>
            )}
            {task.isMandate && (
              <ShieldCheck className="w-3 h-3 text-amber-500/50 shrink-0" />
            )}
          </div>
        </div>
      </div>

      {/* Hover Actions (The Pencil & Trash) */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={(e) => { e.stopPropagation(); onSelect(task); }} 
          className="p-1.5 text-zinc-600 hover:text-amber-500 transition-colors"
        >
          <Edit3 className="w-3.5 h-3.5" />
        </button>
        {!task.isMandate && (
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(task.id); }} 
            className="p-1.5 text-zinc-600 hover:text-rose-400 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

// --- Main Page Component ---
export default function CommandPage() {
    const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
    const [sortBy, setSortBy] = useState<'newest' | 'alphabetical' | 'oldest'>('newest');
    const [selectedTask, setSelectedTask] = useState<any | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTaskName, setNewTaskName] = useState('');
    const [isUrgent, setIsUrgent] = useState(false);
    const [isImportant, setIsImportant] = useState(false);
    const [view, setView] = useState<'matrix' | 'calendar'>('matrix');
    const [isLoading, setIsLoading] = useState(true);
  
    // 1. THE LIVE DATA STREAM
    useEffect(() => {
      const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
        if (user && user.email) {
          const q = query(
            collection(db, "tasks"),
            where("email", "==", user.email), // Matches our secure rule
            orderBy("createdAt", "desc")
          );
  
          const unsubTasks = onSnapshot(q, 
            (snapshot) => {
              const fetchedTasks = snapshot.docs.map(doc => ({ 
                id: doc.id, 
                ...doc.data() 
              })) as Task[];
              setTasks(fetchedTasks);
              setIsLoading(false);
            },
            (error) => {
              console.error("Firestore Error (Click the Index link if permission denied!):", error);
              setIsLoading(false);
            }
          );
          return () => unsubTasks();
        } else {
          setIsLoading(false);
        }
      });
  
      return () => unsubscribeAuth();
    }, []);
  
    // 2. FIRESTORE ACTIONS
    const addTask = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newTaskName.trim() || !auth.currentUser?.email) return;
  
      await addDoc(collection(db, "tasks"), {
        title: newTaskName,
        urgent: isUrgent,
        important: isImportant,
        completed: false,
        createdAt: Date.now(),
        dueDate: Date.now(),
        dependencies: [],
        email: auth.currentUser.email,
        isMandate: false // Ensures Fellows can create it per our security rules
      });
  
      setNewTaskName('');
      setIsUrgent(false);
      setIsImportant(false);
    };
  
    const toggleTask = async (id: string) => {
      const task = tasks.find(t => t.id === id);
      if (task) {
        await updateDoc(doc(db, "tasks", id), { completed: !task.completed });
      }
    };
  
    const deleteTask = async (id: string) => {
      if (confirm("Decommission this objective?")) {
        await deleteDoc(doc(db, "tasks", id));
      }
    };
  
    const updateTask = async (updatedTask: Task) => {
      const taskRef = doc(db, "tasks", updatedTask.id);
      // Remove the ID before sending to Firestore
      const { id, ...taskData } = updatedTask; 
      await updateDoc(taskRef, taskData);
      setSelectedTask(null);
    };

    const handleUpdateTask = async (updatedTask: any) => {
      const taskRef = doc(db, "tasks", updatedTask.id);
      // Destructure to remove the 'id' so we don't accidentally save it inside the document fields
      const { id, ...taskData } = updatedTask; 
      await updateDoc(taskRef, taskData);
      setSelectedTask(null); // Closes the modal after saving
    };
  
    const matrix = useMemo(() => {
      let filtered = [...tasks];
      
      // Apply Status Filter (Using boolean 'completed')
      if (filter === 'active') filtered = filtered.filter(t => !t.completed);
      if (filter === 'completed') filtered = filtered.filter(t => t.completed);
      
      // Apply Sorting
      filtered.sort((a, b) => {
        if (sortBy === 'alphabetical') return a.title.localeCompare(b.title);
        if (sortBy === 'oldest') return a.createdAt - b.createdAt;
        return b.createdAt - a.createdAt; // default newest
      });
  
      // Route to Quadrants (Using boolean 'important' and 'urgent')
      return {
        boardroom: filtered.filter(t => t.important && t.urgent),
        architecture: filtered.filter(t => t.important && !t.urgent),
        delegation: filtered.filter(t => !t.important && t.urgent),
        noise: filtered.filter(t => !t.important && !t.urgent),
      };
    }, [tasks, filter, sortBy]);
  
    if (isLoading) {
      return (
        <div className="h-96 flex flex-col items-center justify-center">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Establishing Secure Link...</p>
        </div>
      );
    }

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header className="border-b border-zinc-900 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-8">
      <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
            <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-5 h-5 text-amber-500" />
                <span className="text-[10px] font-bold tracking-[0.3em] text-zinc-500 uppercase">System Active</span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-white uppercase mb-2">Command Center</h1>
            <p className="text-zinc-400 font-medium tracking-tight text-sm">
                Phase 1 • <span className="text-white">The Auditor</span>
            </p>
            </div>
            <div className="w-full md:w-auto">
            <CountdownEngine />
            </div>
        </div>
        </div>
      </header>

      {/* Initialize Objective */}
      <section className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-amber-500/10 rounded-lg">
            <Plus className="w-5 h-5 text-amber-500" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">Initialize 10xB Objective</h2>
        </div>
        <form onSubmit={addTask} className="flex flex-col lg:flex-row gap-6">
          <input type="text" value={newTaskName} onChange={(e) => setNewTaskName(e.target.value)} placeholder="Describe the high-impact task..." className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 focus:outline-none focus:border-amber-500 text-white" />
          <div className="flex flex-wrap items-center gap-4">
            <button type="button" onClick={() => setIsUrgent(!isUrgent)} className={`flex items-center gap-2 px-6 py-4 rounded-xl border text-[10px] font-bold uppercase tracking-widest ${isUrgent ? 'bg-red-500/10 border-red-500/50 text-red-500' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}><Zap className="w-4 h-4" /> Urgent</button>
            <button type="button" onClick={() => setIsImportant(!isImportant)} className={`flex items-center gap-2 px-6 py-4 rounded-xl border text-[10px] font-bold uppercase tracking-widest ${isImportant ? 'bg-amber-500/10 border-amber-500/50 text-amber-500' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}><ShieldCheck className="w-4 h-4" /> Important</button>
            <button type="submit" disabled={!newTaskName.trim()} className="bg-white text-black px-8 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-zinc-200 disabled:opacity-50 ml-auto lg:ml-0">Deploy</button>
          </div>
        </form>
      </section>

      {/* FILTERS & TOGGLES ENGINE */}
      <section className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-zinc-900/10 border border-zinc-800/50 rounded-xl p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-zinc-900/50 p-1 rounded-lg border border-zinc-800">
            <button onClick={() => setView('matrix')} className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${view === 'matrix' ? 'bg-white text-black' : 'text-zinc-500 hover:text-zinc-300'}`}>Matrix</button>
            <button onClick={() => setView('calendar')} className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${view === 'calendar' ? 'bg-white text-black' : 'text-zinc-500 hover:text-zinc-300'}`}>Calendar</button>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2 bg-zinc-900/50 p-1 rounded-lg border border-zinc-800">
            {(['all', 'active', 'completed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${filter === f ? 'bg-white text-black' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-zinc-800 hidden sm:block" />

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'alphabetical' | 'oldest')}
              className="bg-black border border-zinc-800 rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-300 focus:outline-none focus:border-amber-500 transition-all cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="alphabetical">Alphabetical</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </section>

      {/* DYNAMIC VIEW RENDERING */}
      {view === 'matrix' ? (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { title: 'Q1: Boardroom', tasks: matrix.boardroom, accent: 'text-red-500', icon: AlertCircle, bg: 'bg-red-500/5' },
            { title: 'Q2: Architecture', tasks: matrix.architecture, accent: 'text-amber-500', icon: Layers, bg: 'bg-amber-500/5' },
            { title: 'Q3: Delegation', tasks: matrix.delegation, accent: 'text-zinc-400', icon: Users, bg: 'bg-zinc-800/50' },
            { title: 'Q4: Noise', tasks: matrix.noise, accent: 'text-zinc-600', icon: Wind, bg: 'bg-zinc-900/50' }
          ].map((quad) => (
            <div key={quad.title} className="bg-zinc-900/20 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col min-h-[400px]">
              <div className={`p-6 border-b border-zinc-800 ${quad.bg} flex justify-between`}>
                <h3 className={`font-bold uppercase tracking-widest text-sm ${quad.accent} flex items-center gap-2`}>
                  <quad.icon className="w-4 h-4" /> {quad.title}
                </h3>
              </div>
              <div className="p-6 flex-1 space-y-3 overflow-y-auto max-h-[400px]">
                {quad.tasks.map(t => (
                  <TaskCard 
                    key={t.id} 
                    task={t} 
                    allTasks={tasks} 
                    onToggle={(id: string, currentState: boolean) => updateDoc(doc(db, "tasks", id), { completed: !currentState })} 
                    onDelete={(id: string) => deleteDoc(doc(db, "tasks", id))} 
                    onSelect={setSelectedTask} 
                  />
                ))}
              </div>
            </div>
          ))}
        </section>
      ) : (
        <CalendarView tasks={tasks} onSelectTask={setSelectedTask} />
      )}
      {/* THE OBJECTIVE ANALYSIS MODAL */}
      <AnimatePresence>
        {selectedTask && (
          <TaskModal 
            task={selectedTask} 
            allTasks={tasks}
            onClose={() => setSelectedTask(null)} 
            onSave={handleUpdateTask}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

const TaskModal = ({ task, allTasks, onClose, onSave }: { task: Task; allTasks: Task[]; onClose: () => void; onSave: (task: Task) => void }) => {
    const [editedTask, setEditedTask] = useState<Task>({ ...task });
  
    const toggleDependency = (id: string) => {
      setEditedTask(prev => ({
        ...prev,
        dependencies: prev.dependencies.includes(id)
          ? prev.dependencies.filter(d => d !== id)
          : [...prev.dependencies, id]
      }));
    };
  
    const availableTasks = allTasks.filter(t => t.id !== task.id);
  
    return (
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-zinc-900 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg"><FileText className="w-5 h-5 text-amber-500" /></div>
              <h3 className="font-bold tracking-tight uppercase text-sm text-white">Objective Analysis</h3>
              {/* Add a label that the task can't be edited if it's a mandate from admin i.e isMandate == true */}
              {task.isMandate && (
                <span className="flex-shrink-0 text-[8px] font-bold uppercase tracking-widest text-rose-500/50 bg-rose-500/5 px-1.5 py-0.5 rounded border border-rose-500/10">
                Admin Task - Can't Edit
              </span>
              )}
            </div>
            <button onClick={onClose} className="p-2 hover:bg-zinc-900 rounded-lg transition-colors"><X className="w-5 h-5 text-zinc-500" /></button>
          </div>
  
          <div className="p-8 space-y-6 overflow-y-auto max-h-[70vh]">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Task Designation</label>
              <input type="text" value={editedTask.title} disabled={editedTask.isMandate} onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-all" />
            </div>
  
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Strategic Context</label>
              <textarea value={editedTask.description || ''} disabled={editedTask.isMandate} onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })} placeholder="Add detailed operational context..." rows={3} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-all resize-none" />
            </div>
  
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Deadline</label>
                <input type="date" value={editedTask.dueDate ? format(editedTask.dueDate, 'yyyy-MM-dd') : ''} disabled={editedTask.isMandate} onChange={(e) => setEditedTask({ ...editedTask, dueDate: new Date(e.target.value).getTime() })} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-all [color-scheme:dark]" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Priority Matrix</label>
                <div className="flex gap-2">
                  <button onClick={() => setEditedTask({ ...editedTask, urgent: !editedTask.urgent })} disabled={editedTask.isMandate} className={`flex-1 py-3 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${editedTask.urgent ? 'bg-red-500/10 border-red-500/50 text-red-500' : 'bg-black border-zinc-800 text-zinc-600'}`}>Urgent</button>
                  <button onClick={() => setEditedTask({ ...editedTask, important: !editedTask.important })} disabled={editedTask.isMandate} className={`flex-1 py-3 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${editedTask.important ? 'bg-amber-500/10 border-amber-500/50 text-amber-500' : 'bg-black border-zinc-800 text-zinc-600'}`}>Important</button>
                </div>
              </div>
            </div>
  
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2"><Layers className="w-3 h-3" /> Operational Dependencies</label>
              <div className="bg-black border border-zinc-800 rounded-xl p-4 max-h-40 overflow-y-auto space-y-2">
                {availableTasks.length === 0 ? (
                  <p className="text-[10px] text-zinc-700 italic text-center py-4 uppercase tracking-widest">No other objectives available for dependency.</p>
                ) : (
                  availableTasks.map(t => (
                    <button key={t.id} onClick={() => toggleDependency(t.id)} disabled={editedTask.isMandate} className={`w-full flex items-center justify-between p-2 rounded-lg border transition-all ${editedTask.dependencies.includes(t.id) ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'bg-zinc-900/50 border-zinc-800 text-zinc-600 hover:border-zinc-700'}`}>
                      <span className="text-[10px] font-bold uppercase tracking-tight truncate">{t.title}</span>
                      {editedTask.dependencies.includes(t.id) && <CheckCircle2 className="w-3 h-3" />}
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
  
          <div className="p-6 bg-black border-t border-zinc-900 flex justify-end gap-4">
            <button onClick={onClose} className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-all">Abort</button>
            <button onClick={() => onSave(editedTask)} className="px-8 py-3 bg-white text-black rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all">Commit Changes</button>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const CalendarView = ({ tasks, onSelectTask }: { tasks: Task[]; onSelectTask: (task: Task) => void }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    
    // Date-fns logic to build the exact grid for the current month
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    
    const days = eachDayOfInterval({ start: startDate, end: endDate });
  
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black border border-zinc-900 rounded-2xl overflow-hidden"
      >
        {/* Calendar Header */}
        <div className="p-6 border-b border-zinc-900 flex items-center justify-between bg-zinc-950">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-zinc-900 rounded-lg">
              <CalendarIcon className="w-5 h-5 text-zinc-500" />
            </div>
            <h3 className="text-xl font-black tracking-tighter uppercase text-white">
              {format(currentDate, 'MMMM yyyy')}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={prevMonth} className="p-2 border border-zinc-800 hover:border-amber-500 rounded-lg transition-colors text-zinc-500 hover:text-amber-500">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={nextMonth} className="p-2 border border-zinc-800 hover:border-amber-500 rounded-lg transition-colors text-zinc-500 hover:text-amber-500">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
  
        {/* Days of the Week */}
        <div className="grid grid-cols-7 border-b border-zinc-900 bg-zinc-950/50">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="py-3 text-center text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 border-r border-zinc-900 last:border-0">
              {day}
            </div>
          ))}
        </div>
  
        {/* The Calendar Grid */}
        <div className="grid grid-cols-7">
          {days.map((day) => {
            // Filter tasks that belong to this specific day
            const dayTasks = tasks.filter(t => t.dueDate && isSameDay(new Date(t.dueDate), day));
            const isCurrentMonth = format(day, 'M') === format(monthStart, 'M');
            
            return (
              <div 
                key={day.toString()} 
                className={`min-h-[120px] p-2 border-r border-b border-zinc-900 last:border-r-0 transition-colors ${
                  !isCurrentMonth ? 'bg-zinc-950/30 opacity-50' : 'bg-black hover:bg-zinc-900/20'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[10px] font-bold tracking-widest ${
                    isToday(day) ? 'bg-amber-500 text-black px-1.5 py-0.5 rounded-sm' : 
                    isCurrentMonth ? 'text-zinc-400' : 'text-zinc-700'
                  }`}>
                    {format(day, 'd')}
                  </span>
                </div>
                
                {/* Task Render within the Day */}
                <div className="space-y-1">
                  {dayTasks.slice(0, 3).map(task => (
                    <button
                      key={task.id}
                      onClick={() => onSelectTask(task)}
                      className={`w-full text-left px-2 py-1 rounded-sm text-[9px] font-bold uppercase tracking-tight truncate border transition-colors ${
                        task.completed 
                          ? 'bg-zinc-900/50 border-zinc-800 text-zinc-600 line-through' 
                          : task.urgent && task.important
                          ? 'bg-red-500/10 border-red-500/30 text-red-500 hover:border-red-500/60'
                          : 'bg-amber-500/10 border-amber-500/30 text-amber-500 hover:border-amber-500/60'
                      }`}
                    >
                      {task.title}
                    </button>
                  ))}
                  {dayTasks.length > 3 && (
                    <div className="text-[8px] text-zinc-600 font-bold uppercase text-center mt-1">
                      + {dayTasks.length - 3} More
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    );
  };