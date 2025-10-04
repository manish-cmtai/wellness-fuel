import SEO from "../models/settingModel.js";


// Create
export async function createSEO(req, res) {
  try {
    const seo = await SEO.create(req.body);
    res.status(201).json({ success: true, data: seo });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

// Read all
export async function getAllSEO(req, res) {
  try {
    const seos = await SEO.find();
    res.json({ success: true, data: seos });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

// Read one
export async function getSEOById(req, res) {
  try {
    const seo = await SEO.findById(req.params.id).populate('user', 'name email');
    if (!seo) return res.status(404).json({ success: false, message: 'SEO not found' });
    res.json({ success: true, data: seo });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

// Update
export async function updateSEO(req, res) {
  try {
    const seo = await SEO.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!seo) return res.status(404).json({ success: false, message: 'SEO not found' });
    res.json({ success: true, data: seo });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

// Delete
export async function deleteSEO(req, res) {
  try {
    const seo = await SEO.findByIdAndDelete(req.params.id);
    if (!seo) return res.status(404).json({ success: false, message: 'SEO not found' });
    res.json({ success: true, message: 'SEO deleted' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}
