const mongoose = require('mongoose');

const pilotSchema = new mongoose.Schema({
  number:      { type: Number, required: true, unique: true },
  name:        { type: String, required: true },
  nameRu:      { type: String },
  nationality: { type: String },
  flag:        { type: String },
  born:        { type: String },
  hometown:    { type: String },
  bio:         { type: String },
  image:       { type: String },
  helmet:      { type: String },
  stats: {
    races:         { type: Number, default: 0 },
    wins:          { type: Number, default: 0 },
    podiums:       { type: Number, default: 0 },
    poles:         { type: Number, default: 0 },
    championships: { type: Number, default: 0 },
  },
  car:       { type: String },
  instagram: { type: String },
  twitter:   { type: String },
  active:    { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Pilot', pilotSchema);
