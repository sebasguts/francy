################################################
#! @BeginChunk Example_Create_Canvas_1
#! @BeginExample

graph := Graph(GraphType.HASSE);

shapeG := Shape(ShapeType.DIAMOND, "G");
shapeG!.layer := 0;

shape1 := Shape(ShapeType.WYE, "1");
shape1!.layer := 3;

Add(graph, Link(shapeG, shape1));

Add(graph, [shapeG, shape1]);

canvas := Canvas("Quaternion Group Subgroup Lattice");
canvas!.height := 400; # default 600
canvas!.width := 400; # default 800
canvas!.zoomToFit := false; # default true

Draw(canvas);

#! @EndExample
#! @EndChunk
