import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

// 1. Definisikan interface untuk properti User
export interface IUser {
  username: string;
  email: string;
  password?: string; // Tanda tanya karena mungkin tidak ada sebelum hashing
}

// 2. Definisikan interface yang menggabungkan Document dan custom methods
export interface IUserModel extends IUser, Document {
  // Tambahkan tanda tangan (signature) metode comparePassword di sini
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// 3. Definisikan Schema untuk User
const userSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // Penting: Jangan sertakan password secara default saat query
    },
  },
  { timestamps: true }
);

// ✅ Indexes untuk performance
userSchema.index({ email: 1 }); // Index untuk pencarian by email
userSchema.index({ username: 1 }); // Index untuk pencarian by username

// 4. Pre-save hook untuk hashing password
userSchema.pre<IUserModel>("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password as string, salt);
});

// 5. Method untuk membandingkan password
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const user = this as IUserModel; // Cast 'this' ke IUserModel

  // Ambil password dari instance saat ini. Di controller login, kita sudah select("+password")
  const hashedPassword = user.password;

  if (!hashedPassword) {
    // Jika password tidak ada (misalnya lupa select("+password") di query), cari lagi
    const fetchedUser = await mongoose
      .model<IUserModel>("User")
      .findOne({ _id: user._id })
      .select("+password");
    if (!fetchedUser || !fetchedUser.password) {
      return false;
    }
    return bcrypt.compare(candidatePassword, fetchedUser.password);
  }

  return bcrypt.compare(candidatePassword, hashedPassword);
};

// Ekspor model dengan tipe IUserModel
export default mongoose.model<IUserModel>("User", userSchema); // <-- Gunakan IUserModel
