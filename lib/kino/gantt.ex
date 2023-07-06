defmodule Kino.Gantt do
  @moduledoc """
  TODO.
  """

  use Kino.JS, assets_path: "lib/assets/gantt/build"
  use Kino.JS.Live

  @type t :: Kino.JS.Live.t()

  @spec new() :: t()
  def new() do
    Kino.JS.Live.new(__MODULE__, DhtmlxGantt.new())
  end

  @doc """
  Creates a new kino with the given Gantt definition.
  """
  @spec new(DhtmlxGantt.t()) :: t()
  def new(gantt) when is_struct(gantt, DhtmlxGantt) do
    Kino.JS.Live.new(__MODULE__, gantt)
  end

  @doc false
  @spec static(Gantt.t()) :: Kino.JS.t()
  def static(gantt) when is_struct(gantt, Gantt) do
    data = %{
      config: %{},
      gantt_data: %{}
    }

    Kino.JS.new(__MODULE__, data, export_info_string: "gantt", export_key: :spec)
  end

  @doc """

  """
  @spec add_task(pid(), String.t(), integer()) :: {:ok, integer()} | :error
  def add_task(gantt, name, duration) do
    Kino.JS.Live.call(gantt, {:add_task, name, duration})
  end

  def add_task_form(gantt) do
    Kino.JS.Live.call(gantt, :add_task_form)
  end

  def trigger_func(gantt, func, args) do
    Kino.JS.Live.cast(gantt, {:trigger, func, args})
  end

  # CALLBACKS

  @impl true
  def init(gantt, ctx) do
    add_task_form = create_add_task_form()
    :ok = Kino.Control.subscribe(add_task_form, "add_task")
    {:ok, assign(ctx, add_task_form: add_task_form, config: gantt.config, gantt_data: gantt.gantt_data)}
  end

  defp create_add_task_form() do
    Kino.Control.form(
      [
        name: Kino.Input.text("Name"),
        duration: Kino.Input.number("Duration (in weeks)", default: 8)
      ],
      submit: "Add Project",
      reset_on_submit: true
    )
  end

  @impl true
  def handle_connect(ctx) do
    {:ok, %{config: ctx.assigns.config, gantt_data: ctx.assigns.gantt_data}, ctx}
  end

  @impl true
  def handle_event("gantt_changed", %{"action" => action, "id" => id, "data" => data} = test, ctx) do
    case action do
      #"task_added" -> Kino.JS.Live.reply(ctx.assigns.current_action_pid, {:ok, id})
      _ -> nil
    end
    broadcast_event(ctx, "gantt_changed", data)
    {:noreply, assign(ctx, gantt_data: data)}
  end

  @impl true
  def handle_call(:add_task_form, _from, ctx) do
    {:reply, ctx.assigns.add_task_form, ctx}
  end

  @impl true
  def handle_cast({:trigger, func, args}, ctx) do
    broadcast_event(ctx, "trigger", %{func: func, args: args})
    {:noreply, ctx}
  end

  @impl true
  def handle_info({"add_task", %{origin: origin, data: data}}, ctx) do 
    task = %{
      name: data.name,
      duration: data.duration
    }
    send_event(ctx, origin, "add_task", task)
    {:noreply, ctx}
  end
end
