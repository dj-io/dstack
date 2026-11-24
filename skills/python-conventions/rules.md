## Python conventions

### Shape: a feature is a folder

- A feature is a directory named for what it does. Its entry module holds one class, and that class only constructs the classes that own the logic.
- Classes own behaviour. No module-level functions or lambdas. **(guard)**
- One public class per module. Exceptions it raises may sit beside it. Name the module for what its class does. **(guard)**
- `__init__.py` files stay empty: no imports, no `__all__`. Import from the module that defines the name. **(guard)**
- Pass dependencies through constructors. A default for the common case is fine: `https or PublicHttps()`.

### Classes: readable from the top

A developer should be able to tell what a class does, and its main steps, from its public methods and names alone.

- Public methods first (dunders, then the rest), private `_methods` below them in the order they're called. **(guard)**
- A public method reads as named steps: calls to private methods or owned classes whose names describe the work.
- A class whose private methods serve different steps is several classes. Split it, and have the entry construct them.
- No module-level mutable state: no `global`, and no module-level list, dict or set. Use a tuple, a frozenset, or a class that owns the state. **(guard)**
- Settings are typed `BaseSettings` classes, one per concern. Other constants and enums live on the class, or at the top of the module. Magic strings stay at external boundaries.

### Control flow

- A function body has at most one `if`, and that `if` returns, raises or breaks. A conditional expression counts as an `if`. A second decision belongs on a type. **(guard)**
- Prefer EAFP to LBYL. Keep nesting within three levels, and return early.
- At most four parameters, counting `self`. Past that, pass a dataclass. **(lint)**
- Keep functions small: at most 20 statements and a complexity of 10. **(lint)**

### Data

- Type every public method and field, with built-in generics (`list[str]`, `dict[str, Tool]`), not `typing.List`. mypy runs in strict mode. **(lint)**
- Parse untyped input once, at the edge, into frozen dataclasses or Pydantic models. No raw dicts past that boundary.
- Records are frozen dataclasses. Mutable defaults use `field(default_factory=...)`.
- Know the field and use it. After the edge, read `record.url`. If the name isn't in view, read the type or the library source. Don't probe with `isinstance`, `getattr`, `hasattr` or `dict.get`. A missing key is a `KeyError`.
- Name data. A tuple or bare `str` id that crosses a module boundary gets a named type.

### Resources and I/O

- Paths are `pathlib.Path`. Log with `logging`, never `print`. **(lint)**
- Files, locks, clients and sessions use `with` or `async with`.
- I/O methods are async. Blocking calls go through `asyncio.to_thread`. **(lint)**
- Catch specific exceptions. Log with context, or let them propagate. **(lint)**
- A stream has one owner. Don't re-yield the same async iterator from a second class. **(guard)**

### Comments

- Documentation is docstrings. A `#` comment outside a function or class body must be a docstring instead, unless it's a tool pragma (`# noqa`, `# type:`). **(guard)**
- Comment only what the code can't say: a workaround, a constraint you can't see from the code, why one approach was chosen over another. Never restate the code.

### Tests

- Tests do two jobs only: enforce these rules, and cover regressions.
- Guards live at `tests/guards/test_<rule>.py`. Each parses `app/` with `ast`, and carries a sample violation that it must report.
- Regression tests live at `tests/<feature>/test_<what_broke>.py`. They call the class directly and mock I/O.
- A new rule that can be checked by a tool gets a guard or a lint rule, not just a line here.

### Before calling it done

On a new module or a substantial edit, match the neighbouring names and layout, then check:

- Shared mutable state is locked or updated atomically.
- Retriable entrypoints (webhooks, jobs, client retries) are safe to run twice.
- I/O is async, and blocking calls use `asyncio.to_thread`.
- Exceptions are specific, and logged with context or left to propagate.
- No drive-by refactors, and no "clean this up later" left inside the change.
