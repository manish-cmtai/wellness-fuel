import  { model, Schema } from 'mongoose';

const leadSchema = new Schema({
  // Contact info
  firstName: {
    type: String,
    trim: true,
    required: [true, 'First name is required'],
    minlength: [2, 'First name must be at least 2 characters'],
    maxlength: [60, 'First name cannot exceed 60 characters']
  },
  lastName: {
    type: String,
    trim: true,
    required: [true, 'Last name is required'],
    minlength: [1, 'Last name must be at least 1 character'],
    maxlength: [60, 'Last name cannot exceed 60 characters']
  },
  email: {
    type: String,
    trim: true,
    required: [true, 'Email is required'],
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Email is invalid'],
    index: true
  },
  phone: {
    type: String,
    trim: true
  },

  // Company and role
  company: {
    type: String,
    trim: true,
    maxlength: [120, 'Company cannot exceed 120 characters']
  },
  position: {
    type: String,
    trim: true,
    maxlength: [80, 'Position cannot exceed 80 characters']
  },

  // Lead status and meta
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'],
    default: 'New',
    index: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  source: {
    type: String,
    enum: ['Website', 'Referral', 'Email', 'Phone', 'Event', 'Ads', 'Other'],
    default: 'Website'
  },
  estimatedValue: {
    type: Number,
    min: [0, 'Estimated value cannot be negative'],
    default: 0
  },

  // Assignment
  assignedTo: {
    type: String,
    trim: true,
    default: 'Unassigned'
    // alternatively: Schema.Types.ObjectId ref: 'Team' or 'User'
  },

  // Notes
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  }
}, { timestamps: true });


const Lead =model('Lead', leadSchema);

export default Lead;
