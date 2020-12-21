// https://www.npmjs.com/package/aria-tablist
import AriaTablist from "aria-tablist";

console.log(AriaTablist);

const tabs = document.querySelectorAll('[role="tablist"]');
tabs.forEach(t => {
  AriaTablist(t);
});