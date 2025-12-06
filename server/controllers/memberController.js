import Membership from '../models/Membership.js';
import User from '../models/User.js';

export const addMembership = async (req, res) => {
  const { memberId, membershipNo, memberName, contactDetails, duration } = req.body;
  try {
    const membershipExists = await Membership.findOne({ membershipNo });
    if (membershipExists) return res.status(400).json({ message: 'Membership number already exists' });

    let months = 6;
    if (duration === '1_YEAR') months = 12;
    if (duration === '2_YEARS') months = 24;

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + months);

    const membership = await Membership.create({
      memberId,
      membershipNo,
      memberName,
      contactDetails,
      startDate,
      endDate,
      duration,
    });

    res.status(201).json(membership);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateMembership = async (req, res) => {
  const { duration, action } = req.body; // action: 'EXTEND' or 'CANCEL'
  try {
    const membership = await Membership.findById(req.params.id);
    if (membership) {
      if (action === 'CANCEL') {
        membership.status = 'cancelled';
      } else if (action === 'EXTEND') {
        let months = 6;
        if (duration === '1_YEAR') months = 12;
        if (duration === '2_YEARS') months = 24;

        const now = new Date();
        const existingEndDate = new Date(membership.endDate);
        
        // If expired, extend from NOW. If active, extend from current endDate.
        const baseDate = existingEndDate < now ? now : existingEndDate;
        
        baseDate.setMonth(baseDate.getMonth() + months);
        membership.endDate = baseDate;
        membership.duration = duration;
        membership.status = 'active';
      }
      const updatedMembership = await membership.save();
      res.json(updatedMembership);
    } else {
      res.status(404).json({ message: 'Membership not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMembership = async (req, res) => {
  try {
    const membership = await Membership.findOne({ memberId: req.params.id })
      .sort({ createdAt: -1 })
      .populate('memberId', 'name email');
    if (membership) {
      res.json(membership);
    } else {
      res.status(404).json({ message: 'Membership not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllMemberships = async (req, res) => {
  try {
    const memberships = await Membership.find().populate('memberId', 'name email');
    res.json(memberships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
