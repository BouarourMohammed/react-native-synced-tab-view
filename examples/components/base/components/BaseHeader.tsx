import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { HEADER_SPACER_STYLE, styles } from "./shared";

type BaseHeaderProps = {
  title?: string;
};

export const BaseHeader = ({ title = "Base Example" }: BaseHeaderProps) => {
  const navigation = useNavigation();

  return (
    <View style={styles.headerBar}>
      <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </Pressable>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={HEADER_SPACER_STYLE} />
    </View>
  );
};
