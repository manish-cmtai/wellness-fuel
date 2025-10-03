import  { model, Schema } from 'mongoose';

const leadSchema = new Schema({
  name:{
    type:String,
    required:true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
  },
  phone: {
    type: String,
    trim: true,
    required:true
  },

  subject:{
    type: String,
   
  },
  message:{
    type:String,
   
  },

  // Lead status and meta
  status: {
    type: String,
    enum: ['New', 'Contacted',  'Proposal', "losted"],
    default: 'New',
    index: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  estimatedValue: {
    type: Number,
    min: [0, 'Estimated value cannot be negative'],
    default: 0
  },

  // Notes
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },

  lastContact:{
    type:String
  }
}, { timestamps: true });


const Lead =model('Lead', leadSchema);

export default Lead;
