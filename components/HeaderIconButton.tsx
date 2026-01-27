import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  size?: number;
  color?: string;
  glassEffect?: boolean;
};

export function HeaderIconButton({
  icon,
  onPress,
  size = 24,
  color = "white",
  glassEffect = true,
}: Props) {
  const hitSize = Math.max(44, size + 20);

  return (
    <Pressable
      onPress={onPress}
      hitSlop={10}
      style={({ pressed }) => [
        styles.container,
        {
          width: hitSize,
          height: hitSize,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <View
        style={[
          styles.circle,
          {
            width: hitSize,
            height: hitSize,
            borderRadius: hitSize / 2,
            backgroundColor: glassEffect
              ? "rgba(255,255,255,0.12)"
              : "transparent",
          },
        ]}
      >
        <Ionicons name={icon} size={size} color={color} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    overflow: "hidden", 
  },
});
