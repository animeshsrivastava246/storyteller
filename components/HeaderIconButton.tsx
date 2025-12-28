import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

type Props = {
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
    size?: number;
    color?: string;
    backgroundColor?: string;
};

export function HeaderIconButton({
    icon,
    onPress,
    size = 32,
    color = "white",
    backgroundColor = "transparent",
}: Props) {
    return (
        <Pressable onPress={onPress} style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }} hitSlop={10}>
            <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor, justifyContent: "center", alignItems: "center", marginLeft: 4 }}>
                <Ionicons name={icon} size={size} color={color} />
            </View>
        </Pressable>
    );
}
