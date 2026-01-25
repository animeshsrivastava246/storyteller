import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

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
  const containerSize = size + 16;

  return (
    <Pressable
      onPress={onPress}
      hitSlop={10}
      className="active:opacity-70"
      style={{
        width: containerSize,
        height: containerSize,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: containerSize,
          height: containerSize,
          borderRadius: containerSize / 2,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: glassEffect ? "rgba(255,255,255,0.1)" : "transparent",
          borderWidth: glassEffect ? 1 : 0,
          borderColor: "rgba(255,255,255,0.15)",
        }}
      >
        <Ionicons name={icon} size={size} color={color} />
      </View>
    </Pressable>
  );
}
