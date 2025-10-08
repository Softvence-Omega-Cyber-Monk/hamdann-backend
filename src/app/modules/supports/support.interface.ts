import { Document, Types } from "mongoose";

export interface ISupport  {
  userId: Types.ObjectId;
  ticketId?: string;
  supportSubject: string;
  supportMessage: string;
  status?: 'Pending' | 'Resolved';
}
