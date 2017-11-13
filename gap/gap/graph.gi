#############################################################################
##
#W  callback.gi                 FRANCY library                 Manuel Martins
##
#Y  Copyright (C) 2017 Manuel Martins
##

#############################################################################
##
#M  TriggerEvent . . .  the various events supported to trigger a callback
##
BindGlobal("GraphType", rec(
  UNDIRECTED := Objectify(NewType(GraphFamily, IsGraphType and IsGraphTypeRep), rec(value := "undirected")),
  DIRECTED  := Objectify(NewType(GraphFamily, IsGraphType and IsGraphTypeRep), rec(value := "directed")),
  HASSE  := Objectify(NewType(GraphFamily, IsGraphType and IsGraphTypeRep), rec(value := "directed"))
));

#############################################################################
##
#M  GraphDefaults . . . . . . . . . .  the various types of shapes supported
##
BindGlobal("GraphDefaults", Objectify(NewType(GraphFamily, IsGraphDefaults and IsGraphDefaultsRep), rec(
  simulation := true
)));

#############################################################################
##
#M  Graph( <graph type> ) . 
##
InstallMethod(Graph,
  "a graph type",
  true,
  [IsGraphType,
   IsGraphDefaults],
  0,
function(graphType, options)
  return MergeObjects(Objectify(NewType(GraphFamily, IsGraph and IsGraphRep), rec(
    id        := HexStringUUID(RandomUUID()),
    nodes     := rec(),
    links     := rec(),
    type      := graphType!.value,
  )), options);
end);

InstallOtherMethod(Graph,
  "a graph type",
  true,
  [IsGraphType],
  0,
function(graphType)
  return Graph(graphType, GraphDefaults);
end);
#############################################################################
##
#M  Add( <graph>, <francy object> ) . . . . . add objects to graph
##
InstallMethod(Add,
  "a graph, a shape",
  true,
  [IsGraph,
   IsFrancyObject],
  0,
function(graph, object)
  if IsShape(object) then
    graph!.nodes!.(object!.id) := object;
  elif IsLink(object) then
    graph!.links!.(object!.id) := object;
  fi;
  return graph;
end);

InstallOtherMethod(Add,
  "a graph, a list of francy objects",
  true,
  [IsGraph,
   IsList],
  0,
function(graph, objects)
  local object;
  for object in objects do
    Add(graph, object);
  od;
  return graph;
end);

#############################################################################
##
#M  Remove( <graph>, <francy object> ) . . . . . remove object from graph
##
InstallMethod(Remove,
  "a graph, a shape",
  true,
  [IsGraph,
   IsFrancyObject],
  0,
function(graph, object)
  local link;
  if IsShape(object) then
    Unbind(graph!.nodes!.(object!.id));
    # remove also links to this object
    for link in object!.links do
      if link!.source!.id = object!.id or link!.target!.id = object!.id then
        Unbind(graph!.links!.(link!.id));
      fi;
    od;
  elif IsLink(object) then
    Unbind(graph!.links!.(object!.id));
  elif IsMenu(object) then
    Unbind(graph!.menus!.(object!.id));
  fi;
  return graph;
end);

InstallOtherMethod(Remove,
  "a graph, a list of francy objects",
  true,
  [IsGraph,
   IsList],
  0,
function(graph, objects)
  local object;
  for object in objects do
    Remove(graph, object);
  od;
  return graph;
end);


#############################################################################
##
#M  ShapeType . . . . . . . . . . . . . the various types of shapes supported
##
BindGlobal("ShapeType", Objectify(NewType(ShapeFamily, IsFrancyType and IsFrancyTypeRep), rec(
  TRIANGLE := Objectify(NewType(ShapeFamily, IsShapeType and IsShapeTypeRep), rec(value := "triangle")),
  DIAMOND := Objectify(NewType(ShapeFamily, IsShapeType and IsShapeTypeRep), rec(value := "diamond")),
  CIRCLE := Objectify(NewType(ShapeFamily, IsShapeType and IsShapeTypeRep), rec(value := "circle")),
  SQUARE := Objectify(NewType(ShapeFamily, IsShapeType and IsShapeTypeRep), rec(value := "square")),
  CROSS := Objectify(NewType(ShapeFamily, IsShapeType and IsShapeTypeRep), rec(value := "cross")),
  STAR := Objectify(NewType(ShapeFamily, IsShapeType and IsShapeTypeRep), rec(value := "star")),
  WYE := Objectify(NewType(ShapeFamily, IsShapeType and IsShapeTypeRep), rec(value := "wye"))
)));


#############################################################################
##
#M  ShapeDefaults . . . . . . . . . . . the various types of shapes supported
##
BindGlobal("ShapeDefaults", Objectify(NewType(ShapeFamily, IsShapeDefaults and IsShapeDefaultsRep), rec(
  highlight := true,
  layer := 0,
  size := 10,
  x := 0,
  y := 0 
)));


#############################################################################
##
#M  Shape( <shapeType>, <title>, <options> )  . .  create a Shape for a type
##
InstallMethod(Shape,
  "a shape type, a title string, a default configurations record",
  true,
  [IsShapeType,
   IsString,
   IsShapeDefaults],
  0,
function(shapeType, title, options)
  return MergeObjects(Objectify(NewType(ShapeFamily, IsShape and IsShapeRep), rec(
    id      := HexStringUUID(RandomUUID()),
    type    := shapeType!.value,
    title   := title
  )), options);
end);

InstallOtherMethod(Shape,
  "a shape type, a title string",
  true,
  [IsShapeType,
   IsString],
  0,
function(shapeType, title)
  return Shape(shapeType, title, ShapeDefaults);
end);


#############################################################################
##
#M  Link( <obj1>, <obj2> )
##
InstallMethod(Link,
  "a shape, another shape",
  true,
  [IsShape,
   IsShape],
  0,

function(source, target)
  return Objectify(NewType(LinkFamily, IsLink and IsLinkRep), rec(
    id     := HexStringUUID(RandomUUID()),
    source := source!.id,
    target := target!.id
  ));
end);

InstallMethod(Links,
  "a list of shape, a list of shape",
  true,
  [IsList,
   IsList],
  0,
function(source, target)
  local list, src, tgt;
  list := [];
  for src in source do
    for tgt in target do
      AddSet(list, Link(src, tgt));
    od;
  od;
  return list;
end);