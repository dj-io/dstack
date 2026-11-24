# Patterns for readable logic files

Each pattern lists the signal that calls for it, the shape it produces, and when to leave it out.

## Named-step pipeline

- **Signal:** the entry body is a long run of statements, often split into phases by blank lines or comments.
- **Shape:** the entry calls one function per phase, named for what the phase produces (`chooseDrops`, `floorDropSource`, `writeFile`). Each phase lives below the entry, or in its own module once it grows its own helpers.
- **Skip when:** the body is already only a few lines.

## Folder by step

- **Signal:** one export with more than three private helpers, or helpers that cluster around different steps.
- **Shape:** a folder named for the job. It has one entry module whose body is the named steps, plus one module per step. The folder's name and file list become the outline.
- **Skip when:** the helpers all serve one step and are only a few lines each.

## Config object

- **Signal:** loose constants (`ITERATIONS`, `SLOP`) spread across files, or magic numbers inside bodies.
- **Shape:** one typed object (`physicsConfig`), with a JSDoc line per field giving units and the reason for the value. Functions import it or take it as a parameter.
- **Skip when:** a constant is used once and its name already explains it.

## Parameters over ambient values

- **Signal:** helpers read module-level values or imported singletons that their signature doesn't show.
- **Shape:** pass the value in. The signature then tells the whole story, and tests don't need module setup.
- **Skip when:** the value is a true constant of the domain, like a unit conversion.

## Options object

- **Signal:** more than three parameters, boolean flags, or several parameters of the same type that are easy to swap.
- **Shape:** one typed object parameter with named fields. Turn a boolean flag into a named mode (`mode: 'preview' | 'bake'`) or split it into two functions.
- **Skip when:** the parameters have an obvious natural order, as in `clamp(value, min, max)`.

## Named data types

- **Signal:** tuples (`[x, y, z]`), bare `number` ids, or anonymous object literals crossing file boundaries.
- **Shape:** a named type (`Vec3`, `JackId`, `Sphere`) in its own file, used in every signature that carries it.
- **Skip when:** the value never leaves one function.

## Rule table

- **Signal:** chains of `if`/`switch` over cases that share one shape, or parallel arrays indexed by the same id.
- **Shape:** an array or record of rule objects (`{ when, then }`, or one entry per id), plus one small function that applies them. Adding a case becomes adding a row.
- **Skip when:** there are two or three cases with different shapes.

## Pure core, stateful shell

- **Signal:** a class whose methods mix math or decisions with changes to its own fields, so no method can be read or tested alone.
- **Shape:** pure functions that take state and return the result. A thin class or function owns the state and calls them in order.
- **Skip when:** the class is small and its state changes are the point, as in a counter or a cache.

## Query or command

- **Signal:** a function both returns an answer and changes something, so callers can't tell whether calling it is safe.
- **Shape:** split it into a query that computes, and a command that applies the change. Name them so the difference is visible (`contactsBetween` vs `resolveContacts`).
- **Skip when:** the combined operation is atomic by nature, like `Map.prototype.set` returning the map.
