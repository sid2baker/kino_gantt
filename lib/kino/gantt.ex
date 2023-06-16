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
  @spec new(Gantt.t()) :: t()
  def new(gantt) when is_struct(gantt, Gantt) do
    Kino.JS.Live.new(__MODULE__, gantt)
  end

  @doc false
  @spec static(Gantt.t()) :: Kino.JS.t()
  def static(gantt) when is_struct(gantt, Gantt) do
    data = %{
      spec: Gantt.to_spec(gantt),
      datasets: []
    }

    Kino.JS.new(__MODULE__, data, export_info_string: "gantt", export_key: :key)
  end

  @impl true
  def init(gantt, ctx) do
    {:ok, assign(ctx, gantt: gantt, datasets: %{})}
  end

  @impl true
  def handle_connect(ctx) do
    data = %{

    }
    {:ok, data, ctx}
  end
end
