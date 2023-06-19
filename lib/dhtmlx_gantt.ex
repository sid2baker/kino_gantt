defmodule DhtmlxGantt do
  @moduledoc """
  TODO
  """

  defstruct config: %{}, gantt_data: %{}

  @type t :: %{
    config: map(),
    gantt_data: %{
      data: list(task),
      links: list(link)
    }
  }

  @type task :: %{
    id: integer(),
    text: String.t(),
    start_date: Date.t(),
    duration: integer(),
    progress: float(),
    parent: integer()
  }

  @type link :: %{
    id: integer(),
    source: integer(),
    target: integer(),
    type: :task | :project
  }

  @doc """

  """
  @spec new(keyword()) :: t()
  def new(opts \\ []) do
    gantt = %DhtmlxGantt{}
    
  end

  @doc """

  """
  @spec from_json(String.t()) :: t()
  def from_json(json) do
    json
    |> Jason.decode!()
    #|> from_spec()
  end

  @doc """

  """
  @spec to_spec(t()) :: map()
  def to_spec(gantt) do
    gantt.config
  end

end
