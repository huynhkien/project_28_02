const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: String, require: true },
  thumb: {
    url: String,
    public_id: String
  },
  images: [
    {
      url: String,
      public_id: String,
    }
  ],
  price: { type: Number, required: true },
  slug: { type: String, slug: 'name', unique: true },
}, {
  timestamps: true,
});

// Add plugins
mongoose.plugin(slug);

module.exports = mongoose.model('Product', ProductSchema);
