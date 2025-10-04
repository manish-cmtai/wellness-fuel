import { model, Schema } from 'mongoose';

const noteSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Note title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    
    content: {
      type: String,
      trim: true,
      maxlength: [10000, 'Content cannot exceed 10000 characters']
    },
    
    category: {
      type: String,
      trim: true,
      maxlength: [50, 'Category cannot exceed 50 characters']
    },
    
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    
    status: {
      type: String,
      enum: ['Draft', 'In Progress', 'Completed', 'Archived'],
      default: 'Draft'
    },
    
    authorName: {
      type: String,
      trim: true,
      maxlength: [100, 'Author name cannot exceed 100 characters']
    },
    
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    
    tags: {
      type: [String],
      default: []
    },
  },
  { timestamps: true }
);

// Indexes
noteSchema.index({ title: 'text', content: 'text', tags: 'text' });
noteSchema.index({ author: 1, createdAt: -1 });
noteSchema.index({ category: 1, status: 1 });

const Note = model('Note', noteSchema);

export default Note;
