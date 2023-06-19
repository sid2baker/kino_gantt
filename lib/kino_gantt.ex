defimpl Kino.Render, for: DhtmlxGantt do
  def to_livebook(gantt) do
    gantt |> Kino.Gantt.static() |> Kino.Render.to_livebook()
  end
end
