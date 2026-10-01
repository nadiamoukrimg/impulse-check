import mongoose from 'mongoose';

const esquemaImpulso = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  precio: { type: Number, required: true, min: 0 },
  motivo: { type: String, required: true, trim: true },
  prioridad: {
    type: String,
    enum: ['soloLoQuiero', 'seriaUtil', 'creoQueLoNecesito'],
    required: function () { return this.isNew; },
  },
  restriccionPersonal: { type: String, trim: true, default: '' },
  fechaFinEspera: { type: Date, required: true, immutable: true },
  estado: {
    type: String,
    enum: ['pendiente', 'comprado', 'descartado'],
    default: 'pendiente',
    required: true,
  },
  fechaDecision: { type: Date, default: null },
}, {
  timestamps: true,
  autoCreate: false,
  autoIndex: false,
});

export default mongoose.model('Impulso', esquemaImpulso);
