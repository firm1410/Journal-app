# Swipe gestures in React Native Expo

## Short answer

Yes. React Native has a built-in gesture responder system, including `PanResponder`, so a simple swipe can be implemented without a third-party package. React Native documents `PanResponder` as a wrapper around the responder callbacks and exposes distance and velocity through `gestureState` ([official docs](https://reactnative.dev/docs/panresponder)).

For this Expo app, the recommended choice is `react-native-gesture-handler`, usually paired with `react-native-reanimated` for the visual movement/settling animation. Gesture Handler uses the platform's native touch/gesture system and is intended to address performance limitations of the built-in responder system ([Gesture Handler overview](https://docs.swmansion.com/react-native-gesture-handler/docs/), [Expo package docs](https://docs.expo.dev/versions/latest/sdk/gesture-handler/)). Reanimated provides timing, spring, and decay animations ([official animation docs](https://docs.swmansion.com/react-native-reanimated/docs/category/animations/)).

## Which option to use

| Need | Choice |
| --- | --- |
| One small, simple swipe with no animation or nested scroll views | React Native `PanResponder` |
| Swipeable cards, rows, carousels, drawers, or gestures combined with `ScrollView` | `react-native-gesture-handler` |
| Smooth drag while the finger moves, then snap-back or dismiss animation | Gesture Handler + `react-native-reanimated` |
| Detect only a quick directional flick | Gesture Handler's `Fling` gesture; use `Pan` when you need continuous tracking |

For a journal UI, use `Pan` for a swipeable entry/card. It reports `translationX`, `translationY`, and velocity, and supports restricting recognition to horizontal movement ([Pan gesture docs](https://docs.swmansion.com/react-native-gesture-handler/docs/2.x/gestures/pan-gesture/)). Use `Fling` only when you want a quick swipe event rather than the card following the finger ([Fling gesture docs](https://docs.swmansion.com/react-native-gesture-handler/docs/2.x/gesture-handlers/fling-gh/)).

## Installation for this repository

This repository uses Expo `~57.0.21` and React Native `0.86.3`. Let Expo select compatible package versions:

```bash
npx expo install react-native-gesture-handler react-native-reanimated
```

Expo's current Gesture Handler page lists the package as included in Expo Go and recommends `npx expo install react-native-gesture-handler` ([Expo docs](https://docs.expo.dev/versions/latest/sdk/gesture-handler/)). Expo's Reanimated page documents the matching install command and notes that Expo configures its Babel integration automatically ([Expo docs](https://docs.expo.dev/versions/latest/sdk/reanimated/)).

## Minimal swipe pattern

The current 2.x Gesture Handler API, which is appropriate when Expo resolves the 2.x package line, looks like this. All functions use arrow-function syntax to match this repository's coding instruction.

```tsx
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const SwipeCard = ({ onSwipedLeft }: { onSwipedLeft: () => void }) => {
  const translateX = useSharedValue(0);

  const pan = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-40, 40])
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      if (event.translationX < -120 || event.velocityX < -800) {
        runOnJS(onSwipedLeft)();
      }

      translateX.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={animatedStyle} />
    </GestureDetector>
  );
};
```

For production, render the app under `GestureHandlerRootView` if the gesture is not already inside a root supplied by the app/navigation setup. The handler's callbacks can run as worklets; if `onSwipedLeft` updates React state, use the library's documented JS-thread bridge for the installed version rather than calling arbitrary JS directly from a UI-thread callback.

## Built-in alternative

For a dependency-free implementation, `PanResponder` is enough:

```tsx
const panResponder = useRef(
  PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) =>
      Math.abs(gestureState.dx) > Math.abs(gestureState.dy),
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx < -120 || gestureState.vx < -0.8) {
        onSwipedLeft();
      }
    },
  }),
).current;
```

This is a good fit for a single basic interaction. Gesture Handler is preferable when the swipe must coexist with scrolling, navigation gestures, or other touch handlers because its handlers analyze touch streams on the UI/native side ([official explanation](https://docs.swmansion.com/react-native-gesture-handler/docs/2.x/gesture-handlers/about-handlers/)).

## Recommendation

Install `react-native-gesture-handler` and `react-native-reanimated` with `npx expo install`, then implement the interaction with `Gesture.Pan()` and an animated `translateX`. Choose a distance threshold such as `120` points and a velocity threshold such as `800` points/second, and snap the card back with `withSpring` unless the swipe is accepted. Adjust those thresholds after testing on both iOS and Android.

## Sources

- [React Native PanResponder](https://reactnative.dev/docs/panresponder)
- [React Native Gesture Responder System](https://reactnative.dev/docs/gesture-responder-system)
- [Expo Gesture Handler documentation](https://docs.expo.dev/versions/latest/sdk/gesture-handler/)
- [React Native Gesture Handler getting started](https://docs.swmansion.com/react-native-gesture-handler/docs/)
- [React Native Gesture Handler Pan gesture](https://docs.swmansion.com/react-native-gesture-handler/docs/2.x/gestures/pan-gesture/)
- [React Native Gesture Handler Fling gesture](https://docs.swmansion.com/react-native-gesture-handler/docs/2.x/gesture-handlers/fling-gh/)
- [Expo Reanimated documentation](https://docs.expo.dev/versions/latest/sdk/reanimated/)
- [React Native Reanimated animations](https://docs.swmansion.com/react-native-reanimated/docs/category/animations/)
