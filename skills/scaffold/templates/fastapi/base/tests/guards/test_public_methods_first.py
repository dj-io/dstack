import ast
from pathlib import Path

APP = Path(__file__).resolve().parents[2] / "app"


class MethodOrderCheck:
    """In every class, public methods (dunders included) come before private `_methods`."""

    def violations(self, path: Path) -> list[str]:
        tree = ast.parse(path.read_text(), filename=str(path))
        return [
            hit
            for node in ast.walk(tree)
            if isinstance(node, ast.ClassDef)
            for hit in self._check(path, node)
        ]

    def _check(self, path: Path, cls: ast.ClassDef) -> list[str]:
        methods = [n for n in cls.body if isinstance(n, (ast.FunctionDef, ast.AsyncFunctionDef))]
        private = [self._is_private(method) for method in methods]
        first_private = private.index(True) if True in private else len(methods)
        return [
            f"{path}:{method.lineno} {cls.name}.{method.name} follows a private method"
            for method in methods[first_private:]
            if not self._is_private(method)
        ]

    @staticmethod
    def _is_private(method: ast.FunctionDef | ast.AsyncFunctionDef) -> bool:
        return method.name.startswith("_") and not method.name.endswith("__")


def test_public_methods_come_first() -> None:
    check = MethodOrderCheck()
    assert [hit for path in sorted(APP.rglob("*.py")) for hit in check.violations(path)] == []


def test_public_after_private_is_reported(tmp_path: Path) -> None:
    path = tmp_path / "sample.py"
    path.write_text(
        "class Fetch:\n    def _parse(self):\n        pass\n\n    def run(self):\n        pass\n"
    )
    assert MethodOrderCheck().violations(path)


def test_dunder_then_public_then_private_is_allowed(tmp_path: Path) -> None:
    path = tmp_path / "sample.py"
    path.write_text(
        "class Fetch:\n"
        "    def __init__(self):\n        pass\n\n"
        "    def run(self):\n        pass\n\n"
        "    def _parse(self):\n        pass\n"
    )
    assert MethodOrderCheck().violations(path) == []
