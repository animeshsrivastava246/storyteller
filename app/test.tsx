import { ImageBackground, StyleSheet } from "react-native";

export default function AboutScreen() {

    return (
        <>

            <ImageBackground
                source={require("../assets/storyteller-hero-landing.jpeg")}
                style={styles.background}
                resizeMode="cover"
                blurRadius={4}
            >
                {/* <View style={styles.overlay}>
                    <Text style={styles.title}>About Page</Text>

                    <Pressable style={styles.button} onPress={() => router.push("/")}>
                        <Text style={styles.buttonText}>Go Home</Text>
                    </Pressable>
                </View> */}
            </ImageBackground>
        </>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: "center",
    },
    // overlay: {
    //     alignItems: "center",
    //     backgroundColor: "rgba(0,0,0,0.4)",
    //     padding: 20,
    // },
    // title: {
    //     fontSize: 28,
    //     color: "#fff",
    //     marginBottom: 20,
    //     fontWeight: "bold",
    // },
    // button: {
    //     backgroundColor: "#ffffff00",
    //     paddingVertical: 12,
    //     paddingHorizontal: 24,
    //     borderRadius: 8,
    // },
    // buttonText: {
    //     color: "#fff",
    //     fontSize: 16,
    //     fontWeight: "600",
    // },
});
