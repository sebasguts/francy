#############################################################################
##
#W  francy.gi                   FRANCY library                 Manuel Martins
##
#Y  Copyright (C) 2017 Manuel Martins
##

#############################################################################
##
#M  PrintObj( <obj> ) . . . . . . . . . . . . .  override for IsFrancyObjects
##
InstallMethod(PrintObj,
  "a francy object",
  true,
  [IsFrancyObject],
  0,
function(object)
  Print(Clone(object));
end);

#############################################################################
##
#M  ViewObj( <obj> )  . . . . . . . . . . . . .  override for IsFrancyObjects
##
InstallMethod(ViewObj,
  "a francy object",
  true,
  [IsFrancyObject],
  0,
function(object)
  Print(Concatenation( "<",
       CategoriesOfObject( object )[1],
       "/", CategoriesOfObject( object )[2], ">"));
end);

#############################################################################
##
#M  Clone( <obj> )  . . . . . . . . simple properties clone for FrancyObjects
##
## This method will clone a FrancyObject and return a record, traversing all the
## components and converting when appropriate.
##
## This method removes components of type IsFunction, as they can't be
## converted to JSON string.
##
InstallMethod(Clone,
  "an object",
  true,
  [IsObject],
  0,
function(object)
  return Clone(object, rec());
end);

#############################################################################
##
#M  Clone( <obj> )  . . . . . . . . simple properties clone for Records
##
## This method will clone a FrancyObject into the given record
##
InstallOtherMethod(Clone,
  "an object, a record",
  true,
  [IsObject,
   IsRecord],
  0,
function(object, record)
  local component, copy;
  copy := StructuralCopy(object);
  for component in NamesOfComponents(copy) do
    if IsRecord(copy!.(component)) or IsFrancyObject(copy!.(component)) then
      record!.(component) := rec();
      Clone(copy!.(component), record!.(component));
    elif not IsFunction(copy!.(component)) then
      record!.(component) := copy!.(component);
    fi;
  od;
  return record;
end);
