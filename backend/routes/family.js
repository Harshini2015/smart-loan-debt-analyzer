const express = require('express');
const protect = require('../middleware/authMiddleware');
const FamilyGroup = require('../models/FamilyGroup');
const User = require('../models/User');
const { askGroq } = require('../services/groqService');

const router = express.Router();

// Auto-seed or retrieve a family group for the current user
router.get('/my-group', protect, async (req, res) => {
  try {
    let group = await FamilyGroup.findOne({ 'members.userId': req.user._id }).populate('members.userId', 'name email');
    
    if (!group) {
      // Find or create beautiful mock family users to populate the ecosystem realistically
      let spouse = await User.findOne({ email: 'spouse@smartloan.com' });
      if (!spouse) {
        spouse = await User.create({
          name: 'Rajesh S',
          email: 'spouse@smartloan.com',
          password: 'password123',
          role: 'user'
        });
      }

      let child = await User.findOne({ email: 'child@smartloan.com' });
      if (!child) {
        child = await User.create({
          name: 'Aarav S',
          email: 'child@smartloan.com',
          password: 'password123',
          role: 'user'
        });
      }

      let elder = await User.findOne({ email: 'elder@smartloan.com' });
      if (!elder) {
        elder = await User.create({
          name: 'Savitri S',
          email: 'elder@smartloan.com',
          password: 'password123',
          role: 'user'
        });
      }

      // Build mock family structure
      const mockMembers = [
        {
          userId: req.user._id,
          role: 'parent',
          nickname: `${req.user.name || 'Harshini'} (You)`,
          monthlyLimit: 5000,
        },
        {
          userId: spouse._id,
          role: 'parent',
          nickname: 'Rajesh (Spouse)',
          monthlyLimit: 3000
        },
        {
          userId: child._id,
          role: 'child',
          nickname: 'Aarav (Son)',
          monthlyLimit: 1200
        },
        {
          userId: elder._id,
          role: 'elder',
          nickname: 'Savitri (Mother)',
          monthlyLimit: 1500
        }
      ];

      group = await FamilyGroup.create({
        groupName: `${req.user.name || 'Harshini'}'s Family Portfolio`,
        adminUserId: req.user._id,
        members: mockMembers,
        sharedWallet: {
          balance: 8500.00,
          transactions: [
            { userId: req.user._id, amount: 10000, reason: 'Monthly deposit to family pool', date: new Date(Date.now() - 3600000 * 24) },
            { userId: spouse._id, amount: -850, reason: 'Groceries & supermarket restocking', date: new Date(Date.now() - 3600000 * 12) },
            { userId: child._id, amount: -120, reason: 'School project supplies & science kit', date: new Date(Date.now() - 3600000 * 6) },
            { userId: elder._id, amount: -530, reason: 'Medicine monthly refill & cardiac screening', date: new Date(Date.now() - 3600000 * 2) }
          ]
        }
      });

      // Refetch populated
      group = await FamilyGroup.findById(group._id).populate('members.userId', 'name email');
    }

    // Dynamic AI summary via Groq or clean fallback
    let aiSummary = '';
    const summaryText = `Group name: ${group.groupName}. Members: ${group.members
      .map((member) => `${member.nickname || member.userId?.name || 'Member'} (${member.role})`)
      .join(', ')}. Shared wallet balance: $${group.sharedWallet.balance}. Transactions count: ${group.sharedWallet.transactions.length}.`;

    const groqSummary = await askGroq({
      system: 'You are a financial AI assistant. Always respond in the exact format requested.',
      user: `Summarize this family's financial health in 2 sentences. Highlight the balance, and note that there are active contributions. Keep it concise.\n\n${summaryText}`,
      maxTokens: 150,
    });
    aiSummary = groqSummary.ok ? groqSummary.text : '';

    return res.json({ group, aiSummary });
  } catch (error) {
    console.error('my-group error:', error);
    return res.status(500).json({ message: 'Unable to load family group details' });
  }
});

router.post('/create', protect, async (req, res) => {
  try {
    const { groupName, members } = req.body;
    if (!groupName) {
      return res.status(400).json({ message: 'Group name is required' });
    }
    const group = await FamilyGroup.create({
      groupName,
      adminUserId: req.user._id,
      members: [
        {
          userId: req.user._id,
          role: 'parent',
          nickname: req.user.name || 'Admin',
          monthlyLimit: 0,
        },
        ...(Array.isArray(members) ? members : []),
      ],
    });
    return res.json({ group });
  } catch (error) {
    console.error('Family create error:', error);
    return res.status(500).json({ message: 'Unable to create family group' });
  }
});

router.post('/invite', protect, async (req, res) => {
  try {
    const { groupId, email, role, nickname, monthlyLimit } = req.body;
    if (!groupId || !email || !role) {
      return res.status(400).json({ message: 'Missing groupId, email or role' });
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'User not found for invite' });
    }
    const group = await FamilyGroup.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Family group not found' });
    }
    if (!group.adminUserId.equals(req.user._id)) {
      return res.status(403).json({ message: 'Only group admin can invite members' });
    }
    const existing = group.members.find((member) => member.userId.equals(user._id));
    if (existing) {
      return res.status(400).json({ message: 'User already in family group' });
    }
    group.members.push({ userId: user._id, role, nickname: nickname || user.name, monthlyLimit: monthlyLimit || 0 });
    await group.save();
    return res.json({ group });
  } catch (error) {
    console.error('Family invite error:', error);
    return res.status(500).json({ message: 'Unable to invite family member' });
  }
});

router.get('/:id/dashboard', protect, async (req, res) => {
  try {
    const group = await FamilyGroup.findById(req.params.id).populate('members.userId', 'name email');
    if (!group) {
      return res.status(404).json({ message: 'Family group not found' });
    }
    const isMember = group.members.some((member) => {
      if (!member.userId) return false;
      const memberId = member.userId._id || member.userId;
      return memberId.toString() === req.user._id.toString();
    });
    if (!isMember) {
      return res.status(403).json({ message: 'Not authorized to view this family dashboard' });
    }
    const summaryText = `Group name: ${group.groupName}. Members: ${group.members
      .map((member) => `${member.userId?.name || 'Member'} (${member.role})`)
      .join(', ')}. Shared wallet balance: ₹${group.sharedWallet.balance}.`;
    const groqDashSummary = await askGroq({
      system: 'You are a financial AI assistant. Always respond in the exact format requested.',
      user: `Summarize this family's financial health in 2 sentences. Flag any risks.\n\n${summaryText}`,
      maxTokens: 150,
    });
    const aiSummary = groqDashSummary.ok ? groqDashSummary.text : '';
    return res.json({ group, aiSummary });
  } catch (error) {
    console.error('Family dashboard error:', error);
    return res.status(500).json({ message: 'Unable to load family dashboard' });
  }
});

router.post('/:id/wallet/topup', protect, async (req, res) => {
  try {
    const { amount, reason } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Valid top-up amount is required' });
    }
    const group = await FamilyGroup.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ message: 'Family group not found' });
    }
    const isMember = group.members.some((member) => member.userId.equals(req.user._id));
    if (!isMember) {
      return res.status(403).json({ message: 'Not authorized to top up wallet' });
    }
    group.sharedWallet.balance += amount;
    group.sharedWallet.transactions.push({ userId: req.user._id, amount, reason: reason || 'Top-up shared wallet' });
    await group.save();
    return res.json({ group });
  } catch (error) {
    console.error('Wallet topup error:', error);
    return res.status(500).json({ message: 'Unable to top up wallet' });
  }
});

module.exports = router;
