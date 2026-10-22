import {
  addNetworkStateListener,
  getNetworkStateAsync,
  NetworkState,
} from "expo-network";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { StatusScreen } from "../status-screen/status-screen";

const checkNetwork = (onState: (state: NetworkState) => void) =>
  getNetworkStateAsync()
    .then(onState)
    .catch(() => undefined);

// Covers the whole app while the device is offline, so the patient does not act on
// stale data or lose actions that never reach the server. It goes away by itself
// as soon as the connection comes back.
export function OfflineGate() {
  const [networkState, setNetworkState] = useState<NetworkState | null>(null);

  useEffect(() => {
    void checkNetwork(setNetworkState);
    const subscription = addNetworkStateListener(setNetworkState);
    return () => subscription.remove();
  }, []);

  const isOffline =
    networkState?.isConnected === false ||
    networkState?.isInternetReachable === false;

  if (!isOffline) return null;

  return (
    <View style={StyleSheet.absoluteFill}>
      <StatusScreen
        title="Sem conexão com a internet"
        message="Verifique o Wi-Fi ou os dados móveis. O app volta a funcionar sozinho assim que a conexão voltar."
        actionLabel="Tentar novamente"
        onAction={() => void checkNetwork(setNetworkState)}
      />
    </View>
  );
}
