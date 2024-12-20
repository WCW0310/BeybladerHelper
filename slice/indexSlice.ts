import { SpListItemProps } from "@/components/index/SpListItem";
import { ConnectedDeviceState } from "@/constants/ConnectedDeviceState";
import { storage } from "@/managers/StorageManager";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Device } from "react-native-ble-plx";

/*
需要的資料:

單人模式:
射擊次數: 逐一計算 > 從 spList 計算?
MAX SP: 逐一計算 > 從 spList 計算?
spList

多人模式:
各玩家的射擊次數: 從 spList 計算?
各玩家的 MAX SP 從 spList 計算?
各玩家的 spList 從 spList 計算?
*/

type IndexState = {
  connectedDevices: ConnectedDeviceState[];
  numShootValue: number;
  maxShootPowerValue: number;
  // 總資料源
  spList: SpListItemProps[];
};

const initialState: IndexState = {
  connectedDevices: [],
  numShootValue: 0,
  maxShootPowerValue: 0,
  spList: [],
};

const indexSlice = createSlice({
  name: "index",
  initialState,
  reducers: {
    reset: (state) => {
      state.numShootValue = initialState.numShootValue;
      state.maxShootPowerValue = initialState.maxShootPowerValue;
      state.spList = initialState.spList;
    },
    addConnectedDevice: (state, action: PayloadAction<Device>) => {
      const deviceId = action.payload.id;
      let deviceName = storage.getString(deviceId);
      if (!deviceName) {
        deviceName = `裝置${(state.connectedDevices.length + 1).toString()}`;
        storage.set(deviceId, deviceName);
      }
      state.connectedDevices.push({
        device: action.payload,
        uiState: { deviceName },
      });
    },
    removeConnectedDevice: (state, action: PayloadAction<Device | null>) => {
      state.connectedDevices = state.connectedDevices.filter(
        (value) => value.device.id !== action.payload?.id
      );
    },
    updateConnectedDevices: (
      state,
      action: PayloadAction<{
        deviceId: string;
        maxShootPowerValue?: string;
        numShootValue?: string;
      }>
    ) => {
      const { deviceId, maxShootPowerValue, numShootValue } = action.payload;
      state.connectedDevices = state.connectedDevices.map((value) =>
        value.device.id === deviceId
          ? {
              ...value,
              uiState: {
                ...value.uiState,
                maxShootPowerValue,
                numShootValue,
              },
            }
          : value
      );
    },
    updateSpList: (
      state,
      action: PayloadAction<{
        deviceId: string;
        numShoot: number;
        latestShootPower: number;
      }>
    ) => {
      state.numShootValue += 1;
      const { deviceId, numShoot, latestShootPower } = action.payload;
      if (latestShootPower > state.maxShootPowerValue) {
        state.maxShootPowerValue = latestShootPower;
      }
      state.spList = [
        {
          id: numShoot + deviceId,
          shootNum: state.numShootValue.toString(),
          spValue: latestShootPower.toString(),
          deviceName: storage.getString(deviceId) ?? "",
        },
        ...state.spList,
      ];
    },
  },
});

export const actions = indexSlice.actions;
export default indexSlice.reducer;
