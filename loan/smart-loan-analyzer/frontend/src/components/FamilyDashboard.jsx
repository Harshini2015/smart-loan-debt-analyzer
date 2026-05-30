import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import {
  Wallet,
  Users,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  CreditCard,
  DollarSign,
  Plus
} from 'lucide-react';

const formatCurrency = (n) => `$${Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const FamilyDashboard = ({ group, aiSummary, onTopup, onInvite }) => {
  const { t } = useLanguage();
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteNickname, setInviteNickname] = useState('');
  const [inviteRole, setInviteRole] = useState('child');
  const [inviteLimit, setInviteLimit] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);

  if (!group) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-8 text-center text-slate-500 font-medium"
      >
        Create a family group or type your Group ID above to audit shared wallets, limits, and elder monitoring.
      </motion.div>
    );
  }

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !inviteNickname.trim()) {
      alert('Please enter valid email and nickname.');
      return;
    }
    setInviteLoading(true);
    const success = await onInvite(
      inviteEmail,
      inviteRole,
      inviteNickname,
      Number(inviteLimit) || 0
    );
    setInviteLoading(false);
    if (success) {
      setInviteEmail('');
      setInviteNickname('');
      setInviteLimit('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* AI Family Health Summary */}
      <div className="stripe-card bg-indigo-950 text-white p-6 relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-indigo-900 opacity-20 rounded-full" />
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold tracking-tight text-white">{group.groupName}</h2>
          </div>
          <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider bg-indigo-900/60 px-2 py-0.5 rounded-full">
            Ecosystem Audit
          </span>
        </div>
        <p className="text-xs text-indigo-100 leading-relaxed font-medium">
          {aiSummary || 'AI analytical summary will appear here once family metrics compile.'}
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        
        {/* Wallet Balance */}
        <div className="stripe-card bg-white p-6 relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('sharedBalance')}</p>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1.5">
                {formatCurrency(group.sharedWallet?.balance || 0)}
              </h3>
            </div>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Wallet className="w-4.5 h-4.5" />
            </div>
          </div>
          
          {/* Quick inline wallet top-up form */}
          <div className="mt-4 flex gap-2">
            <input
              type="number"
              id="topupAmount"
              placeholder={t('amountVal')}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 focus:bg-white focus:outline-none"
            />
            <button
              onClick={() => {
                const amtInput = document.getElementById('topupAmount');
                const val = Number(amtInput?.value);
                if (val > 0) {
                  onTopup(val, 'Monthly deposit from pool');
                  if (amtInput) amtInput.value = '';
                } else {
                  alert('Please enter a valid positive amount.');
                }
              }}
              className="px-3 py-1.5 bg-indigo-600 text-white font-bold rounded-xl text-[10px] hover:bg-indigo-700 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            >
              {t('topUp')}
            </button>
          </div>

          <div className="mt-4 border-t border-slate-100 pt-3 flex justify-between text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
            <span>{t('primaryPool')}</span>
            <span className="text-indigo-600 font-extrabold">{t('activeWallet')}</span>
          </div>
        </div>

        {/* Member limits & spend overview */}
        <div className="stripe-card bg-white p-6 md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-slate-900 font-bold text-sm tracking-tight flex items-center gap-1.5">
              <Users className="w-4.5 h-4.5 text-indigo-600" />
              {t('ecosystemMembers')}
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {group.members?.length || 0} {t('connected')}
            </span>
          </div>

          <div className="space-y-3">
            {group.members?.map((member) => (
              <div
                key={member.userId?._id || member.userId}
                className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100/50 border border-slate-200/50 rounded-xl transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                    {(member.nickname || member.userId?.name || 'M').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">
                      {member.nickname || member.userId?.name || 'Unknown'}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                      {t(member.role) || member.role}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-slate-900">
                    Limit: {formatCurrency(member.monthlyLimit || 0)}
                  </span>
                  <div className="w-24 bg-slate-200 h-1 rounded-full mt-1.5 overflow-hidden">
                    <div className="h-full bg-indigo-600" style={{ width: '40%' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add member form */}
          <div className="mt-6 border-t border-slate-100 pt-5">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1">
              <Plus className="w-3.5 h-3.5 text-indigo-600" />
              {t('addMember')}
            </h4>
            <p className="text-[10px] text-slate-400 font-semibold mb-4">{t('inviteMemberDesc')}</p>
            
            <form onSubmit={handleInviteSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <input
                  type="email"
                  placeholder={t('emailAddress')}
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder={t('nickname')}
                  value={inviteNickname}
                  onChange={(e) => setInviteNickname(e.target.value)}
                  required
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 focus:bg-white focus:outline-none"
                >
                  <option value="child">{t('child')}</option>
                  <option value="parent">{t('parent')}</option>
                  <option value="elder">{t('elder')}</option>
                </select>
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder={t('monthlyLimit')}
                  value={inviteLimit}
                  onChange={(e) => setInviteLimit(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 focus:bg-white focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={inviteLoading}
                  className="px-4 py-1.5 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800 disabled:opacity-50 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                >
                  {inviteLoading ? t('sendingInvite') : `+ ${t('save')}`}
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>

      {/* Recent Transactions List */}
      <div className="stripe-card bg-white p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-slate-900 font-bold text-sm tracking-tight flex items-center gap-1.5">
            <Wallet className="w-4.5 h-4.5 text-indigo-600" />
            {t('recentTransactions')}
          </h3>
          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
            {t('liveLedger')}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-2.5">{t('member')}</th>
                <th className="py-2.5">{t('reason')}</th>
                <th className="py-2.5">{t('amount')}</th>
                <th className="py-2.5">{t('date')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-700">
              {group.sharedWallet?.transactions?.length > 0 ? (
                [...group.sharedWallet.transactions].reverse().map((tx, idx) => {
                  const member = group.members?.find(m => (m.userId?._id || m.userId) === (tx.userId?._id || tx.userId));
                  const nickname = member?.nickname || 'Family Admin';
                  const isPositive = tx.amount > 0;
                  return (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 font-semibold text-slate-800 flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-[9px]">
                          {nickname.charAt(0)}
                        </div>
                        {nickname}
                      </td>
                      <td className="py-3 text-slate-500">{tx.reason}</td>
                      <td className={`py-3 font-bold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {isPositive ? '+' : ''}{formatCurrency(tx.amount)}
                      </td>
                      <td className="py-3 text-slate-400 font-medium">
                        {new Date(tx.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="py-4 text-center text-slate-400">{t('noTransactions')}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default FamilyDashboard;
