import ast
from pathlib import Path

import pytest

APP = Path(__file__).resolve().parents[2] / "app"
ROOTS = frozenset({"main", "api", "graphql"})


class ImportDirectionCheck:
    """Imports flow one way: roots (main, api, graphql) → features → core.

    A feature never imports another feature.
    """

    def __init__(self, app: Path = APP) -> None:
        self._app = app

    def violations(self, path: Path) -> list[str]:
        source = self._area(path.relative_to(self._app).with_suffix("").parts[0])
        tree = ast.parse(path.read_text(), filename=str(path))
        return [
            f"{path}:{node.lineno} {source} imports {module}"
            for node, module in self._app_imports(tree)
            if not self._allowed(source, self._area(module.split(".")[1]))
        ]

    def _area(self, top: str) -> str:
        if top in ROOTS:
            return "root"
        return top

    def _allowed(self, source: str, target: str) -> bool:
        return source == "root" or target in {"core", source}

    @staticmethod
    def _app_imports(tree: ast.Module) -> list[tuple[ast.stmt, str]]:
        found: list[tuple[ast.stmt, str]] = []
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                found.extend((node, alias.name) for alias in node.names)
            elif isinstance(node, ast.ImportFrom) and node.module and node.level == 0:
                found.append((node, node.module))
        return [(node, module) for node, module in found if module.startswith("app.")]


def test_imports_flow_one_way() -> None:
    check = ImportDirectionCheck()
    assert [hit for path in sorted(APP.rglob("*.py")) for hit in check.violations(path)] == []


@pytest.mark.parametrize(
    ("relative", "source"),
    [
        ("billing/router.py", "from app.health.health import Health\n"),
        ("core/settings.py", "from app.billing.router import BillingRouter\n"),
        ("health/health.py", "from app.api import Api\n"),
    ],
)
def test_wrong_direction_is_reported(relative: str, source: str, tmp_path: Path) -> None:
    path = tmp_path / relative
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(source)
    assert ImportDirectionCheck(tmp_path).violations(path)


@pytest.mark.parametrize(
    ("relative", "source"),
    [
        ("main.py", "from app.billing.router import BillingRouter\n"),
        ("billing/router.py", "from app.core.database import Database\n"),
        ("billing/router.py", "from app.billing.checkout import Checkout\n"),
    ],
)
def test_right_direction_is_allowed(relative: str, source: str, tmp_path: Path) -> None:
    path = tmp_path / relative
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(source)
    assert ImportDirectionCheck(tmp_path).violations(path) == []
