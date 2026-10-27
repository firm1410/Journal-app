# Interactive UI preview

The feature pages follow `journal-product-plan.html` using the existing orange palette and neumorphic surfaces. The microphone opens the existing RecordingControl and RecordingModal without replacing their behavior. Home, Journal, Plan, and Library retain their original navigation icons and positions. The former To-do and Tracker routes are now `/plan` and `/library`; Budget is at `/budget` inside Library.

## Open the preview

Run `npm run web` (or `npm run ios` for a native preview). On sign-in, choose **Explore with sample data**. This enters a separate in-memory preview without authenticating or calling the data API. Reloading restores the initial examples.

## Pages and interactions

- **Home:** today's appointments, completeable tasks and overdue work, source count, known spending, and missing-price purchases from every date. Editing a missing price updates Budget too.
- **Plan:** Calendar/To-do, date navigation, event creation/editing with time and duration, optional task due dates, completion and reopening.
- **Journal:** browse days, review/edit/move/delete transcripts, manually assemble a sample story, and add/remove day-specific activity tags.
- **Library:** search items or dated purchase history, choose collections, filter Book reading status, wishlist, or history date ranges, and inspect/edit item fields and history.
- **Item detail:** ownership, reading status, author, custom fields, dated purchases, and a Budget link. Archiving hides the item while keeping purchases.
- **Budget:** day/week/month-to-date totals, category breakdown and filtering, missing-price filtering, and purchase editing. Weeks begin on Monday; unknown prices never count as zero-price purchases in the totals.
- **Capture:** the existing recording, transcript editing, and confirmation modal is preserved. Its components and controller are independent of the sample page data.
- **Supporting sheets:** task/event/purchase/source editors, new items, new collections, custom field definitions, and activity tags. Custom fields support text, numbers, dates, checkboxes, single/multiple choices, and item links.

## Boundaries

The pages use sample data. The center microphone runs the existing recording controller and modal; it does not use a replacement demo capture flow. Saving in that modal does not populate the in-memory page examples.

The Journal sample story joins the saved transcripts. There is no AI generation, scheduled 21:00 job, persistence across reloads, or backend synchronization. Authenticated sign-in remains available, but these feature pages clearly display sample data. The recording implementation is preserved separately from the sample-page data.

The October 27 database rules guide the sample behavior: deleting a transcript keeps independent cards; moving a transcript does not move saved purchases/tasks/events; transcript changes clear the affected sample summary; custom values are retained when switching collections; manually edited tags stay independent of summaries.

Run `npm run typecheck`, `npm run lint`, and `npm test -- --runInBand` for checks. Integration tests cover task completion, cross-page price updates, independent saved cards, and configurable item fields. Existing recording-cancellation tests remain in place. Native microphone/backend integration and on-device touch testing remain separate work.
