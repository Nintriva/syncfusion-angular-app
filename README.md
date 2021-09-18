# syncfusion-angular-app

You may borrow the source code of: https://ej2.syncfusion.com/demos/#/material/tree-grid/default-context-menu.html,
and make your improvements, the webage has to be fully responsive on mobile touchscreen.
Insert 1,000 rows (random data) to TreeGrid by default, TreeGrid shall always occupy browser full-screen, no Paging (whole
TreeGrid on single webpage), enable Vertical & Horizontal default-scroll-bars.
Please implement these features on the webpage:


**** Context Menu 1 (right-click or long-press) on any "Column Header", to pop-up these menu items:

Style: User can set current column style, e.g. Data Type, Default Value, Font, Color, Alignment, Text-wrap.

Freeze On/Off: Freeze all columns to the left of current column,

See https://ej2.syncfusion.com/demos/#/material/tree-grid/frozen-column.html

Filter On/Off: Enable Filter Bar in Parent Hierarchy Mode,

See https://ej2.syncfusion.com/demos/#/material/tree-grid/filtering.html

Multi-Sort On/Off: Enable Multi-Sort for all columns,

See https://ej2.syncfusion.com/demos/#/material/tree-grid/sorting.html

  Add; Del; Edit: Users can Add/Del/Edit columns, (also Drag-n-drop to Reorder & Resize columns).


**** Context Menu 2 (right-click or long-press) on any "Row", to pop-up these menu items:

Multi-Select On/Off: Enable users to multi-select rows on both PC and Mobile,

See https://ej2.syncfusion.com/demos/#/material/tree-grid/clipboard.html

Copy; Cut: Copy/Cut multi-selected rows - similar to how MS Windows File Explorer copy/cut Files (leaf rows) and Folders (non-leaf rows).
(The rows being Copied/Cut shall be highlighted in color, but not removed yet, until user perform Paste)
Paste as Sibling: Insert the copied/cut Rows as siblings of the current row
Paste as Child: Insert the copied/cut Rows as children of the current row
Add; Del; Edit: Users can Add/Del/"Dialog-Edit" rows in Row-Editing-Mode, (also Drag-n-drop to move multi-selected rows in TreeGrid).


**** Also:
Tech stack: Make full use of Syncfusion EJ2 Angular TreeGrid. Whatever Syncfusion does not support, you'll have to write code to implement.

Any question regarding this test task, please feel free to ask us using Upwork message.
