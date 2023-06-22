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
  @spec add_task(pid(), String.t(), Date.t()) :: {:ok, integer()} | :error
  def add_task(gantt, text, start) do
    Kino.JS.Live.call(gantt, {:add_task, text, start})
  end

  def trigger_func(gantt, func, args) do
    Kino.JS.Live.cast(gantt, {:trigger, func, args})
  end

  # CALLBACKS

  @impl true
  def init(gantt, ctx) do
    {:ok, assign(ctx, config: gantt.config, gantt_data: gantt.gantt_data)}
  end

  @impl true
  def handle_connect(ctx) do
    {:ok, %{config: ctx.assigns.config, gantt_data: ctx.assigns.gantt_data}, ctx}
  end

  @impl true
  def handle_event("gantt_changed", data, ctx) do
    broadcast_event(ctx, "gantt_changed", data)
    {:noreply, assign(ctx, gantt_data: data)}
  end

  @impl true
  def handle_call({:add_task, text, start}, data, ctx) do
    task = %{
      id: 55,
      text: text,
      start: start,
      duration: 4
    }
    broadcast_event(ctx, "add_task", task)
    {:reply, {:ok, 55}, ctx}
  end

  @impl true
  def handle_cast({:trigger, func, args}, ctx) do
    broadcast_event(ctx, "trigger", %{func: func, args: args})
    {:noreply, ctx}
  end
end
