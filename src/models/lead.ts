import mongoose from "mongoose";

interface ILead {
  name: string;
  phone: string;
  roistat: string;
}

const leadSchema = new mongoose.Schema<ILead>({
  name: { type: String, required: true, minlength: 2, maxlength: 40 },
  phone: { type: String, required: true },
  roistat: { type: String, required: false },
});



export default mongoose.model<ILead>('lead', leadSchema);