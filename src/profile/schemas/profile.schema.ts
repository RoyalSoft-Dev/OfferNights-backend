// import * as mongoose from 'mongoose';

// export const UserSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   password: String,
//   permission: Boolean,
//   date_added: String
// })

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type ProfileDocument = Profile & Document;

@Schema()
export class Profile {

    @Prop({required:false })
    tradeName: string;

    @Prop({required:true, unique:true })
    email: string

    @Prop({required:true })
    brokerageAddress: string

    @Prop({required:true})
    brokerageCity: string;

    @Prop({required:true})
    brokeragePostalCode: string;

    @Prop({required:true})
    brokeragePhone: string

    @Prop({required:false})
    picture: string;

    @Prop({required:false})
    activeAreas: [string]

    @Prop({required:false, default: Date.now() })
    createdDate: Date
}

export const ProfileSchema = SchemaFactory.createForClass(Profile)
