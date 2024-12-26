import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
 
  location: {
    type: String,
    required: true,
  },
  companyName: { //branch
    type: String,
    required: true,
  },
  introduction: { //self marketing
    type: String,
  },
  
  qualifications: {
    type: String,
    required: true,
  },
  offers: { //scholarship
    type: String,
  },
  
 
  personalWebsite: {
    title: String,
    url: String
  },
  jobNiche: {
    type: String,
    required: true,
  },
  newsLettersSent: {
    type: Boolean,
    default: false,
  },
  jobPostedOn: {
    type: Date,
    default: Date.now,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export const Job = mongoose.model("Job", jobSchema);
