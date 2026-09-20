import type { NavigatorScreenParams } from '@react-navigation/native';

import type { Voucher } from './domain';

export type AppTabParamList = {
  Home: undefined;
  BloodCenters: undefined;
  Wallet: undefined;
  Schedule: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  SignUp: undefined;
  AppTabs: NavigatorScreenParams<AppTabParamList> | undefined;
  DonationHistory: undefined;
  InformationCenter: undefined;
  VoucherDetails: { voucher: Voucher };
};
