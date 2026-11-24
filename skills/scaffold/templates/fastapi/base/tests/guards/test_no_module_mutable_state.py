import ast
from pathlib import Path

import pytest

APP = Path(__file__).resolve().parents[2] / "app"
MUTABLE_VALUES = (ast.List, ast.Dict, ast.Set, ast.ListComp, ast.DictComp, ast.SetComp)
MUTABLE_CALLS = frozenset({"list", "dict", "set", "defaultdict", "deque"})


class ModuleStateCheck:
    """No `global`, and no module-level list, dict or set."""

    def violations(self, path: Path) -> list[str]:
        tree = ast.parse(path.read_text(), filename=str(path))
        globals_ = [
            f"{path}:{n.lineno} global" for n in ast.walk(tree) if isinstance(n, ast.Global)
        ]
        values = [
            f"{path}:{node.lineno} module-level mutable value"
            for node in tree.body
            if isinstance(node, (ast.Assign, ast.AnnAssign)) and self._is_mutable(node.value)
        ]
        return [*globals_, *values]

    @staticmethod
    def _is_mutable(value: ast.expr | None) -> bool:
        call = value.func if isinstance(value, ast.Call) else None
        return isinstance(value, MUTABLE_VALUES) or (
            isinstance(call, ast.Name) and call.id in MUTABLE_CALLS
        )


def test_app_has_no_module_mutable_state() -> None:
    check = ModuleStateCheck()
    assert [hit for path in sorted(APP.rglob("*.py")) for hit in check.violations(path)] == []


@pytest.mark.parametrize(
    "source",
    [
        "CACHE = {}\n",
        "SEEN: list[str] = []\n",
        "COUNTS = defaultdict(int)\n",
        "class C:\n    def f(self):\n        global X\n",
    ],
)
def test_mutable_state_is_reported(source: str, tmp_path: Path) -> None:
    path = tmp_path / "sample.py"
    path.write_text(source)
    assert ModuleStateCheck().violations(path)


def test_tuple_and_instance_are_allowed(tmp_path: Path) -> None:
    path = tmp_path / "sample.py"
    path.write_text("ORIGINS = ('a', 'b')\nsettings = Settings()\n")
    assert ModuleStateCheck().violations(path) == []
