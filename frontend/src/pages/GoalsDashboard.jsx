import React, { useEffect, useState, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { goalService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, Pencil, Trash2, CheckCircle, X, AlertCircle, Loader2 } from 'lucide-react';

const fmt = (n) =>
  `₹${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

const CATEGORIES = [
  { value: 'other',     label: '🎯 Other' },
  { value: 'vehicle',   label: '🚗 Vehicle' },
  { value: 'travel',    label: '✈️ Travel' },
  { value: 'gadget',    label: '💻 Gadget' },
  { value: 'education', label: '🎓 Education' },
  { value: 'home',      label: '🏠 Home' },
  { value: 'health',    label: '❤️ Health' },
  { value: 'emergency', label: '🛡️ Emergency' },
];

const EMOJIS = ['🎯','🚗','✈️','💻','🎓','🏠','❤️','🛡️','🌟','💰','🎸','🏋️'];

const EMPTY_FORM = {
  goalName: '', targetAmount: '', monthlySavingCapacity: '',
  currentSaved: '', targetDate: '', category: 'other', emoji: '🎯',
};

const inputCls = 'w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400';
const labelCls = 'block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5';

// ── GoalCard ──────────────────────────────────────────────────────────────────
const GoalCard = ({ goal, onEdit, onDelete, onComplete }) => {
  const { t } = useLanguage();
  const pct         = goal.percentage ?? Math.min(100, Math.round(((goal.currentSaved || 0) / goal.targetAmount) * 100));
  const remaining   = goal.remaining  ?? Math.max(0, goal.targetAmount - (goal.currentSaved || 0));
  const months      = goal.monthsNeeded;
  const estDate     = goal.estimatedDate ? new Date(goal.estimatedDate) : null;
  const isCompleted = goal.isCompleted;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -3 }}
      className={`stripe-card bg-white p-6 flex flex-col justify-between relative ${isCompleted ? 'opacity-75' : ''}`}
    >
      {isCompleted && (
        <div className="absolute top-3 right-3">
          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-bold">✅ {t('g_completed')}</span>
        </div>
      )}

      <div>
        <div className="flex items-start gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-2xl shrink-0">{goal.emoji || '🎯'}</div>
          <div className="flex-1 min-w-0">
            <h3 className="font-extrabold text-slate-900 text-sm truncate">{goal.goalName}</h3>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">{t('g_cat_' + goal.category, goal.category)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase">{t('g_target')}</p>
            <p className="text-sm font-extrabold text-slate-900 mt-0.5">{fmt(goal.targetAmount)}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase">{t('g_saved')}</p>
            <p className="text-sm font-extrabold text-emerald-600 mt-0.5">{fmt(goal.currentSaved || 0)}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase">{t('g_monthly')}</p>
            <p className="text-sm font-extrabold text-indigo-600 mt-0.5">{fmt(goal.monthlySavingCapacity)}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase">{t('g_remaining')}</p>
            <p className="text-sm font-extrabold text-rose-600 mt-0.5">{fmt(remaining)}</p>
          </div>
        </div>

        {estDate && !isCompleted && (
          <div className="mb-4 text-xs text-slate-500 flex items-center gap-1.5">
            <span>⏱</span>
            <span>
              {t('g_est_completion')}: <strong className="text-slate-700">{estDate.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}</strong>
              {months != null && ` (~${months} ${months === 1 ? t('g_month_singular') : t('g_months_plural')})`}
            </span>
          </div>
        )}

        <div>
          <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase mb-1.5">
            <span>{t('g_progress')}</span><span>{pct}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className={`h-full transition-all duration-700 ${isCompleted ? 'bg-emerald-500' : 'bg-indigo-600'}`} style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      {!isCompleted && (
        <div className="flex gap-2 mt-5 pt-4 border-t border-slate-100">
          <button onClick={() => onEdit(goal)} title={t('g_edit')}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer transition-all">
            <Pencil className="w-3 h-3" /> {t('g_edit')}
          </button>
          <button onClick={() => onComplete(goal._id)} title={t('g_complete')}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg cursor-pointer transition-all">
            <CheckCircle className="w-3 h-3" /> {t('g_complete')}
          </button>
          <button onClick={() => onDelete(goal._id)} title={t('g_delete')}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg cursor-pointer transition-all ml-auto">
            <Trash2 className="w-3 h-3" /> {t('g_delete')}
          </button>
        </div>
      )}
    </motion.div>
  );
};

// ── GoalForm Modal ────────────────────────────────────────────────────────────
const GoalFormModal = ({ initial, onSave, onClose, loading, error }) => {
  const { t } = useLanguage();
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const derivedTarget = form.targetAmount && form.monthlySavingCapacity
    ? Math.ceil(Number(form.targetAmount) / Number(form.monthlySavingCapacity))
    : null;

  const isEdit = !!(initial && initial._id);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <motion.div initial={{ scale: 0.93 }} animate={{ scale: 1 }} exit={{ scale: 0.93 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative my-4">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 cursor-pointer"><X className="w-5 h-5" /></button>

        <h2 className="text-lg font-extrabold text-slate-900 mb-5 flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-600" />
          {isEdit ? t('g_edit_goal') : t('g_create_goal')}
        </h2>

        {/* Emoji picker */}
        <div className="mb-4">
          <label className={labelCls}>{t('g_icon')}</label>
          <div className="flex flex-wrap gap-2">
            {EMOJIS.map(e => (
              <button key={e} onClick={() => set('emoji', e)} type="button"
                className={`text-xl w-9 h-9 rounded-xl border transition-all cursor-pointer ${form.emoji === e ? 'border-indigo-400 bg-indigo-50 scale-110' : 'border-slate-200 hover:border-slate-300'}`}>
                {e}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className={labelCls}>{t('g_goal_name')}</label>
            <input className={inputCls} value={form.goalName} onChange={e => set('goalName', e.target.value)} placeholder="e.g. Electric Bike, Goa Trip" />
          </div>
          <div>
            <label className={labelCls}>{t('g_target_amount')}</label>
            <input type="number" className={inputCls} value={form.targetAmount} onChange={e => set('targetAmount', e.target.value)} placeholder="e.g. 80000" />
          </div>
          <div>
            <label className={labelCls}>{t('g_monthly_contribution')}</label>
            <input type="number" className={inputCls} value={form.monthlySavingCapacity} onChange={e => set('monthlySavingCapacity', e.target.value)} placeholder="e.g. 5000" />
          </div>
          <div>
            <label className={labelCls}>{t('g_already_saved')}</label>
            <input type="number" className={inputCls} value={form.currentSaved} onChange={e => set('currentSaved', e.target.value)} placeholder="e.g. 10000" />
          </div>
          <div>
            <label className={labelCls}>{t('g_category')}</label>
            <select className={inputCls} value={form.category} onChange={e => set('category', e.target.value)}>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{t('g_cat_' + c.value, c.label)}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className={labelCls}>{t('g_target_date')}</label>
            <input type="date" className={inputCls} value={form.targetDate} onChange={e => set('targetDate', e.target.value)} />
          </div>
        </div>

        {derivedTarget && (
          <p className="text-xs text-indigo-600 font-semibold mt-3">
            📌 At ₹{Number(form.monthlySavingCapacity).toLocaleString('en-IN')}/month → approximately <strong>{derivedTarget} {derivedTarget === 1 ? t('g_month_singular') : t('g_months_plural')}</strong> to reach your goal.
          </p>
        )}

        {error && (
          <div className="mt-4 flex items-center gap-2 text-xs text-rose-600 font-semibold bg-rose-50 border border-rose-200 rounded-xl px-4 py-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        <button onClick={() => onSave(form)} disabled={loading}
          className="mt-5 w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold disabled:opacity-50 cursor-pointer transition-all flex items-center justify-center gap-2">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> {t('g_saving')}</> : (isEdit ? t('g_save_changes') : t('g_create_goal_btn'))}
        </button>
      </motion.div>
    </motion.div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const GoalsDashboard = () => {
  const { t } = useLanguage();
  const [goals, setGoals]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [modal, setModal]         = useState(null);  // null | 'create' | goalObject
  const [saving, setSaving]       = useState(false);
  const [formError, setFormError] = useState('');
  const [toast, setToast]         = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const loadGoals = useCallback(async () => {
    try {
      setLoading(true);
      const res = await goalService.list();
      setGoals(res.data.goals || []);
      console.log('[Goals] Loaded:', res.data.goals?.length, 'goals');
    } catch (e) {
      console.error('[Goals] Load failed:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadGoals(); }, [loadGoals]);

  const handleSave = async (form) => {
    setFormError('');
    if (!form.goalName?.trim())           return setFormError(t('g_name_required'));
    if (!form.targetAmount || Number(form.targetAmount) <= 0)
                                           return setFormError(t('g_target_gt_0'));
    if (!form.monthlySavingCapacity || Number(form.monthlySavingCapacity) <= 0)
                                           return setFormError(t('g_contribution_gt_0'));

    setSaving(true);
    try {
      const isEdit = !!(modal && modal._id);
      const payload = {
        goalName:              form.goalName.trim(),
        targetAmount:          Number(form.targetAmount),
        monthlySavingCapacity: Number(form.monthlySavingCapacity),
        currentSaved:          Number(form.currentSaved) || 0,
        category:              form.category || 'other',
        emoji:                 form.emoji    || '🎯',
        ...(form.targetDate && { targetDate: form.targetDate }),
      };

      if (isEdit) {
        await goalService.update(modal._id, payload);
        showToast(`✅ ${t('g_toast_updated', 'Goal updated!')}`);
      } else {
        await goalService.create(payload);
        window.dispatchEvent(new CustomEvent('add-notification', {
          detail: { text: `🎯 Goal created: ${form.goalName} (Target: ${fmt(form.targetAmount)})` }
        }));
        showToast(`🎯 ${t('g_toast_created', 'Goal created!')}`);
      }
      setModal(null);
      await loadGoals();
    } catch (e) {
      setFormError(e.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (goalId) => {
    if (!window.confirm(t('g_delete_confirm'))) return;
    try {
      await goalService.remove(goalId);
      showToast(t('g_toast_deleted'));
      setGoals(g => g.filter(x => x._id !== goalId));
    } catch (e) {
      showToast(t('g_toast_failed_delete'));
    }
  };

  const handleComplete = async (goalId) => {
    try {
      await goalService.markComplete(goalId);
      showToast(t('g_toast_completed'));
      await loadGoals();
    } catch (e) {
      showToast(t('g_toast_failed_complete'));
    }
  };

  const handleEdit = (goal) => {
    setFormError('');
    setModal({
      ...goal,
      targetDate: goal.targetDate ? new Date(goal.targetDate).toISOString().split('T')[0] : '',
    });
  };

  const activeGoals    = goals.filter(g => !g.isCompleted);
  const completedGoals = goals.filter(g => g.isCompleted);

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Target className="w-8 h-8 text-indigo-600" />
            {t('g_builder_title')}
          </h1>
          <p className="mt-1 text-slate-500 text-sm">{t('g_builder_desc')}</p>
        </div>
        <button onClick={() => { setFormError(''); setModal('create'); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-200 cursor-pointer transition-all active:scale-95">
          <Plus className="w-4 h-4" /> {t('g_new_goal')}
        </button>
      </div>

      {/* Summary bar */}
      {goals.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: t('g_total_goals'), val: goals.length, color: 'text-indigo-600' },
            { label: t('g_active'), val: activeGoals.length, color: 'text-amber-600' },
            { label: t('g_completed'), val: completedGoals.length, color: 'text-emerald-600' },
          ].map(s => (
            <div key={s.label} className="stripe-card bg-white p-4 text-center">
              <p className={`text-2xl font-extrabold ${s.color}`}>{s.val}</p>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Goals grid */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(n => <div key={n} className="h-64 bg-slate-100 animate-pulse rounded-2xl" />)}
        </div>
      ) : (
        <>
          {activeGoals.length === 0 && completedGoals.length === 0 ? (
            <div className="stripe-card bg-slate-50 border-2 border-dashed border-slate-200 p-12 text-center">
              <Target className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-semibold text-sm mb-2">{t('g_no_goals')}</p>
              <p className="text-slate-400 text-xs mb-6">{t('g_no_goals_desc')}</p>
              <button onClick={() => { setFormError(''); setModal('create'); }}
                className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold cursor-pointer hover:bg-indigo-700">
                {t('g_create_first')}
              </button>
            </div>
          ) : (
            <>
              {activeGoals.length > 0 && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {activeGoals.map(g => (
                    <GoalCard key={g._id} goal={g} onEdit={handleEdit} onDelete={handleDelete} onComplete={handleComplete} />
                  ))}
                </div>
              )}
              {completedGoals.length > 0 && (
                <>
                  <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">{t('g_completed_goals')}</h2>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {completedGoals.map(g => (
                      <GoalCard key={g._id} goal={g} onEdit={handleEdit} onDelete={handleDelete} onComplete={handleComplete} />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <GoalFormModal
            initial={modal === 'create' ? null : modal}
            onSave={handleSave}
            onClose={() => setModal(null)}
            loading={saving}
            error={formError}
          />
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-xl z-50">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default GoalsDashboard;
