import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      unique: true,
      required: true,
    },
    studentName: {
      type: String,
      required: true,
    },
    studentRoll: {
      type: String,
      required: true,
    },
    hostel: {
      type: String,
      required: true,
    },
    room: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    category: {
      type: String,
      enum: ['Electricity', 'Water', 'Cleaning', 'Internet', 'Other'],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Low',
    },
    status: {
      type: String,
      enum: ['Submitted', 'Acknowledged', 'In Progress', 'Resolved', 'Rejected'],
      default: 'Submitted',
    },
    adminNotes: {
      type: String,
      default: '',
    },
    resolvedAt: {
      type: Date,
    },
    attachments: [
      {
        type: String,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Complaint', complaintSchema);
