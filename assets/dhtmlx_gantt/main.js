import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import { gantt } from "dhtmlx-gantt";

export function init(ctx, data) {
  ctx.importCSS("main.css");

  gantt.config.columns = [
    { name: "text", label: "Task name", tree: true, width: '*' },
    { name: "start_date", label: "Start time", align: "center" },
    { name: "duration", label: "Duration", align: "center" },
    { name: "add", label: "" }
  ];

  gantt.config.scales = [
    {
      unit: "week", step: 1, format: function(date) {
        return "Week #" + gantt.date.getWeek(date);
      }
    }
  ];

  gantt.config.start_date = new Date("2023-01-01");
  gantt.config.end_date = new Date("2024-01-01");

  gantt.plugins({
    fullscreen: true,
    marker: true
  });

  gantt.addMarker({
    start_date: new Date(),
    css: "today",
    text: "Now",
    title: "TEST"
  });

  gantt.init(ctx.root);

  let button = document.createElement("button");

  button.innerHTML = "Fullscreen";

  button.onclick = function() {
    gantt.ext.fullscreen.toggle();
  }

  ctx.root.prepend(button);
}
