import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import "./main.css";
import { gantt } from "dhtmlx-gantt";

export function init(ctx, data) {
  ctx.importCSS("main.css");
  ctx.root.innerHTML = `
    <button id="fullscreenButton">Fullscreen</button>
    <div id="gantt" />
  `
  const { config, gantt_data } = data;

  let zoomConfig = {
    levels: [
      {
        name: "week",
        scale_height: 30,
        min_column_width: 30,
        scales: [
          { unit: "week", step: 1, format: "%W" }
        ]
      },
      {
        name: "month",
        scale_height: 50,
        min_column_width: 50,
        scales: [
          { unit: "month", step: 1, format: "%M.%y" }
        ]
      }
    ]
  }

  gantt.ext.zoom.init(zoomConfig);

  gantt.config.lightbox.sections = [
    { name: "description", height: 70, map_to: "text", type: "textarea", focus: true },
    { name: "time", type: "duration", map_to: "auto" },
    { name: "end_date", map_to: "end_date", type: "date", time_format: ["%d", "%m", "%Y"] }
  ];

  let today = new Date();
  gantt.config.start_date = gantt.date.add(today, -8, "week");
  gantt.config.end_date = gantt.date.add(today, 1, "year");

  gantt.config.work_time = true;

  gantt.config.order_branch = true;
  gantt.config.order_branch_free = true;

  const textEditor = { type: "text", map_to: "text" };
  const dateEditor = {
    type: "date", map_to: "start_date",
    min: today
  };
  const durationEditor = { type: "number", map_to: "duration", min: 0, max: 100 }

  gantt.config.columns = [
    { name: "text", label: "Task name", tree: true, width: '*', editor: textEditor },
    { name: "start_date", label: "Start time", align: "center", editor: dateEditor },
    { name: "duration", label: "Duration", align: "center", editor: durationEditor },
    { name: "add", label: "" }
  ];

  gantt.config.duration_unit = "day";

  gantt.plugins({
    fullscreen: true,
    marker: true,
  });

  gantt.addMarker({
    start_date: today,
    css: "today",
    text: "Now",
    title: "TEST"
  });

  //gantt.config = config;
  console.log(gantt.config);

  gantt.init("gantt");

  gantt.addCalendar({
    id: "default",
    worktime: {
      hours: ["8:00-17:00"],
      days: [1, 1, 1, 1, 1, 1, 1]
    }
  });

  console.log(gantt_data);
  if (Object.keys(gantt_data).length !== 0) {
    gantt.parse(gantt_data);
  }

  gantt.setSizes();

  gantt.attachEvent("onAfterTaskAdd", function(_id, _task) {
    pushUpdatedGantt(ctx, gantt);
  });

  gantt.attachEvent("onAfterTaskUpdate", function(_id, _task) {
    pushUpdatedGantt(ctx, gantt);
  });

  gantt.attachEvent("onAfterTaskDelete", function(_id) {
    pushUpdatedGantt(ctx, gantt);
  });

  gantt.attachEvent("onAfterLinkAdd", function(_id, _link) {
    pushUpdatedGantt(ctx, gantt);
  });

  gantt.attachEvent("onAfterLinkUpdate", function(_id, _link) {
    pushUpdatedGantt(ctx, gantt);
  });

  gantt.attachEvent("onAfterLinkDelete", function(_id) {
    pushUpdatedGantt(ctx, gantt);
  });

  gantt.attachEvent("onAfterTaskUpdate", function(_id, _item) {
    pushUpdatedGantt(ctx, gantt);
  });

  ctx.handleEvent("trigger", ({ func, args }) => {
    switch (func) {
      case "fullscreen":
        gantt.ext.fullscreen.toggle();
        break;
      case "zoom":
        gantt.ext.zoom.setLevel(args);
        break;
      default:
        console.log(`Unkown function ${func}.`);
    }
  });

  ctx.handleEvent("gantt_changed", (data) => {
    gantt.parse(data);
  });

  ctx.handleEvent("add_task", ({ id, text, start_date, duration }) => {
    gantt.addTask({
      text: text,
      start_date: today,
      duration: duration
    })
  });

  document.getElementById("fullscreenButton").addEventListener("click", function() {
    gantt.ext.fullscreen.toggle();
  });
}

function pushUpdatedGantt(ctx, gantt) {
  ctx.pushEvent("gantt_changed", gantt.serialize());
}
