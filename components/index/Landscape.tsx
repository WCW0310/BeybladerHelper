import { Button, Divider, makeStyles } from "@rneui/themed";
import React from "react";
import { FlatList, Text, View } from "react-native";
import TextPairV from "@/components/index/TextPairV";
import { SpListItemProps } from "@/components/index/SpListItem";
import DeviceBtn from "./DeviceBtn";
import { useAppSelector } from "@/hooks/useApp";
import ToSettingBtn from "./ToSettingBtn";

const Landscape = ({
  clearSpList,
  renderSpListItem,
  isScanning,
  isConnecting,
  isConnected,
  scanDevices,
  stopScan,
  showDeviceBottomSheet,
}: {
  clearSpList: () => void;
  renderSpListItem: ({ item }: { item: SpListItemProps }) => JSX.Element;
  isScanning: boolean;
  isConnecting: boolean;
  isConnected: boolean;
  scanDevices: () => Promise<void>;
  stopScan: () => void;
  showDeviceBottomSheet: () => void;
}) => {
  const styles = useStyles();
  const { numShootValue, maxShootPowerValue, spList } = useAppSelector(
    (state) => state.index
  );
  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <Text
          style={styles.currentSpValue}
          adjustsFontSizeToFit
          numberOfLines={1}
        >
          {spList.length > 0 ? spList[0].spValue : "0"}
        </Text>
        <Text
          style={styles.connectionStatus}
          adjustsFontSizeToFit
          numberOfLines={1}
        >{`連結狀態: ${
          isScanning
            ? "掃描中"
            : isConnecting
            ? "連結中"
            : isConnected
            ? "已連結"
            : "未連結"
        }`}</Text>
        <View style={styles.connectBtnContainer}>
          <DeviceBtn
            isScanning={isScanning}
            isConnecting={isConnecting}
            isConnected={isConnected}
            scanDevices={scanDevices}
            stopScan={stopScan}
            showDeviceBottomSheet={showDeviceBottomSheet}
          />
          <ToSettingBtn style={styles.toSettingBtn} />
        </View>
      </View>
      <Divider style={styles.divider} />
      <View style={styles.rightContainer}>
        <View style={styles.rightTopContainer}>
          <TextPairV
            title={"射擊次數"}
            value={numShootValue.toString()}
            scale={0.8}
          />
          <TextPairV
            title={"MAX SP"}
            value={maxShootPowerValue.toString()}
            scale={0.8}
          />
        </View>
        <Text style={styles.spListTitle} adjustsFontSizeToFit numberOfLines={1}>
          {"最近紀錄"}
        </Text>
        <FlatList
          data={spList.filter((_, index) => index !== 0)}
          renderItem={renderSpListItem}
          keyExtractor={(item) => item.id}
        />
        <Button
          containerStyle={styles.clearBtn}
          title={"清除紀錄"}
          disabled={spList.length === 0}
          onPress={clearSpList}
          color={"primary"}
          icon={{ name: "refresh", color: "white" }}
          size="sm"
        />
      </View>
    </View>
  );
};

export default Landscape;

const useStyles = makeStyles((theme) => ({
  container: {
    flexDirection: "row",
    flex: 1,
    marginBottom: 16,
  },
  leftContainer: {
    flexDirection: "column",
    flex: 5,
    justifyContent: "space-between",
    marginTop: 32,
  },
  currentSpValue: {
    fontSize: 150,
    textAlign: "center",
    fontWeight: "bold",
    color: theme.colors.black,
  },
  connectionStatus: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 8,
    color: theme.colors.black,
  },
  connectBtnContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    position: "relative",
  },
  connectBtn: {
    alignSelf: "center",
  },
  toSettingBtn: {
    position: "absolute",
    right: 10,
  },
  divider: {
    borderWidth: 1,
    borderColor: theme.colors.grey4,
    margin: 8,
  },
  rightContainer: {
    flexDirection: "column",
    flex: 2,
    justifyContent: "space-between",
    marginTop: 16,
  },
  rightTopContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  spListTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 8,
    color: theme.colors.black,
  },
  clearBtn: {
    alignSelf: "center",
  },
}));
