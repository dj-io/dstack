import ast
from pathlib import Path

import pytest

APP = Path(__file__).resolve().parents[2] / "app"


class PublicClassCheck:
    """One public class per module. Exceptions it raises (`...Error`) may sit beside it."""

    def violations(self, path: Path) -> list[str]:
        tree = ast.parse(path.read_text(), filename=str(path))
        public = [n for n in tree.body if isinstance(n, ast.ClassDef) and self._is_public(n)]
        return [
            f"{path}:{node.lineno} {node.name} is public class #{index}"
            for index, node in enumerate(public[1:], start=2)
        ]

    @staticmethod
    def _is_public(node: ast.ClassDef) -> bool:
        return not node.name.startswith("_") and not node.name.endswith(("Error", "Exception"))


def test_modules_have_one_public_class() -> None:
    check = PublicClassCheck()
    assert [hit for path in sorted(APP.rglob("*.py")) for hit in check.violations(path)] == []


def test_second_public_class_is_reported(tmp_path: Path) -> None:
    path = tmp_path / "sample.py"
    path.write_text("class Fetch:\n    pass\n\n\nclass Parse:\n    pass\n")
    assert PublicClassCheck().violations(path)


@pytest.mark.parametrize(
    "source",
    [
        "class Fetch:\n    pass\n\n\nclass FetchError(Exception):\n    pass\n",
        "class Fetch:\n    pass\n\n\nclass _Cache:\n    pass\n",
    ],
)
def test_error_and_private_classes_are_allowed(source: str, tmp_path: Path) -> None:
    path = tmp_path / "sample.py"
    path.write_text(source)
    assert PublicClassCheck().violations(path) == []
