import mongoose from 'mongoose';
import Note from '../models/notesModel.js';


const isId = (id) => mongoose.isValidObjectId(id);

// Create note
export async function createNote(req, res) {
  try {
    // Parse tags if comma-separated string
    if (req.body.tags && typeof req.body.tags === 'string') {
      req.body.tags = req.body.tags.split(',').map(t => t.trim()).filter(Boolean);
    }
    
    const note = await Note.create(req.body);
    const populated = await note.populate('author', 'firstName lastName email');
    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

// List notes with filters and pagination
export async function listNotes(req, res) {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      priority,
      status,
      author,
      isFavorite,
      isPublished,
      search,
      sort = '-createdAt'
    } = req.query;

    const filter = {};
    if (category) filter.category = new RegExp(category, 'i');
    if (priority) filter.priority = priority;
    if (status) filter.status = status;
    if (author && isId(author)) filter.author = author;
    if (isFavorite === 'true') filter.isFavorite = true;
    if (isPublished === 'true') filter.isPublished = true;
    if (isPublished === 'false') filter.isPublished = false;
    
    if (search) {
      const rx = new RegExp(search, 'i');
      filter.$or = [
        { title: rx },
        { content: rx },
        { authorName: rx },
        { tags: rx }
      ];
    }

    const [notes, total] = await Promise.all([
      Note.find(filter)
        .populate('author', 'firstName lastName email')
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(Number(limit)),
      Note.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: notes,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

// Get single note
export async function getNoteById(req, res) {
  try {
    const { id } = req.params;
    if (!isId(id)) return res.status(400).json({ success: false, message: 'Invalid note id' });

    const note = await Note.findById(id).populate('author', 'firstName lastName email');
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });

    res.json({ success: true, data: note });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

// Update note
export async function updateNote(req, res) {
  try {
    const { id } = req.params;
    if (!isId(id)) return res.status(400).json({ success: false, message: 'Invalid note id' });

    // Parse tags if comma-separated
    if (req.body.tags && typeof req.body.tags === 'string') {
      req.body.tags = req.body.tags.split(',').map(t => t.trim()).filter(Boolean);
    }

    const updated = await Note.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    }).populate('author', 'firstName lastName email');

    if (!updated) return res.status(404).json({ success: false, message: 'Note not found' });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

// Delete note
export async function deleteNote(req, res) {
  try {
    const { id } = req.params;
    if (!isId(id)) return res.status(400).json({ success: false, message: 'Invalid note id' });

    const deleted = await Note.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Note not found' });

    res.json({ success: true, message: 'Note deleted', id });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

// Get notes by category
export async function getNotesByCategory(req, res) {
  try {
    const { category } = req.params;
    const notes = await Note.find({ category: new RegExp(category, 'i') })
      .populate('author', 'firstName lastName email')
      .sort('-createdAt');

    res.json({ success: true, data: notes, count: notes.length });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

// Get favorite notes
export async function getFavoriteNotes(req, res) {
  try {
    const { author } = req.query;
    const filter = { isFavorite: true };
    if (author && isId(author)) filter.author = author;

    const notes = await Note.find(filter)
      .populate('author', 'firstName lastName email')
      .sort('-createdAt');

    res.json({ success: true, data: notes, count: notes.length });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}
