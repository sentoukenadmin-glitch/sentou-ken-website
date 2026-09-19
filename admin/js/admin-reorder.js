/**
 * admin-reorder.js — shared "Move Up / Move Down" reordering for admin list
 * tables backed by a numeric `sort_order` column (Gallery Photos, Team,
 * Achievements, Announcements).
 *
 * HOW IT WORKS: each admin page loads its list already sorted the way it's
 * currently shown (ascending by sort_order). Clicking the up/down arrow on a
 * row swaps that row's sort_order with its neighbour's, saves both rows to
 * Supabase, then re-runs the page's own reload function so the table (and,
 * a few seconds later, the public site) reflects the confirmed new order —
 * never just a guessed client-side reshuffle.
 *
 * Include this AFTER supabase-config.js on any admin page that needs it.
 */

// Moves the item at `index` up (direction -1) or down (direction 1) within
// `sortedList` (the array currently rendered, in display order) by swapping
// its sort_order with the neighbour it's moving past.
async function moveItem(tableName, sortedList, index, direction, reloadFn) {
  var otherIndex = index + direction;
  if (otherIndex < 0 || otherIndex >= sortedList.length) return;

  var a = sortedList[index];
  var b = sortedList[otherIndex];
  var aOrder = (a.sort_order !== null && a.sort_order !== undefined) ? a.sort_order : index;
  var bOrder = (b.sort_order !== null && b.sort_order !== undefined) ? b.sort_order : otherIndex;

  // Legacy rows that were never explicitly ordered can share the same
  // sort_order (e.g. everything still at the default 0) — swapping identical
  // numbers wouldn't move anything, so fall back to swapping by position.
  if (aOrder === bOrder) { aOrder = index; bOrder = otherIndex; }

  await supabaseClient.from(tableName).update({ sort_order: bOrder }).eq("id", a.id);
  await supabaseClient.from(tableName).update({ sort_order: aOrder }).eq("id", b.id);
  await reloadFn();
}

// Returns the two-button HTML (up/down arrows) for one row. `index`/`total`
// decide which arrows are disabled (top row can't move up, bottom can't move
// down).
function reorderButtonsHtml(index, total) {
  return '<button type="button" class="admin-btn secondary" style="padding:4px 10px;" data-move-up="' + index + '"' +
    (index === 0 ? " disabled" : "") + ' title="Move up">&uarr;</button> ' +
    '<button type="button" class="admin-btn secondary" style="padding:4px 10px;" data-move-down="' + index + '"' +
    (index === total - 1 ? " disabled" : "") + ' title="Move down">&darr;</button>';
}

// Call once right after the row HTML (built using reorderButtonsHtml above)
// is inserted into `containerEl`, passing the same `sortedList` and a
// reload function that re-fetches + re-renders the list.
function wireReorderButtons(containerEl, tableName, sortedList, reloadFn) {
  containerEl.querySelectorAll("[data-move-up]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      moveItem(tableName, sortedList, parseInt(btn.getAttribute("data-move-up"), 10), -1, reloadFn);
    });
  });
  containerEl.querySelectorAll("[data-move-down]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      moveItem(tableName, sortedList, parseInt(btn.getAttribute("data-move-down"), 10), 1, reloadFn);
    });
  });
}

// Next sort_order value to give a brand-new row so it lands at the END of
// the current order instead of jumping to the front (the default column
// value is 0, which would otherwise outrank everything already ordered).
function nextSortOrder(sortedList) {
  if (!sortedList || !sortedList.length) return 1;
  var max = 0;
  sortedList.forEach(function (item) {
    if (typeof item.sort_order === "number" && item.sort_order > max) max = item.sort_order;
  });
  return max + 1;
}
