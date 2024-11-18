interface EmptyProps{
  resource:string;
}
function Empty({resource}:EmptyProps) {
  return <p>No {resource} could be found.</p>;
}

export default Empty;
