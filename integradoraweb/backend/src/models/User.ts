import { Document, model, Schema, Types } from "mongoose";

export interface IUser extends Document {
    _id: Types.ObjectId;
    name: string;
    password: string;
    email: string;
    phone: string;
    status: boolean;
    createDate: Date;
    deleteDate?: Date;          
    roles: Types.ObjectId[];    
}

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    createDate: {
        type: Date,
        default: Date.now,
    },
    roles: [
        {
            type: Schema.Types.ObjectId,
            ref: "Rol",
            required: true,
        },
    ],
    phone: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        required: true,
        default: true,
    },
    deleteDate: {                
        type: Date,
    },
});

// Exportamos el modelo
export const User = model<IUser>("User", userSchema);