import { Document, model, Schema, Types } from "mongoose";

export interface IRol extends Document {
    _id: Types.ObjectId;
    tipe: string;
    name: string;
    creationDate: Date;
    status: boolean;
    updateDate: Date;
}

const rolSchema = new Schema<IRol>({
    tipe: { 
        type: String, 
        required: true,
    },
    name: { 
        type: String,
        required: true, 
    },
    creationDate: { 
        type: Date, 
        default: Date.now,
        required: true,
    },
    status: {
        type: Boolean,
        default: true,
        required: true,
    },
    updateDate: { 
        type: Date,
        default: Date.now,
        required: true,
    },
});


export const Rol = model<IRol>("Rol", rolSchema);