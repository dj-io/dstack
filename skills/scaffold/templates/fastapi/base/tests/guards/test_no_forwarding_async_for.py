import ast
from collections import defaultdict
from pathlib import Path

APP = Path(__file__).resolve().parents[2] / "app"


class ForwardingAsyncForCheck:
    """A stream has one owner: the same async iterator is re-yielded in at most one place."""

    def duplicates(self, paths: list[Path]) -> list[str]:
        by_attr: dict[str, list[str]] = defaultdict(list)
        for path in paths:
            for attr, location in self._hits(path):
                by_attr[attr].append(location)
        return [
            f"{attr} re-yielded at {', '.join(locations)}"
            for attr, locations in by_attr.items()
            if len(locations) > 1
        ]

    def _hits(self, path: Path) -> list[tuple[str, str]]:
        tree = ast.parse(path.read_text(), filename=str(path))
        return [
            (attr, f"{path}:{node.lineno}")
            for node in ast.walk(tree)
            if isinstance(node, ast.AsyncFor) and (attr := self._forwarded(node)) is not None
        ]

    def _forwarded(self, node: ast.AsyncFor) -> str | None:
        target = node.target
        forwards = (
            isinstance(target, ast.Name)
            and not node.orelse
            and all(self._yields(stmt, target.id) for stmt in node.body)
        )
        call = node.iter.func if isinstance(node.iter, ast.Call) else node.iter
        return call.attr if forwards and isinstance(call, ast.Attribute) else None

    @staticmethod
    def _yields(stmt: ast.stmt, name: str) -> bool:
        return (
            isinstance(stmt, ast.Expr)
            and isinstance(stmt.value, ast.Yield)
            and isinstance(stmt.value.value, ast.Name)
            and stmt.value.value.id == name
        )


def test_forwarding_async_for_has_one_owner() -> None:
    assert ForwardingAsyncForCheck().duplicates(sorted(APP.rglob("*.py"))) == []


def test_shared_forwarding_is_reported(tmp_path: Path) -> None:
    path = tmp_path / "sample.py"
    path.write_text(
        "class Labels:\n"
        "    async def run(self, event):\n"
        "        async for item in self.running.prefetch(event):\n"
        "            yield item\n"
        "\n"
        "class Loop:\n"
        "    async def run(self, event):\n"
        "        async for item in self._labels.prefetch(event):\n"
        "            yield item\n"
    )
    assert ForwardingAsyncForCheck().duplicates([path])


def test_one_forwarding_is_allowed(tmp_path: Path) -> None:
    path = tmp_path / "sample.py"
    path.write_text(
        "class Runner:\n"
        "    async def run(self, loop):\n"
        "        async for event in loop.run():\n"
        "            yield event\n"
    )
    assert ForwardingAsyncForCheck().duplicates([path]) == []
