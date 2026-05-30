import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { familyService } from '../services/api';
import FamilyDashboard from '../components/FamilyDashboard';
import { motion } from 'framer-motion';
import {
  Users,
  Sparkles,
  ChevronRight,
  Plus,
  Compass,
  ArrowRight,
  ShieldCheck,
  Cpu
} from 'lucide-react';

const FamilyDashboardPage = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [groupId, setGroupId] = useState('');
  const [customGroupName, setCustomGroupName] = useState('');
  const [group, setGroup] = useState(null);
  const [aiSummary, setAiSummary] = useState('');
  const [status, setStatus] = useState('idle');

  // Auto-fetch or seed family group on mount
  useEffect(() => {
    const initFamilyGroup = async () => {
      setStatus('loading');
      try {
        const res = await familyService.getMyGroup();
        setGroup(res.data.group);
        setGroupId(res.data.group._id);
        setAiSummary(res.data.aiSummary);
      } catch (error) {
        console.error('Error fetching user group:', error);
      } finally {
        setStatus('idle');
      }
    };
    initFamilyGroup();
  }, []);

  const handleTopup = async (amount, reason) => {
    if (!group?._id) return;
    try {
      const res = await familyService.topup(group._id, { amount, reason });
      setGroup(res.data.group);
      
      // Emit real-time notification
      window.dispatchEvent(new CustomEvent('add-notification', {
        detail: {
          text: `💰 Pool top-up: Credited $${amount} to family wallet for "${reason || 'General Pool'}".`,
          textKn: `💰 ಟಾಪ್-ಅಪ್ ಯಶಸ್ಸು: "${reason || 'ಸಾಮಾನ್ಯ ಪೂಲ್'}" ಗಾಗಿ $${amount} ಹಣವನ್ನು ಕುಟುಂಬ ವಾಲೆಟ್‌ಗೆ ಜಮೆ ಮಾಡಲಾಗಿದೆ.`
        }
      }));
    } catch (err) {
      console.error(err);
      alert('Wallet top-up failed. Please check network.');
    }
  };

  const handleInvite = async (email, role, nickname, monthlyLimit) => {
    if (!group?._id) return false;
    try {
      const res = await familyService.invite({
        groupId: group._id,
        email,
        role,
        nickname,
        monthlyLimit: Number(monthlyLimit) || 0
      });
      setGroup(res.data.group);
      
      // Dispatch real-time notification
      window.dispatchEvent(new CustomEvent('add-notification', {
        detail: {
          text: `👥 Family: Added ${nickname} (${role}) to your family group ecosystem!`,
          textKn: `👥 ಕುಟುಂಬ: ನಿಮ್ಮ ಕುಟುಂಬ ಗುಂಪಿಗೆ ${nickname} (${role}) ರನ್ನು ಸೇರಿಸಲಾಗಿದೆ!`
        }
      }));
      return true;
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to add family member. Ensure the user email is registered.');
      return false;
    }
  };

  const fetchDashboard = async (id) => {
    if (!id.trim()) {
      alert(t('inviteCodeRequired'));
      return;
    }
    setStatus('loading');
    try {
      const res = await familyService.dashboard(id);
      setGroup(res.data.group);
      setAiSummary(res.data.aiSummary);
    } catch (error) {
      console.error(error);
      alert('Group ID not found or server database offline.');
    } finally {
      setStatus('idle');
    }
  };

  const createGroup = async () => {
    setStatus('loading');
    const nameToUse = customGroupName.trim() || `${user.name || 'Harshini'}'s Family`;
    try {
      const res = await familyService.create({ groupName: nameToUse });
      setGroup(res.data.group);
      setGroupId(res.data.group._id);
      setAiSummary('Family group ecosystem created successfully. Share your Group ID to link family members.');
      
      // Dispatch notification
      window.dispatchEvent(new CustomEvent('add-notification', {
        detail: {
          text: `🎉 Created new family group: "${nameToUse}"!`,
          textKn: `🎉 ಹೊಸ ಕುಟುಂಬ ಗುಂಪನ್ನು ರಚಿಸಲಾಗಿದೆ: "${nameToUse}"!`
        }
      }));
    } catch (error) {
      console.error(error);
      alert('Failed to create family group.');
    } finally {
      setStatus('idle');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-4xl mx-auto"
    >
      {/* Title */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-8 h-8 text-indigo-600 animate-pulse" />
            {t('familyTitle')}
          </h1>
          <p className="mt-1 text-slate-500 text-sm font-medium">
            {t('familyDesc')}
          </p>
        </div>
        <span className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-xs font-bold text-indigo-700">
          <Cpu className="w-3.5 h-3.5" />
          {t('multiUserSync')}
        </span>
      </div>

      {/* Control Console */}
      <div className="stripe-card bg-white p-6 md:p-8">
        <h3 className="text-slate-900 font-bold text-base tracking-tight mb-6">{t('groupManagement')}</h3>

        <div className="grid gap-6 md:grid-cols-2">
          
          {/* Creator panel */}
          <div className="flex flex-col justify-between p-5 bg-slate-50 border border-slate-200/50 rounded-2xl">
            <div>
              <h4 className="text-sm font-bold text-slate-800">{t('establishGroup')}</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {t('establishGroupDesc')}
              </p>
              <input
                value={customGroupName}
                onChange={(e) => setCustomGroupName(e.target.value)}
                placeholder={`${user.name || 'Harshini'}'s Family`}
                className="mt-4 w-full text-xs bg-white border border-slate-200 rounded-xl px-4 py-2.5 focus:bg-white"
              />
            </div>
            <button
              onClick={createGroup}
              disabled={status === 'loading'}
              className="mt-6 w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/10 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>{t('createNewEcosystem')}</span>
            </button>
          </div>

          {/* Loader panel */}
          <div className="flex flex-col justify-between p-5 bg-slate-50 border border-slate-200/50 rounded-2xl">
            <div>
              <label className="block text-sm font-bold text-slate-800">{t('ecosystemConnectionId')}</label>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {t('provideConnectionIdDesc')}
              </p>
              <input
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
                placeholder="e.g. 607f1f77bcf86cd..."
                className="mt-4 w-full text-xs bg-white border border-slate-200 rounded-xl px-4 py-2.5 focus:bg-white"
              />
            </div>
            <button
              onClick={() => fetchDashboard(groupId)}
              disabled={!groupId.trim() || status === 'loading'}
              className="mt-4 w-full py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white rounded-xl text-xs font-bold active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1"
            >
              <span>{status === 'loading' ? t('synching') : t('synchronizeGroup')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Group ID sharing clipboard notice */}
        {group && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl flex items-center justify-between"
          >
            <div className="text-xs">
              <span className="font-bold text-indigo-900">{t('inviteCode')}</span>
              <code className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-mono ml-1">{group._id}</code>
            </div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t('shareCodeWithFamily')}</span>
          </motion.div>
        )}
      </div>

      {/* Main Family Dashboard Display */}
      <FamilyDashboard group={group} aiSummary={aiSummary} onTopup={handleTopup} onInvite={handleInvite} />
    </motion.div>
  );
};

export default FamilyDashboardPage;
