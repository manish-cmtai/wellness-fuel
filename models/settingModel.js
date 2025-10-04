import { model, Schema } from "mongoose";

const settingsSchema = new Schema(
  {
   seoSetting:[ {
    
    siteTitle: {
      type: String,
      required: true,
      maxlength: 60,
    },
    metaDescription: {
      type: String,
      maxlength: 160,
    },
    keywords: {
      type: [String],
    },
    twitterHandle: {
      type: String,
    },
    googleAnalyticsId: {
      type: String,
    },
    // Third-party scripts
    googleTagManagerId: { type: String },
    hotjarId: { type: String },
    intercomAppId: { type: String },
    zendeskWidgetKey: { type: String },
    customScripts: { type: String },

    // Meta tags
    author: { type: String },
    robots: { type: String, default: "index, follow" },
    viewport: { type: String, default: "width=device-width, initial-scale=1" },
    themeColor: { type: String },
    customMetaTags: { type: String },}],

    businessSetting:{}
  },
  { timestamps: true }
);

const Setting = model("Setting", settingsSchema);

export default Setting;
