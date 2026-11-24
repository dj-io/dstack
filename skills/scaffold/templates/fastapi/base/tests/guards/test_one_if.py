import ast
from pathlib import Path

import pytest

APP = Path(__file__).resolve().parents[2] / "app"
SCOPES = (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef, ast.Lambda)


class OneIfCheck:
    """A function has at most one `if`, and it must return, raise or break.

    Conditional expressions count as an `if`, so none are allowed.
    """

    def violations(self, path: Path) -> list[str]:
        tree = ast.parse(path.read_text(), filename=str(path))
        found: list[str] = []
        for node in ast.walk(tree):
            if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                found.extend(self._check(path, node))
        return found

    def _check(self, path: Path, fn: ast.FunctionDef | ast.AsyncFunctionDef) -> list[str]:
        ifs = self._collect(fn, ast.If)
        found = [
            f"{path}:{e.lineno} {fn.name} has a conditional expression"
            for e in self._collect(fn, ast.IfExp)
        ]
        if len(ifs) > 1:
            found.append(f"{path}:{fn.lineno} {fn.name} has {len(ifs)} if statements")
        found.extend(
            f"{path}:{s.lineno} {fn.name} if does not exit" for s in ifs if not self._exits(s)
        )
        return found

    def _collect[T: ast.AST](self, fn: ast.AST, kind: type[T]) -> list[T]:
        found: list[T] = []
        pending: list[ast.AST] = list(getattr(fn, "body", []))
        while pending:
            node = pending.pop()
            if isinstance(node, SCOPES):
                continue
            if isinstance(node, kind):
                found.append(node)
            pending.extend(ast.iter_child_nodes(node))
        return found

    @staticmethod
    def _exits(node: ast.If) -> bool:
        return any(isinstance(stmt, (ast.Return, ast.Raise, ast.Break)) for stmt in node.body)


def test_functions_have_one_guard_if() -> None:
    check = OneIfCheck()
    assert [hit for path in sorted(APP.rglob("*.py")) for hit in check.violations(path)] == []


@pytest.mark.parametrize(
    "source",
    [
        "def f(a, b):\n    if a:\n        return 1\n    if b:\n        return 2\n    return 3\n",
        "def f(a):\n    if a:\n        print(a)\n    return 1\n",
        "def f(a):\n    return 1 if a else 2\n",
    ],
)
def test_extra_decision_is_reported(source: str, tmp_path: Path) -> None:
    path = tmp_path / "sample.py"
    path.write_text(source)
    assert OneIfCheck().violations(path)


def test_one_guard_if_is_allowed(tmp_path: Path) -> None:
    path = tmp_path / "sample.py"
    path.write_text("def f(a):\n    if not a:\n        raise ValueError(a)\n    return a\n")
    assert OneIfCheck().violations(path) == []
