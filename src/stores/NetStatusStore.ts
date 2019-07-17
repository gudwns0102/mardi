import { flow, types } from "mobx-state-tree";
import { ConnectionInfo, ConnectionType, NetInfo } from "react-native";

export const NetStatusStore = types
  .model({
    connectionType: types.optional(types.string, "")
  })
  .actions(self => {
    const afterCreate = flow(function*() {
      try {
        const connectionInfo = yield NetInfo.getConnectionInfo();
        self.connectionType = connectionInfo.type;
      } catch (error) {
        self.connectionType = "unknown";
      }
    });

    const setConnectionType = (connectionType: ConnectionType) =>
      (self.connectionType = connectionType);

    const addNetstatusListener = (
      callback: (connectionInfo: ConnectionInfo) => any
    ) => {
      NetInfo.addEventListener("connectionChange", callback as any);
    };

    return {
      afterCreate,
      setConnectionType,
      addNetstatusListener
    };
  })
  .views(self => {
    return {
      get isConnected() {
        return !["unknown", "none"].includes(self.connectionType);
      },

      get isWifiConnection() {
        return self.connectionType === "wifi";
      }
    };
  });

export type INetStatusStore = typeof NetStatusStore.Type;
