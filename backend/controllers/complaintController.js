import Complaint from '../models/Complaint.js';

// Generate unique complaint ID
const generateComplaintId = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `IIITN-${timestamp}-${random}`;
};

// Create a new complaint
export const createComplaint = async (req, res) => {
  try {
    const { studentName, studentRoll, hostel, room, email, phone, category, description, priority } = req.body;

    if (!studentName || !studentRoll || !hostel || !room || !category || !description) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }

    const complaintId = generateComplaintId();

    const complaint = new Complaint({
      complaintId,
      studentName,
      studentRoll,
      hostel,
      room,
      email,
      phone,
      category,
      description,
      priority: priority || 'Low',
      status: 'Submitted',
    });

    await complaint.save();

    res.status(201).json({
      message: 'Complaint submitted successfully',
      complaintId,
      complaint,
    });
  } catch (error) {
    console.error('Error creating complaint:', error);
    res.status(500).json({ message: 'Failed to create complaint', error: error.message });
  }
};

// Get all complaints (admin only)
export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.status(200).json(complaints);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ message: 'Failed to fetch complaints', error: error.message });
  }
};

// Get complaint by ID
export const getComplaintById = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const complaint = await Complaint.findOne({ complaintId });

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.status(200).json(complaint);
  } catch (error) {
    console.error('Error fetching complaint:', error);
    res.status(500).json({ message: 'Failed to fetch complaint', error: error.message });
  }
};

// Update complaint status (admin only)
export const updateComplaintStatus = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { status, adminNotes } = req.body;

    if (!['Submitted', 'Acknowledged', 'In Progress', 'Resolved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const complaint = await Complaint.findOneAndUpdate(
      { complaintId },
      {
        status,
        adminNotes: adminNotes || '',
        ...(status === 'Resolved' && { resolvedAt: new Date() }),
      },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.status(200).json({
      message: 'Complaint updated successfully',
      complaint,
    });
  } catch (error) {
    console.error('Error updating complaint:', error);
    res.status(500).json({ message: 'Failed to update complaint', error: error.message });
  }
};

// Get complaints by category (analytics)
export const getComplaintsByCategory = async (req, res) => {
  try {
    const complaints = await Complaint.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    res.status(200).json(complaints);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'Failed to fetch analytics', error: error.message });
  }
};

// Get complaints by status (analytics)
export const getComplaintsByStatus = async (req, res) => {
  try {
    const complaints = await Complaint.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    res.status(200).json(complaints);
  } catch (error) {
    console.error('Error fetching status analytics:', error);
    res.status(500).json({ message: 'Failed to fetch status analytics', error: error.message });
  }
};

// Public live summary for the landing page
export const getComplaintLiveSummary = async (req, res) => {
  try {
    const [totalComplaints, byCategory, byStatus, recentDailyTrend, resolvedComplaints] = await Promise.all([
      Complaint.countDocuments(),
      Complaint.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Complaint.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Complaint.aggregate([
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' },
            },
            submitted: { $sum: 1 },
            resolved: {
              $sum: {
                $cond: [{ $eq: ['$status', 'Resolved'] }, 1, 0],
              },
            },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
      ]),
      Complaint.find({ status: 'Resolved', resolvedAt: { $exists: true } }).select('createdAt resolvedAt'),
    ]);

    const today = new Date();

    const todaysComplaints = await Complaint.countDocuments({
      createdAt: {
        $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
        $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
      },
    });

    const todaysResolved = await Complaint.countDocuments({
      status: 'Resolved',
      resolvedAt: {
        $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
        $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
      },
    });

    const criticalOpen = await Complaint.countDocuments({ priority: 'High', status: { $ne: 'Resolved' } });

    const avgResolutionMinutes = resolvedComplaints.length
      ? Math.round(
          resolvedComplaints.reduce((total, complaint) => {
            const createdAt = new Date(complaint.createdAt).getTime();
            const resolvedAt = new Date(complaint.resolvedAt).getTime();
            return total + Math.max(0, resolvedAt - createdAt);
          }, 0) / resolvedComplaints.length / 60000,
        )
      : 0;

    const weeklyTrend = recentDailyTrend.slice(-7).map((item) => ({
      day: new Date(item._id.year, item._id.month - 1, item._id.day).toLocaleDateString('en-US', { weekday: 'short' }),
      submitted: item.submitted,
      resolved: item.resolved,
    }));

    res.status(200).json({
      totalComplaints,
      todayFiled: todaysComplaints,
      todayResolved: todaysResolved,
      openCritical: criticalOpen,
      avgResolutionMinutes,
      weeklyTrend,
      categoryBreakup: byCategory,
      statusBreakup: byStatus,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching live summary:', error);
    res.status(500).json({ message: 'Failed to fetch live summary', error: error.message });
  }
};

// Delete complaint (admin only)
export const deleteComplaint = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const complaint = await Complaint.findOneAndDelete({ complaintId });

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.status(200).json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    console.error('Error deleting complaint:', error);
    res.status(500).json({ message: 'Failed to delete complaint', error: error.message });
  }
};
