import mongoose, { Schema, model, models } from "mongoose";

export interface ISettings {
  _id: string;
  showBeerNames: boolean;
}

const SettingsSchema = new Schema<ISettings>({
  showBeerNames: {
    type: Boolean,
    default: false,
  },
});

const Settings =
  models.Settings || model<ISettings>("Settings", SettingsSchema);

export default Settings;
