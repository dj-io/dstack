import ast
from pathlib import Path

import pytest

APP = Path(__file__).resolve().parents[2] / "app"


class FreeFunctionCheck:
    """Classes own behaviour: no function or lambda outside a class."""

    def violations(self, path: Path) -> list[str]:
        tree = ast.parse(path.read_text(), filename=str(path))
        found: list[str] = []
        self._walk(tree, path, class_depth=0, found=found)
        return found

    def _walk(self, node: ast.AST, path: Path, *, class_depth: int, found: list[str]) -> None:
        if isinstance(node, ast.ClassDef):
            class_depth += 1
        elif class_depth == 0 and isinstance(
            node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.Lambda)
        ):
            found.append(f"{path}:{node.lineno} {getattr(node, 'name', '<lambda>')}")
        for child in ast.iter_child_nodes(node):
            self._walk(child, path, class_depth=class_depth, found=found)


def test_app_has_no_free_functions() -> None:
    check = FreeFunctionCheck()
    assert [hit for path in sorted(APP.rglob("*.py")) for hit in check.violations(path)] == []


@pytest.mark.parametrize(
    "source",
    ["def run():\n    return 1\n", "async def run():\n    return 1\n", "run = lambda: 1\n"],
)
def test_free_function_is_reported(source: str, tmp_path: Path) -> None:
    path = tmp_path / "sample.py"
    path.write_text(source)
    assert FreeFunctionCheck().violations(path)


def test_method_is_allowed(tmp_path: Path) -> None:
    path = tmp_path / "sample.py"
    path.write_text("class Runner:\n    def run(self):\n        return 1\n")
    assert FreeFunctionCheck().violations(path) == []
