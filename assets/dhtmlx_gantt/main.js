import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import { gantt } from "dhtmlx-gantt";

export function init(ctx, data) {
  ctx.importCSS("main.css");

  const { config, gantt_data } = data;

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

  gantt.config.lightbox.sections = [
    { name: "Title", height: 40, map_to: "text", type: "textarea", focus: true },
    { name: "time", height: 72, map_to: "auto", type: "duration" }
  ];

  gantt.config.start_date = new Date("2023-01-01");
  gantt.config.end_date = new Date("2024-01-01");

  gantt.config.order_branch = true;
  gantt.config.order_branch_free = true;

  gantt.config.autosize = true;

  gantt.plugins({
    fullscreen: true,
    marker: true,
  });

  gantt.addMarker({
    start_date: new Date(),
    css: "today",
    text: "Now",
    title: "TEST"
  });

  //gantt.config = config;
  console.log(gantt.config);

  gantt.init(ctx.root);

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

  ctx.handleEvent("gantt_changed", (data) => {
    gantt.parse(data);
  });

  ctx.handleEvent("add_task", ({ id, text, start_date, duration }) => {
    gantt.addTask({

    })
  });

  let button = document.createElement("button");
  let data_button = document.createElement("button");

  button.innerHTML = "Fullscreen";
  data_button.innerHTML = "DATA"

  button.onclick = function() {
    gantt.ext.fullscreen.toggle();
  }

  data_button.onclick = function() {
    console.log(gantt.serialize());
  }

  ctx.root.prepend(data_button);
  ctx.root.prepend(button);
}

function pushUpdatedGantt(ctx, gantt) {
  ctx.pushEvent("gantt_changed", gantt.serialize());
}
