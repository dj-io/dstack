import ast
import io
import re
import tokenize
from pathlib import Path

APP = Path(__file__).resolve().parents[2] / "app"
PRAGMA = re.compile(r"#\s*(noqa|type:|pragma|fmt:|ruff:|mypy:|-\*-)")


class ModuleCommentCheck:
    """A `#` comment outside every function and class body must be a docstring.

    Tool pragmas such as `# noqa` and `# type:` are allowed.
    """

    def violations(self, path: Path) -> list[str]:
        source = path.read_text()
        covered = self._body_lines(ast.parse(source, filename=str(path)))
        return [
            f"{path}:{line} module-level comment; make it a docstring"
            for line, text in self._comments(source)
            if line not in covered and not PRAGMA.match(text)
        ]

    @staticmethod
    def _body_lines(tree: ast.Module) -> set[int]:
        scopes = (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)
        return {
            line
            for node in tree.body
            if isinstance(node, scopes)
            for line in range(node.lineno, (node.end_lineno or node.lineno) + 1)
        }

    @staticmethod
    def _comments(source: str) -> list[tuple[int, str]]:
        tokens = tokenize.generate_tokens(io.StringIO(source).readline)
        return [(tok.start[0], tok.string) for tok in tokens if tok.type == tokenize.COMMENT]


def test_module_comments_are_docstrings() -> None:
    check = ModuleCommentCheck()
    assert [hit for path in sorted(APP.rglob("*.py")) for hit in check.violations(path)] == []


def test_module_comment_is_reported(tmp_path: Path) -> None:
    path = tmp_path / "sample.py"
    path.write_text("# builds the client\nclient = Client()\n")
    assert ModuleCommentCheck().violations(path)


def test_pragma_and_body_comments_are_allowed(tmp_path: Path) -> None:
    path = tmp_path / "sample.py"
    path.write_text(
        "import os  # noqa: F401\n"
        "class C:\n"
        "    def f(self):\n"
        "        # retry once: the upstream drops the first call after idle\n"
        "        return 1\n"
    )
    assert ModuleCommentCheck().violations(path) == []
