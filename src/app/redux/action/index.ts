import {ITripAction} from './trips';
import {IPaymentAction} from './payments';
import {ITransferAction} from './transfers';

export type IAction = ITripAction | IPaymentAction | ITransferAction