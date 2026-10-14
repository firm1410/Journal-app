# Post-recording flow

Agreed on October 13, 2026.

## Purpose and scope

The app is a personal daily capture tool: speak naturally and organize the recording into useful records. Support both quick recordings throughout the day and longer recaps, with quick daytime capture as the priority.

This document covers what happens after recording stops, through closing the review modal. Daily journal generation is outside this scope.

## Agreed flow

1. **Stop recording and save the capture.** Show an editable transcript. Users can review and confirm it now or return later.
2. **Confirm the transcript.** Generate event suggestions from the confirmed text, including any user corrections.
3. **Review event cards.** Show colored cards with visible type labels. Supported suggestions include journal memories, expenses, tasks, and calendar events. One recording can produce multiple suggestions.
4. **Select what to create.** All cards are selected initially. Provide **Select all / Unselect all** at the top, selection controls on the cards, and a delete button for unwanted suggestions.
5. **Fill details when convenient.** Cards can contain inputs for missing details. Users do not have to fill them immediately. Changing an event's type is handled elsewhere, not in this review flow.
6. **Confirm at the bottom.** Create complete selected events. Keep incomplete selected cards pending for later completion. Deselected cards remain pending unless deleted.
7. **Close the modal.** For now, confirming closes the modal without additional feedback. Users can finish even when there are no cards or no selected cards; use **Done** when nothing is selected.

## Data behavior

- The confirmed transcript remains saved as the daily record, including when no events are created.
- Deleting a card removes only that suggestion, not the underlying transcript content.
- Selecting a card does not create an event until the user confirms.
- Missing details must not block saving the capture or finishing the review.
- No additional questionnaire is required after recording. The transcript supplies context to the LLM; card inputs collect missing details for individual events.

## Example

Confirmed transcript: “Had lunch with May, need to send her the photos tomorrow.”

The app can suggest a memory, an expense with a missing amount, and a task. The user can delete unwanted suggestions and confirm the remaining selection. Complete selected items are created; the expense stays pending if its required details are still missing. The modal closes and the transcript remains saved.

## Deferred decisions

- Pending items can be completed from Home or their corresponding event page. Their layout and completion flow belong to a later session.
- Event type changes and editing outside this modal belong to a later session.
- Feedback in the breadcrumb may be added later. It is not part of the current modal-close behavior.
- Daily journal generation, timing, and review belong to a separate session.
