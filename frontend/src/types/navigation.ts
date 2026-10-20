import type { NavigatorScreenParams } from '@react-navigation/native';

import type { Voucher } from './domain';

export type AppTabParamList = {
  Home: undefined;
  BloodCenters: undefined;
  Wallet: undefined;
  Schedule: { hemocentroId?: number } | undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  AccessChoice: undefined;
  SignUp: undefined;
  DonorLogin: undefined;
  HemocentroSignUp: undefined;
  HemocentroLogin: undefined;
  HemocentroTabs: undefined;
  AppTabs: NavigatorScreenParams<AppTabParamList> | undefined;
  DonationHistory: undefined;
  InformationCenter: undefined;
  Triage: { doadorId: number };
  VoucherDetails: { voucher: Voucher };
};
