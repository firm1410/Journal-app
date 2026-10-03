# How `useRecordingAnimationController` works

## Short answer

`useRecordingAnimationController` turns recording state into the geometry and lifecycle for a full-screen reveal animation. It measures the floating record button, creates one stable `Animated.Value` named `progress`, maps `progress` from `0 → 1` to both circle scale and content opacity, and keeps the modal mounted during the reverse animation after recording has already been stopped. The hook owns animation state, but it does **not** own recording state; `useRecordingController` does.

The implementation is in [`useRecordingAnimationController.ts`](/Users/pranitarnfuaengfuvongrat/Documents/Journal-app/src/shared/navigation/components/RecordingControl/controllers/useRecordingAnimationController.ts:12). Its only caller is [`RecordingControl.tsx`](/Users/pranitarnfuaengfuvongrat/Documents/Journal-app/src/shared/navigation/components/RecordingControl/RecordingControl.tsx:6), which connects the recording controller, animation controller, record button, and modal.

## Component and state flow

```text
Navigation
  └─ RecordingControl
       ├─ useRecordingController
       │    ├─ isRecording ───────────────┐
       │    └─ toggleRecording ────────┐  │
       ├─ useRecordingAnimationController│  │
       │    inputs: isOpen ◀────────────┘  │
       │            toggleRecording ◀─────┘
       │    outputs: measured center, diameter,
       │             progress, scale, visibility,
       │             closeModal
       ├─ RecordButton (measured origin + starts recording)
       └─ RecordingModal (renders animation + stops recording)
```

`Navigation` places `RecordingControl` in the center slot of the bottom navigation ([`Navigation.tsx`](/Users/pranitarnfuaengfuvongrat/Documents/Journal-app/src/shared/navigation/Navigation.tsx:11)). `RecordingControl` passes `isRecording` into the animation hook as `isOpen` and passes the same recording toggle into both the hook and the visible record button ([`RecordingControl.tsx`](/Users/pranitarnfuaengfuvongrat/Documents/Journal-app/src/shared/navigation/components/RecordingControl/RecordingControl.tsx:7)). It then forwards every animation output to `RecordingModal` ([`RecordingControl.tsx`](/Users/pranitarnfuaengfuvongrat/Documents/Journal-app/src/shared/navigation/components/RecordingControl/RecordingControl.tsx:22)).

The modal does no animation orchestration itself. It renders the expanding circle with `circleScale`, fades its content with `progress`, positions its stop button at `center`, and sends both the stop-button press and native modal-close request to `closeModal` ([`RecordingModal.tsx`](/Users/pranitarnfuaengfuvongrat/Documents/Journal-app/src/shared/navigation/components/RecordingControl/components/RecordingModal/RecordingModal.tsx:41)).

## Internal values

| Value | Role |
| --- | --- |
| `BUTTON_SIZE = 72` | Assumed initial visual diameter and returned stop-button size ([source](/Users/pranitarnfuaengfuvongrat/Documents/Journal-app/src/shared/navigation/components/RecordingControl/controllers/useRecordingAnimationController.ts:4)). The record button is independently styled as `72 × 72`, so these values must remain synchronized ([source](/Users/pranitarnfuaengfuvongrat/Documents/Journal-app/src/shared/navigation/components/RecordingControl/components/RecordButton/RecordButton.tsx:47)). |
| `ANIMATION_DURATION = 550` | Duration in milliseconds for both opening and closing timing animations ([source](/Users/pranitarnfuaengfuvongrat/Documents/Journal-app/src/shared/navigation/components/RecordingControl/controllers/useRecordingAnimationController.ts:5)). |
| `buttonRef` | Ref to the native-backed `Pressable`/view that is measured in window coordinates ([hook](/Users/pranitarnfuaengfuvongrat/Documents/Journal-app/src/shared/navigation/components/RecordingControl/controllers/useRecordingAnimationController.ts:17), [consumer](/Users/pranitarnfuaengfuvongrat/Documents/Journal-app/src/shared/navigation/components/RecordingControl/components/RecordButton/RecordButton.tsx:23)). |
| `buttonPosition` | Measured center of the button. It starts at `{x: 0, y: 0}` ([source](/Users/pranitarnfuaengfuvongrat/Documents/Journal-app/src/shared/navigation/components/RecordingControl/controllers/useRecordingAnimationController.ts:18)). |
| `isClosing` | React state that preserves the modal while the reverse animation finishes ([source](/Users/pranitarnfuaengfuvongrat/Documents/Journal-app/src/shared/navigation/components/RecordingControl/controllers/useRecordingAnimationController.ts:19)). |
| `progress` | A stable scalar `Animated.Value`, initially `0`, created only on the first render through lazy `useState` ([source](/Users/pranitarnfuaengfuvongrat/Documents/Journal-app/src/shared/navigation/components/RecordingControl/controllers/useRecordingAnimationController.ts:20)). React Native explicitly supports one animated value driving multiple synchronized properties ([official `Animated.Value` docs](https://reactnative.dev/docs/0.86/animatedvalue)). |

## Geometry

### 1. Locate the animation origin

When the record button lays out, its `onLayout` calls `handleButtonLayout` ([`RecordButton.tsx`](/Users/pranitarnfuaengfuvongrat/Documents/Journal-app/src/shared/navigation/components/RecordingControl/components/RecordButton/RecordButton.tsx:29)). The handler calls `measureInWindow` and converts the returned top-left coordinate plus width/height into the button center:

```text
centerX = x + measuredWidth / 2
centerY = y + measuredHeight / 2
```

That calculation is implemented in the hook ([source](/Users/pranitarnfuaengfuvongrat/Documents/Journal-app/src/shared/navigation/components/RecordingControl/controllers/useRecordingAnimationController.ts:41)). React Native defines `measureInWindow` as asynchronous measurement in the current window and returns `x`, `y`, `width`, and `height` ([official measurement docs](https://reactnative.dev/docs/0.86/legacy/direct-manipulation#measureinwindowcallback)).

Before a non-zero measurement exists, `center` falls back to horizontal center and `height - 36`, which approximates a bottom-centered 72 px button ([source](/Users/pranitarnfuaengfuvongrat/Documents/Journal-app/src/shared/navigation/components/RecordingControl/controllers/useRecordingAnimationController.ts:21)).

### 2. Build a circle large enough to cover the window

The hook finds the farther horizontal edge and farther vertical edge from the center, then uses the Pythagorean distance to that implied farthest corner:

```text
horizontalRadius = max(centerX, windowWidth - centerX)
verticalRadius   = max(centerY, windowHeight - centerY)
radius           = hypot(horizontalRadius, verticalRadius)
circleDiameter   = radius * 2
```

This guarantees that a circle at full scale reaches all four window corners, assuming the center and window dimensions share the same coordinate space ([source](/Users/pranitarnfuaengfuvongrat/Documents/Journal-app/src/shared/navigation/components/RecordingControl/controllers/useRecordingAnimationController.ts:25)). `useWindowDimensions` updates when the screen size changes, so the diameter is recomputed after a window-size change ([official docs](https://reactnative.dev/docs/0.86/usewindowdimensions)).

### 3. Make the full-size circle initially look button-sized

The actual rendered circle always has `circleDiameter × circleDiameter` layout dimensions and is centered on the measured button ([`RecordingModal.tsx`](/Users/pranitarnfuaengfuvongrat/Documents/Journal-app/src/shared/navigation/components/RecordingControl/components/RecordingModal/RecordingModal.tsx:51)). The hook interpolates:

```text
progress 0 → scale 72 / circleDiameter
progress 1 → scale 1
```

At progress `0`, the rendered diameter is therefore `circleDiameter × (72 / circleDiameter) = 72`; at `1`, it is the full coverage diameter ([source](/Users/pranitarnfuaengfuvongrat/Documents/Journal-app/src/shared/navigation/components/RecordingControl/controllers/useRecordingAnimationController.ts:32)). React Native interpolation maps an input range to an output range, and it is linear here because no interpolation easing is specified ([official docs](https://reactnative.dev/docs/0.86/animatedvalue#interpolate)).

## Open sequence

1. Pressing the idle record button calls `toggleRecording` directly ([`RecordButton.tsx`](/Users/pranitarnfuaengfuvongrat/Documents/Journal-app/src/shared/navigation/components/RecordingControl/components/RecordButton/RecordButton.tsx:23)).
2. `useRecordingController` requests microphone permission, configures audio, opens the transcription socket, sends the start message, and starts the audio stream ([`useRecordingController.ts`](/Users/pranitarnfuaengfuvongrat/Documents/Journal-app/src/shared/navigation/components/RecordingControl/controllers/useRecordingController.ts:54)).
3. `isRecording` does not become true until the socket's `onReady` handler runs ([`useRecordingController.ts`](/Users/pranitarnfuaengfuvongrat/Documents/Journal-app/src/shared/navigation/components/RecordingControl/controllers/useRecordingController.ts:37)). Consequently, the reveal starts on socket readiness, not immediately on the user's press.
4. When `isOpen` becomes true, the effect stops any current animation, snaps `progress` to `0`, and times it to `1` over 550 ms with `Easing.out(Easing.cubic)` ([source](/Users/pranitarnfuaengfuvongrat/Documents/Journal-app/src/shared/navigation/components/RecordingControl/controllers/useRecordingAnimationController.ts:52)). The “out” cubic curve runs quickly at first and slows toward the end; React Native documents `out` as running an easing function backwards ([official Easing docs](https://reactnative.dev/docs/0.86/easing)).
5. During the same 0→1 transition, the circle grows to cover the screen and the content opacity changes from transparent to opaque ([`RecordingModal.tsx`](/Users/pranitarnfuaengfuvongrat/Documents/Journal-app/src/shared/navigation/components/RecordingControl/components/RecordingModal/RecordingModal.tsx:51)).

Both timing animations use `useNativeDriver: true` ([open](/Users/pranitarnfuaengfuvongrat/Documents/Journal-app/src/shared/navigation/components/RecordingControl/controllers/useRecordingAnimationController.ts:59), [close](/Users/pranitarnfuaengfuvongrat/Documents/Journal-app/src/shared/navigation/components/RecordingControl/controllers/useRecordingAnimationController.ts:74)). React Native sends native-driven animation configuration to native before starting, allowing it to continue on the UI thread without a JS bridge round trip per frame ([official Animated docs](https://reactnative.dev/docs/0.86/animated#using-the-native-driver)). The hook animates only `transform: scale` and `opacity`; the circle's size and position are ordinary static styles for that render ([`RecordingModal.tsx`](/Users/pranitarnfuaengfuvongrat/Documents/Journal-app/src/shared/navigation/components/RecordingControl/components/RecordingModal/RecordingModal.tsx:53)).

## Close sequence

1. The modal stop button or Android/Apple TV close request calls `closeModal` ([`RecordingModal.tsx`](/Users/pranitarnfuaengfuvongrat/Documents/Journal-app/src/shared/navigation/components/RecordingControl/components/RecordingModal/RecordingModal.tsx:42)). React Native documents `onRequestClose` as the callback for Android hardware back and Apple TV menu presses ([official Modal docs](https://reactnative.dev/docs/0.86/modal#onrequestclose)).
2. If the hook is already in a rendered `isClosing === true` state, it returns early. Otherwise it sets `isClosing` true, stops the current animation, and times the current `progress` value to `0` over 550 ms with `Easing.in(Easing.cubic)` ([source](/Users/pranitarnfuaengfuvongrat/Documents/Journal-app/src/shared/navigation/components/RecordingControl/controllers/useRecordingAnimationController.ts:67)). Unlike opening, closing does not reset progress to `1`, so stopping during an incomplete opening reverses from the current visual value.
3. It calls `toggleRecording()` immediately and deliberately discards its promise; it does **not** wait for the closing animation ([source](/Users/pranitarnfuaengfuvongrat/Documents/Journal-app/src/shared/navigation/components/RecordingControl/controllers/useRecordingAnimationController.ts:85)). In the expected recording branch, `toggleRecording` calls `disconnect`, which sets `isRecording` false before closing the socket ([`useRecordingController.ts`](/Users/pranitarnfuaengfuvongrat/Documents/Journal-app/src/shared/navigation/components/RecordingControl/controllers/useRecordingController.ts:47)).
4. Although `isOpen` is now false, `isVisible = isOpen || isClosing` keeps the modal mounted ([source](/Users/pranitarnfuaengfuvongrat/Documents/Journal-app/src/shared/navigation/components/RecordingControl/controllers/useRecordingAnimationController.ts:88)). The stop button is disabled during this phase ([`RecordingModal.tsx`](/Users/pranitarnfuaengfuvongrat/Documents/Journal-app/src/shared/navigation/components/RecordingControl/components/RecordingModal/RecordingModal.tsx:70)).
5. A normally completed reverse animation reports `{finished: true}` and clears `isClosing`; the next render makes `isVisible` false, and `RecordingModal` returns `null` ([hook](/Users/pranitarnfuaengfuvongrat/Documents/Journal-app/src/shared/navigation/components/RecordingControl/controllers/useRecordingAnimationController.ts:79), [modal](/Users/pranitarnfuaengfuvongrat/Documents/Journal-app/src/shared/navigation/components/RecordingControl/components/RecordingModal/RecordingModal.tsx:37)). React Native specifies `finished: false` when an animation is interrupted ([official Animated docs](https://reactnative.dev/docs/0.86/animated#working-with-animations)).

The `Modal` itself uses `animationType="none"`, so this custom circle/fade is the only enter/exit animation ([source](/Users/pranitarnfuaengfuvongrat/Documents/Journal-app/src/shared/navigation/components/RecordingControl/components/RecordingModal/RecordingModal.tsx:42)). It is transparent and extends beneath Android system bars because both translucency props are set ([source](/Users/pranitarnfuaengfuvongrat/Documents/Journal-app/src/shared/navigation/components/RecordingControl/components/RecordingModal/RecordingModal.tsx:43), [official Modal docs](https://reactnative.dev/docs/0.86/modal)).

## Returned interface

The hook returns three kinds of values ([source](/Users/pranitarnfuaengfuvongrat/Documents/Journal-app/src/shared/navigation/components/RecordingControl/controllers/useRecordingAnimationController.ts:88)):

- Measurement: `buttonRef`, `handleButtonLayout`, and computed `center`.
- Visual geometry: `buttonSize`, `circleDiameter`, `circleScale`, and `progress`.
- Lifecycle/control: `closeModal`, `isClosing`, and derived `isVisible`.

This is a useful separation: the controller computes and orchestrates, while `RecordingModal` renders declaratively from those outputs.

## Edge cases and current limitations

These are direct consequences of the current source, not necessarily intended behavior.

1. **An external recording stop has no exit animation.** The effect ignores `isOpen === false`; only `closeModal` sets `isClosing` and starts the reverse animation ([source](/Users/pranitarnfuaengfuvongrat/Documents/Journal-app/src/shared/navigation/components/RecordingControl/controllers/useRecordingAnimationController.ts:52)). If the socket closes on its own, `handleClose` sets `isRecording` false ([source](/Users/pranitarnfuaengfuvongrat/Documents/Journal-app/src/shared/navigation/components/RecordingControl/controllers/useRecordingController.ts:41)); with `isClosing` still false, `isVisible` becomes false immediately.
2. **A cancelled close animation can leave `isClosing` stuck true.** The callback clears it only when `finished` is true ([source](/Users/pranitarnfuaengfuvongrat/Documents/Journal-app/src/shared/navigation/components/RecordingControl/controllers/useRecordingAnimationController.ts:79)). React Native says `stopAnimation()` stops a running animation and interrupted animation completion reports `finished: false` ([`Animated.Value` docs](https://reactnative.dev/docs/0.86/animatedvalue#stopanimation), [`Animated` docs](https://reactnative.dev/docs/0.86/animated#working-with-animations)). If another path interrupts closing and no later successful close runs, visibility remains true because `isClosing` remains true.
3. **The fallback treats valid zero coordinates as “not measured.”** `buttonPosition.x || fallback` and the corresponding `y` use truthiness ([source](/Users/pranitarnfuaengfuvongrat/Documents/Journal-app/src/shared/navigation/components/RecordingControl/controllers/useRecordingAnimationController.ts:21)). A button whose measured center is exactly `0` on either axis would use the fallback for that axis.
4. **Measurement is asynchronous.** `measureInWindow` invokes an asynchronous callback ([official docs](https://reactnative.dev/docs/0.86/legacy/direct-manipulation#measureinwindowcallback)). If recording becomes ready before the callback stores the real center, the modal begins from the fallback center and can reposition when measurement arrives.
5. **Resize updates geometry but does not remeasure the button directly.** `useWindowDimensions` updates `width` and `height`, recalculating fallback center and diameter ([hook](/Users/pranitarnfuaengfuvongrat/Documents/Journal-app/src/shared/navigation/components/RecordingControl/controllers/useRecordingAnimationController.ts:16), [official docs](https://reactnative.dev/docs/0.86/usewindowdimensions)). The actual `buttonPosition` changes only when the button receives another `onLayout`, so correctness after a window change relies on that layout event occurring.
6. **The duplicate-close guard is render-based, not synchronous.** `setIsClosing(true)` schedules a React state update, while the callback closes over the current `isClosing` value ([source](/Users/pranitarnfuaengfuvongrat/Documents/Journal-app/src/shared/navigation/components/RecordingControl/controllers/useRecordingAnimationController.ts:67)). Two close invocations before the rerender can both see false. After rerender, both the early return and the disabled stop button protect against repeats.
7. **Opening always snaps to zero.** The open effect stops the current animation and calls `setValue(0)` before timing to `1` ([source](/Users/pranitarnfuaengfuvongrat/Documents/Journal-app/src/shared/navigation/components/RecordingControl/controllers/useRecordingAnimationController.ts:57)). React Native documents that `setValue` stops a running animation and updates bound properties immediately ([official docs](https://reactnative.dev/docs/0.86/animatedvalue#setvalue)), so a reopen during another transition would visually jump back to button size before expanding.
8. **The transcription is currently always empty.** The recording controller initializes `transcribe` to `""` ([source](/Users/pranitarnfuaengfuvongrat/Documents/Journal-app/src/shared/navigation/components/RecordingControl/controllers/useRecordingController.ts:15)), but `handleMessage` only displays errors and logs messages; it never calls `setTranscribe` ([source](/Users/pranitarnfuaengfuvongrat/Documents/Journal-app/src/shared/navigation/components/RecordingControl/controllers/useRecordingController.ts:30)). The modal correctly renders the passed value, but the upstream value never changes in the present implementation ([source](/Users/pranitarnfuaengfuvongrat/Documents/Journal-app/src/shared/navigation/components/RecordingControl/components/RecordingModal/RecordingModal.tsx:66)).
9. **The animation hook does not stop the audio stream.** `closeModal` delegates entirely to `toggleRecording` ([source](/Users/pranitarnfuaengfuvongrat/Documents/Journal-app/src/shared/navigation/components/RecordingControl/controllers/useRecordingAnimationController.ts:85)); the current disconnect branch clears recording state and closes the socket but does not call `stream.stop()` ([source](/Users/pranitarnfuaengfuvongrat/Documents/Journal-app/src/shared/navigation/components/RecordingControl/controllers/useRecordingController.ts:47)). This is outside animation ownership, but it is part of the close data flow.

## Dependencies and ownership boundary

- **React:** `useEffect` reacts to `isOpen`; `useCallback` stabilizes handlers; `useMemo` derives diameter/interpolation; `useRef` stores the view; and `useState` stores position, close lifecycle, and the stable animated value ([imports](/Users/pranitarnfuaengfuvongrat/Documents/Journal-app/src/shared/navigation/components/RecordingControl/controllers/useRecordingAnimationController.ts:1)).
- **React Native:** `Animated` and `Easing` execute the transitions, `useWindowDimensions` supplies coverage bounds, and `View` supplies the measurement ref ([imports](/Users/pranitarnfuaengfuvongrat/Documents/Journal-app/src/shared/navigation/components/RecordingControl/controllers/useRecordingAnimationController.ts:2)).
- **Recording controller:** owns permission, socket/audio setup, and the `isRecording` truth that opens the modal ([source](/Users/pranitarnfuaengfuvongrat/Documents/Journal-app/src/shared/navigation/components/RecordingControl/controllers/useRecordingController.ts:13)).
- **Rendering components:** `RecordButton` provides the origin and starts recording; `RecordingModal` consumes all animation outputs and provides the close interaction ([wiring](/Users/pranitarnfuaengfuvongrat/Documents/Journal-app/src/shared/navigation/components/RecordingControl/RecordingControl.tsx:13)).

## Sources

Repository sources are linked inline to exact local lines. External claims use first-party React Native 0.86 documentation, matching the repository's `react-native` dependency version declared in [`package.json`](/Users/pranitarnfuaengfuvongrat/Documents/Journal-app/package.json:20):

- [React Native 0.86: Animated](https://reactnative.dev/docs/0.86/animated)
- [React Native 0.86: Animated.Value](https://reactnative.dev/docs/0.86/animatedvalue)
- [React Native 0.86: Easing](https://reactnative.dev/docs/0.86/easing)
- [React Native 0.86: Modal](https://reactnative.dev/docs/0.86/modal)
- [React Native 0.86: useWindowDimensions](https://reactnative.dev/docs/0.86/usewindowdimensions)
- [React Native 0.86: measureInWindow](https://reactnative.dev/docs/0.86/legacy/direct-manipulation#measureinwindowcallback)
