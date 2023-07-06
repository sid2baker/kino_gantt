import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import "./main.css";
import { gantt } from "dhtmlx-gantt";

export function init(ctx, data) {
  ctx.importCSS("main.css");
  ctx.root.innerHTML = `
    <button id="fullscreenButton">⛶</button>
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
  gantt.config.details_on_create = false;

  let today = new Date()
  let startOfWeek = getStartOfWeek();
  gantt.config.start_date = gantt.date.add(startOfWeek, -8, "week");
  gantt.config.end_date = gantt.date.add(startOfWeek, 1, "year");

  gantt.config.order_branch = true;
  gantt.config.order_branch_free = true;
  gantt.config.server_utc = true;
  gantt.config.drag_links = false;

  const textEditor = { type: "text", map_to: "text" };
  const dateEditor = {
    type: "date", map_to: "end_date",
    min: today
  };
  const durationEditor = { type: "number", map_to: "duration", min: 0 };

  gantt.config.columns = [
    { name: "text", label: "Project", tree: true, width: '*', editor: textEditor },
    { name: "duration", label: "Duration", align: "center", editor: durationEditor },
    { name: "add", label: "" }
  ];

  gantt.config.duration_unit = "week";
  gantt.config.duration_step = 1;

  gantt.plugins({
    fullscreen: true,
    marker: true,
  });

  gantt.addMarker({
    start_date: today,
    css: "today",
    text: "Today",
    title: "Today"
  });

  //gantt.config = config;
  console.log(gantt.config);

  gantt.init("gantt");

  console.log(gantt_data);
  if (Object.keys(gantt_data).length !== 0) {
    gantt.parse(gantt_data);
  }

  gantt.setSizes();

  gantt.attachEvent("onAfterTaskAdd", function(id, _task) {
    pushUpdatedGantt(ctx, "task_added", id, gantt);
  });

  gantt.attachEvent("onAfterTaskUpdate", function(id, _task) {
    pushUpdatedGantt(ctx, "task_updated", id, gantt);
  });

  gantt.attachEvent("onAfterTaskDelete", function(id) {
    pushUpdatedGantt(ctx, "task_deleted", id, gantt);
  });

  gantt.attachEvent("onAfterLinkAdd", function(id, _link) {
    pushUpdatedGantt(ctx, "link_added", id, gantt);
  });

  gantt.attachEvent("onAfterLinkUpdate", function(id, _link) {
    pushUpdatedGantt(ctx, "link_updated", id, gantt);
  });

  gantt.attachEvent("onAfterLinkDelete", function(id) {
    pushUpdatedGantt(ctx, "link_deleted", id, gantt);
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
    console.log("Strucutred data");
    console.log(data);
    gantt.parse(data);
  });

  ctx.handleEvent("add_task", ({ name, duration }) => {
    let task_id = gantt.addTask({
      text: name,
      start_date: startOfWeek,
      duration: duration
    });
    console.log(task_id);
  });

  document.getElementById("fullscreenButton").addEventListener("click", function() {
    gantt.ext.fullscreen.toggle();
  });
}

function pushUpdatedGantt(ctx, action, id, gantt) {
  console.log(ctx);
  ctx.pushEvent("gantt_changed", { action: action, id: id, data: gantt.serialize() });
}

function getStartOfWeek() {
  let today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  let dayOfWeek = today.getDay();
  return new Date(today.setDate(today.getDate() - dayOfWeek + 1));
}
