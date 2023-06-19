defmodule Kino.Gantt do
  @moduledoc """
  TODO.
  """

  use Kino.JS, assets_path: "lib/assets/gantt/build"
  use Kino.JS.Live

  @type t :: Kino.JS.Live.t()

  @spec new() :: t()
  def new() do
    Kino.JS.Live.new(__MODULE__, %{})
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
end
