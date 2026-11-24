import ast
from pathlib import Path

import pytest

APP = Path(__file__).resolve().parents[2] / "app"


class BarrelCheck:
    """`__init__.py` files stay empty: no imports and no `__all__`."""

    def violations(self, path: Path) -> list[str]:
        tree = ast.parse(path.read_text(), filename=str(path))
        found: list[str] = []
        for node in tree.body:
            if isinstance(node, (ast.Import, ast.ImportFrom)):
                found.append(f"{path}:{node.lineno} import")
            elif self._assigns_all(node):
                found.append(f"{path}:{node.lineno} __all__")
        return found

    @staticmethod
    def _assigns_all(node: ast.AST) -> bool:
        targets: list[ast.expr] = []
        if isinstance(node, ast.Assign):
            targets = list(node.targets)
        elif isinstance(node, ast.AnnAssign):
            targets = [node.target]
        return any(isinstance(target, ast.Name) and target.id == "__all__" for target in targets)


def test_package_inits_are_not_barrels() -> None:
    check = BarrelCheck()
    assert [
        hit for path in sorted(APP.rglob("__init__.py")) for hit in check.violations(path)
    ] == []


@pytest.mark.parametrize(
    "source", ["import app.api\n", "from app.api import Api\n", "__all__ = ['Api']\n"]
)
def test_barrel_is_reported(source: str, tmp_path: Path) -> None:
    path = tmp_path / "__init__.py"
    path.write_text(source)
    assert BarrelCheck().violations(path)
